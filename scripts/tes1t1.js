document.addEventListener("DOMContentLoaded", function () {
  // ───── Your Existing Setup ─────
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSummary      = document.getElementById("cart-summary");
  const orderTotal       = document.getElementById("order-total");
  const modal            = document.getElementById("confirmation-modal");
  const closeModal       = document.getElementById("close-modal");
  const downloadOrderBtn = document.getElementById("download-order");
  const orderDetails     = document.getElementById("order-details");
  const proceedBtn       = document.getElementById("proceed-to-payment");
  const paypalContainer  = document.getElementById("paypal-button-container");
  const hiddenForm       = document.getElementById("hidden-email-form");

  let transactionSucceeded = false;

  function displayCart() {
    cartSummary.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.totalPrice;
      cartSummary.insertAdjacentHTML("beforeend", `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <p><strong>${item.name}</strong></p>
            <p>Date: ${item.date}</p>
            ${item.adults? `<p>Adults: ${item.adults}</p>` : ""}
            ${item.children? `<p>Children: ${item.children}</p>` : ""}
            ${item.infants? `<p>Infants: ${item.infants}</p>` : ""}
            <p><strong>€${item.totalPrice.toLocaleString()}</strong></p>
          </div>
        </div>`);
    });
    orderTotal.textContent = total.toLocaleString();
  }

  // ───── Payment Button & Validation ─────
  proceedBtn.addEventListener("click", function(e) {
    e.preventDefault();
    // ... your existing validation ...
    const name    = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email   = document.getElementById("email").value.trim();
    const phone   = document.getElementById("phone").value.trim();
    if (!name||!surname||!email||!phone) {
      alert("Please fill all required fields");
      return;
    }
    localStorage.setItem("customerData", JSON.stringify({ name, surname, email, phone,
      agency: document.getElementById("agency").value.trim()
    }));
    paypalContainer.style.display = "block";
    proceedBtn.style.display = "none";
  });

  paypal.Buttons({
    createOrder(data, actions) {
      const amt = parseFloat(orderTotal.textContent.replace(/,/g, "")).toFixed(2);
      return actions.order.create({
        purchase_units: [{ amount: { value: amt, currency_code: "EUR" } }],
        application_context: { shipping_preference: "NO_SHIPPING" }
      });
    },
    style: { layout: "vertical", color: "gold", shape: "rect" },
    onApprove(data, actions) {
      return actions.order.capture().then(details => {
        transactionSucceeded = true;
        showConfirmation();
      });
    },
    onError(err) {
      console.error("PayPal error:", err);
      alert("Payment failed");
    }
  }).render("#paypal-button-container");

  // ───── showConfirmation & submitOrder ─────
  async function showConfirmation() {
    if (!transactionSucceeded) return;
    modal.style.display = "flex";

    // Populate modal (exactly as you had)
    const cust = JSON.parse(localStorage.getItem("customerData")) || {};
    orderDetails.innerHTML = `
      <h3>Customer Details</h3>
      <p>Name: ${cust.name} ${cust.surname}</p>
      <p>Email: ${cust.email}</p>
      <p>Phone: ${cust.phone}</p>
      <p>Agency: ${cust.agency||"—"}</p>
      <h3>Order Summary</h3>
      ${cart.map((it,i)=>`
        <div class="order-item">
          <p><strong>Product ${i+1}:</strong> ${it.name}</p>
          <p>Date: ${it.date}</p>
          ${it.adults? `<p>Adults: ${it.adults}</p>` : ""}
          ${it.children? `<p>Children: ${it.children}</p>` : ""}
          ${it.infants? `<p>Infants: ${it.infants}</p>` : ""}
          <p><strong>€${it.totalPrice.toLocaleString()}</strong></p>
        </div>`).join("")}
      <h3>Total: €${orderTotal.textContent}</h3>
    `;

    // Now send email + PDF
    await submitOrder();
  }

  async function submitOrder() {
    // 1) Prevent any native form redirect
    hiddenForm.addEventListener("submit", e => e.preventDefault());

    // 2) Gather data
    const cust = JSON.parse(localStorage.getItem("customerData")) || {};
    const count = getOrderNumber();
    // plain-text summary
    let summary = cart.map((it,i)=>`
--- Product ${i+1} ---
Name: ${it.name}
Date: ${it.date}
${it.adults? "Adults: "+it.adults+"\n":""}
${it.children? "Children: "+it.children+"\n":""}
${it.infants? "Infants: "+it.infants+"\n":""}
€${it.totalPrice.toLocaleString()}
`).join("\n");
    summary += `\nTotal: €${orderTotal.textContent}`;

    // 3) Fill hidden inputs
    hiddenForm.querySelector("#hidden-name").value    = cust.name;
    hiddenForm.querySelector("#hidden-surname").value = cust.surname;
    hiddenForm.querySelector("#hidden-email").value   = cust.email;
    hiddenForm.querySelector("#hidden-phone").value   = cust.phone;
    hiddenForm.querySelector("#hidden-agency").value  = cust.agency||"";
    hiddenForm.querySelector("#hidden-order-summary").value = summary;
    hiddenForm.querySelector('input[name="_subject"]').value = `New Order #${count}`;

    // 4) Generate PDF
    const pdfBlob = await generatePDF(cust, true);

    // 5) Build and send FormData
    const fd = new FormData(hiddenForm);
    fd.append("_attachment", new File([pdfBlob], `Order_${count}.pdf`, {
      type: "application/pdf"
    }));

    try {
      const res = await fetch(hiddenForm.action, {
        method: hiddenForm.method,
        body: fd
      });
      if (!res.ok) throw new Error(res.statusText);
      console.log("Email sent with PDF!");
    } catch (err) {
      console.error("FormSubmit error:", err);
    }

    // 6) Hook download button
    downloadOrderBtn.onclick = () => generatePDF(cust, false);

    // 7) Clear cart/customer
    localStorage.removeItem("cart");
    localStorage.removeItem("customerData");
  }

  // ───── Shared Order Count ─────
  function getOrderNumber() {
    const key = "globalOrderCount";
    let n = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, n);
    return n;
  }

  // ───── Your generatePDF (untouched) ─────
  async function generatePDF(customerData, returnBlob = true) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // … your full PDF logic here …
    if (returnBlob) {
      return doc.output("blob");
    } else {
      doc.save(`Order_${getOrderNumber()}.pdf`);
    }
  }

  // ───── Close modal ─────
  closeModal.onclick = () => {
    modal.style.display = "none";
    displayCart();
    location.reload();
  };

  displayCart();
});

document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSummary      = document.getElementById("cart-summary");
  const orderTotal       = document.getElementById("order-total");
  const modal            = document.getElementById("confirmation-modal");
  const closeModal       = document.getElementById("close-modal");
  const downloadOrderBtn = document.getElementById("download-order");
  const orderDetails     = document.getElementById("order-details");
  const proceedBtn       = document.getElementById("proceed-to-payment");
  const paypalContainer  = document.getElementById("paypal-button-container");
  const hiddenForm = document.getElementById("hidden-email-form");


  let lastPdfBlob = null;
  let lastPdfUrl = null;


  let transactionSucceeded = false;

  function displayCart() {
    cartSummary.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      total += item.totalPrice;
      const html = `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <p><strong>${item.name} ${t(item.headlineKey)}</strong></p>
          
            <p><span data-i18n="checkout.date">Date:</span> ${item.date}</p>
            ${item.adults    ? `<p><span data-i18n="checkout.adults">Adults:</span> ${item.adults}</p>`    : ""}
            ${item.children  ? `<p><span data-i18n="checkout.children">Children:</span> ${item.children}</p>`: ""}
            ${item.infants   ? `<p><span data-i18n="checkout.infants">Infants:</span> ${item.infants}</p>`  : ""}
            ${item.extras && item.extras.length
              ? `<p>${t("checkout.extras")} `+
                  item.extras.map(e=>`${t(e.key)} x${e.qty}`).join(", ")+
                `</p>`
              : ""
            }
            <p class="price"><strong>€${item.totalPrice.toLocaleString()}</strong></p>
          </div>
        </div>`;
      cartSummary.insertAdjacentHTML("beforeend", html);
    });
    orderTotal.textContent = total.toLocaleString();
    applyTranslations(localStorage.getItem("lang")||"en");
  }


  // Form validation + show PayPal button
  proceedBtn.addEventListener("click", function(e){
    e.preventDefault();
    const name    = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email   = document.getElementById("email").value.trim();
    const phone   = document.getElementById("phone").value.trim();
    const agency  = document.getElementById("agency").value.trim();

    const nameRegex  = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;

    if(!name||!surname||!email||!phone){
      alert(t("alert.missing.fields")); return;
    }
    if(!nameRegex.test(name))     { alert(t("alert.invalid.name")); return; }
    if(!nameRegex.test(surname))  { alert(t("alert.invalid.surname")); return; }
    if(!emailRegex.test(email))   { alert(t("alert.invalid.email")); return; }
    if(!phoneRegex.test(phone))   { alert(t("alert.invalid.phone")); return; }

    localStorage.setItem("customerData",
      JSON.stringify({name,surname,email,phone,agency})
    );
    paypalContainer.style.display="block";
    proceedBtn.style.display="none";
  });

  // PayPal integration
  paypal.Buttons({
    createOrder(data,actions){
      let amt = parseFloat(orderTotal.textContent.replace(/,/g,"")).toFixed(2);
      return actions.order.create({
        purchase_units:[{amount:{value:amt,currency_code:"EUR"}}],
        application_context:{shipping_preference:"NO_SHIPPING"}
      });
    },
    style:{layout:"vertical",color:"gold",shape:"rect"},
    onApprove(data,actions){
      return actions.order.capture().then(details=>{
        transactionSucceeded=true;
        showConfirmation();
        
    downloadOrderBtn.onclick = function () {
      generatePDF(cust, false);
    };
      });
    },
    onError(err){
      console.error("PayPal error:",err);
      alert(t("alert.payment.failed"));
      transactionSucceeded=false;
    }
  }).render("#paypal-button-container");



  // ───── showConfirmation & submitOrder ─────
  async function showConfirmation() {
    if (!transactionSucceeded) return;
    modal.style.display = "flex";

    // Populate modal (exactly as you had)
    const cust = JSON.parse(localStorage.getItem("customerData")) || {};
    orderDetails.innerHTML = `
    <h3>${t("checkout.customer.details")}</h3>
    <p><strong>${t("checkout.name")}:</strong> ${cust.name} ${cust.surname}</p>
    <p><strong>${t("checkout.email")}:</strong> ${cust.email}</p>
    <p><strong>${t("checkout.phone")}:</strong> ${cust.phone}</p>
    <p><strong>${t("checkout.agency")}:</strong> ${cust.agency||"_________________________________"}</p>
    <h3>${t("checkout.order.summary")}</h3>
    ${cart.map((item,i)=>`
      <div class="order-item">
        <p><strong>${t("checkout.product")} ${i+1}:</strong> ${item.name}</p>
        <p>${t("checkout.date")}: ${item.date}</p>
        ${item.adults    ? `<p>${t("checkout.adults")}: ${item.adults}</p>`    : ""}
        ${item.children  ? `<p>${t("checkout.children")}: ${item.children}</p>`: ""}
        ${item.infants   ? `<p>${t("checkout.infants")}: ${item.infants}</p>`  : ""}
        ${item.extras&&item.extras.length
          ? `<p>${t("checkout.extras")}: `+
              item.extras.map(e=>`${t(e.key)} x${e.qty}`).join(", ")+
            `</p>`
          : ""
        }
        <p><strong>€${item.totalPrice.toLocaleString()}</strong></p>
      </div>`).join("")}
    <h3>${t("checkout.total")}: €${orderTotal.textContent}</h3>
  `;


  lastPdfBlob = await generatePDF(cust, true);
  lastPdfUrl = URL.createObjectURL(lastPdfBlob);




  // Auto download
  const a = document.createElement('a');
  a.href = lastPdfUrl;
  a.download = `Order_${generateOrderNumber()}.pdf`;
  a.click();

  // Set button to re-download using the same URL
  downloadOrderBtn.onclick = () => {
    const a2 = document.createElement('a');
    a2.href = lastPdfUrl;
    a2.download = `Order_${generateOrderNumber()}.pdf`;
    a2.click();
  };
    // Now send email + PDF
    await submitOrder();

   
  }

  async function submitOrder() {
    console.log("→ submitOrder fired");
    // 1) Prevent any native form redirect
    hiddenForm.addEventListener("submit", e => e.preventDefault());

    // 2) Gather data
const cust        = JSON.parse(localStorage.getItem("customerData")) || {};
  const orderNumber = generateOrderNumber();
    // plain-text summary
// Build plain‑text order summary for email
let formatted = "";
cart.forEach((item, i) => {
  formatted += `
------------------------------
${t("checkout.product")} ${i+1}: ${item.name.toUpperCase()}
${item.date ? t("checkout.date") + ": " + item.date + "\n" : ""}
${item.adults ? t("checkout.adults") + ": " + item.adults + "\n" : ""}
${item.children ? t("checkout.children") + ": " + item.children + "\n" : ""}
${item.infants ? t("checkout.infants") + ": " + item.infants + "\n" : ""}`;

  if (item.extras && item.extras.length) {
    formatted += `${t("checkout.extras")}:\n`;
    item.extras.forEach(e => {
      formatted += `  • ${t(e.key)} x${e.qty}\n`;
    });
  } else {
    formatted += `${t("checkout.extras")}: None\n`;
  }

  formatted += `${t("checkout.subtotal")}: €${item.totalPrice.toLocaleString()}\n`;
});

formatted += `==============================\n${t("checkout.total")}: €${orderTotal.textContent}`;

// Put into hidden field
document.getElementById("hidden-order-summary").value = formatted;

    // 3) Fill hidden inputs
    hiddenForm.querySelector("#hidden-name").value    = cust.name;
    hiddenForm.querySelector("#hidden-surname").value = cust.surname;
    hiddenForm.querySelector("#hidden-email").value   = cust.email;
    hiddenForm.querySelector("#hidden-phone").value   = cust.phone;
    hiddenForm.querySelector("#hidden-agency").value  = cust.agency||"";
    hiddenForm.querySelector("#hidden-order-summary").value = formatted;
    hiddenForm.querySelector('input[name="_subject"]').value = `New Order #${orderNumber}`;

  // 4) Generate PDF blob
  const pdfBlob = await generatePDF(cust, true);

  // 5) Build FormData **with an explicit filename** for iOS Safari
  const fd = new FormData(hiddenForm); 
  fd.append("First Name", cust.name);
  fd.append("Last Name",  cust.surname);
  fd.append("Email",      cust.email);
  fd.append("Phone",      cust.phone);
  fd.append("Agency/Hotel", cust.agency || "");
  fd.append("Order Summary", formatted);
  // Anything else you had hidden:
  fd.append("_captcha", "false");
  fd.append("_template", "table");
  fd.append("_subject", `New Order #${orderNumber}`);
  fd.append("_cc", "latolatto16@gmail.com");

  fd.append("_attachment", pdfBlob, `Order_${orderNumber}.pdf`);

  // 6) Send via fetch (FormSubmit.co will see it as a file upload)
 let sent = false;

// Simple user‐agent sniff for iOS WebKit:
const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isiOS) {
  // ==== iOS: use XHR ====
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(hiddenForm.method, hiddenForm.action, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("✅ Email with PDF sent via XHR on iOS");
        sent = true;
        resolve();
      } else {
        console.warn("XHR returned", xhr.status, xhr.statusText);
        resolve();  // still resolve so fallback can run
      }
    };
    xhr.onerror = () => {
      console.warn("XHR error", xhr.statusText);
      resolve();
    };
    xhr.send(fd);
  });
} else {
  // ==== non-iOS: use fetch ====
  try {
    const res = await fetch(hiddenForm.action, {
      method: hiddenForm.method,
      body: fd
    });
    if (res.ok) {
      console.log("✅ Email with PDF sent via fetch()");
      sent = true;
    } else {
      console.warn("fetch() returned", res.status, res.statusText);
    }
  } catch (e) {
    console.warn("fetch() failed:", e);
  }
}


 // 7) Fallback: if fetch() failed, submit form into hidden iframe (text-only)
  if (!sent) {
    console.log("→ fetch() failed or blocked; falling back to form.submit()");
    hiddenForm.submit();
  }

  // 8) Re-hook download button & clean up
  downloadOrderBtn.onclick = () => generatePDF(cust, false);
  localStorage.removeItem("cart");
  localStorage.removeItem("customerData");
}
  

  // ───── Shared Order Count ─────
  function generateOrderNumber() {
    const now = new Date();
    return now.toISOString().replace(/[-:.]/g, "").replace("Z", "Z");
  }

// PDF generation (keeps your layout)
async function generatePDF(customerData, returnBlob = true) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginBottom = 10;
  const newPageTopMargin = 40;

  // Logo & header
  await new Promise(res => {
    const img = new Image();
    img.src = "./assets/images/logo.webp";
    img.onload = () => {
      doc.addImage(img, "PNG", 80, 5, 50, 20);
      res();
    };
  });

  // Business info
  doc.setFontSize(16).text("Tourist Solutions", 80, 30);
  doc.setFontSize(10)
     .text("Email: support@touristsolutions.info", 80, 37)
     .text("Phone: +355698136849", 80, 44);

  // Customer details
  doc.setFontSize(12).text("Order Confirmation", 10, 55);
  doc.setFontSize(10);
  let y = 65;
  doc.text(`Name: ${customerData.name} ${customerData.surname}`, 10, y); y += 8;
  doc.text(`Email: ${customerData.email}`, 10, y);                     y += 8;
  doc.text(`Phone: ${customerData.phone}`, 10, y);                     y += 8;
  doc.text(`Agency: ${customerData.agency || "______________________________"}`, 10, y); y += 12;

  // Order Tickets header
  doc.setFontSize(12).text("Order Tickets:", 10, y);
  y += 10;

  let total = 0;

  // Loop tickets synchronously
  for (const item of cart) {
    // Page break if needed
    if (y + 60 > pageHeight - marginBottom) {
      doc.addPage();
      y = newPageTopMargin;
    }
    const ticketY = y;
    total += item.totalPrice;

    // Draw border & text
    doc.setDrawColor(0).setLineWidth(0.5).rect(10, ticketY, 180, 55);
    const isBus = item.name.includes("Vlora-");
    const headline = isBus ? "Daily Van Tour" : "Boat Tour";
    doc.setFont("helvetica","bold").text(`${item.name} - ${headline}`, 45, ticketY + 10);
    doc.setFont("helvetica","normal").text(`Date: ${item.date}`, 45, ticketY + 18);
    if (item.adults)   doc.text(`Adults: ${item.adults}`, 45, ticketY + 36);
    if (item.children) doc.text(`Children: ${item.children}`, 45, ticketY + 44);
    if (item.infants)  doc.text(`Infants: ${item.infants}`, 45, ticketY + 52);
    doc.text("Extras:", 120, ticketY + 10);
    if (item.extras?.length) {
      item.extras.forEach((e, i) => {
        const label = translations.en[e.key];
        doc.text(`• ${label} x${e.qty}`, 120, ticketY + 18 + i * 8);
      });
    } else {
      doc.text("None", 120, ticketY + 18);
    }
    doc.setFont("helvetica","bold")
       .text(`Price: € ${item.totalPrice.toLocaleString()}`, 120, ticketY + 40);

    // Load & draw image inline
    await new Promise(res => {
      const img = new Image();
      img.src = item.image;
      img.onload = () => {
        doc.addImage(img, "JPEG", 12, ticketY + 3, 30, 30);
        res();
      };
      img.onerror = () => res();
    });

    // Advance y
    y += 70;
  }

  // Total Price
  if (y > pageHeight - marginBottom) {
    doc.addPage();
    y = newPageTopMargin;
  }
  doc.setFontSize(12).text(`Total: € ${total.toLocaleString()}`, 10, y);

  // Return or save
  if (returnBlob) {
    return doc.output("blob");
  } else {
    doc.save(`Order_${generateOrderNumber()}.pdf`);
  }
}

  

  // Disable if cart is empty
  if(!cart.length){
    document.querySelectorAll('form input,form select,form textarea,form button')
      .forEach(f=>f.disabled=true);
  }

  closeModal.addEventListener("click",()=>{
    modal.style.display="none";
    location.reload();
    localStorage.removeItem("cart");
    localStorage.removeItem("customerData");
     const formFields = document.querySelectorAll('form input, form select, form textarea, form button');
        formFields.forEach(field => field.disabled = true);


  });

  displayCart();
});


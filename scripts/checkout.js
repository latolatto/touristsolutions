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

  // Build & show the confirmation modal + trigger PDF + email
  async function showConfirmation() {
    if (!transactionSucceeded) return;
    modal.style.display = "flex";

    // Retrieve customer data
    const cust = JSON.parse(localStorage.getItem("customerData")) || {};

    // Build modal HTML
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

    // Prepare hidden form fields
    document.getElementById("hidden-name").value    = cust.name;
    document.getElementById("hidden-surname").value = cust.surname;
    document.getElementById("hidden-email").value   = cust.email;
    document.getElementById("hidden-phone").value   = cust.phone;
    document.getElementById("hidden-agency").value  = cust.agency||"__________________";

    // Build plain‐text order summary for email
    let formatted = "";
    cart.forEach((item,i)=>{
      formatted+=`
------------------------------
${t("checkout.product")} ${i+1}: ${item.name.toUpperCase()}
${item.date? t("checkout.date")+": "+item.date+"\n":""}
${item.adults? t("checkout.adults")+": "+item.adults+"\n":""}
${item.children? t("checkout.children")+": "+item.children+"\n":""}
${item.infants? t("checkout.infants")+": "+item.infants+"\n":""}`;
      if(item.extras&&item.extras.length){
        formatted+=t("checkout.extras")+":\n";
        item.extras.forEach(e=>{
          formatted+=`  • ${t(e.key)} x${e.qty}\n`;
        });
      } else {
        formatted+=`${t("checkout.extras")}: None\n`;
      }
      formatted+=`${t("checkout.subtotal")}: €${item.totalPrice.toLocaleString()}\n`;
    });
    formatted+=`==============================\n${t("checkout.total")}: €${orderTotal.textContent}`;
    document.getElementById("hidden-order-summary").value = formatted;

    // Generate PDF (force English for pdf)
    const prevLang = localStorage.getItem("lang");
    localStorage.setItem("lang","en");
    const pdfBlob = await generatePDF(cust);
    localStorage.setItem("lang", prevLang);

    // Auto‐download PDF
    const count = parseInt(localStorage.getItem("orderCount")||"0",10)+1;
    localStorage.setItem("orderCount",count);
    const filename = `Order_Confirmation_#${count}.pdf`;
    document.querySelector('input[name="_subject"]').value = `Order Confirmation #${count}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(pdfBlob);
    a.download = filename;
    a.click();

    downloadOrderBtn.onclick = () => generatePDF(cust, false);


    // Attach PDF and submit email via fetch
    const dt = new DataTransfer();
    dt.items.add(new File([pdfBlob],filename,{type:"application/pdf"}));
    document.getElementById("pdfInput").files = dt.files;

    const form = document.getElementById("hidden-email-form");
    fetch(form.action, { method:"POST", body:new FormData(form) });
console.log("email sent successfully");
    // Clear storage
    localStorage.removeItem("cart");
    localStorage.removeItem("customerData");
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

  // PDF generation (keeps your layout)
  function generatePDF(customerData, returnBlob = true) {
    return new Promise((resolve) => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginBottom = 10;
      const newPageTopMargin = 40;
  
      // Logo & header
      let logoPromise = new Promise(res => {
        let img = new Image();
        img.src = "./assets/images/logo.png";
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
      doc.text(`Name: ${customerData.name} ${customerData.surname}`, 10, y); y+=8;
      doc.text(`Email: ${customerData.email}`, 10, y);                     y+=8;
      doc.text(`Phone: ${customerData.phone}`, 10, y);                     y+=8;
      doc.text(`Agency: ${customerData.agency||"______________________________"}`, 10, y);              y+=12;
  
      // Order Tickets
      doc.setFontSize(12).text("Order Tickets:", 10, y); y+=10;
      let promises = [logoPromise];
      let total = 0;
  
      cart.forEach(item => {
        if (y + 60 > pageHeight - marginBottom) {
          doc.addPage();
          y = newPageTopMargin;
        }
        const ticketY = y;
        total += item.totalPrice;
  
        // Ticket border
        doc.setDrawColor(0).setLineWidth(0.5).rect(10, ticketY, 180, 55);
  
        // Item image
        let imgP = new Promise(res => {
          let img = new Image();
          img.src = item.image;
          img.onload = () => {
            doc.addImage(img, "JPEG", 12, ticketY + 3, 30, 30);
            res();
          };
        });
        promises.push(imgP);
  
        // Headline in English
        const isBus = item.name.includes("Vlora-");
        const headline = isBus ? "Daily Van Tour" : "Boat Tour";
        doc.setFont("helvetica","bold").text(`${item.name} - ${headline}`,45,ticketY+10);
        doc.setFont("helvetica","normal").text(`Date: ${item.date}`,45,ticketY+18);
  
        if (item.adults)   doc.text(`Adults: ${item.adults}`,45,ticketY+36);
        if (item.children) doc.text(`Children: ${item.children}`,45,ticketY+44);
        if (item.infants)  doc.text(`Infants: ${item.infants}`,45,ticketY+52);
  
        // Extras as array
        doc.text("Extras:", 120, ticketY + 10);
        if (Array.isArray(item.extras) && item.extras.length) {
          item.extras.forEach((e, idx) => {
            // For the PDF, we want English labels (per your earlier request)
            const label = translations.en[e.key];
            doc.text(`• ${label} x${e.qty}`, 120, ticketY + 18 + idx * 8);
          });
        } else {
          doc.text("None", 120, ticketY + 18);
        }
        doc.setFont("helvetica","bold")
           .text(`Price: €${item.totalPrice.toLocaleString()}`,120,ticketY+40);
  
        y += 60;
      });
  
      // Total Price
      if (y > pageHeight - marginBottom) {
        doc.addPage();
        y = newPageTopMargin;
      }
      doc.setFontSize(12).text(`Total: € ${total.toLocaleString()}`, 10, y);
  
      // Wait for all images to finish
      Promise.all(promises).then(() => {
        if (returnBlob) {
          // For auto-download/email path
          const blob = doc.output("blob");
          resolve(blob);
        } else {
          // Manual download path
          const count = localStorage.getItem("orderCount") || "1";
          doc.save(`Order_Confirmation_#${count}.pdf`);
          resolve();
        }
    });
    });

  
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
     const formFields = document.querySelectora('form input, form select, form textarea, form button');
        formFields.forEach(field => field.disabled = true);


  });

  displayCart();
});



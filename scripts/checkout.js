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


   // generate PDF
  const pdfBlob = await generatePDF(cust, true);



  lastPdfBlob = await generatePDF(cust, true);
  lastPdfUrl = URL.createObjectURL(lastPdfBlob);
  

downloadOrderBtn.addEventListener('click', async () => {
  if (!lastPdfBlob) return;

  // 1) iOS Safari detection
  const isIosSafari = /iP(hone|od|ad)/.test(navigator.platform)
    && navigator.userAgent.includes('Safari')
    && !navigator.userAgent.includes('Chrome');

  if (isIosSafari) {
    // ——— iOS Safari path: Data-URI into a new tab ———
    const reader = new FileReader();
    // open a blank tab immediately (avoid popup blockers)
    const newWin = window.open('', '_blank');
    reader.onloadend = () => {
      // reader.result -> "data:application/pdf;base64,…"
      if (newWin) newWin.location.href = reader.result;
    };
    reader.readAsDataURL(lastPdfBlob);

  } else {
    // ——— Other browsers: normal download ———
    const blobUrl = URL.createObjectURL(lastPdfBlob);
    const link    = document.createElement('a');
    link.href     = blobUrl;
    link.download = `Order_${generateOrderNumber()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  // ——— FLASH BUTTON FEEDBACK (same as you already have) ———
  const originalBg    = downloadOrderBtn.style.backgroundColor;
  const originalColor = downloadOrderBtn.style.color;
  downloadOrderBtn.style.backgroundColor = '#28a745';
  downloadOrderBtn.style.color           = '#fff';
  downloadOrderBtn.disabled              = true;
  checkmarkPlaceholder.textContent       = '✓';

  setTimeout(() => {
    downloadOrderBtn.style.backgroundColor = originalBg;
    downloadOrderBtn.style.color           = originalColor;
    downloadOrderBtn.disabled              = false;
    checkmarkPlaceholder.textContent       = '';
  }, 3000);
});



// 1) Reserve a space for the checkmark
const checkmarkPlaceholder = document.createElement('span');
checkmarkPlaceholder.id = 'download-success-check';
checkmarkPlaceholder.style.display = 'inline-block';
checkmarkPlaceholder.style.width = '1em';       // space for one character
checkmarkPlaceholder.style.marginLeft = '8px';  // tweak as you like
checkmarkPlaceholder.style.textAlign = 'center';
downloadOrderBtn.parentNode.insertBefore(checkmarkPlaceholder, downloadOrderBtn.nextSibling);
 
    // build plain-text summary
  let summary = '';
  cart.forEach((item,i)=>{
    summary += `------------------------------

    Product ${i+1}: ${item.name}\n` +
               `Date: ${item.date||'-'}\n` +
               `Adults: ${item.adults||0}, Children: ${item.children||0}, Infants: ${item.infants||0}\n` +
`Extras: ${
  item.extras && item.extras.length
    ? item.extras
        .map(e => `${translations.en[e.key]} x${e.qty}`)
        .join(', ')
    : 'None'
}\n\n`;                
summary += `Subtotal: €${item.totalPrice.toLocaleString()}\n\n`;

  });
summary += `------------------------------\nTotal: €${orderTotal.textContent}`;

  // finally: send email + PDF
  createAndSubmitForm(cust, summary, pdfBlob);

  // cleanup storage
  localStorage.removeItem('cart');
  localStorage.removeItem('customerData');

   
  }

async function submitOrder() {
  console.log("→ submitOrder() start");


  // 1) Gather data
  const cust        = JSON.parse(localStorage.getItem("customerData")) || {};
  const orderNumber = generateOrderNumber();

  // 2) Build plain-text summary
  let formatted = "";
  cart.forEach((item, i) => {
    formatted += `
------------------------------
Product ${i+1}: ${item.name.toUpperCase()}
Date: ${item.date || "—"}
Adults: ${item.adults || 0}
Children: ${item.children || 0}
Infants: ${item.infants || 0}
Extras: ${
      item.extras?.length
        ? item.extras.map(e => `${t(e.key)} x${e.qty}`).join(", ")
        : "None"
    }
Subtotal: €${item.totalPrice.toLocaleString()}
`;
  });
  formatted += `\n==============================\nTotal: €${orderTotal.textContent}`;
  console.log("  • formatted summary:", formatted);


 // 3) Populate hidden inputs so FormData(hiddenForm) catches them
  hiddenForm.querySelector("#hidden-name").value            = cust.name;
  hiddenForm.querySelector("#hidden-surname").value         = cust.surname;
  hiddenForm.querySelector("#hidden-email").value           = cust.email;
  hiddenForm.querySelector("#hidden-phone").value           = cust.phone;
  hiddenForm.querySelector("#hidden-agency").value          = cust.agency || "";
  hiddenForm.querySelector("#hidden-order-summary").value   = formatted;
  hiddenForm.querySelector('input[name="_subject"]').value  = `New Order #${orderNumber}`;


    // 4) Generate the PDF Blob
  console.log("  • generating PDF");
  const pdfBlob = await generatePDF(cust, true);
  console.log("  • PDF blob size:", pdfBlob.size, "bytes");

  // 4) inject into file input via DataTransfer
  const dt = new DataTransfer();
  dt.items.add(new File([pdfBlob], `Order_${orderNumber}.pdf`, {
    type: "application/pdf"
  }));
  document.getElementById("pdfInput").files = dt.files;

  

    // 5) submit the form into the hidden iframe
  console.log("  • submitting hidden form");
  hiddenForm.submit();

  // 6) cleanup
  localStorage.removeItem("cart");
  localStorage.removeItem("customerData");
  console.log("→ submitOrder() end");
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
  /**
 * Builds a tiny off-screen form, injects all your fields + PDF, and submits it.
 */
function createAndSubmitForm(cust, summary, pdfBlob) {
  const orderNumber = new Date().toISOString().replace(/[-:.]/g,'') + 'Z';

  // 1) Dynamically create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.name = 'email-target';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // 2) Create the form and target it into that iframe
  const form = document.createElement('form');
  form.action  = 'https://formsubmit.co/2ce673b9bc3539ee449be95aaf832627';
  form.method  = 'POST';
  form.enctype = 'multipart/form-data';
  form.target  = 'email-target';  // ← send the POST here
  form.style.display = 'none';

  // 3) Prevent the browser from navigating on submit
  form.addEventListener('submit', e => {
    e.preventDefault();  // stops any navigation
    // we still let the browser send the request into the iframe
  });

  // 4) Append your hidden fields
  const data = {
    'First Name':    cust.name,
    'Last Name':     cust.surname,
    'email':         cust.email,
    'Phone':         cust.phone,
    'Agency/Hotel':  cust.agency || '',
    'Order Summary': summary,
    '_captcha':      'false',
    '_subject':      `New Order #${orderNumber}`,
    '_cc':           'latolatto16@gmail.com',
    '_template':     'table',
    '_redirect':     'false'
    // no _next field
  };
  Object.entries(data).forEach(([k,v]) => {
    const inp = document.createElement('input');
    inp.type  = 'hidden';
    inp.name  = k;
    inp.value = v;
    form.appendChild(inp);
  });

  // 5) Off-screen file input
  const fileInput = document.createElement('input');
  fileInput.type   = 'file';
  fileInput.name   = '_attachment';
  fileInput.accept = 'application/pdf';
  fileInput.style.position = 'absolute';
  fileInput.style.left     = '-9999px';
  form.appendChild(fileInput);

  document.body.appendChild(form);

  // 6) Populate the file input
  const dt = new DataTransfer();
  dt.items.add(new File([pdfBlob], `Order_${orderNumber}.pdf`, {type:'application/pdf'}));
  fileInput.files = dt.files;

  // 7) Trigger the submit (fires into the iframe, no navigation)
  form.submit();
}


});
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

  const modalWasShown = sessionStorage.getItem("modalWasShown");
const modalWasClosed = sessionStorage.getItem("modalWasClosed");

if (localStorage.getItem("cart") && modalWasShown && !modalWasClosed) {
  // User closed the browser while the modal was open
  localStorage.removeItem("cart");
  localStorage.removeItem("customerData");
       const formFields = document.querySelectorAll('form input, form select, form textarea, form button');
        formFields.forEach(field => field.disabled = true);

  // Hide modal defensively
  modal.style.display = "none";

  // Clean up session flags
  sessionStorage.removeItem("modalWasShown");
  sessionStorage.removeItem("modalWasClosed");
}

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
            ${item.departureTime ? `<p><span data-i18n="departure.time.van">Departure time:</span> ${item.departureTime}</p>` : ""}
            ${item.adults    ? `<p><span data-i18n="checkout.adults">Adults:</span> ${item.adults}</p>`    : ""}
            ${item.children  ? `<p><span data-i18n="checkout.children">Children:</span> ${item.children}</p>`: ""}
            ${item.infants   ? `<p><span data-i18n="checkout.infants">Infants:</span> ${item.infants}</p>`  : ""}
            ${item.extras && item.extras.length
              ? `<p>${t("checkout.extras")} `+
                  item.extras.map(e=>`${t(e.key)} x${e.qty}`).join(", ")+
                `</p>`
              : ""
            }
            <p class="price"><strong>€${(item.totalPrice || 0).toLocaleString()}</strong></p>
          </div>
        </div>`;
      cartSummary.insertAdjacentHTML("beforeend", html);
    });
    orderTotal.textContent = total.toLocaleString();
    applyTranslations(localStorage.getItem("lang")||"en");
  }
function validateForm() {
  const name    = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const email   = document.getElementById("email").value.trim();
  const phone   = document.getElementById("phone").value.trim();
  const agency  = document.getElementById("agency").value.trim();

  const nameRegex  = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+\d{6,15}$/;

  const isValid = 
      name && surname && email && phone &&
      nameRegex.test(name) &&
      nameRegex.test(surname) &&
      emailRegex.test(email) &&
      phoneRegex.test(phone);

  // Show/hide PayPal button and proceed button
  const paypalContainer = document.getElementById("paypal-button-container");
  const proceedBtn = document.getElementById("proceed-to-payment");

  if (!isValid) {
    paypalContainer.style.display = "none";
    proceedBtn.style.display = "inline-block";
  }

  return isValid;
}

document.querySelectorAll("#name, #surname, #email, #phone, #agency").forEach(input => {
  input.addEventListener("input", validateForm);
});

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
    const phoneRegex = /^\+\d{6,15}$/;

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
    validateForm();
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



  function shouldShowBoatItinerary(item) {
    return item && !item.name.includes("Vlora-");
  }

  function getBoatItineraryMarkup(item) {
    return `
      <p><strong>€${(item.totalPrice || 0).toLocaleString()}</strong></p>
      <hr>
      <p><strong>Boat departs at 10:00 AM from the Port of Vlora and returns around 6:00 PM.</strong></p>
      <p><strong>---The itinerary includes:---</strong></p>
      <ul>
        <li>Beach stop at Karaburun – approximately 3/4-hour stay</li>
        <li>Panoramic visit to the Cave of Haxhi Ali</li>
        <li>Stop at Sazan Island – where you can either explore the old military town or enjoy the beach for about 1.5 hours</li>
      </ul>
      <p>At 09:00 you need to be at our office to take the physical ticket.</p>
      <p>At 09:30 you need to be at the port.</p>
    `;
  }

  // ───── showConfirmation & submitOrder ─────
  async function showConfirmation() {
    if (!transactionSucceeded) return;
    modal.style.display = "flex";

    sessionStorage.setItem("modalWasShown", "true");

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
        ${item.departureTime ? `<p>${t("departure.time.van")}: ${item.departureTime}</p>` : ""}
        ${item.adults    ? `<p>${t("checkout.adults")}: ${item.adults}</p>`    : ""}
        ${item.children  ? `<p>${t("checkout.children")}: ${item.children}</p>`: ""}
        ${item.infants   ? `<p>${t("checkout.infants")}: ${item.infants}</p>`  : ""}
        ${item.extras&&item.extras.length
          ? `<p>${t("checkout.extras")}: `+
              item.extras.map(e=>`${t(e.key)} x${e.qty}`).join(", ")+
            `</p>`
          : ""
        }
        ${shouldShowBoatItinerary(item) ? getBoatItineraryMarkup(item) : `<p><strong>€${(item.totalPrice || 0).toLocaleString()}</strong></p>`}
        <hr>
      </div>`).join("")}
    <hr>
    <h3>${t("checkout.total")}: €${orderTotal.textContent}</h3>
  `;


   // generate PDF
  const pdfBlob = await generatePDF(cust, true);



  lastPdfBlob = await generatePDF(cust, true);
  lastPdfUrl = URL.createObjectURL(lastPdfBlob);
  

// — inside showConfirmation(), after you set lastPdfBlob/lastPdfUrl —
downloadOrderBtn.addEventListener('click', () => {
  if (!lastPdfBlob) return;

  const blobUrl = URL.createObjectURL(lastPdfBlob);

  // Detect iOS Safari
  const isIosSafari =
    /iP(hone|od|ad)/.test(navigator.platform) &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('CriOS') && 
    !navigator.userAgent.includes('FxiOS') &&
    !navigator.userAgent.includes('EdgiOS');
  
  if (isIosSafari) {
    // Open the blob in a new tab (so Safari won’t replace your checkout page)
    window.open(blobUrl, '_blank');

  } else {
    // All other browsers: force a download
    const blobUrl = URL.createObjectURL(lastPdfBlob);
    const link   = document.createElement('a');
    link.href    = blobUrl;
    link.download= `Order_${generateOrderNumber()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  // 2) Flash the button green + ✓ for 3s
  const origBg    = downloadOrderBtn.style.backgroundColor;
  const origColor = downloadOrderBtn.style.color;

  downloadOrderBtn.style.backgroundColor = '#28a745';
  downloadOrderBtn.style.color           = '#fff';
  downloadOrderBtn.disabled              = true;
  checkmarkPlaceholder.textContent       = '✓';

  setTimeout(() => {
    downloadOrderBtn.style.backgroundColor = origBg;
    downloadOrderBtn.style.color           = origColor;
    downloadOrderBtn.disabled              = false;
    checkmarkPlaceholder.textContent       = '';
  }, 3000);
});

// (somewhere after you grab `downloadOrderBtn` but before any clicks fire)
const checkmarkPlaceholder = document.createElement('span');
checkmarkPlaceholder.style.display    = 'inline-block';
checkmarkPlaceholder.style.width      = '1em';
checkmarkPlaceholder.style.marginLeft = '8px';
downloadOrderBtn.parentNode.insertBefore(
  checkmarkPlaceholder,
  downloadOrderBtn.nextSibling
);

 
    // build plain-text summary
  let summary = '';
  cart.forEach((item,i)=>{
    summary += `------------------------------

    Product ${i+1}: ${item.name}\n` +
               `Date: ${item.date||'-'}\n` +
               (item.departureTime ? `Departure time : ${item.departureTime}\n` : "") +
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
Subtotal: €${(item.totalPrice || 0).toLocaleString()}
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
    doc.setTextColor(0, 0, 0);

  
  doc.setFontSize(16).text("Tourist Solutions", 80, 30);
  doc.setFontSize(10)
     .text("Email: support@touristsolutions.info", 80, 37)
     .text("Phone: +355698136849", 80, 44);
 // ** RED DISCLAIMER **
  doc.setFontSize(15);
  doc.setTextColor(255, 0, 0);               // red
    doc.setFont("helvetica", "bold");
  doc.text(
    "!! Screenshot this order receipt and send it to us via Whatsapp for order confirmation !! ",
    10, 50,                                  // x=10, y=50
    { maxWidth: 190 }                        // wrap if needed
  );

  // Customer details
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
  doc.setFontSize(12).text("Order Confirmation", 10, 65);
  doc.setFontSize(10);
  let y = 75;
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
    const isBus = item.name.includes("Vlora-");
    const isBoat = !isBus;
    const cardHeight = isBoat ? 150 : 65;

    // Page break if needed
    if (y + cardHeight > pageHeight - marginBottom) {
      doc.addPage();
      y = newPageTopMargin;
    }
    const ticketY = y;
    total += item.totalPrice;

    // Draw border & text
    doc.setDrawColor(0).setLineWidth(0.5).rect(10, ticketY, 180, cardHeight);
    const headline = isBus ? "Daily Van Tour" : "Boat Tour";
    doc.setFont("helvetica","bold").text(`${item.name} - ${headline}`, 45, ticketY + 10);
    doc.setFont("helvetica","normal").text(`Date: ${item.date}`, 45, ticketY + 18);
    if (item.departureTime) {
      doc.text(`Departure time: ${item.departureTime}`, 45, ticketY + 26);
    }

    if (item.adults)   doc.text(`Adults: ${item.adults}`, 45, ticketY + 34);
    if (item.children) doc.text(`Children: ${item.children}`, 45, ticketY + 42);
    if (item.infants)  doc.text(`Infants: ${item.infants}`, 45, ticketY + 50);

    doc.text("Extras:", 120, ticketY + 10);
    if (item.extras?.length) {
      item.extras.forEach((e, i) => {
        const label = translations.en[e.key];
        doc.text(`• ${label} x${e.qty}`, 120, ticketY + 18 + i * 8);
      });
    } else {
      doc.text("None", 120, ticketY + 18);
    }

    if (isBoat) {
      doc.setFont("helvetica","bold")
         .text(`Price: € ${item.totalPrice.toLocaleString()}`, 120, ticketY + 52);

      const itineraryYStart = ticketY + 60;
      doc.setDrawColor(120, 120, 120).line(15, itineraryYStart, 190, itineraryYStart);

      const itineraryLines = [
        "Boat departs at 10:00 AM from the Port of Vlora and returns around 6:00 PM.",
        "",
        "---The itinerary includes:---",
        "• Beach stop at Karaburun – approximately 3/4-hour stay",
        "• Panoramic visit to the Cave of Haxhi Ali",
        "• Stop at Sazan Island – where you can either explore the old military town or enjoy the beach for about 1.5 hours",
        "",
        "At 09:00 you need to be at our office to take the physical ticket.",
        "At 09:30 you need to be at the port."
      ];

      let itineraryY = itineraryYStart + 8;
      itineraryLines.forEach((line) => {
        if (!line) {
          itineraryY += 6;
          return;
        }

        const wrapped = doc.splitTextToSize(line, 165);
        wrapped.forEach((wrappedLine) => {
          doc.text(wrappedLine, 15, itineraryY);
          itineraryY += 6;
        });
      });
    } else {
      doc.setFont("helvetica","bold")
         .text(`Price: € ${item.totalPrice.toLocaleString()}`, 120, ticketY + 40);
    }

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
    y += cardHeight + 10;
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
  sessionStorage.setItem("modalWasClosed", "true");



  });





  
  displayCart();
  
  // ═══════════════════════════════════════════════════════════════
  // EMAIL RETRY + OFFLINE QUEUE SYSTEM
  // ═══════════════════════════════════════════════════════════════

  // Convert Blob to Base64 for localStorage storage
  async function blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // Convert Base64 back to Blob
  function base64ToBlob(base64String) {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Save email to queue for persistent retry
  async function savePendingEmail(cust, summary, pdfBlob) {
    try {
      const pending = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
      const orderNumber = generateOrderNumber();
      const pdfBase64 = await blobToBase64(pdfBlob);

      pending.push({
        id: orderNumber,
        timestamp: Date.now(),
        cust: cust,
        summary: summary,
        pdfBase64: pdfBase64,
        retries: 0,
        nextRetryTime: Date.now() + 2000
      });

      localStorage.setItem('pendingEmails', JSON.stringify(pending));
      console.log('→ Email queued for background retry:', orderNumber);
    } catch (error) {
      console.error('Failed to queue email:', error);
    }
  }

  // Send email via fetch to FormSubmit.co
  async function sendEmailViaFetch(cust, summary, pdfBlob, orderNumber) {
    try {
      const formData = new FormData();
      formData.append('First Name', cust.name);
      formData.append('Last Name', cust.surname);
      formData.append('email', cust.email);
      formData.append('Phone', cust.phone);
      formData.append('Agency/Hotel', cust.agency || '');
      formData.append('Order Summary', summary);
      formData.append('_captcha', 'false');
      formData.append('_subject', `New Order #${orderNumber}`);
      formData.append('_cc', 'latolatto16@gmail.com');
      formData.append('_template', 'table');
      formData.append('_redirect', 'false');
      formData.append('_attachment', pdfBlob, `Order_${orderNumber}.pdf`);

      const response = await fetch('https://formsubmit.co/2ce673b9bc3539ee449be95aaf832627', {
        method: 'POST',
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('Fetch error:', error);
      return false;
    }
  }

  // Process emails queued in localStorage
  async function processPendingEmails() {
    try {
      const pending = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
      const now = Date.now();
      let updated = false;

      for (let i = pending.length - 1; i >= 0; i--) {
        const email = pending[i];

        // Skip if not ready to retry yet
        if (email.nextRetryTime > now) continue;

        // Max 5 retries
        if (email.retries >= 5) {
          console.warn('⚠️ Email', email.id, 'max retries reached');
          pending.splice(i, 1);
          updated = true;
          continue;
        }

        email.retries++;
        const pdfBlob = base64ToBlob(email.pdfBase64);
        const success = await sendEmailViaFetch(email.cust, email.summary, pdfBlob, email.id);

        if (success) {
          console.log('✓ Queued email sent:', email.id);
          pending.splice(i, 1);
          updated = true;
        } else {
          // Schedule next retry with exponential backoff
          const backoffMs = Math.pow(2, email.retries - 1) * 3000; // 3s, 6s, 12s, 24s, 48s
          email.nextRetryTime = now + backoffMs;
          console.log(`→ Retry ${email.retries} scheduled for ${(backoffMs / 1000).toFixed(0)}s`);
          updated = true;
        }
      }

      if (updated) {
        localStorage.setItem('pendingEmails', JSON.stringify(pending));
      }
    } catch (error) {
      console.error('Error processing pending emails:', error);
    }
  }

  // Main function: Try immediately 3 times, then queue for background retry
  async function createAndSubmitForm(cust, summary, pdfBlob) {
    const orderNumber = generateOrderNumber();
    const maxImmediateRetries = 3;

    console.log('→ Attempting to send email for order:', orderNumber);

    for (let attempt = 1; attempt <= maxImmediateRetries; attempt++) {
      try {
        const success = await sendEmailViaFetch(cust, summary, pdfBlob, orderNumber);
        if (success) {
          console.log('✓ Email sent successfully on attempt', attempt);
          return true;
        }
      } catch (error) {
        console.error(`✗ Attempt ${attempt} failed:`, error);
      }

      // Wait before next retry (1s, 2s)
      if (attempt < maxImmediateRetries) {
        const delayMs = 1000 * attempt;
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    // All immediate retries failed, queue for background retry
    console.log('✗ Immediate retries exhausted, queuing for background retry...');
    await savePendingEmail(cust, summary, pdfBlob);
    return false;
  }

  // Process pending emails when page loads
  processPendingEmails();

  // Process pending emails every 30 seconds
  setInterval(processPendingEmails, 30000);


});
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartSummary = document.getElementById("cart-summary");
    const orderTotal = document.getElementById("order-total");
    const modal = document.getElementById("confirmation-modal");
    const closeModal = document.getElementById("close-modal");
    const downloadOrderBtn = document.getElementById("download-order");
    const orderDetails = document.getElementById("order-details");
    const proceedToPaymentBtn = document.getElementById("proceed-to-payment");
    const paypalContainer = document.getElementById("paypal-button-container");

    function displayCart() {
        cartSummary.innerHTML = "";
        let total = 0;
        cart.forEach(item => {
            total += item.totalPrice;
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <p><strong>${item.name} ${item.headline}</strong></p>
                    <p>Date: ${item.date}</p>
                    ${item.adults ? `<p>Adults: ${item.adults}</p>` : ""}
                    ${item.children ? `<p>Children: ${item.children}</p>` : ""}
                    ${item.infants ? `<p>Infants: ${item.infants}</p>` : ""}
                    ${item.extras ? `<p>Extras: ${item.extras}</p>` : ""}
                    <p class="price"><strong>€ ${item.totalPrice.toLocaleString()} </strong></p>
                </div>
            `;
            cartSummary.appendChild(cartItem);
        });
        orderTotal.textContent = total.toLocaleString();
    }

    proceedToPaymentBtn.addEventListener("click", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const surname = document.getElementById("surname").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        if (!name || !surname || !email || !phone) {
            alert("Please fill all fields before proceeding.");
            return;
        }
        localStorage.setItem("customerData", JSON.stringify({ name, surname, email, phone }));
        paypalContainer.style.display = "block";
        proceedToPaymentBtn.style.display = "none";
    });
    
    paypal.Buttons({
        createOrder: function (data, actions) {
            let totalAmount = parseFloat(orderTotal.textContent.replace(/,/g, ""));
            return actions.order.create({
                purchase_units: [{
                    amount: { 
                        value: totalAmount.toFixed(2), 
                        currency_code: "EUR"
                    }
                }],
                application_context: {
                    shipping_preference: 'NO_SHIPPING' // Disables shipping address collection
                }
            });
        },
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect'
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                modal.style.display = "flex";
        
                let customerData = JSON.parse(localStorage.getItem("customerData")) || {};
        
                // Fill the modal content
                orderDetails.innerHTML = `
                    <h3>Customer Details</h3>
                    <p><strong>Name:</strong> ${customerData.name} ${customerData.surname}</p>
                    <p><strong>Email:</strong> ${customerData.email}</p>
                    <p><strong>Phone:</strong> ${customerData.phone}</p>
                    <h3>Order Summary</h3>
                    ${cartSummary.innerHTML}
                    <h3>Total: € ${orderTotal.textContent}</h3>
                `;
        
                // 📨 Prepare Pageclip form
                const form = document.getElementById("hidden-email-form");
                document.getElementById("hidden-name").value = customerData.name;
                document.getElementById("hidden-surname").value = customerData.surname;
                document.getElementById("hidden-email").value = customerData.email;
                document.getElementById("hidden-phone").value = customerData.phone;
                document.getElementById("hidden-order-summary").value = cartSummary.innerText + `\nTotal: € ${orderTotal.textContent}`;
        
                // Submit Pageclip form
                form.submit();
        
                // Setup for PDF download
                downloadOrderBtn.onclick = function () {
                    generatePDF(customerData);
                };
            });
        },

        
        onError: function (err) {
            console.error("Error during transaction:", err);
            alert("An error occurred. Please try again.");
        }
    }).render("#paypal-button-container");
    

    function generatePDF(customerData) {


        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginBottom = 10;
        const newPageTopMargin = 40; // New page tickets will start at y = 20
    
        // Capture the current page for the logo
        const logoPage = doc.getNumberOfPages();
    
        // ✅ Business Header with Logo
        let logoPromise = new Promise((resolve) => {
            let img = new Image();
            img.src = "./assets/images/logo.png";
            img.onload = function () {
                doc.setPage(logoPage);
                doc.addImage(img, "PNG", 80, 5, 50, 20); // Logo centered
                resolve();
            };
        });
    
        // ✅ Business Name & Contact Info
        doc.setFontSize(16);
        doc.text("Tourist Solutions", 80, 30);
        doc.setFontSize(10);
        doc.text("Email: support@touristsolutions.info", 80, 37);
        doc.text("Phone: +355698136849", 80, 44);
    
        // ✅ Customer Details
        doc.setFontSize(12);
        doc.text("Order Confirmation", 10, 55);
        doc.setFontSize(10);
    
        let y = 65;
        doc.text("Customer Details:", 10, y);
        y += 8;
        doc.text(`Name: ${customerData.name} ${customerData.surname}`, 10, y);
        y += 8;
        doc.text(`Email: ${customerData.email}`, 10, y);
        y += 8;
        doc.text(`Phone: ${customerData.phone}`, 10, y);
        y += 12;
    
        // ✅ Order Summary
        doc.setFontSize(12);
        doc.text("Order Tickets:", 10, y);
        y += 10;
    
        let total = 0;
        let promises = [logoPromise];
    
        cart.forEach((item) => {
            // Ticket height is fixed at 60 units.
            if (y + 60 > pageHeight - marginBottom) {
                doc.addPage();
                y = newPageTopMargin;  // start a bit lower on the new page
            }
            // Capture the current page number for this ticket.
            const ticketPage = doc.getNumberOfPages();
            const ticketY = y;
    
            // 🎟️ **Ticket Border**
            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.rect(10, ticketY, 180, 55);
    
            // 🖼️ **Image Embedding**
            let imagePromise = new Promise((resolve) => {
                let img = new Image();
                img.src = item.image;
                img.onload = function () {
                    // Ensure the image is added to the page where the ticket is drawn.
                    doc.setPage(ticketPage);
                    doc.addImage(img, "JPEG", 12, ticketY + 3, 30, 30);
                    resolve();
                };
            });
            promises.push(imagePromise);
    
            // 📝 **Ticket Content**
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(`${item.name} - ${item.headline}`, 45, ticketY + 10);
            doc.setFont("helvetica", "normal");
    
            doc.text(`Date: ${item.date}`, 45, ticketY + 18);
            
            // ✅ If it's a bus ticket, add "Agency" field
            if (item.name.includes("Vlora-Saranda") || item.name.includes("Vlora-Berat")) {
                doc.text("Agency: ___________________________", 45, ticketY + 26);
                y += 8;
            }
    
            if (item.adults) { doc.text(`Adults: ${item.adults}`, 45, ticketY + 36); }
            if (item.children) { doc.text(`Children: ${item.children}`, 45, ticketY + 44); }
            if (item.infants) { doc.text(`Infants: ${item.infants}`, 45, ticketY + 52); }
    
            // ✅ **Extras now appear below "Extras:" if selected**
            doc.text("Extras:", 120, ticketY + 10);
            if (item.extras) {
                let extrasList = item.extras.replace(/🚤|🍽️/g, "").trim().split(", ");
                extrasList.forEach((extra, idx) => {
                    doc.text(`• ${extra}`, 120, ticketY + 18 + (idx * 8));
                });
                y += (extrasList.length * 8);
            } else {
                doc.text("None", 120, ticketY + 18);
            }
    
            doc.setFont("helvetica", "bold");
            doc.text(`Price: €${item.totalPrice.toLocaleString()} `, 120, ticketY + 40);
    
            total += item.totalPrice;
    
            // Increase y position for the next ticket.
            y += 60;
        });
    
        // ✅ Total Price
        y += 10;
        if (y > pageHeight - marginBottom) {
            doc.addPage();
            y = newPageTopMargin;
        }
        doc.setFontSize(12);
        doc.text(`Total: € ${total.toLocaleString()} `, 10, y);
    
        // ✅ Save after images load
        Promise.all(promises).then(() => {
            doc.save("Order_Confirmation.pdf");
            localStorage.removeItem("cart");
            localStorage.removeItem("customerData");
        });
        uploadPDFToFileIO(pdfBlob)
        .then(pdfDownloadLink => {
            // Now, send email with the PDF link
            sendEmail(customerData, pdfDownloadLink);
        })
        .catch(error => {
            console.error("Error uploading PDF:", error);
        });
}

function uploadPDFToFileIO(pdfBlob) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", pdfBlob, "Order_Confirmation.pdf");

        fetch("https://file.io", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(data.link); // The generated link from file.io
            } else {
                reject("Failed to upload file to file.io");
            }
        })
        .catch(error => {
            reject("Error uploading PDF: " + error);
        });
    });
}


    



    if (cart.length === 0) {
        const formFields = document.querySelectorAll('form input, form select, form textarea, form button');
        formFields.forEach(field => field.disabled = true);
      }
      
    

    closeModal.addEventListener("click", function () {
        localStorage.removeItem("cart");
        localStorage.removeItem("customerData");
        location.reload();
        const formFields = document.querySelectora('form input, form select, form textarea, form button');
        formFields.forEach(field => field.disabled = true);
    });
    displayCart();
});


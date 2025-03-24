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
                    ${item.time ? `<p>Time: ${item.time}</p>` : ""}
                    ${item.adults ? `<p>Adults: ${item.adults}</p>` : ""}
                    ${item.children ? `<p>Children: ${item.children}</p>` : ""}
                    ${item.infants ? `<p>Infants: ${item.infants}</p>` : ""}
                    ${item.extras ? `<p>Extras: ${item.extras}</p>` : ""}
                    <p class="price"><strong>${item.totalPrice.toLocaleString()} ALL</strong></p>
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
                        currency_code: "USD" 
                    }  ,

                }],
                // experience_context_base: {
                //     shipping_preference: 'NO_SHIPPING' // Disables address collection
                //   },
                //   application_context: {
                //     shipping_preference: 'NO_SHIPPING' // Disables address collection
                //   }
                // no_shipping:0
                no_shipping: 1  // This disables shipping and billing address

            });
        },
        style: {
            layout: 'vertical', // You can adjust the layout style here
            color: 'gold', // Customize button color
            shape: 'rect', // Button shape
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                modal.style.display = "flex";
                let customerData = JSON.parse(localStorage.getItem("customerData")) || {};
                orderDetails.innerHTML = `
                    <h3>Customer Details</h3>
                    <p><strong>Name:</strong> ${customerData.name} ${customerData.surname}</p>
                    <p><strong>Email:</strong> ${customerData.email}</p>
                    <p><strong>Phone:</strong> ${customerData.phone}</p>
                    <h3>Order Summary</h3>
                    ${cartSummary.innerHTML}
                    <h3>Total: ${orderTotal.textContent} ALL</h3>
                `;
                downloadOrderBtn.onclick = function () {
                    generatePDF(customerData);
                };
            });
        },
                    // Handle errors
                    onError: function (err) {
                        console.error('Error during transaction:', err);
                        alert('An error occurred. Please try again.');
                    },

    }).render("#paypal-button-container");

    function generatePDF(customerData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // ✅ Business Header
        doc.setFontSize(14);
        doc.text("Tourist Solutions", 10, 10);
        doc.setFontSize(10);
        doc.text("Email: support@touristsolutions.info", 10, 20);
        doc.text("Phone: +355698136849", 10, 30);
    
        // ✅ Customer Details
        doc.setFontSize(12);
        doc.text("Order Confirmation", 10, 50);
        doc.setFontSize(10);
        
        let y = 60; // Starting position
        doc.text(`Customer Details:`, 10, y);
        y += 10;
        doc.text(`Name: ${customerData.name} ${customerData.surname}`, 10, y);
        y += 10;
        doc.text(`Email: ${customerData.email}`, 10, y);
        y += 10;
        doc.text(`Phone: ${customerData.phone}`, 10, y);
        y += 20; // Extra spacing before order summary
    
        // ✅ Order Summary
        doc.text("Order Summary:", 10, y);
        y += 10;
    
        let total = 0;
        cart.forEach((item) => {
            doc.text(`• ${item.name} ${item.headline}`, 10, y);
            y += 8;
            doc.text(`   Date: ${item.date}`, 10, y);
            y += 8;
            if (item.time) { doc.text(`   Time: ${item.time}`, 10, y); y += 8; }
            if (item.adults) { doc.text(`   Adults: ${item.adults}`, 10, y); y += 8; }
            if (item.children) { doc.text(`   Children: ${item.children}`, 10, y); y += 8; }
            if (item.infants) { doc.text(`   Infants: ${item.infants}`, 10, y); y += 8; }
            doc.text(`   Extras: ${item.extras || "None"}`, 10, y);
            y += 8;
            doc.text(`   Price: ${item.totalPrice.toLocaleString()} ALL`, 10, y);
            y += 12; // Space between items
            doc.text("-------------------------------------", 10, y);
            y += 18; 
            total += item.totalPrice;
        });
    
        // ✅ Total Price
        y += 10;
        doc.setFontSize(12);
        doc.text(`Total: ${total.toLocaleString()} ALL`, 10, y);
    
        // ✅ Save the PDF
        doc.save("Order_Confirmation.pdf");
    
        // ✅ Clear Data After Download
        localStorage.removeItem("cart");
        localStorage.removeItem("customerData");
    }
    

    closeModal.addEventListener("click", function () {
        localStorage.removeItem("cart");
        localStorage.removeItem("customerData");
        location.reload();
    });
    displayCart();
});


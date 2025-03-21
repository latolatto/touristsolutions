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
                    amount: { value: totalAmount.toFixed(2), 
                        currency_code: "USD" },
                        shipping: {
                            address: {
                                address_line_1: '',
                                address_line_2: '',
                                admin_area_1: '',
                                admin_area_2: '',
                                postal_code: '',
                                country_code: ''
                            } 
                                                }
                              
                }]
            });
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
        }
    }).render("#paypal-button-container");

    function generatePDF(customerData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let orderText = `Order Confirmation\n\n`;
        orderText += `Customer Details:\n`;
        orderText += `Name: ${customerData.name} ${customerData.surname}\n`;
        orderText += `Email: ${customerData.email}\n`;
        orderText += `Phone: ${customerData.phone}\n\n`;
        orderText += `Order Summary:\n`;
        let total = 0;
        cart.forEach((item, index) => {
            orderText += `${index + 1}. ${item.name} ${item.headline}\n`;
            orderText += `   Date: ${item.date}\n`;
            if (item.time) orderText += `   Time: ${item.time}\n`;
            if (item.adults) orderText += `   Adults: ${item.adults}\n`;
            if (item.children) orderText += `   Children: ${item.children}\n`;
            if (item.infants) orderText += `   Infants: ${item.infants}\n`;
            orderText += `   Extras: ${item.extras || "None"}\n`;
            orderText += `   Price: ${item.totalPrice.toLocaleString()} ALL\n`;
            orderText += `-------------------------------------\n`;
            totalPrice += item.totalPrice;
        
        });
        orderText += `\nTotal: ${total.toLocaleString()} ALL`;
        doc.text(orderText, 10, 10);
        doc.save("Order_Confirmation.pdf");
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


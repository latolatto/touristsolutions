
document.getElementById("year").innerHTML = new Date().getFullYear();

// JavaScript for Back-to-Top Button
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('backToTopBtn');
  
    // Show/Hide button based on scroll position
    function toggleBackToTopBtn() {
        if (window.scrollY > 200) { // Adjust the scroll threshold as needed
            backToTopBtn.style.display = 'flex'; // Show the button
        } else {
            backToTopBtn.style.display = 'none'; // Hide the button
        }
    }
  
    // Scroll to top functionality
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scrolling
        });
    }
  
    // Attach event listeners
    window.addEventListener('scroll', toggleBackToTopBtn);
    backToTopBtn.addEventListener('click', scrollToTop);
  });

  //booking +/- buttons
document.querySelectorAll(".increase, .decrease").forEach(button => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      let value = parseInt(input.value);
      
      if (this.classList.contains("increase")) {
        input.value = value + 1;
      } else if (this.classList.contains("decrease")) {
        if (targetId === "adults" && value > 1) {
          input.value = value - 1;
        } else if ((targetId === "children" || targetId === "infants") && value > 0) {
          input.value = value - 1;
        }
      }
    });
  });


// Remove any non-integer characters
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, ''); 
    });
});


//product generation for booking page
document.addEventListener("DOMContentLoaded", function () {
    // Get the product (boat or bus) name from the URL
    const params = new URLSearchParams(window.location.search);
    const productName = params.get("boat") || params.get("bus"); // Supports both "boat" and "bus"

    // Define product details (boats + buses)
    const productDetails = {
        // 🛥️ BOATS
        "Aquamarine": {
            image: "./assets/images/other pages/boat-trip/aqua1.jpeg",
            features: [
                "🌊 Boat Tour: Guided exploration",
                "🏝️ Beach Stops: Relaxing breaks",
                "🚤 Speedboat Option: Haxhi Ali Cave (+1500 ALL)",
                "🎶 Party Onboard: DJ & entertainment",
                "🍽️ Dining: Bar & restaurant (meat & fish + 1500 ALL)",
                "🍉 Included: Free large fruit banquet"
            ],
            price: 2500,
            mainInfo: "Guided boat tour of Karaburun-Sazan National Marine Park"
        },
        "Liburna": {
            image: "./assets/images/other pages/boat-trip/liburna1.jpg",
            features: [
                "🌊 Boat Tour: Guided exploration",
                "🏝️ Beach Stops: Relaxing breaks",
                "🚤 Speedboat Option: Haxhi Ali Cave (+1500 ALL)",
                "🎭 Entertainment: DJ, Pirate & Monkey Show",
                "🍕 Dining: Bar & pizzeria",
                "☕ Included: Free coffee"
            ],
            price: 2500,
            mainInfo: "Guided boat tour of Karaburun-Sazan National Marine Park"
        },
        "Vlora Cruise": {
            image: "./assets/images/other pages/boat-trip/vlora1.png",
            features: [
                "🌊 Boat Tour: Guided exploration",
                "🏝️ Beach Stops: Relaxing breaks",
                "🚤 Speedboat Option: Haxhi Ali Cave (+1500 ALL)",
                "🧘 Relaxing Experience: Perfect for those who prefer a quiet trip without loud music or partying",
                "🍹 Bar: Refreshing drinks",
                "🥪 Included: Free sandwich"
            ],
            price: 2500,
            mainInfo: "Guided boat tour of Karaburun-Sazan National Marine Park"
        },

        // 🚍 BUSES
        "Vlora-Saranda": {
            image: "./assets/images/bus1.jpeg",
            features: [
                "🏷️ Price: 1500 ALL per adult | 800 ALL per child",
                "🕒 Departure (Vlora): 07:00 AM | 11:30 AM | 04:00 PM",
                "🕒 Departure (Saranda): 09:30 AM | 02:00 PM | 07:00 PM",
                "📍 Stops: Orikum, Dhermi, Himara, Borsh",
                "⏳ Duration: ~3.5 hours",
                "🚌 Bus Type: Air-conditioned, 50-seater",
                "💳 Payment: Cash or card on board"
            ],
            price: {
                adult: 1500,
                child: 800
            },
            mainInfo: "Daily transportation service"
        },
        "Vlora-Berat": {
            image: "./assets/images/bus2.jpeg",
            features: [
                "🏷️ Price: 1500 ALL per adult | 800 ALL per child",
                "🕒 Departure (Vlora): 06:30 AM | 12:30 PM | 05:30 PM",
                "🕒 Departure (Berat): 09:00 AM | 03:00 PM | 08:00 PM",
                "📍 Stops: Fier, Lushnje",
                "⏳ Duration: ~2.5 hours",
                "🚌 Bus Type: Comfortable, 40-seater",
                "💳 Payment: Cash or card on board"
            ],
            price: {
                adult: 1200,
                child: 700
            },
            mainInfo: "Daily transportation service"
        }
    };

    // Display product details
    if (productName && productDetails[productName]) {
        const isitbus = productName.includes("Vlora-");
const additionalinfo=bookingtitle= isitbus?"" :  `      <section class="container py-5">
<h2 class="text-center pb-3">Pricing</h2>
<div class="row justify-content-center">
    
    <!-- Infants -->
    <div class="col-md-4">
        <div class="card text-center shadow-lg border-0 rounded-4 p-4">
            <h5 class="fw-bold">Infants</h5>
            <p class="text-muted">(0 - X years old)</p>
            <h3 class="text-success">FREE</h3>
        </div>
    </div>
    
    <!-- Children -->
    <div class="col-md-4">
        <div class="card text-center shadow-lg border-0 rounded-4 p-4">
            <h5 class="fw-bold">Children</h5>
            <p class="text-muted">(X - Y years old)</p>
            <h3 class="text-danger">1,500 ALL</h3>
        </div>
    </div>
    
    <!-- Adults -->
    <div class="col-md-4">
        <div class="card text-center shadow-lg border-0 rounded-4 p-4">
            <h5 class="fw-bold">Adults</h5>
            <p class="text-muted">(Y+ years old)</p>
            <h3 class="text-danger">2,500 ALL</h3>
        </div>
    </div>
</div>
</section>
<div class="container my-5">
<div class="row justify-content-center">
    <div class="col-lg-8">
        <div class="card shadow-lg border-0">
            <div class="card-body">
                <h3 class="text-center mb-4">📍 Itinerary</h3>

                <!-- Departure -->
                <div class="d-flex align-items-center mb-5">
                    <span class="fs-4 me-3"><img width="70" src="./assets/images/other pages/boat-trip/port.jpg"></span>
                    <div>
                        <h5 class="mb-1">Departure</h5>
                        <p class="mb-0"><strong>10:00 AM </strong>from Vlora Civil Port</p>
                    </div>
                </div>

                <!-- Stop 1: Karaburun Beach -->
                <div class="d-flex align-items-center mb-5">
                    <span class="fs-4 me-3"><img width="70" src="./assets/images/other pages/boat-trip/karaburun.jpg"></span>
                    <div>
                        <h5 class="mb-1">Stop 1 – Karaburun Beach</h5>
                        <p class="mb-0">Enjoy a relaxing beach stay (approximately <strong>3-4 hours</strong>).</p>
                    </div>
                </div>

                <!-- Stop 2: Haxhi Ali Cave -->
                <div class="d-flex align-items-center mb-5">
                    <span class="fs-4 me-3"><img width="70" src="./assets/images/other pages/boat-trip/haxhi-ali.jpg"></span>
                    <div>
                        <h5 class="mb-1">Stop 2 – Haxhi Ali Cave</h5>
                        <p class="mb-0">Panoramic visit of the famous sea cave; <strong>optional</strong> speedboat entrance (+1500 ALL, ~20 minutes)</p>
                    </div>
                </div>

                <!-- Stop 3: Sazan Island -->
                <div class="d-flex align-items-center mb-5">
                    <span class="fs-4 me-3"><img width="70" src="./assets/images/other pages/boat-trip/sazan.jpeg"></span>
                    <div>
                        <h5 class="mb-1">Stop 3 – Sazan Island</h5>
                        <p class="mb-0">Guided exploration of the island, including bunkers and historic sites (~<strong>1 hour</strong>).</p>
                    </div>
                </div>

                <!-- Return -->
                <div class="d-flex align-items-center mb-5">
                    <span class="fs-4 me-3"><img width="70" src="./assets/images/other pages/boat-trip/return.jpg"></span>
                    <div>
                        <h5 class="mb-1">Return</h5>
                        <p class="mb-0">Arrival back at the starting point around <strong>06:00 PM</strong> .</p>
                    </div>
                </div>

                <!-- Note -->
                <div class="alert alert-warning mt-4">
                    ⚠️ <strong>Note:</strong> The itinerary may be subject to changes due to weather conditions.
                </div>

                <!-- Not Included -->
                <h4 class="mt-4 text-center">❌ Not Included in the Price :</h4>
                <ul class="list-unstyled text-center mt-3">
                    <li>🍽️ Food & drinks from the onboard restaurant/bar</li>
                    <li>⛱️ Sunbeds and umbrellas at the beach</li>
                    <li>🚤 Optional speedboat tour inside Haxhi Ali Cave (+1500 ALL)</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</div>`;

        const isbus = productName.includes("Vlora-");
const booknowtitle=bookingtitle= isbus? "Book Your Bus Seat" : "Book Your Tour";
        document.getElementById("additional-info").innerHTML=additionalinfo;
        document.getElementById("booknow-title").textContent=booknowtitle;
        document.getElementById("boat-name").textContent = productName;
        document.getElementById("main-info").textContent = productDetails[productName].mainInfo;
        document.getElementById("boat-image").src = productDetails[productName].image;
        
        // Generate feature list
        document.getElementById("boat-features").innerHTML = productDetails[productName].features
            .map(feature => `<li class="list-group-item">${feature}</li>`)
            .join('');

        // Handle price formatting (for buses and boats)
        const priceElement = document.getElementById("boat-price");
        if (typeof productDetails[productName].price === "object") {
            priceElement.textContent = `Adult: ${productDetails[productName].price.adult} ALL | Child: ${productDetails[productName].price.child} ALL`;
        } else {
            priceElement.textContent = `${productDetails[productName].price} ALL`;
        }
    }
});



//CART
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartOffcanvas = document.getElementById("cartOffcanvas");
    const cartItemsContainer = document.getElementById("cart-items");
    const grandTotalContainer = document.getElementById("grand-total");
    const cartItemCount = document.getElementById("cartItemCount");

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        cart.forEach((item, index) => {
            total += item.totalPrice;
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" class="cart-image" alt="${item.name}">
                <div>
                    <p><strong>${item.name} ${item.headline}</strong></p>
                    <p>${item.date}</p>
                    ${item.adults ? `<p>Adults: ${item.adults}</p>` : ""}
                    ${item.children ? `<p>Children: ${item.children}</p>` : ""}
                    ${item.infants ? `<p>Infants: ${item.infants}</p>` : ""}
                    <p><strong>Total: ${item.totalPrice.toLocaleString()} ALL</strong></p>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        grandTotalContainer.textContent = `Grand total: ${total.toLocaleString()} ALL`;
        cartItemCount.textContent = cart.length;
    }

    document.getElementById("clearCart").addEventListener("click", function () {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    });

    document.getElementById("cart-items").addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
        }
    });

    updateCartDisplay();

    document.getElementById("bookNow").addEventListener("click", function (event) {
        event.preventDefault();

        const boatName = document.getElementById("boat-name").textContent;
        const isBus = boatName.includes("Vlora-");
        const headline = isBus ? "Bus Seat" : "Boat Tour";
                const date = document.getElementById("tour-date").value;
        const adults = parseInt(document.getElementById("adults").value) || 0;
        const children = parseInt(document.getElementById("children").value) || 0;
        const infants = parseInt(document.getElementById("infants").value) || 0;

        const boatDetails = {
            "Aquamarine": {
                image: "./assets/images/other pages/boat-trip/aqua1.jpeg",
                price: 2500
            },
            "Liburna": {
                image: "./assets/images/other pages/boat-trip/liburna1.jpg",
                price: 2500
            },
            "Vlora Cruise": {
                image: "./assets/images/other pages/boat-trip/vlora1.png",
                price: 2500
            },
            "Vlora-Saranda": {
                image: "./assets/images/bus1.jpeg",
                price: { adult: 1500, child: 800 }
            },
            "Vlora-Berat": {
                image: "./assets/images/bus2.jpeg",
                price: { adult: 1200, child: 700 }
            }
        };

        if (!date) {
            alert("Please select a valid date.");
            return;
        }
        if (adults < 1) {
            alert("Please select at least one adult.");
            return;
        }

        const boat = boatDetails[boatName];
        if (!boat) {
            alert("Invalid  selection.");
            return;
        }

        let totalPrice;
        if (typeof boat.price === "object") {
            totalPrice = (adults * boat.price.adult) + (children * boat.price.child);
        } else {
            totalPrice = (adults * boat.price) + (children * 1500);
        }

        cart.push({
            name: boatName,
            headline: headline,
            date: date,
            adults: adults,
            children: children,
            infants: infants,
            totalPrice: totalPrice,
            image: boat.image
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();

        document.getElementById("tour-date").value = "";
        document.getElementById("adults").value = 1;
        document.getElementById("children").value = 0;
        document.getElementById("infants").value = 0;
        document.getElementById("special-requests").value = "";
    });

    window.addEventListener("storage", function () {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        updateCartDisplay();
    });
});

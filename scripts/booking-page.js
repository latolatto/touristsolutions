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

  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, ''); // Remove any non-integer characters
    });
});



document.addEventListener("DOMContentLoaded", function () {
    // Get the boat name from the URL
    const params = new URLSearchParams(window.location.search);
    const boatName = params.get("boat");
    // Define boat details
    const boatDetails = {
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
            price: 2500
        },
        "Liburna": {
            image: "./assets/images/other pages/boat-trip/liburna1.jpg",
            features: [
                "🌊 Boat Tour: Guided exploration",
                "🏝️ Beach Stops: Relaxing breaks",
                "🚤 Speedboat Option: Haxhi Ali Cave (+1500 ALL)",
                "🎭 Entertainment:DJ, Pirate & Monkey Show",
                "🍕 Dining:Bar & pizzeria",
                "☕ Included: Free coffee"
            ],
            price: 2500
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
            price: 2500
        }
    };

            // Display boat details
            if (boatName && boatDetails[boatName]) {
                document.getElementById("boat-name").textContent = boatName;
                // document.getElementById("boat-description").textContent = boatDetails[boatName].description;
                // document.getElementById("boat-price").textContent = boatDetails[boatName].price;
                document.getElementById("boat-image").src = boatDetails[boatName].image;
                document.getElementById("boat-features").innerHTML = boatDetails[boatName].features
                .map(feature => `<li class="list-group-item">${feature}</li>`)
                .join('');
                
            }
        });



    


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
                            <p><strong>${item.name}</strong></p>
                            <p>${item.date}</p>
                            ${item.adults ? `<p>Adults: ${item.adults}</p>` : ""}
                            ${item.children ? `<p>Children: ${item.children}</p>` : ""}
                            ${item.infants ? `<p>Infants: ${item.infants}</p>` : ""}
                            <p><strong>Total${item.totalPrice.toLocaleString()} ALL</strong></p>
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
                const date = document.getElementById("tour-date").value;
                const adults = parseInt(document.getElementById("adults").value) || 0;
                const children = parseInt(document.getElementById("children").value) || 0;
                const infants = parseInt(document.getElementById("infants").value) || 0;
        
                // Your original boatDetails object (unchanged)
                const boatDetails = {
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
                        price: 2500
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
                        price: 2500
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
                        price: 2500
                    }
                };
        
                // Validate inputs
                if (!date) {
                    alert("Please select a tour date.");
                    return;
                }
                if (adults < 1) {
                    alert("Please select at least one adult.");
                    return;
                }
        
                // Get boat details
                const boat = boatDetails[boatName];
        
                if (!boat) {
                    alert("Invalid boat selection.");
                    return;
                }
        
                // Calculate total price
                const totalPrice = (adults * boat.price) + (children * 1500);
        
                // Add to cart
                cart.push({
                    name: boatName,
                    date: date,
                    adults: adults,
                    children: children,
                    infants: infants,
                    totalPrice: totalPrice,
                    image: boat.image // Ensure image is correctly accessed
                });
        
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
        });
        
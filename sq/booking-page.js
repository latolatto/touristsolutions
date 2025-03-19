
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
            image: "../assets/images/other pages/boat-trip/aqua1.jpeg",
            features: [
                "🌊 Turne me Varkë: Eksplorim me guidë",
                "🏝️ Ndalesa në Plazh: Momente relaksuese",
                "🚤 Opsioni me Skaf: Shpella e Haxhi Aliut  (+1500 ALL)",
                "🎶 Festa në Bord: DJ & argëtim",
                "🍽️ Ushqim & Pije: Bar & restorant (mish & peshk + 1500 ALL)",
                "🍉 Përfshirë: Banket i madh me fruta falas"
            ],
            price: 2500,
            mainInfo: "Udhëtim me anije në Parkun Kombëtar Detar Karaburun-Sazan"
        },
        "Liburna": {
            image: "../assets/images/other pages/boat-trip/liburna1.jpg",
            features: [
                "🌊 Turne me Varkë: Eksplorim me guidë",
                "🏝️ Ndalesa në Plazh: Momente relaksuese",
                "🚤 Opsioni me Skaf: Shpella e Haxhi Aliut  (+1500 ALL)",
                "🎭 Argëtim: DJ, shfaqje piratësh & majmunësh",
                "🍕 Ushqim: Bar & piceri",
                "☕ Përfshirë: Kafe falas"
            ],
            price: 2500,
            mainInfo: "Udhëtim me anije në Parkun Kombëtar Detar Karaburun-Sazan"
        },
        "Vlora Cruise": {
            image: "../assets/images/other pages/boat-trip/vlora1.png",
            features: [
                "🌊 Boat Tour: Eksplorim me guidë",
                "🏝️ Ndalesa në Plazh: Momente relaksuese",
                "🚤 Opsioni me Skaf: Shpella e Haxhi Aliut  (+1500 ALL)",
                "🧘 Eksperiencë Relaksuese: E përkryer për ata që duan qetësi pa muzikë të lartë",
                "🍹 Bar: Pije freskuese",
                "🥪 Përfshirë: Sanduiç falas"
            ],
            price: 2500,
            mainInfo: "Udhëtim i qetë me guidë me anije në Parkun Kombëtar Detar Karaburun-Sazan"
        },

        // 🚍 BUSES
        "Vlora-Saranda": {
            image: "../assets/images/bus1.jpeg",
            features: [
                "🏷️ Çmimi: 1500 ALL për të rritur | 800 ALL për fëmijë",
                "🕒 Nisja (Vlora): 07:00 AM | 11:30 AM | 04:00 PM",
                "🕒 Nisja (Saranda): 09:30 AM | 02:00 PM | 07:00 PM",
                "📍 Ndalesa: Orikum, Dhërmi, Himarë, Borsh",
                "⏳ Kohëzgjatja: ~3.5 orë",
                "🚌 Lloji i autobusit: Me ajër të kondicionuar, 50 vende",
                "💳 Pagesa: Me para në dorë ose kartë në bord"
            ],
            price: {
                adult: 1500,
                child: 800
            },
            mainInfo: "Shërbim transporti ditor"
        },
        "Vlora-Berat": {
            image: "../assets/images/bus2.jpeg",
            features: [
                "🏷️ Çmimi: 1200 ALL për të rritur | 700 ALL për fëmijë",
                "🕒 Nisja (Vlora): 06:30 AM | 12:30 PM | 05:30 PM",
                "🕒 Nisja (Berat): 09:00 AM | 03:00 PM | 08:00 PM",
                "📍 Ndalesa: Fier, Lushnje",
                "⏳ Kohëzgjatja: ~2.5 orë",
                "🚌 Lloji i autobusit: I rehatshëm, 40 vende",
                "💳 Pagesa: Me para në dorë ose kartë në bord"
            ],
            price: {
                adult: 1200,
                child: 700
            },
            mainInfo: "Shërbim transporti ditor"
        }
    };

    // Display product details
    if (productName && productDetails[productName]) {
        const isitbus = productName.includes("Vlora-");
const additionalinfo= isitbus?"" :  `      <section class="container py-5">
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
                 <h3 class="text-center mb-4">📍 Itinerari</h3>
        
                            <!-- Departure -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img width="70" src="../assets/images/other pages/boat-trip/port.jpg"></span>
                                <div>
                                    <h5 class="mb-1">Nisja </h5>
                                    <p class="mb-0"><strong>10:00 AM </strong>nga Porti i Vlorës</p>
                                </div>
                            </div>
        
                            <!-- Stop 1: Karaburun Beach -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img width="70" src="../assets/images/other pages/boat-trip/karaburun.jpg"></span>
                                <div>
                                    <h5 class="mb-1">Ndalesa 1 – Plazhi Karaburun</h5>
                                    <p class="mb-0">Shijoni një qëndrim relaksues në plazh (afërsisht <strong>3-4 orë</strong>).</p>                                </div>
                            </div>
        
                            <!-- Stop 2: Haxhi Ali Cave -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img width="70" src="../assets/images/other pages/boat-trip/haxhi-ali.jpg"></span>
                                <div>
                                    <h5 class="mb-1">Ndalesa 2 – Shpella e Haxhi Aliut </h5>
                                    <p class="mb-0">Vizitë panoramike e shpellës së famshme detare; Hyrja <strong>opsionale</strong> me skaf (+1500 lekë, ~20 minuta)</p>                                </div>
                            </div>
        
                            <!-- Stop 3: Sazan Island -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img width="70" src="../assets/images/other pages/boat-trip/sazan.jpeg"></span>
                                <div>
                                    <h5 class="mb-1">Ndalesa 3 – Ishulli i Sazanit </h5>
                                    <p class="mb-0">Eksplorim me guidë i ishullit, duke përfshirë bunkerët dhe vendet historike (~<strong>1 orë</strong>).</p>                                </div>
                            </div>
        
                            <!-- Return -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img width="70" src="../assets/images/other pages/boat-trip/return.jpg"></span>
                                <div>
                                    <h5 class="mb-1">Kthimi</h5>
                                    <p class="mb-0">Mbërritja në pikën e nisjes rreth <strong>06:00 PM</strong> .</p>                                </div>
                            </div>
        
                            <!-- Note -->
                            <div class="alert alert-warning mt-4">
                                ⚠️ <strong>Shënim:</strong> Itinerari mund të ndryshojë për shkak të kushteve të motit.
                            </div>
        
                            <!-- Not Included -->
                            <h4 class="mt-4 text-center">❌ Nuk përfshihet në çmim :</h4>
                            <ul class="list-unstyled text-center mt-3">
                                <li>🍽️ Ushqime dhe pije nga restoranti/bari në bord</li>                                
                                <li>⛱️ Shezlongët dhe çadrat në plazh</li>                                
                                <li>🚤 Turne opsional me skaf brenda shpelles se Haxhi Aliut (+1500 leke)</li>                            </ul>
                        </div>
        </div>
    </div>
</div>
</div>`;

        const isbus = productName.includes("Vlora-");
const booknowtitle= isbus? "Book Your Bus Seat" : "Book Your Tour";

         const booktime= isbus? `  <label for="appt"> <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
</svg>Select a time:</label>
  <input type="time" id="appt" name="appt">` :"";
        document.getElementById("book-time").innerHTML= booktime;
        
  const booktimevisibility=isbus? "visible" : "hidden";
  document.getElementById("book-time").style.visibility=booktimevisibility;

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
            priceElement.textContent = `Te rritur: ${productDetails[productName].price.adult} ALL | Femije: ${productDetails[productName].price.child} ALL`;
        } else {
            priceElement.textContent = `${productDetails[productName].price} ALL`;
        }
    }
});



// CART
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
                    ${item.name.includes("Vlora-") ? `<p>Orari: ${item.time}</p>` : ""}
                    ${item.adults ? `<p>Të rritur: ${item.adults}</p>` : ""}
                    ${item.children ? `<p>Fëmijë: ${item.children}</p>` : ""}
                    ${item.infants ? `<p>Fosnja: ${item.infants}</p>` : ""}
                    <p><strong>Totali: ${item.totalPrice.toLocaleString()} ALL</strong></p>
                    <button class="remove-btn" data-index="${index}">Fshij</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        grandTotalContainer.textContent = `Totali gjithsej: ${total.toLocaleString()} ALL`;
        cartItemCount.textContent = cart.length;


        // Get buttons
    const clearCartBtn = document.getElementById("clearCart");
    const checkoutBtn = document.getElementById("checkout");

    // Disable buttons if cart is empty
    if (cart.length === 0) {
        clearCartBtn.disabled = true;
        checkoutBtn.disabled = true;
    } else {
        clearCartBtn.disabled = false;
        checkoutBtn.disabled = false;
    }
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
        
        // Fetch the time input correctly
        const timeInput = document.getElementById("appt");
        const time = timeInput ? timeInput.value : null;

        if (!date) {
            alert("Please select a valid date.");
            return;
        }

        if (isBus && !time) {
            alert("Please select a valid time stamp.");
            console.log("Error: Missing time for bus trip");
            return;
        }

        const adults = parseInt(document.getElementById("adults").value) || 0;
        const children = parseInt(document.getElementById("children").value) || 0;
        const infants = parseInt(document.getElementById("infants").value) || 0;

        if (adults < 1) {
            alert("Please select at least one adult.");
            return;
        }

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

        const boat = boatDetails[boatName];
        if (!boat) {
            alert("Invalid selection.");
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
            time: time || "N/A", // Ensuring a valid value
            adults: adults,
            children: children,
            infants: infants,
            totalPrice: totalPrice,
            image: boat.image
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();

        // Reset form fields
        document.getElementById("tour-date").value = "";
        document.getElementById("appt").value = "";
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

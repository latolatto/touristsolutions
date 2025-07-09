
const currentLanguage = localStorage.getItem("lang") || "en";


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
// Booking +/- buttons
document.querySelectorAll(".increase, .decrease").forEach(button => {
    button.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const input = document.getElementById(targetId);
        let value = parseInt(input.value) || 0; // Ensure value is a number
        
        if (this.classList.contains("increase")) {
            input.value = value + 1;
        } else if (this.classList.contains("decrease") && value > 0) {
            input.value = value - 1;
        }
    });
});



// Remove any non-integer characters
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, ''); 
    });
});

document.addEventListener("DOMContentLoaded", function () {



    // Get the product (boat or bus) name from the URL

  
    const params = new URLSearchParams(window.location.search);
    const productName = params.get("boat") || params.get("bus");
  
    const productDetails = {
      "Aquamarine": {
        image: "./assets/images/other-pages/boat-trip/aqua1.webp",
        features: [
          "features.aqua.1",
          "features.aqua.2",
          "features.aqua.3",
          "features.aqua.4",
          "features.aqua.5",
          "features.aqua.6"
        ],
        price: {
          infant: { age: "0-4" , value: 0 },
          child: { age: "5-10", value: 15 },
          adult: { age: "11+", value: 25 }
        },
        mainInfo: "maininfo.aqua",
        extras: {
          speedboat: { label: "extras.aqua.speedboat", price: 15 },
          meal: { label: "extras.aqua.meal", price: 15 }
        }
      },
      "Liburna": {
        image: "./assets/images/other-pages/boat-trip/liburna1.webp",
        features: [
          "features.liburna.1",
          "features.liburna.2",
          "features.liburna.3",
          "features.liburna.4",
          "features.liburna.5",
          "features.liburna.6"
        ],
        price: {
          infant: { age: "0-3", value: 0 },
          child: { age: "4-6", value: 15 },
          adult: { age: "7+", value: 25 }
        },
        mainInfo: "maininfo.liburna"
      },
      "Vlora Cruise": {
        image: "./assets/images/other-pages/boat-trip/vlora1.webp",
        features: [
          "features.cruise.1",
          "features.cruise.2",
          "features.cruise.3",
          "features.cruise.4",
          "features.cruise.5"
        ],
        price: {
          infant: { age: "0-3", value: 0 },
          child: { age: "4-9", value: 15 },
          adult: { age: "10+", value: 25 }
        },
        mainInfo: "maininfo.cruise"
      },
      "Vlora-Saranda": {
        image: "./assets/images/other-pages/boat-trip/saranda.webp",
        features: [
          "features.bus.saranda.1",
          "features.bus.saranda.2",
          "features.bus.saranda.3",
          "features.bus.saranda.4",
          "features.bus.saranda.5",
          "features.bus.saranda.6",
          "features.bus.saranda.7",
          "features.bus.saranda.8"
        ],
        price: {
          infant: { age: "0-2", value: 0 },
          child: { age: "3-6", value: 40 },
          adult: { age: "7+", value: 50 }
        },
        mainInfo: "maininfo.saranda"
      },
      "Vlora-Berat": {
        image: "./assets/images/other-pages/boat-trip/berat.webp",
        features: [
          "features.bus.berat.1",
          "features.bus.berat.2",
          "features.bus.berat.3",
          "features.bus.berat.4",
          "features.bus.berat.5",
          "features.bus.berat.6",
          "features.bus.berat.7",
          "features.bus.berat.8"
        ],
        price: {
          infant: { age: "0-2", value: 0 },
          child: { age: "3-6", value: 32 },
          adult: { age: "7+", value: 40 }
        },
        mainInfo: "maininfo.berat"
      }
    };
  
      

    // Display product details
    if (productName && productDetails[productName]) {
        const isitbus = productName.includes("Vlora-");
        const additionalinfo = isitbus ? "" : `      
               <div class="container my-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow-lg border-0">
                        <div class="card-body">
                            <h3 class="text-center mb-4" data-i18n="boat.itinerary.title">📍 Itinerary</h3>
        
                            <!-- Departure -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img alt="departure" width="70" src="./assets/images/other-pages/boat-trip/port.webp"></span>
                                <div>
                                    <h5 class="mb-1" data-i18n="boat.itinerary.departure.title">Departure</h5>
                                    <p class="mb-0" data-i18n="boat.itinerary.departure.time"><strong>10:00 AM </strong>from Vlora Civil Port</p>
                                </div>
                            </div>
        
                            <!-- Stop 1: Karaburun Beach -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img alt="beach" width="70" src="./assets/images/other-pages/boat-trip/karaburun.webp"></span>
                                <div>
                                    <h5 class="mb-1" data-i18n="boat.itinerary.stop1">Stop 1 – Karaburun Beach</h5>
                                    <p class="mb-0" data-i18n="boat.itinerary.stop1.txt">Enjoy a relaxing beach stay (approximately <strong>3-4 hours</strong>).</p>
                                </div>
                            </div>
        
                            <!-- Stop 2: Haxhi Ali Cave -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img alt="cave" width="70" src="./assets/images/other-pages/boat-trip/haxhi-ali.webp"></span>
                                <div>
                                    <h5 class="mb-1" data-i18n="boat.itinerary.stop2">Stop 2 – Haxhi Ali Cave</h5>
                                    <p class="mb-0" data-i18n="boat.itinerary.stop2.txt">Panoramic visit of the famous sea cave; <strong>optional</strong> speedboat entrance (+ €15, ~20 minutes)</p>
                                </div>
                            </div>
        
                            <!-- Stop 3: Sazan Island -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img alt="island" width="70" src="./assets/images/other-pages/boat-trip/sazan.webp"></span>
                                <div>
                                    <h5 class="mb-1" data-i18n="boat.itinerary.stop3">Stop 3 – Sazan Island</h5>
                                    <p class="mb-0" data-i18n="boat.itinerary.stop3.txt">Guided exploration of the island, including bunkers and historic sites (~<strong>1 hour</strong>).</p>
                                </div>
                            </div>
        
                            <!-- Return -->
                            <div class="d-flex align-items-center mb-5">
                                <span class="fs-4 me-3"><img alt="sea-coast" width="70" src="./assets/images/other-pages/boat-trip/return.webp"></span>
                                <div>
                                    <h5 class="mb-1" data-i18n="boat.itinerary.return">Return</h5>
                                    <p class="mb-0" data-i18n="boat.itinerary.return.time">Arrival back at the starting point around <strong>06:00 PM</strong> .</p>
                                </div>
                            </div>
        
                            <!-- Note -->
                            <div class="alert alert-warning mt-4" data-i18n="boat.itinerary.note">
                                ⚠️ <strong>Note:</strong> The itinerary may be subject to changes due to weather conditions.
                            </div>
        
                            <!-- Not Included -->
                            <h4 class="mt-4 text-center" data-i18n="boat.itinerary.not.included">❌ Not Included in the Price :</h4>
                            <ul class="list-unstyled text-center mt-3">
                                <li data-i18n="boat.itinerary.excluded1">🍽️ Food & drinks from the onboard restaurant/bar</li>
                                <li data-i18n="boat.itinerary.excluded2">⛱️ Sunbeds and umbrellas at the beach</li>
                                <li data-i18n="boat.itinerary.excluded3">🚤 Optional speedboat tour inside Haxhi Ali Cave (+ €15 )</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    
        
        const isbus = productName.includes("Vlora-");

        const booknowKey = isbus ? "book.daily.tour" : "book.boat.tour";
        document.getElementById("booknow-title").textContent = t(booknowKey);
    
        
        const data = productDetails[productName];

        // document.getElementById("booknow-title").textContent = `${booknowtitleKey}`;
        document.getElementById("boat-name").textContent = productName;
        document.getElementById("main-info").textContent = t(data.mainInfo);
        document.getElementById("boat-image").src = data.image;
    
        document.getElementById("boat-features").innerHTML = data.features
          .map(key => `<li class="list-group-item">${t(key)}</li>`).join("");
    
        const priceData = data.price;
        let pricingHTML = `
          <div class="pricing text-center my-3 pb-2">
            <h4 class="fw-bold text-primary" data-i18n="van.opt1.pricing">Pricing</h4>
            <p><span class="badge bg-success"><span data-i18n="booking.infants">Infants</span> (${priceData.infant?.age} <span data-i18n="age.name"> Years </span>) : <span data-i18n="free.price"> ${priceData.infant?.value === 0 ? "free.price" : "€" + priceData.infant?.value}</span></span></p>
            <p><span class="badge bg-danger" ><span data-i18n="booking.children">Children</span> (${priceData.child?.age} <span data-i18n="age.name"> Years </span>) : €${priceData.child?.value}</span></p>
            <p><span class="badge bg-warning text-dark" ><span data-i18n="booking.adults">Adults</span>  (${priceData.adult?.age} <span data-i18n="age.name"> Years </span>) : €${priceData.adult?.value}</span></p>
          </div>`;
        document.getElementById("boat-pricing-container").innerHTML = pricingHTML;
    
        if (productName === "Aquamarine") {
          document.getElementById("extra-options").style.display = "block";
        }
      } else {
        console.error("❌ productName is missing or invalid");
      
    }

    // Price Calculation
    function updateTotalPrice() {
        if (!productName || !productDetails[productName]) return;

        let priceData = productDetails[productName].price;
        let adults = parseInt(document.getElementById("adults").value);
        let children = parseInt(document.getElementById("children").value);
        let infants = parseInt(document.getElementById("infants").value);

        let total = (adults * priceData.adult.value) + (children * priceData.child.value);

        // Only apply add-ons if Aquamarine is selected
        if (productName === "Aquamarine") {
            const speedboatQty = document.getElementById("speedboat-tickets").valueAsNumber || 0;
            const mealQty      = document.getElementById("meal-tickets").valueAsNumber      || 0;
            total += speedboatQty * 15;
            total += mealQty      * 15;
          }
          

        let priceElement = document.getElementById("total-price");
        priceElement ? (priceElement.textContent = " €" + total  ) : console.log("Element not found!");
            }

    // Attach event listeners to input fields
setTimeout(() => {
  const inputs = ["adults", "children", "infants"];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener("input", updateTotalPrice);
  });
}, 100); // delay to ensure DOM is ready


applyTranslations(localStorage.getItem("lang") || "en");

});

document.addEventListener("DOMContentLoaded", function () {

    const  popSound= new Audio("./assets/images/cart-pop.mp3");
    popSound.preload = 'auto';

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
                    <p><strong>${item.name} ${t(item.headlineKey)}</strong></p>
                    <p >${item.date}</p>
                    ${item.adults ? `<p><span data-i18n="cart.item.adults">Adults</span> : ${item.adults}</p>` : ""}
                    ${item.children ? `<p ><span data-i18n="cart.item.children">Children</span> : ${item.children}</p>` : ""}
                    ${item.infants ? `<p ><span data-i18n="cart.item.infants">Infants</span> : ${item.infants}</p>` : ""}
                    ${item.extras && item.extras.length
                        ? `<p>${t("checkout.extras")} ` +
                            item.extras.map(e => `${t(e.key)} x${e.qty}`).join(", ") +
                          `</p>`
                        : ""
                      }
                    <p><strong ><span data-i18n="cart.item.total">Total </span>: €${item.totalPrice.toLocaleString()}</strong></p>
                    <button class="remove-btn" data-index="${index}" data-i18n="cart.item.remove">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
    
        // grandTotalContainer.setAttribute("data-i18n", "cart.grandTotal");
        grandTotalContainer.innerHTML = `<span data-i18n="cart.grandTotal">Grand total</span>: €${total.toLocaleString()}`;
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
    
        // ✅ Refresh translations
        applyTranslations(localStorage.getItem("lang") || "en");
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

    updateCartDisplay(); // ✅ Ensures cart updates correctly on page load

    document.getElementById("bookNow").addEventListener("click", function (event) {
        event.preventDefault();

        const boatName = document.getElementById("boat-name").textContent;
        const isBus = boatName.includes("Vlora-");
        // const headline = isBus ? "Daily Van Tour " : "Boat Tour";
        // const headline = isBus ? t("tour.headline.bus") : t("tour.headline.boat");
        
        const   headlineKey= isBus ? t("tour.headline.bus") : t("tour.headline.boat");

        // const date = document.getElementById("tour-date").value;

//         const rawDate = document.getElementById("tour-date").value;
// const selectedDate = new Date(rawDate);

// if (isNaN(selectedDate)) {
//     alert("Please select a valid date.");
//     return;
// }


// const date = selectedDate.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric"
// });


//         if (!date) {
//             alert("Please select a valid date.");
//             return;
//         }

const rawDate = document.getElementById("tour-date").value;
const selectedDate = new Date(rawDate);

if (isNaN(selectedDate)) {
  alert(t("alert.invalid.date"));
  return;
}

const date = selectedDate.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

if (!date) {
  alert(t("alert.invalid.date")); // Optional redundancy
  return;
}

        const adults = parseInt(document.getElementById("adults").value) || 0;
        const children = parseInt(document.getElementById("children").value) || 0;
        const infants = parseInt(document.getElementById("infants").value) || 0;

        // if (adults < 1) {
        //     alert("Please select at least one adult.");
        //     return;
        // }

        if (adults < 1) {
            alert(t("alert.invalid.adult"));
            return;
          }
          
       



        const boatDetails = {
            "Aquamarine": {
                image: "./assets/images/other-pages/boat-trip/aqua1.webp",
                price: {
                    infant: 0, child: 15, adult: 25
                },
                extras: { speedboat: 15, meal: 15 }
            },
            "Liburna": {
                image: "./assets/images/other-pages/boat-trip/liburna1.webp",
                price: { infant: 0, child: 15, adult: 25 }
            },
            "Vlora Cruise": {
                image: "./assets/images/other-pages/boat-trip/vlora1.webp",
                price: { infant: 0, child: 15, adult: 25 }
            },
            "Vlora-Saranda": {
                image: "./assets/images/other-pages/boat-trip/saranda.webp",
                price: { adult: 50, child: 40 }
            },
            "Vlora-Berat": {
                image: "./assets/images/other-pages/boat-trip/berat.webp",
                price: { adult: 40, child: 32 }
            }
        };

        const boat = boatDetails[boatName];
        // if (!boat) {
        //     alert("Invalid selection.");
        //     return;
            if (!boat) {
              alert(t("alert.invalid.selection"));
              return;
        }else{
 // Assuming reservation is successful, show the message and play sound
 const addedToCartMessage = document.getElementById("added-to-cart");

 addedToCartMessage.style.display = "block"; // Show the message
 popSound.play(); // Play the sound


//  setTimeout(function() {
//     popSound.play();
// }, 2000);
 // Hide the message after 2 seconds
 setTimeout(() => {
     addedToCartMessage.style.display = "none";
 }, 2000);
        }

        let totalPrice = (adults * boat.price.adult) + (children * boat.price.child);
// ✅ Fix: Add-on Calculation & totalPrice
let extras = [];

// Only Aquamarine has extras
if (boatName === "Aquamarine") {
  const speedboatSelected = document.getElementById("speedboat-option").checked;
  const speedboatTickets = speedboatSelected
    ? parseInt(document.getElementById("speedboat-tickets").value) || 0
    : 0;
  if (speedboatSelected && speedboatTickets > 0) {
    extras.push({ key: "extra.booking.1", qty: speedboatTickets });
    totalPrice += speedboatTickets * boat.extras.speedboat;
  }

  const mealSelected = document.getElementById("meal-option").checked;
  const mealTickets = mealSelected
    ? parseInt(document.getElementById("meal-tickets").value) || 0
    : 0;
  if (mealSelected && mealTickets > 0) {
    extras.push({ key: "extra.booking.2", qty: mealTickets });
    totalPrice += mealTickets * boat.extras.meal;
  }
}

// ✅ Push to cart with structured extras and correct total
cart.push({
  name:        boatName,
  headlineKey: isBus ? "tour.headline.bus" : "tour.headline.boat",
  date:        date,
  adults:      adults,
  children:    children,
  infants:     infants,
  extras:      extras.length ? extras : null,
  totalPrice:  totalPrice,
  image:       boat.image
});

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay(); // ✅ Ensures cart icon updates instantly

        // ✅ Fix: Reset Fields Properly
        document.getElementById("tour-date").value = "";
        document.getElementById("adults").value = 1;
        document.getElementById("children").value = 0;
        document.getElementById("infants").value = 0;
        const speedboatOption = document.getElementById("speedboat-option");
if (speedboatOption) speedboatOption.checked = false;

const mealOption = document.getElementById("meal-option");
if (mealOption) mealOption.checked = false;

const speedboatQty = document.getElementById("speedboat-quantity");
if (speedboatQty) speedboatQty.style.display = "none";

const mealQty = document.getElementById("meal-quantity");
if (mealQty) mealQty.style.display = "none";

        // document.getElementById("speedboat-option").checked = false;
        // document.getElementById("meal-option").checked = false;
        // document.getElementById("speedboat-quantity").style.display = "none";
        // document.getElementById("meal-quantity").style.display = "none";
    });

    // ✅ Fix: Ensure cart updates across all pages
    window.addEventListener("storage", function () {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        updateCartDisplay();
    });

    updateCartDisplay(); // ✅ Ensures cart loads properly

       // ✅ **Show/Hide extra ticket inputs**
    //    document.getElementById("speedboat-option").addEventListener("change", function () {
    //     document.getElementById("speedboat-quantity").style.display = this.checked ? "flex" : "none";
    // });

    // document.getElementById("meal-option").addEventListener("change", function () {
    //     document.getElementById("meal-quantity").style.display = this.checked ? "flex" : "none";
    // });


    const speedboatCheckbox = document.getElementById("speedboat-option");
if (speedboatCheckbox) {
  speedboatCheckbox.addEventListener("change", function () {
    document.getElementById("speedboat-quantity").style.display = this.checked ? "flex" : "none";
  });
}

const mealCheckbox = document.getElementById("meal-option");
if (mealCheckbox) {
  mealCheckbox.addEventListener("change", function () {
    document.getElementById("meal-quantity").style.display = this.checked ? "flex" : "none";
  });
}

});




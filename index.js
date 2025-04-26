document.getElementById("year").innerHTML = new Date().getFullYear();


//TESTIMONIALS
$('.carousel-testimonial').owlCarousel({
    loop:true,
    margin:0,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        768:{
            items:3,
            nav:false
        },
        1000:{
            items:3,
            nav:true,
            loop:true
        }
    }
})



//reviews

function timeAgo(dateString) {
    const reviewDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - reviewDate) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400);

    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
        const years = Math.floor(diffInDays / 365);
        return `${years} year${years > 1 ? "s" : ""} ago`;
    }
}

// Apply to all review dates
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".review-date").forEach(span => {
        const reviewDate = span.getAttribute("data-date");
        span.textContent = timeAgo(reviewDate);
    });
});



document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.read-more-btn');
    buttons.forEach(button => {
      button.addEventListener('click', function () {
        const reviewText = button.previousElementSibling; // the <p class="review-text">
        reviewText.classList.toggle('expanded');
        button.textContent = reviewText.classList.contains('expanded') ? '▲▲▲' : '▼▼▼';
      });
    });
  });
  
  
  
  










  
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

    cartItemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartDisplay();
        }
    });

    // Listen for updates from other tabs/pages
    window.addEventListener("storage", function () {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        updateCartDisplay();
    });

    updateCartDisplay();
});



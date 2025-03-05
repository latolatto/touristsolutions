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
        600:{
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


document.addEventListener("DOMContentLoaded", function () {
    const reviews = document.querySelectorAll(".review-text");

    reviews.forEach(review => {
        const fullText = review.innerHTML;
        if (fullText.length > 130) {
            const truncatedText = fullText.substring(0, 130) + "...";
            review.innerHTML = truncatedText;

            const button = review.nextElementSibling;
            button.style.display = "inline-block";

            button.addEventListener("click", function () {
                if (button.innerText === "Read More") {
                    review.innerHTML = fullText;
                    button.innerText = "Read Less";
                } else {
                    review.innerHTML = truncatedText;
                    button.innerText = "Read More";
                }
            });
        } else {
            review.nextElementSibling.style.display = "none"; // Hide button if text is short
        }
    });
});



//counter

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");
    const section = document.querySelector(".counter-section");
    let started = false;

    function startCounting() {
      if (!started) {
        counters.forEach(counter => {
          let target = +counter.getAttribute("data-target");
          let count = 0;
          let increment = target / 100;

          let updateCounter = () => {
            if (count < target) {
              count += increment;
              counter.textContent = Math.floor(count);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          updateCounter();
        });
        started = true;
      }
    }

    window.addEventListener("scroll", () => {
      let sectionPosition = section.getBoundingClientRect().top;
      let screenPosition = window.innerHeight;

      if (sectionPosition < screenPosition) {
        startCounting();
      }
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
                    <p><strong>${item.name} ${item.headline}</strong></p>
                    <p>${item.date}</p>
                    ${item.name.includes("Vlora-") ? `<p>Time: ${item.time}</p>` : ""}
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



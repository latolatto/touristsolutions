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
// Get elements
const header = document.querySelector("header");
const scrollBtn = document.getElementById("scroll-btn");
const menu = document.getElementById("menu-icon");
const navlist = document.querySelector(".nav-list");
const navlistEl = document.querySelectorAll(".nav-list li a");
const sections = document.querySelectorAll('section[id]');

// Handle nav list element on click
navlist.addEventListener("click", (e) => {
  navlistEl.forEach((el) => el.classList.remove("active"));
  if (e.target.tagName === "A") e.target.classList.add("active");
});


// Scroll button display based on page scroll
const scrollFunction = () => {
  scrollBtn.style.display =
    document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
      ? "block"
      : "none";
};

// Scroll to top of the document
const topFunction = () => {
  document.body.scrollTop = 0; // Safari
  document.documentElement.scrollTop = 0; // Chrome, Firefox, etc.
};

// Sticky header on scroll
window.addEventListener("scroll", () => {
  header.classList.toggle("sticky", window.scrollY > 80);
  scrollFunction();
});

// Hide scroll button on initial load
window.onload = scrollFunction;

// Handle menu click
menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navlist.classList.toggle("open");
};

// Scroll Reveal animations
const sr = ScrollReveal({
  origin: "top",
  distance: "85px",
  duration: 2500,
  reset: true,
});

sr.reveal(".home-text", { delay: 300 });
sr.reveal(".home-img", { delay: 400 });
sr.reveal(".container", { delay: 400 });
sr.reveal(".about-img");
sr.reveal(".about-text", { delay: 300 });
sr.reveal(".middle-text");
sr.reveal(".shop-content, .row-btn", { delay: 300 });
sr.reveal(".review-content, .contact", { delay: 300 });



// Mixitup filter for featured section
var mixerFeatured = mixitup(".featured_content", {
  selectors: {
    target: ".featured_card",
  },
  animation: {
    duration: 300,
  },
});

// Active featured link
const linkFeatured = document.querySelectorAll(".featured_item");

linkFeatured.forEach((l) =>
  l.addEventListener("click", function () {
    linkFeatured.forEach((el) => el.classList.remove("active-featured"));
    this.classList.add("active-featured");
  })
);

// Show scroll up button
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  scrollUp.classList.toggle("show-scroll", window.scrollY >= 350);
};

window.addEventListener("scroll", scrollUp);

// Scroll sections active link
const scrollActive = () => {
  const scrollY = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 58;
    const sectionId = current.getAttribute("id");
    const sectionsClass = document.querySelectorAll(
      `.nav_menu a[href*=${sectionId}]`
    );

    sectionsClass.forEach((link) => {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
};

window.addEventListener("scroll", scrollActive);

// Scroll reveal animation settings
ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
}).reveal(`
  .home_title, .popular_container, .features_img, .home_subtitle, .home_elec, 
  .home_img, .home_card-data, .home_button, .about_group, .offer_data, 
  .about_data, .offer_img, .features_map, .features_card, .featured_card, 
  .logos_content, .footer_content
`);
function addtocart(button) {
  const productId = button.dataset.productId;
  const productName = button.dataset.productName;
  const productPrice = parseFloat(button.dataset.productPrice);
  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Save to local storage

  // Redirect to cart.html
  window.location.href = "cart.html";
}

'use strict';

/**
 * Add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (!elem) return;

  if (NodeList.prototype.isPrototypeOf(elem) || Array.isArray(elem)) {
    elem.forEach(el => {
      if (el && el.addEventListener) {
        el.addEventListener(type, callback);
      }
    });
  } else if (elem.addEventListener) {
    elem.addEventListener(type, callback);
  }
};

/**
 * Navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
  document.body.classList.toggle("active");
};
addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
  document.body.classList.remove("active");
};
addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * Header active
 */
const header = document.querySelector("[data-header]");
const activeHeader = function () {
  if (window.scrollY > 300) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
};
addEventOnElem(window, "scroll", activeHeader);

/**
 * Toggle active on add to fav
 */
const addToFavBtns = document.querySelectorAll("[data-add-to-fav]");
const toggleActive = function () {
  this.classList.toggle("active");
};
addEventOnElem(addToFavBtns, "click", toggleActive);

/**
 * Scroll reveal effect
 */
const sections = document.querySelectorAll("[data-section]");
const scrollReveal = function () {
  sections.forEach(section => {
    if (section.getBoundingClientRect().top < window.innerHeight / 1.5) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
};
scrollReveal();
addEventOnElem(window, "scroll", scrollReveal);

/**
 * Sign-Up Form
 */
if (document.getElementById("sign-form")) {
  document.getElementById("sign-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const userData = {
      FirstName: document.getElementById("firstname").value,
      LastName: document.getElementById("lastname").value,
      PhoneNumber: document.getElementById("phonenumber").value,
      Email: document.getElementById("email").value,
      Password: document.getElementById("password").value,
    };

    fetch("https://kitkit.azurewebsites.net/api/User/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Token) {
          localStorage.setItem("token", data.Token);
          localStorage.setItem("userId", data.UserId);  // Store userId

          window.location.href = "presale.html";
        } else {
          alert("Signup failed: " + (data.message || "Please try again."));
        }
      })
      .catch((error) => {
        console.error("Signup Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
}

/**
 * Login Form
 */
if (document.getElementById("login-form")) {
  // Optional: redirect if already logged in
  if (localStorage.getItem("token")) {
    window.location.href = "presale.html";
  }

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const loginBtn = document.querySelector(".btn-primary");
    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging In...";

    const userData = {
      Email: document.getElementById("email").value,
      Password: document.getElementById("password").value,
    };

    fetch("https://kitkit.azurewebsites.net/api/User/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Token) {
          localStorage.setItem("token", data.Token);
          localStorage.setItem("userId", data.UserId);  // Store userId

          window.location.href = "presale.html";
        } else {
          alert("Login failed: " + (data.message || "Please try again."));
          loginBtn.disabled = false;
        loginBtn.innerHTML = "Login";
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        alert("An error occurred. Please try again.");
        loginBtn.disabled = false;
        loginBtn.innerHTML = "Login";
      });
  });
}

/**
 * Global Sign Out Button
 */
document.getElementById("signoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});


const signOutLink = document.querySelector(".navbar-item a[data-nav-link='signout']");
if (signOutLink) {
  signOutLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

  // Set the end date/time (in UNIX timestamp seconds)
  const endDate = new Date("2025-04-17T09:00:00").getTime() / 1000;

  new FlipDown(endDate, {
    theme: 'light' // or 'light'
  }).start()
    .ifEnded(() => {
      const message = document.createElement("p");
      message.textContent = "Presale Started You can Buy Now";
      message.style.color = "white";
      message.style.textAlign = "center";
      message.style.marginTop = "10px";
      document.getElementById("flipdown").after(message);
    });



/**
 * Hide Buy Now & Login Buttons on index.html if user is logged in
 */
document.addEventListener("DOMContentLoaded", function () {
  const authButtons = document.getElementById("authButtons");

  if (authButtons && localStorage.getItem("token")) {
    authButtons.style.display = "none";
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const buyNowBtn = document.querySelector(".btn-container a[href='signup.html']");

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", function (e) {
      if (localStorage.getItem("token")) {
        // If user is logged in, redirect to presale.html
        e.preventDefault();
        window.location.href = "presale.html";
      }
    });
  }
});
/**
 * Load Token Data for Presale Hero Section
 */
async function loadTokenData() {
  try {
    const response = await fetch('https://kitkit.azurewebsites.net/api/Token');
    const data = await response.json();

    const token = data[0]; // Taking first token object

    const totalQuantityElem = document.getElementById('totalQuantity');
    const presalePriceElem = document.getElementById('presalePrice');

  
    if (totalQuantityElem && presalePriceElem) {
      totalQuantityElem.innerText = `Total Quantity: ${token.TotalSupply.toLocaleString()}`;
      presalePriceElem.innerText = `Presale Price: $${token.CurrentPrice} per coin`;

    }
  } catch (error) {
    console.error('Failed to load Token Data:', error);
  }
}

// Auto call when page load
document.addEventListener("DOMContentLoaded", loadTokenData);



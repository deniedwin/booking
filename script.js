// script.js

// Store booking data in localStorage
function setBookingData(key, value) {
  localStorage.setItem(key, value);
}

function getBookingData(key) {
  return localStorage.getItem(key);
}

// Generate an order ID with prefix date/time in yyyymmddhhmmss format
function generateOrderId() {
  const now = new Date();
  // Format: YYYYMMDDHHMMSS
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return year + month + day + hours + minutes + seconds;
}

// On Step1: gather product & currency
function selectProductCurrency() {
  const product = document.querySelector('input[name="product"]:checked');
  const currency = document.querySelector('input[name="currency"]:checked');

  if (!product || !currency) {
    alert("Please choose both product and currency.");
    return;
  }

  setBookingData("product", product.value);
  setBookingData("currency", currency.value);

  // Move to next step
  window.location.href = "booking-step2.html";
}

// On Step2: gather date/time
function selectDateTime() {
  const daySelect = document.getElementById("day");
  const timeSelect = document.getElementById("time");
  const day = daySelect.value;
  const time = timeSelect.value;

  if (!day || !time) {
    alert("Please select a valid day and time.");
    return;
  }

  setBookingData("day", day);
  setBookingData("time", time);

  window.location.href = "booking-step3.html";
}

// On Step3: gather user info
function submitUserInfo() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !email || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  setBookingData("name", name);
  setBookingData("email", email);
  setBookingData("phone", phone);

  window.location.href = "booking-step4.html";
}

// On Step4: review data, confirm disclaimers, then proceed to pay
function reviewBooking() {
  // Display data
  const product = getBookingData("product") || "";
  const currency = getBookingData("currency") || "";
  const day = getBookingData("day") || "";
  const time = getBookingData("time") || "";
  const name = getBookingData("name") || "";
  const email = getBookingData("email") || "";
  const phone = getBookingData("phone") || "";

  // Insert these values into the page (if we have placeholders)
  document.getElementById("review-product").innerText = product;
  document.getElementById("review-currency").innerText = currency;
  document.getElementById("review-day").innerText = day;
  document.getElementById("review-time").innerText = time;
  document.getElementById("review-name").innerText = name;
  document.getElementById("review-email").innerText = email;
  document.getElementById("review-phone").innerText = phone;
}

function confirmBooking() {
  // Check disclaimers
  const disclaimersChecked = document.getElementById("disclaimerCheck").checked;
  if (!disclaimersChecked) {
    alert("You must check the waiver and terms to proceed.");
    return;
  }
  // Generate order ID
  const orderId = generateOrderId();
  setBookingData("orderId", orderId);

  // Go to payment simulation
  window.location.href = "booking-payment.html";
}

// Payment page: show final success
function simulatePayment() {
  const orderId = getBookingData("orderId");
  if (orderId) {
    document.getElementById("orderId").innerText = orderId;
  } else {
    document.getElementById("orderId").innerText = "N/A";
  }
}

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
  const dateInput = document.getElementById("dateInput").value;
  const sunrise = document.getElementById("sunrise").checked;
  const sunset = document.getElementById("sunset").checked;

  if (!dateInput || (!sunrise && !sunset)) {
    alert("Please select a valid date and time slot.");
    return;
  }

  // Check if chosen date is Monday, Friday, or Saturday
  const chosenDate = new Date(dateInput);
  const dayOfWeek = chosenDate.getUTCDay(); 
  // Sunday=0, Monday=1, Tuesday=2, ...
  // We want 1 (Mon), 5 (Fri), or 6 (Sat)
  if (dayOfWeek !== 1 && dayOfWeek !== 5 && dayOfWeek !== 6) {
    alert("Please select a Monday, Friday, or Saturday.");
    return;
  }

  const timeSlot = sunrise ? "Sunrise (5-8am)" : "Sunset (4-7pm)";

  setBookingData("date", dateInput);
  setBookingData("time", timeSlot);

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
  const date = getBookingData("date") || "";
  const time = getBookingData("time") || "";
  const name = getBookingData("name") || "";
  const email = getBookingData("email") || "";
  const phone = getBookingData("phone") || "";

  document.getElementById("review-product").innerText = product;
  document.getElementById("review-currency").innerText = currency;
  document.getElementById("review-date").innerText = date;
  document.getElementById("review-time").innerText = time;
  document.getElementById("review-name").innerText = name;
  document.getElementById("review-email").innerText = email;
  document.getElementById("review-phone").innerText = phone;
}

function confirmBooking() {
  // Check disclaimers
  const disclaimersChecked = document.getElementById("disclaimerCheck").checked;
  if (!disclaimersChecked) {
    alert("You must check the waiver, terms, and conditions to proceed.");
    return;
  }
  // Generate order ID
  const orderId = generateOrderId();
  setBookingData("orderId", orderId);

  // Go to payment simulation
  window.location.href = "booking-payment.html";
}

// Payment page: show final success after simulating
function simulatePayment() {
  // Show message, then redirect after short delay
  setTimeout(() => {
    window.location.href = "booking-success.html";
  }, 2000);
}

// Booking Success: display orderId
function showSuccess() {
  const orderId = getBookingData("orderId");
  const orderIdSpan = document.getElementById("orderId");
  if (orderId && orderIdSpan) {
    orderIdSpan.innerText = orderId;
  }
}

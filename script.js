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

// Toggle tickets input if Group Tour is selected
function toggleTicketsInput() {
  const groupRadio = document.getElementById("groupTour");
  const ticketsField = document.getElementById("ticketsField");

  if (groupRadio && groupRadio.checked) {
    ticketsField.style.display = "block";
  } else {
    ticketsField.style.display = "none";
  }
}

// Step 1: gather product & # of tickets (if group)
function selectProduct() {
  const singleRadio = document.getElementById("singleTour");
  const groupRadio = document.getElementById("groupTour");
  let product = "";

  if (singleRadio.checked) {
    product = "Single Tour ($100 / €96)";
    setBookingData("tickets", "1-2"); 
  } else if (groupRadio.checked) {
    product = "Group Tour ($90 / €86)";
    // Retrieve number of tickets
    const ticketsInput = document.getElementById("tickets");
    const numTickets = ticketsInput.value.trim();
    if (parseInt(numTickets) < 3) {
      alert("Group must be 3 or more participants.");
      return;
    }
    setBookingData("tickets", numTickets);
  } else {
    alert("Please choose a product.");
    return;
  }

  setBookingData("product", product);
  window.location.href = "booking-step2.html";
}

// Step 2: Only allow Mon(1)/Fri(5)/Sat(6)
function validateDate() {
  const dateInput = document.getElementById("dateInput");
  const chosenDate = dateInput.value;
  if (!chosenDate) return;

  const dateObj = new Date(chosenDate);
  const dayOfWeek = dateObj.getDay(); // local day
  if (dayOfWeek !== 1 && dayOfWeek !== 5 && dayOfWeek !== 6) {
    alert("Please select a Monday, Friday, or Saturday.");
    dateInput.value = ""; // reset
  }
}

function selectDateTime() {
  const dateInput = document.getElementById("dateInput");
  const sunrise = document.getElementById("sunrise").checked;
  const sunset = document.getElementById("sunset").checked;

  if (!dateInput.value) {
    alert("Please select a valid date.");
    return;
  }
  if (!sunrise && !sunset) {
    alert("Please select a time slot: Sunrise or Sunset.");
    return;
  }

  const timeSlot = sunrise ? "Sunrise (5-8am)" : "Sunset (4-7pm)";
  setBookingData("date", dateInput.value);
  setBookingData("time", timeSlot);

  window.location.href = "booking-step3.html";
}

// Step 3: gather user info
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

// Step 4: review data, then proceed to pay
function reviewBooking() {
  const product = getBookingData("product") || "";
  const tickets = getBookingData("tickets") || "";
  const date = getBookingData("date") || "";
  const time = getBookingData("time") || "";
  const name = getBookingData("name") || "";
  const email = getBookingData("email") || "";
  const phone = getBookingData("phone") || "";

  document.getElementById("review-product").innerText = product;
  document.getElementById("review-tickets").innerText = tickets;
  document.getElementById("review-date").innerText = date;
  document.getElementById("review-time").innerText = time;
  document.getElementById("review-name").innerText = name;
  document.getElementById("review-email").innerText = email;
  document.getElementById("review-phone").innerText = phone;
}

function confirmBooking() {
  const disclaimersChecked = document.getElementById("disclaimerCheck").checked;
  if (!disclaimersChecked) {
    alert("You must check the waiver, terms, & conditions to proceed.");
    return;
  }
  const orderId = generateOrderId();
  setBookingData("orderId", orderId);

  window.location.href = "booking-payment.html";
}

// Payment simulation
function simulatePayment() {
  setTimeout(() => {
    window.location.href = "booking-success.html";
  }, 2000);
}

// Payment success page
function showSuccess() {
  const orderId = getBookingData("orderId");
  const orderIdSpan = document.getElementById("orderId");
  if (orderId && orderIdSpan) {
    orderIdSpan.innerText = orderId;
  }
}

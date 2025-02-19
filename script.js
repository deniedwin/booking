// script.js

// Save & retrieve data
function setBookingData(key, value) {
  localStorage.setItem(key, value);
}
function getBookingData(key) {
  return localStorage.getItem(key);
}

// Generate unique order ID
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return year + month + day + hours + minutes + seconds;
}

// Toggle tickets field for Group Tour, and show total
function toggleTicketsInput() {
  const groupRadio = document.getElementById("groupTour");
  const ticketsField = document.getElementById("ticketsField");
  const groupTotal = document.getElementById("groupTotal");

  if (groupRadio && groupRadio.checked) {
    ticketsField.style.display = "block";
    groupTotal.style.display = "block";
    updateGroupTotal(); // compute initial total
  } else {
    ticketsField.style.display = "none";
    groupTotal.style.display = "none";
  }
}

// If Group Tour is selected, compute total: 
//   # of tickets * $90 or # of tickets * €86
function updateGroupTotal() {
  const ticketsInput = document.getElementById("tickets");
  const groupTotal = document.getElementById("groupTotal");
  if (!ticketsInput || !groupTotal) return;

  let num = parseInt(ticketsInput.value.trim(), 10);
  if (isNaN(num) || num < 3) {
    // default if invalid
    groupTotal.textContent = "Total: $0 / €0";
  } else {
    const usdTotal = num * 90;
    const eurTotal = num * 86;
    groupTotal.textContent = `Total: $${usdTotal} / €${eurTotal}`;
  }
}

// Step 1: pick product
function selectProduct() {
  const singleRadio = document.getElementById("singleTour");
  const groupRadio = document.getElementById("groupTour");

  if (singleRadio.checked) {
    setBookingData("product", "Single Tour ($100 / €96)");
    setBookingData("tickets", "1-2");
  } else if (groupRadio.checked) {
    setBookingData("product", "Group Tour ($90 / €86)");

    const ticketsInput = document.getElementById("tickets");
    const numTickets = parseInt(ticketsInput.value.trim(), 10);
    if (numTickets < 3) {
      alert("Group must be 3 or more participants.");
      return;
    }
    setBookingData("tickets", numTickets);
  } else {
    alert("Please choose a product.");
    return;
  }

  window.location.href = "booking-step2.html";
}

// Validate date for Mon(1), Fri(5), Sat(6)
function validateDate() {
  const dateInput = document.getElementById("dateInput");
  if (!dateInput.value) return;

  const parts = dateInput.value.split("-");
  if (parts.length !== 3) return;
  const [yyyy, mm, dd] = parts.map(Number);

  const dateObj = new Date(yyyy, mm - 1, dd);
  const dayOfWeek = dateObj.getDay();
  if (dayOfWeek !== 1 && dayOfWeek !== 5 && dayOfWeek !== 6) {
    alert("Please select Monday, Friday, or Saturday.");
    dateInput.value = "";
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
    alert("Please select Sunrise or Sunset.");
    return;
  }
  setBookingData("date", dateInput.value);
  setBookingData("time", sunrise ? "Sunrise (5-8am)" : "Sunset (4-7pm)");

  window.location.href = "booking-step3.html";
}

// Step 3: user info
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

// Step 4: review
function reviewBooking() {
  document.getElementById("review-product").innerText = getBookingData("product") || "";
  document.getElementById("review-tickets").innerText = getBookingData("tickets") || "";
  document.getElementById("review-date").innerText = getBookingData("date") || "";
  document.getElementById("review-time").innerText = getBookingData("time") || "";
  document.getElementById("review-name").innerText = getBookingData("name") || "";
  document.getElementById("review-email").innerText = getBookingData("email") || "";
  document.getElementById("review-phone").innerText = getBookingData("phone") || "";
}

function confirmBooking() {
  const checkBox = document.getElementById("disclaimerCheck");
  if (!checkBox.checked) {
    alert("Please agree to waiver, terms & conditions.");
    return;
  }
  setBookingData("orderId", generateOrderId());
  window.location.href = "booking-payment.html";
}

// Payment simulation
function simulatePayment() {
  setTimeout(() => {
    window.location.href = "booking-success.html";
  }, 2000);
}

// Payment success
function showSuccess() {
  const orderId = getBookingData("orderId");
  if (orderId) {
    document.getElementById("orderId").innerText = orderId;
  }
}

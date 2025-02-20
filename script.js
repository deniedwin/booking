/* script.js */

/* LocalStorage Helpers */
function setBookingData(key, value) {
  localStorage.setItem(key, value);
}
function getBookingData(key) {
  return localStorage.getItem(key);
}

/* Step1: Single or Group. For group, store # tickets. */
function toggleGroupTickets() {
  const groupRadio = document.getElementById("groupTour");
  const ticketsDiv = document.getElementById("groupTicketsDiv");
  if (groupRadio.checked) {
    ticketsDiv.style.display = "block";
  } else {
    ticketsDiv.style.display = "none";
  }
}

function step1Submit() {
  const singleRadio = document.getElementById("singleTour");
  const groupRadio = document.getElementById("groupTour");
  if (singleRadio.checked) {
    setBookingData("product", "Single Tour ($100 / €96)");
    setBookingData("tickets", "1-2");
  } else if (groupRadio.checked) {
    setBookingData("product", "Group Tour ($90 / €86)");
    const num = parseInt(document.getElementById("groupTickets").value, 10);
    if (isNaN(num) || num < 3) {
      alert("Group Tour requires at least 3 participants");
      return;
    }
    setBookingData("tickets", num);
  } else {
    alert("Please select a product");
    return;
  }
  window.location.href = "booking-step2.html";
}

/* ASCII Calendar Logic (Step 2) */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// For Step 2, we initialize the ASCII calendar
function initCalendar() {
  drawAsciiCalendar(currentYear, currentMonth);
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  drawAsciiCalendar(currentYear, currentMonth);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  drawAsciiCalendar(currentYear, currentMonth);
}

function drawAsciiCalendar(year, month) {
  const asciiDiv = document.getElementById("asciiCalendar");
  if (!asciiDiv) return;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();

  // Create a matrix or lines for the ASCII grid
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  let header = `${getMonthName(month)} ${year}\nSu Mo Tu We Th Fr Sa\n`;
  let dayOfWeek = firstDay.getDay();
  let ascii = "";

  // Fill initial spaces
  let line = "";
  for (let i = 0; i < dayOfWeek; i++) {
    line += "   "; // 2 chars + space for alignment
  }

  for (let date = 1; date <= lastDay; date++) {
    // Check if it's Mon(1), Fri(5), or Sat(6)
    let dayTest = new Date(year, month, date).getDay();
    let isClickable = (dayTest === 1 || dayTest === 5 || dayTest === 6);

    let dayStr = date < 10 ? ` ${date}` : `${date}`;
    if (isClickable) {
      // We'll wrap in brackets or something
      // We'll store an inline "data-date" attribute for clicking
      dayStr = `[${dayStr}]`;
    } else {
      // Normal day
      dayStr = ` ${dayStr} `;
    }

    line += dayStr;
    if (dayOfWeek === 6) {
      // Saturday -> break line
      ascii += line + "\n";
      line = "";
      dayOfWeek = 0;
    } else {
      dayOfWeek++;
    }
  }
  if (line !== "") ascii += line + "\n";

  // Render final ASCII
  const finalText = header + ascii;
  asciiDiv.innerHTML = `<pre>${finalText}</pre>`;

  // Add clickable day logic
  addCalendarClickHandlers(year, month);
}

function addCalendarClickHandlers(year, month) {
  const asciiDiv = document.getElementById("asciiCalendar");
  if (!asciiDiv) return;

  // We'll look for bracketed days like `[12]`
  // Then turn them into clickable spans
  // We'll do a quick find/replace approach or we can parse the text

  // Easiest approach: after we print the <pre>, we find them via innerHTML
  let html = asciiDiv.innerHTML;

  // Regex that finds e.g. `[ 5]` or `[12]` or `[ 1]`
  const bracketRegex = /\[(\s?\d{1,2})\]/g;
  // Replace with a span that has an onclick
  html = html.replace(bracketRegex, (match, p1) => {
    // p1 = day number with optional leading space
    const dayNum = parseInt(p1, 10);
    // We'll create a clickable link
    return `<span class="clickable-day" onclick="selectDay(${year}, ${month}, ${dayNum})">[${p1}]</span>`;
  });

  asciiDiv.innerHTML = html;
}

// Called when user clicks a bracketed day in the ASCII calendar
function selectDay(year, month, day) {
  // Store date chosen
  const chosenDate = new Date(year, month, day);
  // Format string if needed, or just store as time
  setBookingData("date", chosenDate.toDateString()); 
  // e.g. "Tue Feb 25 2025"
  // Or store year-mo-day if you prefer
  window.location.href = "booking-step3.html";
}

function getMonthName(m) {
  const names = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];
  return names[m];
}

/* Step 3: name, email, phone */
function step3Submit() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  if (!name || !email || !phone) {
    alert("Please fill all fields.");
    return;
  }
  setBookingData("name", name);
  setBookingData("email", email);
  setBookingData("phone", phone);
  window.location.href = "booking-step4.html";
}

/* Step 4: review data, disclaimers, then pay */
function initReview() {
  document.getElementById("review-product").innerText = getBookingData("product") || "";
  document.getElementById("review-tickets").innerText = getBookingData("tickets") || "";
  document.getElementById("review-date").innerText = getBookingData("date") || "";
  document.getElementById("review-name").innerText = getBookingData("name") || "";
  document.getElementById("review-email").innerText = getBookingData("email") || "";
  document.getElementById("review-phone").innerText = getBookingData("phone") || "";
}

function confirmBooking() {
  const disclaimCheck = document.getElementById("disclaimCheck");
  if (!disclaimCheck.checked) {
    alert("Please agree to disclaimers/terms.");
    return;
  }
  // Generate an orderId
  const orderId = genOrderId();
  setBookingData("orderId", orderId);
  window.location.href = "booking-payment.html";
}

function genOrderId() {
  const now = new Date();
  return "KLIF" + now.getTime();
}

/* Payment simulation: after ~2s, move to success */
function simulatePayment() {
  setTimeout(() => {
    window.location.href = "booking-success.html";
  }, 2000);
}

/* Show success on final page */
function initSuccess() {
  const oid = getBookingData("orderId");
  if (oid) document.getElementById("orderId").innerText = oid;
}

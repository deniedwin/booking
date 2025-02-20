/* script.js */

/* Common localStorage setters/getters */
function setBookingData(key, val) {
  localStorage.setItem(key, val);
}
function getBookingData(key) {
  return localStorage.getItem(key);
}

/* --- STEP 1 LOGIC --- */
function initStep1() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  const ticketsInput = document.getElementById("ticketsInput");
  const totalOutput = document.getElementById("totalOutput");

  function updateTotal() {
    if (singleRadio.checked) {
      totalOutput.textContent = "Total: $100 / €96";
    } else if (groupRadio.checked) {
      const tVal = parseInt(ticketsInput.value) || 3;
      const usd = tVal * 90;
      const eur = tVal * 86;
      totalOutput.textContent = `Total: $${usd} / €${eur}`;
    } else {
      totalOutput.textContent = "";
    }
  }

  // Listen for changes
  singleRadio.addEventListener("change", updateTotal);
  groupRadio.addEventListener("change", updateTotal);
  ticketsInput.addEventListener("input", updateTotal);

  updateTotal(); // Initialize totals
}

function step1Next() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  if (!singleRadio.checked && !groupRadio.checked) {
    alert("Please pick Single or Group Tour");
    return;
  }
  if (singleRadio.checked) {
    setBookingData("product", "Single Tour");
    setBookingData("tickets", "1");
  } else {
    const ticketsInput = document.getElementById("ticketsInput");
    let tVal = parseInt(ticketsInput.value) || 0;
    if (tVal < 3) {
      alert("Minimum 3 tickets for Group Tour.");
      return;
    }
    setBookingData("product", "Group Tour");
    setBookingData("tickets", tVal.toString());
  }
  window.location.href = "booking-step2.html";
}

/* --- STEP 2 LOGIC: ASCII CALENDAR --- */
let calYear, calMonth;
let selectedDay = null;

function initStep2() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar(calYear, calMonth);
}

/** Renders an aligned ASCII-like grid with clickable M/F/S. */
function renderCalendar(year, month) {
  const container = document.getElementById("asciiCalendar");
  container.innerHTML = ""; 
  selectedDay = null; // reset selection if user navigates months

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Title
  const title = document.createElement("div");
  title.style.textAlign = "center";
  title.style.fontWeight = "bold";
  title.textContent = `${monthNames[month].toUpperCase()} ${year}`;
  container.appendChild(title);
  
  // Day headers row
  const headerRow = document.createElement("div");
  headerRow.className = "calendar-row";
  const daysHeader = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  for (let d = 0; d < 7; d++) {
    const cell = document.createElement("span");
    cell.className = "calendar-day";
    cell.style.fontWeight = "bold";
    cell.textContent = daysHeader[d];
    headerRow.appendChild(cell);
  }
  container.appendChild(headerRow);

  // First day, leading spaces
  const firstDay = new Date(year, month, 1);
  let dayOfWeek = firstDay.getDay(); // 0=Sun
  let currentRow = document.createElement("div");
  currentRow.className = "calendar-row";

  // Leading empty cells
  for (let i = 0; i < dayOfWeek; i++) {
    const emptyCell = document.createElement("span");
    emptyCell.className = "calendar-day";
    emptyCell.textContent = "  ";
    currentRow.appendChild(emptyCell);
  }

  // Days in month
  const daysInMonth = new Date(year, month+1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("span");
    cell.className = "calendar-day";
    
    let wd = new Date(year, month, d).getDay();
    let dayStr = d < 10 ? ` ${d}` : `${d}`;
    
    // Highlight if Monday(1), Fri(5), or Sat(6)
    if (wd === 1 || wd === 5 || wd === 6) {
      dayStr = `[${dayStr}]`; // bracket
      cell.style.fontWeight = "bold";
      // Make it clickable
      cell.onclick = () => {
        selectedDay = d;
        // Display chosen day below the calendar
        document.getElementById("selectedDate").textContent = 
          `Selected date: ${dayStr.replace(/\[|\]/g,"")} ${monthNames[month]} ${year}`;
      };
    }
    cell.textContent = dayStr;
    currentRow.appendChild(cell);

    // if we hit Saturday(6), new row
    if (wd === 6) {
      container.appendChild(currentRow);
      currentRow = document.createElement("div");
      currentRow.className = "calendar-row";
    }
  }
  // leftover row if any
  if (currentRow.childNodes.length > 0) {
    container.appendChild(currentRow);
  }
}

function prevMonth() {
  calMonth--;
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderCalendar(calYear, calMonth);
}
function nextMonth() {
  calMonth++;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  renderCalendar(calYear, calMonth);
}

/** Step 2: user clicks "Next" => must have selectedDay + Sunrise/Sunset */
function step2Next() {
  const sunrise = document.getElementById("sunriseRadio").checked;
  const sunset = document.getElementById("sunsetRadio").checked;
  if (!selectedDay) {
    alert("Please click on a Monday, Friday, or Saturday in the calendar");
    return;
  }
  if (!sunrise && !sunset) {
    alert("Please pick Sunrise or Sunset");
    return;
  }
  setBookingData("day", selectedDay.toString());
  setBookingData("month", calMonth.toString());
  setBookingData("year", calYear.toString());
  setBookingData("timeSlot", sunrise ? "Sunrise" : "Sunset");
  window.location.href = "booking-step3.html";
}

/* --- STEP 3 LOGIC: user info --- */
function step3Next() {
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  if (!name || !email || !phone) {
    alert("Please fill all fields.");
    return;
  }
  setBookingData("name", name);
  setBookingData("email", email);
  setBookingData("phone", phone);
  window.location.href = "booking-step4.html";
}

/* --- STEP 4 LOGIC: review & disclaimers --- */
function initStep4() {
  const product = getBookingData("product") || "";
  const tickets = getBookingData("tickets") || "";
  const year = getBookingData("year") || "";
  const month = getBookingData("month") || "";
  const day = getBookingData("day") || "";
  const timeSlot = getBookingData("timeSlot") || "";
  const name = getBookingData("name") || "";
  const email = getBookingData("email") || "";
  const phone = getBookingData("phone") || "";

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let monthStr = "";
  if (month) {
    let m = parseInt(month);
    monthStr = monthNames[m] || "";
  }

  document.getElementById("reviewProduct").textContent = product;
  document.getElementById("reviewTickets").textContent = tickets;
  // e.g. "14 Feb 2025"
  if (day && monthStr && year) {
    document.getElementById("reviewDate").textContent = `${day} ${monthStr} ${year}`;
  } else {
    document.getElementById("reviewDate").textContent = "N/A";
  }
  document.getElementById("reviewTime").textContent = timeSlot || "N/A";
  document.getElementById("reviewName").textContent = name;
  document.getElementById("reviewEmail").textContent = email;
  document.getElementById("reviewPhone").textContent = phone;
}

function step4Pay() {
  const disclaimersCheck = document.getElementById("disclaimersCheck");
  if (!disclaimersCheck.checked) {
    alert("You must agree to disclaimers/terms");
    return;
  }
  // generate a simple order ID
  const orderId = Date.now().toString().slice(-6);
  setBookingData("orderId", orderId);
  window.location.href = "booking-payment.html";
}

/* --- PAYMENT & SUCCESS LOGIC --- */
function initPayment() {
  setTimeout(() => {
    window.location.href = "booking-success.html";
  }, 2000);
}
function initSuccess() {
  const orderId = getBookingData("orderId") || "";
  document.getElementById("successOrderId").textContent = orderId;
}

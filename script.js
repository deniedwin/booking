/* script.js */

/* Common localStorage setters/getters */
function setBookingData(key, val) {
  localStorage.setItem(key, val);
}
function getBookingData(key) {
  return localStorage.getItem(key);
}

/* 
   STEP 1 LOGIC
   If tickets <= 2 => Single 
   If tickets >= 3 => Group
   If user toggles radio to Group but tickets < 3 => set tickets=3
   If user toggles radio to Single but tickets >= 3 => set tickets=2
*/
function initStep1() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  const ticketsInput = document.getElementById("ticketsInput");

  // Default: 1 ticket => Single
  ticketsInput.value = "1";
  singleRadio.checked = true;

  // If user toggles radio manually
  singleRadio.addEventListener("change", () => {
    let tVal = parseInt(ticketsInput.value) || 1;
    if (tVal >= 3) {
      ticketsInput.value = "2";
    }
    updateTotal();
  });
  groupRadio.addEventListener("change", () => {
    let tVal = parseInt(ticketsInput.value) || 1;
    if (tVal < 3) {
      ticketsInput.value = "3";
    }
    updateTotal();
  });

  // If user types in the input or uses plus/minus
  ticketsInput.addEventListener("input", updateTotal);

  updateTotal();
}

/** plus/minus function */
function adjustTickets(delta) {
  const ticketsInput = document.getElementById("ticketsInput");
  let currentVal = parseInt(ticketsInput.value) || 1;
  let newVal = currentVal + delta;
  if (newVal < 1) newVal = 1; // can't go below 1
  ticketsInput.value = newVal;
  updateTotal();
}

/** Recompute total, auto-switch single/group if needed */
function updateTotal() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  const ticketsInput = document.getElementById("ticketsInput");
  const totalOutput = document.getElementById("totalOutput");

  let tVal = parseInt(ticketsInput.value) || 1;

  // If tickets <= 2 => single
  // If tickets >= 3 => group
  if (tVal >= 3) {
    groupRadio.checked = true;
  } else {
    singleRadio.checked = true;
  }

  let usd = 0, eur = 0;
  if (singleRadio.checked) {
    // single price
    usd = tVal * 100;
    eur = tVal * 96;
  } else {
    // group price
    usd = tVal * 90;
    eur = tVal * 86;
  }
  totalOutput.textContent = `Total: $${usd} / €${eur}`;
}

/** On "Next" button (Step 1) */
function step1Next() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  const ticketsInput = document.getElementById("ticketsInput");
  let tVal = parseInt(ticketsInput.value) || 1;

  // final check
  if (tVal < 1) {
    alert("At least 1 ticket is required.");
    return;
  }
  if (groupRadio.checked && tVal < 3) {
    alert("Group requires at least 3 tickets.");
    return;
  }

  // store data
  if (singleRadio.checked) {
    setBookingData("product", "Single Tour");
  } else {
    setBookingData("product", "Group Tour");
  }
  setBookingData("tickets", tVal.toString());

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
  const tickets = parseInt(getBookingData("tickets") || "1", 10);
  const year = getBookingData("year") || "";
  const month = getBookingData("month") || "";
  const day = getBookingData("day") || "";
  const timeSlot = getBookingData("timeSlot") || "";
  const name = getBookingData("name") || "";
  const email = getBookingData("email") || "";
  const phone = getBookingData("phone") || "";

  // Convert numeric month => short name
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let monthStr = "";
  if (month) {
    let m = parseInt(month);
    monthStr = monthNames[m] || "";
  }

  // Build text lines with bold labels:
  let usd = 0, eur = 0;
  if (product === "Single Tour") {
    usd = tickets * 100;
    eur = tickets * 96;
  } else if (product === "Group Tour") {
    usd = tickets * 90;
    eur = tickets * 86;
  }

  // Create the text with bold label, normal value
  document.getElementById("reviewProduct").innerHTML = `<strong>Product:</strong> ${product}`;
  document.getElementById("reviewTickets").innerHTML = `<strong>Tickets:</strong> ${tickets}`;
  document.getElementById("reviewTotal").innerHTML = `<strong>Total:</strong> $${usd} / €${eur}`;

  let dateStr = (day && monthStr && year) ? `${day} ${monthStr} ${year}` : "N/A";
  document.getElementById("reviewDate").innerHTML = `<strong>Date:</strong> ${dateStr}`;

  let timeStr = timeSlot || "N/A";
  document.getElementById("reviewTime").innerHTML = `<strong>Time:</strong> ${timeStr}`;

  document.getElementById("reviewName").innerHTML = `<strong>Name:</strong> ${name}`;
  document.getElementById("reviewEmail").innerHTML = `<strong>Email:</strong> ${email}`;
  document.getElementById("reviewPhone").innerHTML = `<strong>Phone:</strong> ${phone}`;
}

/** Called when user clicks "Pay" on Step 4 */
function step4Pay() {
  const disclaimersCheck = document.getElementById("disclaimersCheck");
  if (!disclaimersCheck.checked) {
    alert("You must agree to disclaimers & terms before proceeding.");
    return;
  }
  // generate an order ID
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

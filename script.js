/* script.js */

/* Common localStorage setters/getters */
function setBookingData(key, val) {
  localStorage.setItem(key, val);
}
function getBookingData(key) {
  return localStorage.getItem(key);
}

/* --- STEP 1 LOGIC: Single vs. Group Tickets --- */
function initStep1() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  const ticketsInput = document.getElementById("ticketsInput");
  const totalOutput = document.getElementById("totalOutput");

  // Default: 1 ticket => Single
  ticketsInput.value = "1";
  singleRadio.checked = true;

  // If user toggles radio
  singleRadio.addEventListener("change", () => {
    let tVal = parseInt(ticketsInput.value) || 1;
    if (tVal >= 3) {
      ticketsInput.value = "2";
    }
    updateStep1Total();
  });
  groupRadio.addEventListener("change", () => {
    let tVal = parseInt(ticketsInput.value) || 1;
    if (tVal < 3) {
      ticketsInput.value = "3";
    }
    updateStep1Total();
  });

  // If user types or plus/minus
  ticketsInput.addEventListener("input", updateStep1Total);

  updateStep1Total();
}

function adjustTickets(delta) {
  const ticketsInput = document.getElementById("ticketsInput");
  let currentVal = parseInt(ticketsInput.value) || 1;
  let newVal = currentVal + delta;
  if (newVal < 1) newVal = 1;
  ticketsInput.value = newVal;
  updateStep1Total();
}

function updateStep1Total() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  const ticketsInput = document.getElementById("ticketsInput");
  const totalOutput = document.getElementById("totalOutput");

  let tVal = parseInt(ticketsInput.value) || 1;

  // If tickets >=3 => group, else => single
  if (tVal >= 3) {
    groupRadio.checked = true;
  } else {
    singleRadio.checked = true;
  }

  let usd = 0, eur = 0;
  if (singleRadio.checked) {
    usd = tVal * 100;
    eur = tVal * 96;
  } else {
    usd = tVal * 90;
    eur = tVal * 86;
  }
  totalOutput.textContent = `Total: $${usd} / €${eur}`;
}

function step1Next() {
  const singleRadio = document.getElementById("singleRadio");
  const groupRadio = document.getElementById("groupRadio");
  const ticketsInput = document.getElementById("ticketsInput");
  let tVal = parseInt(ticketsInput.value) || 1;

  if (tVal < 1) {
    alert("At least 1 ticket is required.");
    return;
  }
  if (groupRadio.checked && tVal < 3) {
    alert("Group requires at least 3 tickets.");
    return;
  }

  if (singleRadio.checked) {
    setBookingData("product", "Single Tour");
  } else {
    setBookingData("product", "Group Tour");
  }
  setBookingData("tickets", tVal.toString());

  window.location.href = "booking-step2.html";
}

/* --- STEP 2 LOGIC: Table-based Calendar --- */
let calYear, calMonth;
let selectedDay = null;

function initStep2() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendarTable(calYear, calMonth);
}

function renderCalendarTable(year, month) {
  const container = document.getElementById("calendarTableContainer");
  container.innerHTML = ""; 
  selectedDay = null; // reset selection if user navigates months

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Create a table
  const table = document.createElement("table");
  table.className = "calendar-table";

  // Table caption
  const caption = document.createElement("caption");
  caption.textContent = `${monthNames[month].toUpperCase()} ${year}`;
  table.appendChild(caption);

  // Table header row
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const daysHeader = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  for (let d=0; d<7; d++){
    const th = document.createElement("th");
    th.textContent = daysHeader[d];
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month+1, 0).getDate();

  let row = document.createElement("tr");
  // leading empty cells
  for (let i=0; i<firstDay; i++){
    const emptyTd = document.createElement("td");
    row.appendChild(emptyTd);
  }

  for (let d=1; d<=daysInMonth; d++){
    const currentDate = new Date(year, month, d);
    const dayOfWeek = currentDate.getDay();

    const td = document.createElement("td");
    td.textContent = d.toString();

    // highlight Monday(1), Fri(5), Sat(6) or make them clickable
    if (dayOfWeek===1 || dayOfWeek===5 || dayOfWeek===6) {
      // Make it clickable
      td.style.cursor = "pointer";
      td.style.fontWeight = "bold";
      td.onclick = () => {
        selectedDay = d;
        document.getElementById("selectedDate").textContent =
          `Selected date: ${d} ${monthNames[month]} ${year}`;
      };
    }

    row.appendChild(td);

    if (dayOfWeek===6) {
      // end of the week
      tbody.appendChild(row);
      row = document.createElement("tr");
    }
  }
  // leftover cells
  if (row.childNodes.length>0) {
    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  container.appendChild(table);
}

function prevMonth() {
  calMonth--;
  if (calMonth<0) {
    calMonth=11;
    calYear--;
  }
  renderCalendarTable(calYear, calMonth);
}
function nextMonth() {
  calMonth++;
  if (calMonth>11) {
    calMonth=0;
    calYear++;
  }
  renderCalendarTable(calYear, calMonth);
}

function step2Next() {
  const sunrise = document.getElementById("sunriseRadio").checked;
  const sunset = document.getElementById("sunsetRadio").checked;
  if (!selectedDay) {
    alert("Please select a Monday, Friday, or Saturday from the calendar");
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

  // phone might be optional if we removed it, but let's keep the check:
  if (!name || !email) {
    alert("Please fill all required fields.");
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

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let monthStr = "";
  if (month) {
    let m = parseInt(month);
    monthStr = monthNames[m] || "";
  }

  // Compute total
  let usd=0, eur=0;
  if (product==="Single Tour") {
    usd = tickets*100;
    eur = tickets*96;
  } else {
    usd = tickets*90;
    eur = tickets*86;
  }

  document.getElementById("reviewProduct").innerHTML = `<strong>Product:</strong> ${product}`;
  document.getElementById("reviewTickets").innerHTML = `<strong>Tickets:</strong> ${tickets}`;
  document.getElementById("reviewTotal").innerHTML = `<strong>Total:</strong> $${usd} / €${eur}`;

  let dateStr = "N/A";
  if (day && monthStr && year) {
    dateStr = `${day} ${monthStr} ${year}`;
  }
  document.getElementById("reviewDate").innerHTML = `<strong>Date:</strong> ${dateStr}`;
  document.getElementById("reviewTime").innerHTML = `<strong>Time:</strong> ${timeSlot||"N/A"}`;
  document.getElementById("reviewName").innerHTML = `<strong>Name:</strong> ${name}`;
  document.getElementById("reviewEmail").innerHTML = `<strong>Email:</strong> ${email}`;
  document.getElementById("reviewPhone").innerHTML = `<strong>Phone:</strong> ${phone}`;
}

function step4Pay() {
  const disclaimersCheck = document.getElementById("disclaimersCheck");
  if (!disclaimersCheck.checked) {
    alert("You must agree to disclaimers & terms.");
    return;
  }
  // generate order ID
  const orderId = Date.now().toString().slice(-6);
  setBookingData("orderId", orderId);
  window.location.href="booking-payment.html";
}

/* --- PAYMENT & SUCCESS LOGIC --- */
function initPayment() {
  setTimeout(() => {
    window.location.href="booking-success.html";
  },2000);
}
function initSuccess() {
  const orderId = getBookingData("orderId")||"";
  document.getElementById("successOrderId") &&
    (document.getElementById("successOrderId").textContent = orderId);
}

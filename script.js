/* script.js */

/* Save & retrieve data in localStorage */
function setBookingData(key, val) {
  localStorage.setItem(key, val);
}
function getBookingData(key) {
  return localStorage.getItem(key);
}

/* Step 1: handle Single vs. Group, show total */
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

  updateTotal(); // initialize
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
      alert("Minimum 3 tickets for Group Tour");
      return;
    }
    setBookingData("product", "Group Tour");
    setBookingData("tickets", tVal.toString());
  }
  window.location.href = "booking-step2.html";
}

/* Step 2: ASCII calendar with next/prev month, highlight M/F/S */
let calYear, calMonth;

function initStep2() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar(calYear, calMonth);
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

function renderCalendar(year, month) {
  const calendarDiv = document.getElementById("asciiCalendar");
  calendarDiv.innerHTML = "";
  const monthNames = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
  let firstDay = new Date(year, month, 1);
  let dayOfWeek = firstDay.getDay(); // 0=Sun,1=Mon...
  let header = `    ${monthNames[month].toUpperCase()} ${year}\n`;
  header += "Su Mo Tu We Th Fr Sa\n";

  let grid = "";
  for (let i=0; i<dayOfWeek; i++){
    grid += "   ";
  }
  const daysInMonth = new Date(year, month+1, 0).getDate();
  for (let d=1; d<=daysInMonth; d++){
    let currentDay = new Date(year, month, d).getDay();
    let dayStr = d<10 ? ` ${d}` : `${d}`;
    if (currentDay === 1 || currentDay === 5 || currentDay===6) {
      // highlight M/F/S
      // bracket them
      dayStr = `[${dayStr}]`;
    } else {
      dayStr = ` ${dayStr} `;
    }
    grid += dayStr;
    if (currentDay===6) {
      grid += "\n"; // new line after Sat
    } else {
      grid += " "; // space after each day
    }
  }
  calendarDiv.textContent = header + grid;
}

function step2Next() {
  const sunrise = document.getElementById("sunriseRadio").checked;
  const sunset = document.getElementById("sunsetRadio").checked;
  if (!sunrise && !sunset) {
    alert("Please pick Sunrise or Sunset");
    return;
  }
  // store time slot
  setBookingData("timeSlot", sunrise?"Sunrise":"Sunset");
  // store month/year (roughly)
  setBookingData("year", calYear.toString());
  setBookingData("month", calMonth.toString());
  window.location.href = "booking-step3.html";
}

/* Step 3: user info */
function step3Next() {
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  if (!name || !email || !phone) {
    alert("Please fill all fields");
    return;
  }
  setBookingData("name", name);
  setBookingData("email", email);
  setBookingData("phone", phone);
  window.location.href = "booking-step4.html";
}

/* Step 4: review, disclaimers link, checkbox above Pay */
function initStep4() {
  const product = getBookingData("product") || "";
  const tickets = getBookingData("tickets") || "";
  const year = getBookingData("year") || "";
  const month = getBookingData("month") || "";
  const timeSlot = getBookingData("timeSlot") || "";
  const name = getBookingData("name") || "";
  const email = getBookingData("email") || "";
  const phone = getBookingData("phone") || "";

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let monthStr = "";
  if (month) {
    monthStr = monthNames[parseInt(month)];
  }

  document.getElementById("reviewProduct").textContent = product;
  document.getElementById("reviewTickets").textContent = tickets;
  document.getElementById("reviewDate").textContent = (year && monthStr)?(`${monthStr} ${year}`):"N/A";
  document.getElementById("reviewTime").textContent = timeSlot||"N/A";
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
  // generate an order id
  const orderId = Date.now().toString().slice(-6);
  setBookingData("orderId", orderId);
  window.location.href = "booking-payment.html";
}

/* Payment simulation -> success */
function initPayment() {
  setTimeout(()=> {
    window.location.href="booking-success.html";
  },2000);
}
function initSuccess() {
  const orderId = getBookingData("orderId")||"";
  document.getElementById("successOrderId").textContent = orderId;
}

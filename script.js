// Utility functions for state persistence using localStorage
function getBookingData() {
    return JSON.parse(localStorage.getItem("bookingData")) || {
      bookingType: "single",
      groupQuantity: 1,
      currency: "USD",
      price: 100,
      selectedDate: "",
      timeSlot: "sunrise",
      name: "",
      email: "",
      phone: ""
    };
  }
  
  function saveBookingData(data) {
    localStorage.setItem("bookingData", JSON.stringify(data));
  }
  
  // Update price based on booking type, quantity, and currency
  function updatePrice() {
    const data = getBookingData();
    const pricing = {
      single: { USD: 100, EUR: 96 },
      group: { USD: 90, EUR: 86 }
    };
    let price = 0;
    if (data.bookingType === "single") {
      price = pricing.single[data.currency];
    } else {
      price = pricing.group[data.currency] * data.groupQuantity;
    }
    data.price = price;
    saveBookingData(data);
    const priceDisplay = document.getElementById("priceDisplay");
    if (priceDisplay) {
      priceDisplay.textContent = "Price: " + data.currency + " " + price;
    }
  }
  
  // --- Step 1: Booking Type & Currency ---
  function initStep1() {
    const data = getBookingData();
    // Set booking type radio button
    const radios = document.getElementsByName("bookingType");
    radios.forEach(function(radio) {
      radio.checked = (radio.value === data.bookingType);
    });
    // Show/hide group quantity
    const groupContainer = document.getElementById("groupQuantityContainer");
    if (data.bookingType === "group") {
      groupContainer.style.display = "block";
      document.getElementById("groupQuantity").value = data.groupQuantity;
    } else {
      groupContainer.style.display = "none";
    }
    // Set currency
    document.getElementById("currency").value = data.currency;
    updatePrice();
  
    // Add event listeners
    document.querySelectorAll('input[name="bookingType"]').forEach(function(radio) {
      radio.addEventListener("change", function() {
        const d = getBookingData();
        d.bookingType = this.value;
        saveBookingData(d);
        if (this.value === "group") {
          groupContainer.style.display = "block";
        } else {
          groupContainer.style.display = "none";
        }
        updatePrice();
      });
    });
    document.getElementById("groupQuantity").addEventListener("input", function() {
      const d = getBookingData();
      d.groupQuantity = parseInt(this.value) || 1;
      saveBookingData(d);
      updatePrice();
    });
    document.getElementById("currency").addEventListener("change", function() {
      const d = getBookingData();
      d.currency = this.value;
      saveBookingData(d);
      updatePrice();
    });
    document.getElementById("next1").addEventListener("click", function() {
      window.location.href = "booking-timedate.html";
    });
  }
  
  // --- Step 2: Time Slot & Date ---
  function initStep2() {
    const data = getBookingData();
    // Set time slot radio button
    const timeRadios = document.getElementsByName("timeSlot");
    timeRadios.forEach(function(radio) {
      radio.checked = (radio.value === data.timeSlot);
    });
    document.getElementById("back2").addEventListener("click", function() {
      window.location.href = "booking-type.html";
    });
    document.getElementById("next2").addEventListener("click", function() {
      const d = getBookingData();
      if (!d.selectedDate) {
        alert("Please select a valid date.");
        return;
      }
      d.timeSlot = document.querySelector('input[name="timeSlot"]:checked').value;
      saveBookingData(d);
      window.location.href = "booking-details.html";
    });
    generateCalendar();
  }
  
  // Calendar generation for Step 2
  function generateCalendar() {
    const calendarDiv = document.getElementById("calendar");
    if (!calendarDiv) return;
    calendarDiv.innerHTML = "";
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    // Create header with month navigation
    const headerDiv = document.createElement("div");
    headerDiv.style.display = "flex";
    headerDiv.style.alignItems = "center";
    headerDiv.style.justifyContent = "center";
    headerDiv.style.gap = "5px";
    
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "<";
    prevBtn.style.fontSize = "14px";
    prevBtn.style.padding = "2px 5px";
    prevBtn.addEventListener("click", function() {
      if (currentMonth === 0) { currentMonth = 11; currentYear--; }
      else { currentMonth--; }
      generateCalendarFor(currentMonth, currentYear);
      monthYearSpan.textContent = " " + new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" }) + " ";
    });
    
    const monthYearSpan = document.createElement("span");
    monthYearSpan.textContent = " " + new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" }) + " ";
    
    const nextBtn = document.createElement("button");
    nextBtn.textContent = ">";
    nextBtn.style.fontSize = "14px";
    nextBtn.style.padding = "2px 5px";
    nextBtn.addEventListener("click", function() {
      if (currentMonth === 11) { currentMonth = 0; currentYear++; }
      else { currentMonth++; }
      generateCalendarFor(currentMonth, currentYear);
      monthYearSpan.textContent = " " + new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" }) + " ";
    });
    
    headerDiv.appendChild(prevBtn);
    headerDiv.appendChild(monthYearSpan);
    headerDiv.appendChild(nextBtn);
    calendarDiv.appendChild(headerDiv);
    generateCalendarFor(currentMonth, currentYear);
  }
  
  function generateCalendarFor(month, year) {
    const calendarDiv = document.getElementById("calendar");
    const existingTable = calendarDiv.querySelector("table");
    if (existingTable) calendarDiv.removeChild(existingTable);
    
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(function(day) {
      const th = document.createElement("th");
      th.textContent = day;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement("tbody");
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;
    const currentDay = new Date();
    currentDay.setHours(0,0,0,0);
    
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");
        if (i === 0 && j < firstDay) {
          cell.textContent = "";
        } else if (date > daysInMonth) {
          cell.textContent = "";
        } else {
          cell.textContent = date;
          const cellDate = new Date(year, month, date);
          if (cellDate < currentDay) {
            cell.classList.add("disabled");
          } else {
            if ([4,5,6].includes(cellDate.getDay())) {
              cell.classList.add("available");
              cell.addEventListener("click", function() {
                const prevSelected = calendarDiv.querySelectorAll("td.selected");
                prevSelected.forEach(function(td) { td.classList.remove("selected"); });
                cell.classList.add("selected");
                const d = getBookingData();
                d.selectedDate = cellDate.toISOString().split("T")[0];
                saveBookingData(d);
              });
            } else {
              cell.classList.add("disabled");
            }
          }
          date++;
        }
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    calendarDiv.appendChild(table);
  }
  
  // --- Step 3: Client Details ---
  function initStep3() {
    const data = getBookingData();
    if (data.name) document.getElementById("name").value = data.name;
    if (data.email) document.getElementById("email").value = data.email;
    if (data.phone) document.getElementById("phone").value = data.phone;
  
    document.getElementById("back3").addEventListener("click", function() {
      window.location.href = "booking-timedate.html";
    });
    document.getElementById("next3").addEventListener("click", function() {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      if (!name || !email || !phone) {
        alert("Please fill in all client details.");
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      const d = getBookingData();
      d.name = name; d.email = email; d.phone = phone;
      saveBookingData(d);
      window.location.href = "booking-review.html";
    });
  }
  
  // --- Step 4: Review & Pay ---
  function initStep4() {
    const data = getBookingData();
    const reviewDiv = document.getElementById("reviewSummary");
    reviewDiv.innerHTML = `
      <p><strong>Booking Type:</strong> ${data.bookingType === "single" ? "Single Booking" : "Group Booking"}</p>
      ${data.bookingType === "group" ? `<p><strong>Number of Group Bookings:</strong> ${data.groupQuantity}</p>` : ""}
      <p><strong>Currency:</strong> ${data.currency}</p>
      <p><strong>Total Price:</strong> ${data.currency} ${data.price}</p>
      <p><strong>Date:</strong> ${data.selectedDate}</p>
      <p><strong>Time Slot:</strong> ${data.timeSlot === "sunrise" ? "Sunrise (5-8am)" : "Sunset (4-7pm)"}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
    `;
    document.getElementById("back4").addEventListener("click", function() {
      window.location.href = "booking-details.html";
    });
    document.getElementById("pay").addEventListener("click", function() {
      window.location.href = "processing.html";
    });
  }
  
  // Initialization: Call the appropriate function based on the page
  document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("next1")) {
      initStep1();
    }
    if (document.getElementById("next2")) {
      initStep2();
    }
    if (document.getElementById("next3")) {
      initStep3();
    }
    if (document.getElementById("pay")) {
      initStep4();
    }
  });
  
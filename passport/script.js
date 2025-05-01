
let advisorName = "";
let advisorEmail = "";
let stamps = {};

function startPassport() {
  advisorName = document.getElementById("name").value;
  advisorEmail = document.getElementById("email").value;
  if (!advisorName || !advisorEmail) return alert("Fill in your name and email.");

  document.querySelector(".login").style.display = "none";
  document.getElementById("passport").style.display = "block";

  $(".flipbook").turn({ width: 800, height: 400 });
}

function stamp(btn) {
  const page = btn.parentElement;
  const stampName = page.getAttribute("data-stamp");
  page.innerHTML = `<h2>${stampName}</h2><p>✅ Stamped!</p>`;
  stamps[stampName] = "Stamped";

  sendDataToSheet();
}

function sendDataToSheet() {
  fetch("https://script.google.com/macros/s/AKfycbzBIC9f7lxs3G16U5N-SzxGuTWEF8mtbH6qO-7el6nEaPDKBismET7ddqCQotygY1pEQA/exec", {
    method: "POST",
    body: JSON.stringify({
      name: advisorName,
      email: advisorEmail,
      stamps: stamps
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => console.log("Data saved."));
}

function startApp() {
  hideAll();
  show("onboard");
}

function saveUser() {

  let user = {
    name: name.value,
    age: age.value,
    gender: gender.value,
    email: email.value
  };

  localStorage.setItem("user", JSON.stringify(user));

  loadDashboard();
}

function loadDashboard() {

  hideAll();
  show("dashboard");

  let user = JSON.parse(localStorage.getItem("user"));

  username.innerText = user.name;

  assistant.innerText =
    "Eat healthy food. Drink water. Take medicines on time.";
}

function openCare() {
  hideAll();
  show("care");
}

function openEmergency() {
  hideAll();
  show("emergency");
}

function openBlood() {
  hideAll();
  show("blood");
}

function analyze() {

  let text = symptoms.value.toLowerCase();
  let domain = "General";
  let level = "Basic Care";

  if (text.includes("chest")) {
    domain = "Cardiology";
    level = "Advanced Care";
  }
  else if (text.includes("eye")) {
    domain = "Ophthalmology";
    level = "Basic Care";
  }
  else if (text.includes("skin")) {
    domain = "Dermatology";
    level = "Intermediate Care";
  }

  result.innerHTML = `
    <h3>Result</h3>
    <p>Domain: ${domain}</p>
    <p>Risk Level: ${level}</p>
    <p>Suggested Medicine: Paracetamol (If required)</p>
    <p>Consult doctor if symptoms continue.</p>
  `;
}

function registerDonor() {
  donorForm.classList.remove("hidden");
}

function saveDonor() {

  let bg = document.getElementById("bg").value;

  localStorage.setItem("blood", bg);

  alert("Donor Registered Successfully!");
}

function goBack() {
  loadDashboard();
}

function hideAll() {
  document.querySelectorAll("section").forEach(s=>{
    s.classList.add("hidden");
  });
}

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

window.onload = function(){

  let user = localStorage.getItem("user");

  if(user){
    loadDashboard();
  }

}
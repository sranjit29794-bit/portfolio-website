const button = document.getElementById("theme-toggle");

function updateTheme() {
  if (document.body.classList.contains("dark-mode")) {
    button.textContent = "☀️ Light";
  } else {
    button.textContent = "🌙 Dark";
  }
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

updateTheme();

button.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  updateTheme();
});
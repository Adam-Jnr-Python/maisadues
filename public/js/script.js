const API_BASE = "https://maisa-dues.onrender.com";

// MODAL ALERT SYSTEM
function showModalAlert(message, type = "info", title = "", callback = null) {
  const existingModal = document.getElementById("customAlertModal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
    <div id="customAlertModal" class="custom-alert-overlay">
      <div class="custom-alert-box ${type}">
        <div class="custom-alert-header">
          <h3>${title || (type === "success" ? "✅ Success" : type === "error" ? "❌ Error" : "ℹ️ Information")}</h3>
          <button class="custom-alert-close" onclick="closeModalAlert()">&times;</button>
        </div>
        <div class="custom-alert-body">
          <p>${message}</p>
        </div>
        <div class="custom-alert-footer">
          <button class="custom-alert-btn ${type}" onclick="closeModalAlert()">OK</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.body.style.overflow = "hidden";

  if (callback) {
    window._alertCallback = callback;
  }
}

function closeModalAlert() {
  const modal = document.getElementById("customAlertModal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "auto";
    if (window._alertCallback) {
      const cb = window._alertCallback;
      window._alertCallback = null;
      cb();
    }
  }
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("customAlertModal");
  if (modal && e.target === modal) {
    closeModalAlert();
  }
});

// AUTH HELPERS
function getAuthToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function isAuthenticated() {
  return !!getAuthToken();
}

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document
    .querySelector('input[name="password"]')
    .value.trim();

  if (!email || !password) {
    showModalAlert("Please fill in all fields", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.admin));

      showModalAlert("Login successful! Redirecting...", "success", "Welcome!");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      showModalAlert(
        data.message || "Login failed. Please try again.",
        "error",
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    showModalAlert("Failed to connect to server. Please try again.", "error");
  }
});

// SIGNUP
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document
    .querySelector('input[name="password"]')
    .value.trim();

  if (!name || !email || !password) {
    showModalAlert("Please fill in all fields", "error");
    return;
  }

  if (password.length < 6) {
    showModalAlert("Password must be at least 6 characters long", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.admin));

      showModalAlert(
        "Account created successfully! Redirecting...",
        "success",
        "✅ Welcome!",
      );

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      showModalAlert(
        data.message || "Registration failed. Please try again.",
        "error",
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    showModalAlert("Failed to connect to server. Please try again.", "error");
  }
});

// PROTECTED ROUTES CHECK
const currentPage = window.location.pathname.split("/").pop();
const protectedPages = ["dashboard.html", "students.html", "set-dues.html"];

if (protectedPages.includes(currentPage)) {
  if (!isAuthenticated()) {
    showModalAlert(
      "Please login to access this page",
      "error",
      "Access Denied",
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  }
}

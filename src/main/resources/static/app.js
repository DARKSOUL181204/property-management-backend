const state = {
  token: sessionStorage.getItem("pm_token"),
  email: sessionStorage.getItem("pm_email"),
  properties: [],
};
const $ = (selector) => document.querySelector(selector);
const authView = $("#authView");
const appView = $("#appView");

function showMessage(target, text, error = true) {
  const element = typeof target === "string" ? $(target) : target;
  element.textContent = text;
  element.style.color = error ? "var(--coral)" : "var(--green)";
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(path, { ...options, headers });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok)
    throw new Error(
      payload?.message || payload || `Request failed (${response.status})`,
    );
  return payload;
}

function enterWorkspace() {
  authView.classList.add("hidden");
  appView.classList.remove("hidden");
  $("#userEmail").textContent = state.email || "";
  loadProperties();
}

function leaveWorkspace() {
  sessionStorage.clear();
  state.token = null;
  state.email = null;
  appView.classList.add("hidden");
  authView.classList.remove("hidden");
}

async function loadProperties() {
  try {
    state.properties = await request("/api/properties");
    renderProperties();
  } catch (error) {
    if (
      error.message.includes("403") ||
      error.message.toLowerCase().includes("access")
    )
      leaveWorkspace();
    showMessage("#dashboardMessage", error.message);
  }
}

function renderProperties() {
  const properties = state.properties;
  $("#propertyCount").textContent = properties.length;
  $("#unitCount").textContent = properties.reduce(
    (sum, property) => sum + (property.totalUnits || 0),
    0,
  );
  $("#activeCount").textContent = properties.filter(
    (property) => property.status === "ACTIVE",
  ).length;
  $("#lastUpdated").textContent = properties.length
    ? "Just refreshed"
    : "No records yet";
  if (!properties.length) {
    $("#propertyList").innerHTML =
      '<div class="empty-state"><span class="empty-symbol">+</span><h3>Your portfolio starts here</h3><p>Add your first property to begin tracking the details that matter.</p><button class="text-button" type="button" id="emptyAddButton">Add a property</button></div>';
    $("#emptyAddButton").addEventListener("click", openDialog);
    return;
  }
  $("#propertyList").innerHTML = properties
    .map(
      (property) =>
        `<article class="property-card"><div class="property-name">${escapeHtml(property.name || "Unnamed property")}</div><div class="property-type">${escapeHtml(property.propertyType || "Unclassified")}</div><div class="property-units">${property.totalUnits || 0} units</div><div class="status">${escapeHtml(property.status || "UNKNOWN")}</div><button class="delete-button" type="button" data-id="${property.propertyId}" aria-label="Delete ${escapeHtml(property.name || "property")}">×</button></article>`,
    )
    .join("");
  document
    .querySelectorAll(".delete-button")
    .forEach((button) =>
      button.addEventListener("click", () => deleteProperty(button.dataset.id)),
    );
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ],
  );
}
function openDialog() {
  $("#propertyDialog").showModal();
}
function closeDialog() {
  $("#propertyDialog").close();
  $("#propertyForm").reset();
  showMessage("#propertyMessage", "");
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const result = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    state.token = result.token;
    state.email = form.get("email");
    sessionStorage.setItem("pm_token", state.token);
    sessionStorage.setItem("pm_email", state.email);
    showMessage("#authMessage", "", false);
    enterWorkspace();
  } catch (error) {
    showMessage("#authMessage", error.message);
  }
});

$("#showRegister").addEventListener("click", () => {
  $("#loginForm").classList.toggle("hidden");
  $("#registerForm").classList.toggle("hidden");
  $("#showRegister").textContent = $("#registerForm").classList.contains(
    "hidden",
  )
    ? "Need an account? Create one"
    : "Already have an account? Sign in";
  showMessage("#authMessage", "");
});
$("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: "USER",
      }),
    });
    showMessage("#authMessage", "Account created. Sign in to continue.", false);
    $("#loginForm").classList.remove("hidden");
    $("#registerForm").classList.add("hidden");
    $("#showRegister").textContent = "Need an account? Create one";
  } catch (error) {
    showMessage("#authMessage", error.message);
  }
});
$("#logoutButton").addEventListener("click", leaveWorkspace);
$("#newPropertyButton").addEventListener("click", openDialog);
$("#closeDialog").addEventListener("click", closeDialog);
$("#propertyDialog").addEventListener("click", (event) => {
  if (event.target === $("#propertyDialog")) closeDialog();
});
$("#propertyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await request("/api/properties", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        propertyType: form.get("propertyType"),
        totalUnits: Number(form.get("totalUnits")),
        status: form.get("status"),
      }),
    });
    closeDialog();
    showMessage(
      "#dashboardMessage",
      "Property added to your portfolio.",
      false,
    );
    loadProperties();
  } catch (error) {
    showMessage("#propertyMessage", error.message);
  }
});
async function deleteProperty(id) {
  if (!window.confirm("Remove this property from your portfolio?")) return;
  try {
    await request(`/api/properties/${id}`, { method: "DELETE" });
    showMessage("#dashboardMessage", "Property removed.", false);
    loadProperties();
  } catch (error) {
    showMessage("#dashboardMessage", error.message);
  }
}

if (state.token) enterWorkspace();

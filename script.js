// -----------------------------
// Supabase Client (Public / Read-only)
// -----------------------------
const SUPABASE_URL = "https://zzigzylypifjokskehkn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6aWd6eWx5cGlmam9rc2tlaGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyODEzNDAsImV4cCI6MjA2Nzg1NzM0MH0.UjSODSs-tWPmXxKkyuaSIvSutx5dCnJsMhzslbFaBUg";

// Supabase JS is loaded via index.html <script type="module">
window.supabase = window.supabase || supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("✅ Supabase client exists");


// ======================================================
// A-1 Dashboard PWA Core
// ======================================================
class A1Dashboard {
  constructor() {
    this.init();
  }

  init() {
    this.setupServiceWorker();
    this.setupInstallPrompt();
    this.setupOnlineStatus();
    this.setupDashboardFeatures();
    console.log("A-1APSVC Dashboard PWA initialized");
  }

  setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }

  setupInstallPrompt() {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    window.installApp = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    };
  }

  setupOnlineStatus() {
    const updateStatus = () => {
      console.log(navigator.onLine ? "🟢 Online" : "🔴 Offline");
    };
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
  }

  setupDashboardFeatures() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModals();
    });
  }

  closeModals() {
    document.querySelectorAll(".modal, .overlay").forEach((m) => {
      m.style.display = "none";
    });
  }

  showNotification(message, type = "info") {
    console.log(`[${type.toUpperCase()}]`, message);
  }
}


// ======================================================
// Dashboard Integration (Navigation)
// ======================================================
class DashboardIntegration {
  constructor() {
    this.customerSystemUrl = "./customers.html";
    this.init();
  }

  init() {
    this.setupDashboardCards();
  }

  setupDashboardCards() {
    const customerCard = document.getElementById("customer-card");
    if (!customerCard) return;

    customerCard.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = this.customerSystemUrl;
    });
  }
}


// ======================================================
// G4 — Live Dashboard Metrics
// ======================================================
async function loadDashboardMetrics() {
  if (!window.supabase) {
    console.error("❌ Supabase client missing");
    return;
  }

  console.log("🔄 Loading dashboard metrics…");

  try {
    // Open invoices
    const { count, error } = await window.supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .in("status", ["open", "sent", "overdue"]);

    if (error) throw error;

    console.log("📄 Open invoices:", count);

    const invoiceMetric = document.querySelector(
      ".metrics-grid .metric-card:nth-child(2) .metric-value"
    );

    if (invoiceMetric) {
      invoiceMetric.textContent = count ?? 0;
    }

  } catch (err) {
    console.error("❌ Dashboard metric load failed:", err);
  }
}


// ======================================================
// Init on Load
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  window.a1Dashboard = new A1Dashboard();
  window.dashboardIntegration = new DashboardIntegration();

  loadDashboardMetrics();
});

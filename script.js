document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  const connectBtn = document.getElementById("connectBtn");
  const userArea   = document.getElementById("userArea");
  const userMenu   = document.getElementById("userMenu");
  const addrShort  = document.getElementById("addrShort");
  const addrFull   = document.getElementById("addrFull");

  

  const currentAddress = "0x7b1f3c8a4E12B9A2cC40C2A5Bf0F1d9A0dE8C001";

  function shortAddr(a){ return a ? a.slice(0,6) + "…" + a.slice(-4) : "0x…"; }

  function setConnectedUI(address){
    addrShort.textContent = shortAddr(address);
    addrFull.textContent  = address;
    connectBtn?.classList.add("hidden");
    userArea.classList.remove("hidden");
  }

  function setDisconnectedUI(){
    userArea.classList.add("hidden");
    userArea.classList.remove("open");
    userMenu.setAttribute("aria-hidden","true");
    connectBtn?.classList.remove("hidden");
  }

  // Connect
  connectBtn?.addEventListener("click", () => setConnectedUI(currentAddress));

  // Toggle panel
  userArea.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !userArea.classList.contains("open");
    document.querySelectorAll(".user-area.open").forEach(el => {
      el.classList.remove("open");
      el.querySelector(".user-menu")?.setAttribute("aria-hidden","true");
    });
    if (willOpen) {
      userArea.classList.add("open");
      userMenu.setAttribute("aria-hidden","false");
    }
  });

  // Dışarı tıkla kapat
  document.addEventListener("click", () => {
    if (userArea.classList.contains("open")) {
      userArea.classList.remove("open");
      userMenu.setAttribute("aria-hidden","true");
    }
  });

  // Menü aksiyonları - logout dahil
userMenu.addEventListener("click", (e) => {
  const item = e.target.closest(".menu-item");
  if (!item) return;

  const action = item.dataset.action;

  if (action === "logout") {
     setDisconnectedUI();                 // UI başlangıca dönsün
  userArea.classList.remove("open");
  userMenu.setAttribute("aria-hidden","true");
  connectBtn?.focus();

  // Ana sayfaya dön
  location.hash = "";                  // hash'i temizle
  if (typeof handleRoute === "function") handleRoute();  // varsa router'ı hemen çalıştır

  return;
  }

  if (action === "copy") {
    navigator.clipboard.writeText(addrFull.textContent).then(() => {
      item.textContent = "Copied";
      setTimeout(() => (item.textContent = "Copy Address"), 1200);
    });
    return;
  }

  if (action === "profile")   window.location.hash = "#profile";
  if (action === "activity")  window.location.hash = "#activity";
  if (action === "settings")  window.location.hash = "#settings";
  if (action === "support")   window.location.hash = "#help-center";
});


  // // Dev mode - sayfa açılınca bağlı görün
  // if (document.body.classList.contains("dev-mode")) {
  //   setConnectedUI("0xDEV1234567890");
  // } else {
  //   setDisconnectedUI();
  // }

  // Prod varsayılanı. Sayfa açıldığında panel gizli başlasın
setDisconnectedUI();



/* === Basit router: profil aç/kapa === */
const sectionsToHide = ["hero", "trade", "rent", "history", "docs", "help-center"];
const profileView = document.getElementById("profile");

function showHome() {
  profileView?.classList.add("hidden");
  sectionsToHide.forEach(id => document.getElementById(id)?.classList.remove("hidden"));
}

function showProfile() {
  sectionsToHide.forEach(id => document.getElementById(id)?.classList.add("hidden"));
  profileView?.classList.remove("hidden");
  // cüzdan adresini header'a yaz
  const pfAddrEl = document.getElementById("pfAddr");
  if (pfAddrEl) pfAddrEl.textContent = addrFull.textContent || "0x…";
}

function handleRoute() {
  if (location.hash === "#profile") showProfile();
  else showHome();
}
window.addEventListener("hashchange", handleRoute);
handleRoute();

/* === Profile tabs === */
const pfTabs = document.getElementById("pfTabs");
const pfPanels = document.querySelectorAll(".pf-panel");

function showProfilePanel(key) {
  pfPanels.forEach(p => p.classList.toggle("hidden", p.dataset.panel !== key));
  pfTabs?.querySelectorAll(".pf-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.tab === key);
  });
  if (key === "active-games") renderActiveGames();
}

pfTabs?.addEventListener("click", (e) => {
  const btn = e.target.closest(".pf-tab");
  if (!btn) return;
  showProfilePanel(btn.dataset.tab);
});

/* === Active Games: veri ve render === */
const activeGames = [
  { id: "foundry", title: "Foundry",       image: "images/foundry.jpg", hours: 12.4, renewsIn: "12 days" },
  { id: "puffin",   title: "Puffin Raiders", image: "images/puffin.jpg",   hours: 5.1,  renewsIn: "7 days"  }
];

function renderActiveGames() {
  const grid = document.getElementById("pfGamesGrid");
  if (!grid) return;
  grid.innerHTML = activeGames.map(g => `
    <div class="game-card">
      <div class="game-thumb" style="background-image:url('${g.image}');">
        <span class="ribbon">Active</span>
        <button class="btn-play" data-id="${g.id}">Play</button>
      </div>
      <div class="game-body">
        <div class="game-title">${g.title}</div>
        <div class="game-meta">${g.hours} h played • renews in ${g.renewsIn}</div>
      </div>
    </div>
  `).join("");
}

// Play butonu demo
document.getElementById("pfGamesGrid")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-play");
  if (!btn) return;
  alert("Launching " + btn.dataset.id);
});





});

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

  // Dev mode - sayfa açılınca bağlı görün
  if (document.body.classList.contains("dev-mode")) {
    setConnectedUI("0xDEV1234567890");
  } else {
    setDisconnectedUI();
  }
});

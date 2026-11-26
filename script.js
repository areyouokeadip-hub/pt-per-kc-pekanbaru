document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");
  const currentLabel = document.getElementById("currentLabel");
  const sidebar = document.getElementById("sidebar");

  const labels = {
    beranda: "Beranda",
    produk: "Produk",
    lokasi: "Lokasi",
    simulasi: "Simulasi Kredit",
    tentang: "Tentang Kami",
    pengajuan: "Pengajuan Pinjaman"
  };

  // NAVIGASI HALAMAN
  function showPage(name) {
    pages.forEach(page => {
      page.classList.toggle(
        "active",
        page.id === `page-${name}`
      );
    });

    navButtons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === name
      );
    });

    if (currentLabel) {
      currentLabel.textContent = labels[name] || "Beranda";
    }

    if (sidebar) {
      sidebar.classList.remove("open");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // KLIK MENU
  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  // TOMBOL PINDAH HALAMAN
  document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.goto);
    });
  });

  // MENU MOBILE
  const mobileMenuBtn = document.getElementById("mobileMenu");
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // TAHUN OTOMATIS
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==================================
  // SIMULASI KREDIT PT PER
  // RUMUS: (Plafond / JW) + (15% * Plafond / 12)
  // PEMBULATAN KE ATAS
  // MINIMAL PINJAMAN RP10.000.000
  // ==================================

  const rupiah = value => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  function calculate() {
    const amountInput = document.getElementById("loanAmount");
    const monthsInput = document.getElementById("loanMonths");
    const rateInput = document.getElementById("loanRate");

    if (!amountInput || !monthsInput) return;

    const plafond = Number(amountInput.value);
    const jw = Number(monthsInput.value); // JW = Jangka Waktu (bulan)

    // BUNGA TETAP 15%
    const annualRate = 15;

    // MINIMAL PINJAMAN 10 JUTA
    if (!Number.isFinite(plafond) || plafond < 10000000) {
      alert("Maaf, jumlah pinjaman paling kecil adalah Rp10.000.000.");
      amountInput.value = 10000000;
      return;
    }

    // VALIDASI TENOR
    if (![12, 18, 24, 30, 36, 42, 48, 54, 60].includes(jw)) {
      alert("Silakan pilih jangka waktu yang tersedia.");
      return;
    }

    // KUNCI BUNGA
    if (rateInput) {
      rateInput.value = annualRate;
    }

    // PERHITUNGAN SESUAI RUMUS: (Plafond / JW) + (15% * Plafond / 12)
    const pokokBulanan = plafond / jw;
    const bungaBulanan = (0.15 * plafond) / 12;
    let monthlyPayment = pokokBulanan + bungaBulanan;

    // PEMBULATAN KE ATAS KE RIBUAN TERDEKAT
    monthlyPayment = Math.ceil(monthlyPayment / 1000) * 1000;

    // TAMPILKAN HASIL
    const monthlyRes = document.getElementById("monthlyResult");
    const principalRes = document.getElementById("principalResult");
    const tenorRes = document.getElementById("tenorResult");

    if (monthlyRes) monthlyRes.textContent = rupiah(monthlyPayment);
    if (principalRes) principalRes.textContent = rupiah(plafond);
    if (tenorRes) tenorRes.textContent = jw + " bulan";
  }

  // TOMBOL HITUNG
  const calcBtn = document.getElementById("calculate");
  if (calcBtn) {
    calcBtn.addEventListener("click", calculate);
  }

  // HASIL AWAL
  calculate();
});

// ==================================
// FUNGSI PREVIEW UPLOAD GAMBAR INTERAKTIF
// ==================================

function handleImagePreview(event, targetId) {
  const file = event.target && event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById(targetId);
    if (output) {
      output.src = reader.result;
      output.style.display = "block";
      if (output.nextElementSibling) {
        output.nextElementSibling.style.display = "none";
      }
    }
  };
  reader.readAsDataURL(file);
}

// 1. Banner Beranda
function previewHero(event) {
  handleImagePreview(event, "heroImg");
}

// 2. Banner Lokasi
function previewLokasi(event) {
  handleImagePreview(event, "lokasiImg");
}

// 3. Emblem Bulat di Halaman Tentang Kami
function previewEmblem(event) {
  handleImagePreview(event, "emblemImg");
}

// 4. Banner Atas di Halaman Tentang Kami
function previewTentangBanner(event) {
  handleImagePreview(event, "tentangBannerImg");
}

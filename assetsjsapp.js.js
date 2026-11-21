import {
  ambilDaftarBerita,
  ambilDaftarGuru,
  ambilDaftarGaleri,
  AVATAR_FALLBACK
} from "./store.js";

// Tahun otomatis & menu mobile
const tahunEl = document.getElementById("tahun");
if (tahunEl) tahunEl.textContent = String(new Date().getFullYear());

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const dibuka = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(dibuka));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Render Berita + Filter Kategori & Pencarian
const daftarBeritaEl = document.getElementById("daftarBeritaPublik");
const cariBeritaEl = document.getElementById("cariBerita");
const filterPills = document.querySelectorAll("#filterKategoriBerita .pill");

let kategoriAktif = "Semua";
let kataKunciAktif = "";

function renderBerita() {
  if (!daftarBeritaEl) return;
  const semua = ambilDaftarBerita();
  const hasil = semua.filter((item) => {
    const cocokKategori = kategoriAktif === "Semua" || item.kategori === kategoriAktif;
    const teks = `${item.judul} ${item.ringkasan} ${item.kategori}`.toLowerCase();
    const cocokCari = !kataKunciAktif || teks.includes(kataKunciAktif);
    return cocokKategori && cocokCari;
  });

  if (hasil.length === 0) {
    daftarBeritaEl.innerHTML = `<div class="card"><p class="small-note">Tidak ada berita yang sesuai dengan filter.</p></div>`;
    return;
  }

  daftarBeritaEl.innerHTML = hasil
    .map(
      (item) => `
      <article class="card news-card">
        <div class="announcement-meta">
          <span class="announcement-date">${item.tanggal}</span>
          <span class="badge">${item.kategori}</span>
        </div>
        <h3>${item.judul}</h3>
        <p>${item.ringkasan}</p>
        <a href="berita.html?slug=${encodeURIComponent(item.slug)}" class="text-link">Baca selengkapnya →</a>
      </article>
    `
    )
    .join("");
}

filterPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    filterPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    kategoriAktif = pill.dataset.kategori || "Semua";
    renderBerita();
  });
});

if (cariBeritaEl) {
  cariBeritaEl.addEventListener("input", () => {
    kataKunciAktif = cariBeritaEl.value.trim().toLowerCase();
    renderBerita();
  });
}

// Render Guru & Staf
const daftarGuruEl = document.getElementById("daftarGuruPublik");
function renderGuru() {
  if (!daftarGuruEl) return;
  const daftar = ambilDaftarGuru();
  if (daftar.length === 0) {
    daftarGuruEl.innerHTML = `<p class="small-note">Data guru dan staf belum tersedia.</p>`;
    return;
  }

  daftarGuruEl.innerHTML = daftar
    .map(
      (g) => `
      <article class="card staff-card">
        <img
          src="${g.foto || AVATAR_FALLBACK}"
          alt="Foto ${g.nama}"
          class="staff-photo"
          loading="lazy"
          onerror="this.onerror=null;this.src='${AVATAR_FALLBACK}';"
        />
        <span class="badge">${g.jabatan}</span>
        <h3>${g.nama}</h3>
        ${g.bidang ? `<p class="staff-field">${g.bidang}</p>` : ""}
        ${g.nip ? `<p class="small-note">NIP/NIY: ${g.nip}</p>` : ""}
      </article>
    `
    )
    .join("");
}

// Render Galeri Foto + Lightbox
const daftarGaleriEl = document.getElementById("daftarGaleriPublik");
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxBadge = document.getElementById("lightboxBadge");
const lightboxJudul = document.getElementById("lightboxJudul");
const lightboxDeskripsi = document.getElementById("lightboxDeskripsi");
const tutupLightbox = document.getElementById("tutupLightbox");

function bukaLightbox(item) {
  if (!lightboxModal) return;
  lightboxImg.src = item.foto;
  lightboxImg.alt = item.judul;
  lightboxBadge.textContent = item.kategori || "Galeri";
  lightboxJudul.textContent = item.judul;
  lightboxDeskripsi.textContent = [item.tanggal, item.deskripsi].filter(Boolean).join(" — ");
  lightboxModal.hidden = false;
}

if (tutupLightbox && lightboxModal) {
  tutupLightbox.addEventListener("click", () => {
    lightboxModal.hidden = true;
  });
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) lightboxModal.hidden = true;
  });
}

function renderGaleri() {
  if (!daftarGaleriEl) return;
  const daftar = ambilDaftarGaleri();
  if (daftar.length === 0) {
    daftarGaleriEl.innerHTML = `<p class="small-note">Belum ada foto di galeri sekolah.</p>`;
    return;
  }

  daftarGaleriEl.innerHTML = daftar
    .map(
      (item, idx) => `
      <figure class="card gallery-card" data-galeri-idx="${idx}">
        <img src="${item.foto}" alt="${item.judul}" class="gallery-photo" loading="lazy" />
        <figcaption class="gallery-caption">
          <div class="announcement-meta">
            <span class="badge">${item.kategori || "Kegiatan"}</span>
            ${item.tanggal ? `<span class="announcement-date">${item.tanggal}</span>` : ""}
          </div>
          <h4>${item.judul}</h4>
          ${item.deskripsi ? `<p class="small-note">${item.deskripsi}</p>` : ""}
        </figcaption>
      </figure>
    `
    )
    .join("");

  daftarGaleriEl.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      const idx = Number(card.dataset.galeriIdx);
      if (daftar[idx]) bukaLightbox(daftar[idx]);
    });
  });
}

// Form Kontak
const formKontak = document.getElementById("formKontak");
const statusKontak = document.getElementById("statusKontak");
if (formKontak && statusKontak) {
  formKontak.addEventListener("submit", (e) => {
    e.preventDefault();
    statusKontak.textContent = "Terima kasih! Pesan Anda telah tercatat di formulir lokal.";
    statusKontak.className = "form-status success";
    formKontak.reset();
  });
}

renderBerita();
renderGuru();
renderGaleri();
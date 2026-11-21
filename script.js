// KONFIGURASI PENGIRIMAN EKSTERNAL (OPSIONAL)
// 1. Formspree (Email): isi misal "https://formspree.io/f/abcdwxyz"
// 2. Google Apps Script Web App (Google Sheets): isi URL "/exec"
const KONFIG_KIRIM = {
  formspreeUrl: "",
  googleScriptUrl: ""
};

const BERITA_STORAGE_KEY = "sma_hb_berita_v1";
const KIRIMAN_STORAGE_KEY = "sma_hb_kiriman_v1";

const DATA_BERITA = [
  {
    slug: "pembukaan-ppdb-2027-2028",
    tanggal: "15 November 2026",
    kategori: "PPDB",
    ringkasan: "Informasi jalur pendaftaran, jadwal tes, dan berkas persyaratan sudah dapat disiapkan oleh calon peserta didik.",
    judul: "Pembukaan Pendaftaran Siswa Baru Tahun Ajaran 2027/2028",
    paragraf: [
      "SMA Harapan Bangsa membuka pendaftaran peserta didik baru untuk Tahun Ajaran 2027/2028 mulai bulan ini. Calon siswa dapat memilih peminatan MIPA, IPS, maupun Teknologi & Digital sesuai minat dan rencana studi lanjut.",
      "Panitia PPDB menyediakan sesi konsultasi terbuka bagi orang tua dan calon siswa setiap hari kerja pukul 08.00–14.00 WIB di ruang informasi sekolah."
    ],
    poin: [
      "Siapkan fotokopi rapor semester 1–4 SMP/MTs dan akta kelahiran.",
      "Pilih peminatan sesuai bidang akademik atau proyek kreatif yang diminati.",
      "Gunakan formulir PPDB pada halaman utama untuk pendaftaran awal."
    ]
  },
  {
    slug: "jadwal-ujian-akhir-semester-ganjil",
    tanggal: "02 November 2026",
    kategori: "Akademik",
    ringkasan: "Pelaksanaan ujian semester ganjil akan dimulai pada awal Desember 2026. Detail ruang ujian dibagikan melalui wali kelas.",
    judul: "Jadwal Ujian Akhir Semester Ganjil",
    paragraf: [
      "Ujian Akhir Semester (UAS) Ganjil akan berlangsung pada awal Desember 2026 dengan jadwal terstruktur untuk seluruh tingkat kelas X, XI, dan XII.",
      "Siswa diimbau melengkapi administrasi belajar, mengecek kisi-kisi mata pelajaran bersama guru pengampu, serta hadir 15 menit sebelum jadwal dimulai."
    ],
    poin: [
      "Nomor peserta dan pembagian ruang ujian diumumkan melalui wali kelas.",
      "Seragam sekolah rapi dan perlengkapan tulis dibawa masing-masing.",
      "Konfirmasi kendala kesehatan atau izin segera disampaikan ke wali kelas."
    ]
  },
  {
    slug: "pekan-karya-dan-pentas-seni-siswa",
    tanggal: "20 Oktober 2026",
    kategori: "Kesiswaan",
    ringkasan: "Menampilkan hasil proyek ilmiah, karya seni rupa, dan penampilan ekstrakurikuler siswa.",
    judul: "Pekan Karya & Pentas Seni Siswa",
    paragraf: [
      "Pekan Karya & Pentas Seni menjadi ajang tahunan bagi siswa untuk menampilkan inovasi sains, aplikasi sederhana, karya lukis, musik, dan tari tradisional.",
      "Kegiatan ini melibatkan seluruh ekstrakurikuler dan dibuka untuk warga sekolah serta orang tua sebagai bentuk apresiasi proses belajar sepanjang tahun."
    ],
    poin: [
      "Pameran proyek sains & teknologi di aula utama sekolah.",
      "Pertunjukan seni musik, teater, dan ekstrakurikuler olahraga.",
      "Dokumentasi lengkap dapat dilihat pada bagian Galeri Foto."
    ]
  }
];

function ambilDaftarBerita() {
  try {
    const tersimpan = JSON.parse(localStorage.getItem(BERITA_STORAGE_KEY) || "null");
    if (Array.isArray(tersimpan) && tersimpan.length > 0) {
      return tersimpan;
    }
  } catch {
    // Gunakan data bawaan jika storage gagal dibaca
  }
  return DATA_BERITA;
}

function simpanDaftarBerita(daftar) {
  localStorage.setItem(BERITA_STORAGE_KEY, JSON.stringify(daftar));
}

function resetDaftarBerita() {
  localStorage.removeItem(BERITA_STORAGE_KEY);
  return DATA_BERITA;
}

const DATA_GALERI = [
  {
    id: "g1",
    judul: "Pameran Proyek Sains & Robotika",
    kategori: "Kegiatan",
    foto: "images/kegiatan-sains.jpg",
    caption: "Siswa mempresentasikan prototipe alat dan eksperimen kelompok.",
    deskripsi: "Siswa kelas XI memamerkan hasil riset dan proyek eksperimen di hadapan guru pembimbing serta pengunjung.",
    warnaA: "#1d4ed8",
    warnaB: "#38bdf8",
    label: "PROYEK SAINS"
  },
  {
    id: "g2",
    judul: "Juara Olimpiade Sains Tingkat Kota",
    kategori: "Prestasi",
    foto: "images/prestasi-olimpiade.jpg",
    caption: "Tim siswa meraih medali pada kompetisi bidang sains dan matematika.",
    deskripsi: "Perwakilan siswa SMA Harapan Bangsa berhasil meraih juara pada ajang kompetisi sains tingkat kota setelah melalui pembinaan rutin.",
    warnaA: "#0f766e",
    warnaB: "#34d399",
    label: "PRESTASI SISWA"
  },
  {
    id: "g3",
    judul: "Laboratorium Komputer & Riset",
    kategori: "Fasilitas",
    foto: "images/fasilitas-lab.jpg",
    caption: "Ruang praktik komputer untuk pembelajaran digital dan literasi data.",
    deskripsi: "Laboratorium komputer dilengkapi perangkat pendukung untuk praktik pemrograman dasar, desain, dan riset proyek siswa.",
    warnaA: "#1e3a8a",
    warnaB: "#818cf8",
    label: "LAB KOMPUTER"
  },
  {
    id: "g4",
    judul: "Pentas Seni & Ekstrakurikuler",
    kategori: "Kegiatan",
    foto: "images/pentas-seni.jpg",
    caption: "Penampilan musik dan kreativitas siswa pada acara tahunan sekolah.",
    deskripsi: "Beragam penampilan seni pertunjukan dan kolaborasi ekstrakurikuler memeriahkan panggung kreasi siswa.",
    warnaA: "#b45309",
    warnaB: "#fbbf24",
    label: "PENTAS SENI"
  }
];

function buatFallbackSvg(item) {
  return `
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${item.judul}">
      <defs>
        <linearGradient id="grad-${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${item.warnaA}" />
          <stop offset="100%" stop-color="${item.warnaB}" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#grad-${item.id})" />
      <circle cx="340" cy="45" r="55" fill="rgba(255,255,255,0.14)" />
      <circle cx="65" cy="185" r="70" fill="rgba(255,255,255,0.12)" />
      <rect x="28" y="28" width="140" height="28" rx="14" fill="rgba(255,255,255,0.2)" />
      <text x="98" y="47" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="700">${item.label}</text>
      <text x="28" y="125" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="700">${item.judul.slice(0, 28)}</text>
      <text x="28" y="150" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="12">SMA Harapan Bangsa</text>
    </svg>
  `;
}

function buatMediaGaleri(item, isModal = false) {
  const loadingAttr = isModal ? "" : ' loading="lazy"';
  return `<img src="${item.foto}" alt="${item.judul}"${loadingAttr} />`;
}

function pasangFallbackGambar(containerEl, item) {
  const img = containerEl.querySelector("img");
  if (!img) return;
  img.addEventListener("error", () => {
    containerEl.innerHTML = buatFallbackSvg(item);
  });
}

// Render daftar berita di index.html
const wadahPengumuman = document.getElementById("daftarPengumuman");
if (wadahPengumuman) {
  wadahPengumuman.innerHTML = ambilDaftarBerita()
    .map(
      (item) => `
      <article class="announcement-item">
        <div class="announcement-meta">
          <span class="announcement-date">${item.tanggal}</span>
          <span class="badge">${item.kategori}</span>
        </div>
        <h3><a href="berita.html?slug=${encodeURIComponent(item.slug)}">${item.judul}</a></h3>
        <p>${item.ringkasan}</p>
        <a href="berita.html?slug=${encodeURIComponent(item.slug)}" class="read-more">Baca selengkapnya &rarr;</a>
      </article>
    `
    )
    .join("");
}

// Render & filter galeri foto + modal detail
const gridGaleri = document.getElementById("gridGaleri");
const modalGaleri = document.getElementById("modalGaleri");
const tutupModal = document.getElementById("tutupModal");

function bukaModalGaleri(item) {
  if (!modalGaleri) return;
  const modalVisual = document.getElementById("modalVisual");
  modalVisual.innerHTML = buatMediaGaleri(item, true);
  pasangFallbackGambar(modalVisual, item);
  document.getElementById("modalKategori").textContent = item.kategori;
  document.getElementById("modalJudul").textContent = item.judul;
  document.getElementById("modalDeskripsi").textContent = item.deskripsi;
  modalGaleri.classList.add("open");
  modalGaleri.setAttribute("aria-hidden", "false");
}

function renderGaleri(kategoriAktif = "Semua") {
  if (!gridGaleri) return;
  const hasil =
    kategoriAktif === "Semua"
      ? DATA_GALERI
      : DATA_GALERI.filter((item) => item.kategori === kategoriAktif);

  gridGaleri.innerHTML = hasil
    .map(
      (item) => `
      <article class="gallery-card" data-id="${item.id}" tabindex="0" role="button" aria-label="Lihat foto ${item.judul}">
        <div class="gallery-thumb">${buatMediaGaleri(item, false)}</div>
        <div class="gallery-info">
          <span class="badge">${item.kategori}</span>
          <h3>${item.judul}</h3>
          <p>${item.caption}</p>
        </div>
      </article>
    `
    )
    .join("");

  gridGaleri.querySelectorAll(".gallery-card").forEach((card) => {
    const item = DATA_GALERI.find((g) => g.id === card.dataset.id);
    if (!item) return;
    const thumb = card.querySelector(".gallery-thumb");
    if (thumb) pasangFallbackGambar(thumb, item);
    card.addEventListener("click", () => bukaModalGaleri(item));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        bukaModalGaleri(item);
      }
    });
  });
}

if (gridGaleri) {
  renderGaleri("Semua");

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderGaleri(btn.dataset.kategori);
    });
  });
}

if (tutupModal && modalGaleri) {
  tutupModal.addEventListener("click", () => {
    modalGaleri.classList.remove("open");
    modalGaleri.setAttribute("aria-hidden", "true");
  });

  modalGaleri.addEventListener("click", (e) => {
    if (e.target === modalGaleri) {
      modalGaleri.classList.remove("open");
      modalGaleri.setAttribute("aria-hidden", "true");
    }
  });
}

// Form PPDB & Kontak
const formPpdbKontak = document.getElementById("formPpdbKontak");
const jenisFormulir = document.getElementById("jenisFormulir");
const fieldPpdb = document.getElementById("fieldPpdb");
const statusForm = document.getElementById("statusForm");
const daftarKiriman = document.getElementById("daftarKiriman");
const btnExportCsv = document.getElementById("btnExportCsv");

function ambilKiriman() {
  try {
    return JSON.parse(localStorage.getItem(KIRIMAN_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function simpanKiriman(data) {
  localStorage.setItem(KIRIMAN_STORAGE_KEY, JSON.stringify(data));
}

function renderKiriman() {
  if (!daftarKiriman) return;
  const items = ambilKiriman();
  if (items.length === 0) {
    daftarKiriman.innerHTML = `<p class="small-note">Belum ada data pendaftar atau pesan yang tersimpan.</p>`;
    return;
  }

  daftarKiriman.innerHTML = items
    .map(
      (item) => `
      <div class="submission-item">
        <div class="submission-item-top">
          <strong>${item.nama}</strong>
          <span class="badge">${item.jenis}</span>
        </div>
        <div>${item.email} &bull; ${item.telepon}</div>
        ${
          item.jenis === "PPDB"
            ? `<div>Asal: ${item.asalSekolah} (${item.peminatan})</div>`
            : ""
        }
        ${item.pesan ? `<div>Catatan: ${item.pesan}</div>` : ""}
        <div class="announcement-date">${item.waktu}</div>
      </div>
    `
    )
    .join("");
}

async function kirimKeLayananEksternal(payload) {
  const hasil = { emailOk: false, sheetsOk: false, errors: [] };

  if (KONFIG_KIRIM.formspreeUrl) {
    try {
      const res = await fetch(KONFIG_KIRIM.formspreeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        hasil.emailOk = true;
      } else {
        hasil.errors.push("Formspree gagal merespons");
      }
    } catch {
      hasil.errors.push("Koneksi Formspree bermasalah");
    }
  }

  if (KONFIG_KIRIM.googleScriptUrl) {
    try {
      const params = new URLSearchParams(payload);
      await fetch(KONFIG_KIRIM.googleScriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: params
      });
      hasil.sheetsOk = true;
    } catch {
      hasil.errors.push("Koneksi Google Sheets bermasalah");
    }
  }

  return hasil;
}

if (jenisFormulir && fieldPpdb) {
  const perbaruiTampilanPpdb = () => {
    fieldPpdb.style.display = jenisFormulir.value === "PPDB" ? "block" : "none";
  };
  jenisFormulir.addEventListener("change", perbaruiTampilanPpdb);
  perbaruiTampilanPpdb();
}

if (formPpdbKontak) {
  renderKiriman();

  formPpdbKontak.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusForm.className = "form-status";

    const jenis = jenisFormulir.value;
    const nama = document.getElementById("namaLengkap").value.trim();
    const email = document.getElementById("email").value.trim();
    const telepon = document.getElementById("telepon").value.trim();
    const asalSekolah = document.getElementById("asalSekolah").value.trim();
    const peminatan = document.getElementById("peminatan").value;
    const pesan = document.getElementById("pesan").value.trim();

    if (!nama || !email || !telepon || (jenis === "PPDB" && !asalSekolah)) {
      statusForm.textContent = "Mohon lengkapi semua kolom wajib bertanda (*).";
      statusForm.classList.add("error");
      return;
    }

    const dataBaru = {
      id: Date.now(),
      jenis,
      nama,
      email,
      telepon,
      asalSekolah: jenis === "PPDB" ? asalSekolah : "-",
      peminatan: jenis === "PPDB" ? peminatan : "-",
      pesan,
      waktu: new Date().toLocaleString("id-ID")
    };

    const btnSubmit = formPpdbKontak.querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.disabled = true;
    statusForm.textContent = "Mengirim data...";

    const eksternal = await kirimKeLayananEksternal(dataBaru);
    if (btnSubmit) btnSubmit.disabled = false;

    const semua = [dataBaru, ...ambilKiriman()];
    simpanKiriman(semua);
    renderKiriman();
    formPpdbKontak.reset();
    if (jenisFormulir && fieldPpdb) {
      fieldPpdb.style.display = jenisFormulir.value === "PPDB" ? "block" : "none";
    }

    const tujuanTerkirim = [
      eksternal.emailOk ? "email sekolah" : "",
      eksternal.sheetsOk ? "Google Sheets" : ""
    ].filter(Boolean);

    if (tujuanTerkirim.length > 0) {
      statusForm.textContent = `Data tersimpan & terkirim ke ${tujuanTerkirim.join(" dan ")}.`;
      statusForm.classList.add("success");
    } else if (eksternal.errors.length > 0) {
      statusForm.textContent = `Tersimpan lokal, namun ${eksternal.errors.join(", ")}.`;
      statusForm.classList.add("error");
    } else {
      statusForm.textContent =
        jenis === "PPDB"
          ? "Pendaftaran PPDB awal tercatat lokal. Isi KONFIG_KIRIM di script.js untuk kirim ke email/Sheets."
          : "Pesan kontak tercatat lokal. Isi KONFIG_KIRIM di script.js untuk kirim ke email/Sheets.";
      statusForm.classList.add("success");
    }
  });
}

if (btnExportCsv) {
  btnExportCsv.addEventListener("click", () => {
    const items = ambilKiriman();
    if (items.length === 0) {
      alert("Belum ada data untuk diunduh.");
      return;
    }

    const header = ["Jenis", "Nama", "Email", "Telepon", "Asal Sekolah", "Peminatan", "Pesan", "Waktu"];
    const baris = items.map((i) =>
      [i.jenis, i.nama, i.email, i.telepon, i.asalSekolah, i.peminatan, i.pesan, i.waktu]
        .map((val) => `"${String(val || "").replace(/"/g, '""')}"`)
        .join(",")
    );

    const csvContent = "\uFEFF" + [header.join(","), ...baris].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rekap-ppdb-kontak.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
}

// Menu mobile & tahun footer
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

const tahunEl = document.getElementById("tahun");
if (tahunEl) {
  tahunEl.textContent = new Date().getFullYear();
}
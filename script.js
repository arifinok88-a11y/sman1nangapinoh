// =========================================================
// DATA BAWAAN & STORAGE GURU / STAF
// =========================================================
const GURU_STORAGE_KEY = "sma_hb_guru_v1";

const DATA_GURU_BAWAAN = [
  {
    id: "guru-1",
    nama: "Drs. Hendra Wijaya, M.Pd.",
    jabatan: "Kepala Sekolah",
    bidang: "Manajemen Pendidikan",
    nip: "197204121998021003",
    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "guru-2",
    nama: "Siti Rahmawati, S.Si., M.Sc.",
    jabatan: "Wakil Kepala Bidang Kurikulum",
    bidang: "Kimia & Riset Ilmiah",
    nip: "198409182009032007",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "guru-3",
    nama: "Budi Santoso, S.Kom.",
    jabatan: "Kepala Laboratorium & Staf IT",
    bidang: "Informatika & Sistem Sekolah",
    nip: "199002112015041002",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
  }
];

function ambilDaftarGuru() {
  try {
    const tersimpan = JSON.parse(localStorage.getItem(GURU_STORAGE_KEY) || "null");
    if (Array.isArray(tersimpan)) {
      return tersimpan;
    }
  } catch {
    // Abaikan error dan gunakan data bawaan
  }
  return DATA_GURU_BAWAAN;
}

function simpanDaftarGuru(daftar) {
  localStorage.setItem(GURU_STORAGE_KEY, JSON.stringify(daftar));
}

function resetDaftarGuru() {
  localStorage.removeItem(GURU_STORAGE_KEY);
  return DATA_GURU_BAWAAN;
}

// =========================================================
// DATA BAWAAN & STORAGE GALERI FOTO SEKOLAH
// =========================================================
const GALERI_STORAGE_KEY = "sma_hb_galeri_v1";

const DATA_GALERI_BAWAAN = [
  {
    id: "galeri-1",
    judul: "Praktikum Kimia Terpadu",
    kategori: "Akademik",
    tanggal: "14 Oktober 2026",
    deskripsi: "Siswa kelas XI melakukan uji titrasi di laboratorium sains sekolah.",
    foto: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "galeri-2",
    judul: "Upacara Bendera & Penghargaan Prestasi",
    kategori: "Kesiswaan",
    tanggal: "02 November 2026",
    deskripsi: "Penyerahan piala olimpiade sains tingkat provinsi kepada tim siswa.",
    foto: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "galeri-3",
    judul: "Perpustakaan & Ruang Baca Digital",
    kategori: "Fasilitas",
    tanggal: "10 November 2026",
    deskripsi: "Suasana diskusi kelompok dan akses literasi digital siswa.",
    foto: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
  }
];

function ambilDaftarGaleri() {
  try {
    const tersimpan = JSON.parse(localStorage.getItem(GALERI_STORAGE_KEY) || "null");
    if (Array.isArray(tersimpan)) {
      return tersimpan;
    }
  } catch {
    // Abaikan error dan gunakan data bawaan
  }
  return DATA_GALERI_BAWAAN;
}

function simpanDaftarGaleri(daftar) {
  localStorage.setItem(GALERI_STORAGE_KEY, JSON.stringify(daftar));
}

function resetDaftarGaleri() {
  localStorage.removeItem(GALERI_STORAGE_KEY);
  return DATA_GALERI_BAWAAN;
}

// =========================================================
// RENDER OTOMATIS KE HALAMAN PUBLIK (index.html)
// =========================================================
function renderGuruPublik() {
  const wadah = document.getElementById("daftarGuruPublik");
  if (!wadah) return;

  const daftar = ambilDaftarGuru();
  if (daftar.length === 0) {
    wadah.innerHTML = `<p class="small-note">Data guru dan staf belum tersedia.</p>`;
    return;
  }

  const fallbackFoto =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#e2e8f0"/><circle cx="150" cy="115" r="52" fill="#94a3b8"/><path d="M55 270c12-55 55-82 95-82s83 27 95 82" fill="#94a3b8"/></svg>`
    );

  wadah.innerHTML = daftar
    .map(
      (g) => `
      <article class="card staff-card">
        <img
          src="${g.foto || fallbackFoto}"
          alt="Foto ${g.nama}"
          class="staff-photo"
          onerror="this.onerror=null;this.src='${fallbackFoto}';"
        />
        <div class="staff-info">
          <span class="badge">${g.jabatan}</span>
          <h3>${g.nama}</h3>
          ${g.bidang ? `<p class="staff-field">${g.bidang}</p>` : ""}
          ${g.nip ? `<p class="small-note">NIP/NIY: ${g.nip}</p>` : ""}
        </div>
      </article>
    `
    )
    .join("");
}

function renderGaleriPublik() {
  const wadah = document.getElementById("daftarGaleriPublik");
  if (!wadah) return;

  const daftar = ambilDaftarGaleri();
  if (daftar.length === 0) {
    wadah.innerHTML = `<p class="small-note">Belum ada foto di galeri sekolah.</p>`;
    return;
  }

  wadah.innerHTML = daftar
    .map(
      (item) => `
      <figure class="card gallery-card">
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
}

document.addEventListener("DOMContentLoaded", () => {
  renderGuruPublik();
  renderGaleriPublik();
});

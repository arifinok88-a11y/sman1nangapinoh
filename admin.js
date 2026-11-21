const KODE_AKSES_ADMIN = "SEKOLAH2026";
const SESI_ADMIN_KEY = "sma_hb_admin_terbuka";

const panelLoginAdmin = document.getElementById("panelLoginAdmin");
const formLoginAdmin = document.getElementById("formLoginAdmin");
const inputKodeAdmin = document.getElementById("inputKodeAdmin");
const statusLoginAdmin = document.getElementById("statusLoginAdmin");
const workspaceAdmin = document.getElementById("workspaceAdmin");
const btnKunciAdmin = document.getElementById("btnKunciAdmin");
const btnExportSemua = document.getElementById("btnExportSemua");

// =========================================================
// UTILITAS KOMPRESI FOTO (AGAR HEMAT MEMORI LOCALSTORAGE)
// =========================================================
function kompresGambarKeDataURL(file, maksLebar = 720, kualitas = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const skala = Math.min(1, maksLebar / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * skala);
        canvas.height = Math.round(img.height * skala);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", kualitas));
      };
      img.onerror = () => reject(new Error("File gambar tidak valid."));
      img.src = ev.target.result;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}

function perbaruiStatusKunci() {
  const terbuka = sessionStorage.getItem(SESI_ADMIN_KEY) === "1";
  if (panelLoginAdmin) panelLoginAdmin.hidden = terbuka;
  if (workspaceAdmin) workspaceAdmin.hidden = !terbuka;
}

// =========================================================
// NAVIGASI TAB PANEL ADMIN
// =========================================================
document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.tab;
    document.querySelectorAll(".admin-tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".admin-tab-panel").forEach((panel) => {
      panel.hidden = panel.id !== targetId;
      panel.classList.toggle("active", panel.id === targetId);
    });
    btn.classList.add("active");
  });
});

// =========================================================
// 1. MODUL BERITA & PENGUMUMAN
// =========================================================
const formBeritaAdmin = document.getElementById("formBeritaAdmin");
const judulFormBerita = document.getElementById("judulFormBerita");
const judulBerita = document.getElementById("judulBerita");
const kategoriBerita = document.getElementById("kategoriBerita");
const tanggalBerita = document.getElementById("tanggalBerita");
const slugBerita = document.getElementById("slugBerita");
const ringkasanBerita = document.getElementById("ringkasanBerita");
const isiBerita = document.getElementById("isiBerita");
const poinBerita = document.getElementById("poinBerita");
const btnSimpanBerita = document.getElementById("btnSimpanBerita");
const btnBatalEdit = document.getElementById("btnBatalEdit");
const statusAdmin = document.getElementById("statusAdmin");
const daftarBeritaAdmin = document.getElementById("daftarBeritaAdmin");
const jumlahBeritaEl = document.getElementById("jumlahBerita");
const btnResetBerita = document.getElementById("btnResetBerita");

let indexSedangDiedit = null;

function buatSlug(teks) {
  return (
    teks
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || `berita-${Date.now()}`
  );
}

function setStatusAdmin(pesan, tipe = "") {
  if (!statusAdmin) return;
  statusAdmin.textContent = pesan;
  statusAdmin.className = tipe ? `form-status ${tipe}` : "form-status";
}

function bersihkanFormBerita() {
  indexSedangDiedit = null;
  formBeritaAdmin.reset();
  if (tanggalBerita) {
    tanggalBerita.value = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }
  judulFormBerita.textContent = "Tambah Berita Baru";
  btnSimpanBerita.textContent = "Simpan Berita";
  btnBatalEdit.hidden = true;
}

function isiFormUntukEdit(idx) {
  const item = ambilDaftarBerita()[idx];
  if (!item) return;

  indexSedangDiedit = idx;
  judulBerita.value = item.judul;
  kategoriBerita.value = item.kategori || "Umum";
  tanggalBerita.value = item.tanggal;
  slugBerita.value = item.slug;
  ringkasanBerita.value = item.ringkasan;
  isiBerita.value = (item.paragraf || []).join("\n\n");
  poinBerita.value = (item.poin || []).join("\n");

  judulFormBerita.textContent = "Edit Berita";
  btnSimpanBerita.textContent = "Perbarui Berita";
  btnBatalEdit.hidden = false;
  setStatusAdmin(`Sedang mengedit: "${item.judul}"`);
  formBeritaAdmin.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDaftarAdmin() {
  if (!daftarBeritaAdmin || typeof ambilDaftarBerita !== "function") return;
  const daftar = ambilDaftarBerita();
  if (jumlahBeritaEl) jumlahBeritaEl.textContent = String(daftar.length);

  if (daftar.length === 0) {
    daftarBeritaAdmin.innerHTML = `<p class="small-note">Belum ada berita aktif.</p>`;
    return;
  }

  daftarBeritaAdmin.innerHTML = daftar
    .map(
      (item, idx) => `
      <div class="admin-item">
        <div class="announcement-meta">
          <span class="announcement-date">${item.tanggal}</span>
          <span class="badge">${item.kategori}</span>
        </div>
        <h4 class="admin-item-title">${item.judul}</h4>
        <p class="small-note">${item.ringkasan}</p>
        <div class="admin-item-actions">
          <a href="berita.html?slug=${encodeURIComponent(item.slug)}" class="btn-small" target="_blank" rel="noopener">Lihat</a>
          <button type="button" class="btn-small" data-aksi="edit-berita" data-idx="${idx}">Edit</button>
          <button type="button" class="btn-small btn-danger" data-aksi="hapus-berita" data-idx="${idx}">Hapus</button>
        </div>
      </div>
    `
    )
    .join("");

  daftarBeritaAdmin.querySelectorAll("button[data-aksi]").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    btn.addEventListener("click", () => {
      if (btn.dataset.aksi === "edit-berita") {
        isiFormUntukEdit(idx);
      } else {
        const daftarSaatIni = ambilDaftarBerita();
        const target = daftarSaatIni[idx];
        if (!target || !confirm(`Hapus berita "${target.judul}"?`)) return;
        simpanDaftarBerita(daftarSaatIni.filter((_, i) => i !== idx));
        if (indexSedangDiedit === idx) bersihkanFormBerita();
        renderDaftarAdmin();
        setStatusAdmin(`Berita "${target.judul}" dihapus.`, "success");
      }
    });
  });
}

if (formBeritaAdmin) {
  formBeritaAdmin.addEventListener("submit", (e) => {
    e.preventDefault();
    const judul = judulBerita.value.trim();
    const kategori = kategoriBerita.value;
    const tanggal = tanggalBerita.value.trim();
    const ringkasan = ringkasanBerita.value.trim();
    const paragraf = isiBerita.value
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const poin = poinBerita.value
      .split("\n")
      .map((pt) => pt.trim())
      .filter(Boolean);

    if (!judul || !tanggal || !ringkasan || paragraf.length === 0) {
      setStatusAdmin("Mohon lengkapi judul, tanggal, ringkasan, dan isi berita.", "error");
      return;
    }

    const daftar = [...ambilDaftarBerita()];
    let slugFinal = buatSlug(slugBerita.value || judul);
    if (daftar.some((item, i) => item.slug === slugFinal && i !== indexSedangDiedit)) {
      slugFinal = `${slugFinal}-${Date.now().toString().slice(-4)}`;
    }

    const beritaBaru = { slug: slugFinal, tanggal, kategori, ringkasan, judul, paragraf, poin };
    if (indexSedangDiedit !== null && daftar[indexSedangDiedit]) {
      daftar[indexSedangDiedit] = beritaBaru;
      setStatusAdmin(`Berita "${judul}" berhasil diperbarui.`, "success");
    } else {
      daftar.unshift(beritaBaru);
      setStatusAdmin(`Berita "${judul}" berhasil ditambahkan.`, "success");
    }

    simpanDaftarBerita(daftar);
    renderDaftarAdmin();
    bersihkanFormBerita();
  });
}

if (btnBatalEdit) {
  btnBatalEdit.addEventListener("click", () => {
    bersihkanFormBerita();
    setStatusAdmin("Mode edit dibatalkan.");
  });
}

if (btnResetBerita) {
  btnResetBerita.addEventListener("click", () => {
    if (!confirm("Kembalikan daftar berita ke data bawaan?")) return;
    resetDaftarBerita();
    bersihkanFormBerita();
    renderDaftarAdmin();
    setStatusAdmin("Daftar berita dikembalikan ke data bawaan.", "success");
  });
}

// =========================================================
// 2. MODUL IDENTITAS GURU & STAF + FOTO
// =========================================================
const formGuruAdmin = document.getElementById("formGuruAdmin");
const judulFormGuru = document.getElementById("judulFormGuru");
const namaGuru = document.getElementById("namaGuru");
const jabatanGuru = document.getElementById("jabatanGuru");
const bidangGuru = document.getElementById("bidangGuru");
const nipGuru = document.getElementById("nipGuru");
const fileFotoGuru = document.getElementById("fileFotoGuru");
const urlFotoGuru = document.getElementById("urlFotoGuru");
const previewFotoGuru = document.getElementById("previewFotoGuru");
const teksPreviewGuru = document.getElementById("teksPreviewGuru");
const btnSimpanGuru = document.getElementById("btnSimpanGuru");
const btnBatalEditGuru = document.getElementById("btnBatalEditGuru");
const statusGuruAdmin = document.getElementById("statusGuruAdmin");
const daftarGuruAdmin = document.getElementById("daftarGuruAdmin");
const jumlahGuruEl = document.getElementById("jumlahGuru");
const btnResetGuru = document.getElementById("btnResetGuru");

let indexGuruDiedit = null;
let fotoGuruAktif = "";

function setStatusGuru(pesan, tipe = "") {
  if (!statusGuruAdmin) return;
  statusGuruAdmin.textContent = pesan;
  statusGuruAdmin.className = tipe ? `form-status ${tipe}` : "form-status";
}

function perbaruiPratinjauGuru(src) {
  fotoGuruAktif = src || "";
  if (fotoGuruAktif) {
    previewFotoGuru.src = fotoGuruAktif;
    previewFotoGuru.hidden = false;
    teksPreviewGuru.textContent = "Pratinjau foto siap disimpan.";
  } else {
    previewFotoGuru.hidden = true;
    previewFotoGuru.removeAttribute("src");
    teksPreviewGuru.textContent = "Belum ada foto dipilih (akan memakai avatar bawaan jika kosong).";
  }
}

function bersihkanFormGuru() {
  indexGuruDiedit = null;
  formGuruAdmin.reset();
  perbaruiPratinjauGuru("");
  judulFormGuru.textContent = "Tambah Identitas Guru / Staf";
  btnSimpanGuru.textContent = "Simpan Data Guru";
  btnBatalEditGuru.hidden = true;
}

function isiFormEditGuru(idx) {
  const item = ambilDaftarGuru()[idx];
  if (!item) return;

  indexGuruDiedit = idx;
  namaGuru.value = item.nama || "";
  jabatanGuru.value = item.jabatan || "";
  bidangGuru.value = item.bidang || "";
  nipGuru.value = item.nip || "";
  urlFotoGuru.value = item.foto && !item.foto.startsWith("data:") ? item.foto : "";
  perbaruiPratinjauGuru(item.foto || "");

  judulFormGuru.textContent = "Edit Identitas Guru / Staf";
  btnSimpanGuru.textContent = "Perbarui Data Guru";
  btnBatalEditGuru.hidden = false;
  setStatusGuru(`Sedang mengedit: "${item.nama}"`);
  formGuruAdmin.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDaftarGuruAdmin() {
  if (!daftarGuruAdmin || typeof ambilDaftarGuru !== "function") return;
  const daftar = ambilDaftarGuru();
  if (jumlahGuruEl) jumlahGuruEl.textContent = String(daftar.length);

  if (daftar.length === 0) {
    daftarGuruAdmin.innerHTML = `<p class="small-note">Belum ada data guru atau staf.</p>`;
    return;
  }

  daftarGuruAdmin.innerHTML = daftar
    .map(
      (g, idx) => `
      <div class="admin-item admin-item-media">
        ${
          g.foto
            ? `<img src="${g.foto}" alt="${g.nama}" class="admin-thumb-avatar" />`
            : `<div class="admin-thumb-avatar admin-thumb-placeholder">👤</div>`
        }
        <div class="admin-item-body">
          <span class="badge">${g.jabatan}</span>
          <h4 class="admin-item-title">${g.nama}</h4>
          <p class="small-note">${[g.bidang, g.nip ? `NIP: ${g.nip}` : ""].filter(Boolean).join(" • ")}</p>
          <div class="admin-item-actions">
            <button type="button" class="btn-small" data-aksi="edit-guru" data-idx="${idx}">Edit</button>
            <button type="button" class="btn-small btn-danger" data-aksi="hapus-guru" data-idx="${idx}">Hapus</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  daftarGuruAdmin.querySelectorAll("button[data-aksi]").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    btn.addEventListener("click", () => {
      if (btn.dataset.aksi === "edit-guru") {
        isiFormEditGuru(idx);
      } else {
        const daftarSaatIni = ambilDaftarGuru();
        const target = daftarSaatIni[idx];
        if (!target || !confirm(`Hapus data "${target.nama}"?`)) return;
        simpanDaftarGuru(daftarSaatIni.filter((_, i) => i !== idx));
        if (indexGuruDiedit === idx) bersihkanFormGuru();
        renderDaftarGuruAdmin();
        setStatusGuru(`Data "${target.nama}" dihapus.`, "success");
      }
    });
  });
}

if (fileFotoGuru) {
  fileFotoGuru.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const hasil = await kompresGambarKeDataURL(file, 500, 0.82);
      urlFotoGuru.value = "";
      perbaruiPratinjauGuru(hasil);
      setStatusGuru("Foto berhasil dimuat dan siap disimpan.");
    } catch (err) {
      setStatusGuru(err.message, "error");
    }
  });
}

if (urlFotoGuru) {
  urlFotoGuru.addEventListener("input", () => {
    const val = urlFotoGuru.value.trim();
    if (val) {
      fileFotoGuru.value = "";
      perbaruiPratinjauGuru(val);
    } else if (!fileFotoGuru.files.length) {
      perbaruiPratinjauGuru("");
    }
  });
}

if (formGuruAdmin) {
  formGuruAdmin.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = namaGuru.value.trim();
    const jabatan = jabatanGuru.value.trim();
    const bidang = bidangGuru.value.trim();
    const nip = nipGuru.value.trim();

    if (!nama || !jabatan) {
      setStatusGuru("Nama lengkap dan jabatan wajib diisi.", "error");
      return;
    }

    const daftar = [...ambilDaftarGuru()];
    const dataBaru = {
      id: indexGuruDiedit !== null && daftar[indexGuruDiedit] ? daftar[indexGuruDiedit].id : `guru-${Date.now()}`,
      nama,
      jabatan,
      bidang,
      nip,
      foto: fotoGuruAktif
    };

    try {
      if (indexGuruDiedit !== null && daftar[indexGuruDiedit]) {
        daftar[indexGuruDiedit] = dataBaru;
        simpanDaftarGuru(daftar);
        setStatusGuru(`Data "${nama}" berhasil diperbarui.`, "success");
      } else {
        daftar.push(dataBaru);
        simpanDaftarGuru(daftar);
        setStatusGuru(`Data "${nama}" berhasil ditambahkan.`, "success");
      }
      renderDaftarGuruAdmin();
      bersihkanFormGuru();
    } catch {
      setStatusGuru("Gagal menyimpan: ukuran penyimpanan browser penuh. Gunakan foto lebih kecil atau URL gambar.", "error");
    }
  });
}

if (btnBatalEditGuru) {
  btnBatalEditGuru.addEventListener("click", () => {
    bersihkanFormGuru();
    setStatusGuru("Mode edit guru dibatalkan.");
  });
}

if (btnResetGuru) {
  btnResetGuru.addEventListener("click", () => {
    if (!confirm("Kembalikan daftar guru & staf ke data bawaan?")) return;
    resetDaftarGuru();
    bersihkanFormGuru();
    renderDaftarGuruAdmin();
    setStatusGuru("Data guru & staf dikembalikan ke bawaan.", "success");
  });
}

// =========================================================
// 3. MODUL GALERI FOTO SEKOLAH
// =========================================================
const formGaleriAdmin = document.getElementById("formGaleriAdmin");
const judulFormGaleri = document.getElementById("judulFormGaleri");
const judulGaleri = document.getElementById("judulGaleri");
const kategoriGaleri = document.getElementById("kategoriGaleri");
const tanggalGaleri = document.getElementById("tanggalGaleri");
const deskripsiGaleri = document.getElementById("deskripsiGaleri");
const fileFotoGaleri = document.getElementById("fileFotoGaleri");
const urlFotoGaleri = document.getElementById("urlFotoGaleri");
const previewFotoGaleri = document.getElementById("previewFotoGaleri");
const teksPreviewGaleri = document.getElementById("teksPreviewGaleri");
const btnSimpanGaleri = document.getElementById("btnSimpanGaleri");
const btnBatalEditGaleri = document.getElementById("btnBatalEditGaleri");
const statusGaleriAdmin = document.getElementById("statusGaleriAdmin");
const daftarGaleriAdmin = document.getElementById("daftarGaleriAdmin");
const jumlahGaleriEl = document.getElementById("jumlahGaleri");
const btnResetGaleri = document.getElementById("btnResetGaleri");

let indexGaleriDiedit = null;
let fotoGaleriAktif = "";

function setStatusGaleri(pesan, tipe = "") {
  if (!statusGaleriAdmin) return;
  statusGaleriAdmin.textContent = pesan;
  statusGaleriAdmin.className = tipe ? `form-status ${tipe}` : "form-status";
}

function perbaruiPratinjauGaleri(src) {
  fotoGaleriAktif = src || "";
  if (fotoGaleriAktif) {
    previewFotoGaleri.src = fotoGaleriAktif;
    previewFotoGaleri.hidden = false;
    teksPreviewGaleri.textContent = "Pratinjau foto galeri siap disimpan.";
  } else {
    previewFotoGaleri.hidden = true;
    previewFotoGaleri.removeAttribute("src");
    teksPreviewGaleri.textContent = "Pratinjau foto galeri akan muncul di sini.";
  }
}

function bersihkanFormGaleri() {
  indexGaleriDiedit = null;
  formGaleriAdmin.reset();
  if (tanggalGaleri) {
    tanggalGaleri.value = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }
  perbaruiPratinjauGaleri("");
  judulFormGaleri.textContent = "Tambah Foto ke Galeri";
  btnSimpanGaleri.textContent = "Simpan ke Galeri";
  btnBatalEditGaleri.hidden = true;
}

function isiFormEditGaleri(idx) {
  const item = ambilDaftarGaleri()[idx];
  if (!item) return;

  indexGaleriDiedit = idx;
  judulGaleri.value = item.judul || "";
  kategoriGaleri.value = item.kategori || "Kegiatan Sekolah";
  tanggalGaleri.value = item.tanggal || "";
  deskripsiGaleri.value = item.deskripsi || "";
  urlFotoGaleri.value = item.foto && !item.foto.startsWith("data:") ? item.foto : "";
  perbaruiPratinjauGaleri(item.foto || "");

  judulFormGaleri.textContent = "Edit Foto Galeri";
  btnSimpanGaleri.textContent = "Perbarui Foto Galeri";
  btnBatalEditGaleri.hidden = false;
  setStatusGaleri(`Sedang mengedit foto: "${item.judul}"`);
  formGaleriAdmin.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDaftarGaleriAdmin() {
  if (!daftarGaleriAdmin || typeof ambilDaftarGaleri !== "function") return;
  const daftar = ambilDaftarGaleri();
  if (jumlahGaleriEl) jumlahGaleriEl.textContent = String(daftar.length);

  if (daftar.length === 0) {
    daftarGaleriAdmin.innerHTML = `<p class="small-note">Belum ada foto di galeri.</p>`;
    return;
  }

  daftarGaleriAdmin.innerHTML = daftar
    .map(
      (item, idx) => `
      <div class="admin-item admin-item-media">
        <img src="${item.foto}" alt="${item.judul}" class="admin-thumb-gallery" />
        <div class="admin-item-body">
          <div class="announcement-meta">
            <span class="badge">${item.kategori}</span>
            ${item.tanggal ? `<span class="announcement-date">${item.tanggal}</span>` : ""}
          </div>
          <h4 class="admin-item-title">${item.judul}</h4>
          ${item.deskripsi ? `<p class="small-note">${item.deskripsi}</p>` : ""}
          <div class="admin-item-actions">
            <button type="button" class="btn-small" data-aksi="edit-galeri" data-idx="${idx}">Edit</button>
            <button type="button" class="btn-small btn-danger" data-aksi="hapus-galeri" data-idx="${idx}">Hapus</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  daftarGaleriAdmin.querySelectorAll("button[data-aksi]").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    btn.addEventListener("click", () => {
      if (btn.dataset.aksi === "edit-galeri") {
        isiFormEditGaleri(idx);
      } else {
        const daftarSaatIni = ambilDaftarGaleri();
        const target = daftarSaatIni[idx];
        if (!target || !confirm(`Hapus foto "${target.judul}" dari galeri?`)) return;
        simpanDaftarGaleri(daftarSaatIni.filter((_, i) => i !== idx));
        if (indexGaleriDiedit === idx) bersihkanFormGaleri();
        renderDaftarGaleriAdmin();
        setStatusGaleri(`Foto "${target.judul}" dihapus dari galeri.`, "success");
      }
    });
  });
}

if (fileFotoGaleri) {
  fileFotoGaleri.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const hasil = await kompresGambarKeDataURL(file, 960, 0.8);
      urlFotoGaleri.value = "";
      perbaruiPratinjauGaleri(hasil);
      setStatusGaleri("Foto galeri berhasil dimuat.");
    } catch (err) {
      setStatusGaleri(err.message, "error");
    }
  });
}

if (urlFotoGaleri) {
  urlFotoGaleri.addEventListener("input", () => {
    const val = urlFotoGaleri.value.trim();
    if (val) {
      fileFotoGaleri.value = "";
      perbaruiPratinjauGaleri(val);
    } else if (!fileFotoGaleri.files.length) {
      perbaruiPratinjauGaleri("");
    }
  });
}

if (formGaleriAdmin) {
  formGaleriAdmin.addEventListener("submit", (e) => {
    e.preventDefault();
    const judul = judulGaleri.value.trim();
    const kategori = kategoriGaleri.value;
    const tanggal = tanggalGaleri.value.trim();
    const deskripsi = deskripsiGaleri.value.trim();

    if (!judul || !fotoGaleriAktif) {
      setStatusGaleri("Judul foto dan sumber gambar (unggah file atau URL) wajib diisi.", "error");
      return;
    }

    const daftar = [...ambilDaftarGaleri()];
    const itemBaru = {
      id: indexGaleriDiedit !== null && daftar[indexGaleriDiedit] ? daftar[indexGaleriDiedit].id : `galeri-${Date.now()}`,
      judul,
      kategori,
      tanggal,
      deskripsi,
      foto: fotoGaleriAktif
    };

    try {
      if (indexGaleriDiedit !== null && daftar[indexGaleriDiedit]) {
        daftar[indexGaleriDiedit] = itemBaru;
        simpanDaftarGaleri(daftar);
        setStatusGaleri(`Foto "${judul}" berhasil diperbarui.`, "success");
      } else {
        daftar.unshift(itemBaru);
        simpanDaftarGaleri(daftar);
        setStatusGaleri(`Foto "${judul}" berhasil ditambahkan ke galeri.`, "success");
      }
      renderDaftarGaleriAdmin();
      bersihkanFormGaleri();
    } catch {
      setStatusGaleri("Gagal menyimpan: ukuran penyimpanan browser penuh. Gunakan foto lebih kecil atau URL gambar.", "error");
    }
  });
}

if (btnBatalEditGaleri) {
  btnBatalEditGaleri.addEventListener("click", () => {
    bersihkanFormGaleri();
    setStatusGaleri("Mode edit galeri dibatalkan.");
  });
}

if (btnResetGaleri) {
  btnResetGaleri.addEventListener("click", () => {
    if (!confirm("Kembalikan galeri foto ke data bawaan?")) return;
    resetDaftarGaleri();
    bersihkanFormGaleri();
    renderDaftarGaleriAdmin();
    setStatusGaleri("Galeri foto dikembalikan ke data bawaan.", "success");
  });
}

// =========================================================
// LOGIN, KUNCI SESI & EKSPOR CADANGAN SEMUA DATA
// =========================================================
function inisialisasiSemuaPanelAdmin() {
  renderDaftarAdmin();
  bersihkanFormBerita();
  renderDaftarGuruAdmin();
  bersihkanFormGuru();
  renderDaftarGaleriAdmin();
  bersihkanFormGaleri();
}

if (formLoginAdmin) {
  formLoginAdmin.addEventListener("submit", (e) => {
    e.preventDefault();
    const kode = (inputKodeAdmin.value || "").trim();
    if (kode === KODE_AKSES_ADMIN) {
      sessionStorage.setItem(SESI_ADMIN_KEY, "1");
      statusLoginAdmin.textContent = "";
      inputKodeAdmin.value = "";
      perbaruiStatusKunci();
      inisialisasiSemuaPanelAdmin();
    } else {
      statusLoginAdmin.textContent = "Kode akses salah.";
      statusLoginAdmin.className = "form-status error";
    }
  });
}

if (btnKunciAdmin) {
  btnKunciAdmin.addEventListener("click", () => {
    sessionStorage.removeItem(SESI_ADMIN_KEY);
    perbaruiStatusKunci();
  });
}

if (btnExportSemua) {
  btnExportSemua.addEventListener("click", () => {
    const paketCadangan = {
      dieksportPada: new Date().toISOString(),
      berita: ambilDaftarBerita(),
      guruDanStaf: ambilDaftarGuru(),
      galeriFoto: ambilDaftarGaleri()
    };
    const jsonStr = JSON.stringify(paketCadangan, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cadangan-konten-sekolah.json";
    link.click();
    URL.revokeObjectURL(url);
  });
}

perbaruiStatusKunci();
if (sessionStorage.getItem(SESI_ADMIN_KEY) === "1") {
  inisialisasiSemuaPanelAdmin();
}

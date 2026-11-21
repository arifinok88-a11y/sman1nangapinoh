import {
  KEYS,
  ambilDaftarBerita,
  simpanDaftarBerita,
  resetDaftarBerita,
  ambilDaftarGuru,
  simpanDaftarGuru,
  resetDaftarGuru,
  ambilDaftarGaleri,
  simpanDaftarGaleri,
  resetDaftarGaleri,
  kompresGambarKeDataURL,
  AVATAR_FALLBACK
} from "./store.js";

const KODE_AKSES_ADMIN = "SEKOLAH2026";

const tahunEl = document.getElementById("tahun");
if (tahunEl) tahunEl.textContent = String(new Date().getFullYear());

const panelLogin = document.getElementById("panelLoginAdmin");
const formLogin = document.getElementById("formLoginAdmin");
const inputKode = document.getElementById("inputKodeAdmin");
const statusLogin = document.getElementById("statusLoginAdmin");
const workspace = document.getElementById("workspaceAdmin");
const btnKunci = document.getElementById("btnKunciAdmin");
const btnExportJson = document.getElementById("btnExportJson");

function perbaruiKunci() {
  const terbuka = sessionStorage.getItem(KEYS.ADMIN_SESSION) === "1";
  if (panelLogin) panelLogin.hidden = terbuka;
  if (workspace) workspace.hidden = !terbuka;
}

// Tab switching
document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    document.querySelectorAll(".admin-tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".admin-tab-panel").forEach((p) => {
      p.hidden = p.id !== target;
      p.classList.toggle("active", p.id === target);
    });
    btn.classList.add("active");
  });
});

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

function tanggalHariIni() {
  return new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

// --- BERITA ---
let idxBeritaEdit = null;
const formBerita = document.getElementById("formBeritaAdmin");
const statusBerita = document.getElementById("statusBeritaAdmin");

function setStatus(el, msg, tipe = "") {
  if (!el) return;
  el.textContent = msg;
  el.className = tipe ? `form-status ${tipe}` : "form-status";
}

function resetFormBerita() {
  idxBeritaEdit = null;
  formBerita.reset();
  document.getElementById("tanggalBerita").value = tanggalHariIni();
  document.getElementById("judulFormBerita").textContent = "Tambah Berita Baru";
  document.getElementById("btnSimpanBerita").textContent = "Simpan Berita";
  document.getElementById("btnBatalEditBerita").hidden = true;
}

function renderAdminBerita() {
  const daftar = ambilDaftarBerita();
  document.getElementById("jumlahBerita").textContent = String(daftar.length);
  const wadah = document.getElementById("daftarBeritaAdmin");
  wadah.innerHTML = daftar
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
          <button type="button" class="btn-small" data-act="edit-b" data-idx="${idx}">Edit</button>
          <button type="button" class="btn-small btn-danger" data-act="del-b" data-idx="${idx}">Hapus</button>
        </div>
      </div>
    `
    )
    .join("");

  wadah.querySelectorAll("button").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    btn.addEventListener("click", () => {
      if (btn.dataset.act === "edit-b") {
        const item = ambilDaftarBerita()[idx];
        if (!item) return;
        idxBeritaEdit = idx;
        document.getElementById("judulBerita").value = item.judul;
        document.getElementById("kategoriBerita").value = item.kategori;
        document.getElementById("tanggalBerita").value = item.tanggal;
        document.getElementById("slugBerita").value = item.slug;
        document.getElementById("ringkasanBerita").value = item.ringkasan;
        document.getElementById("isiBerita").value = (item.paragraf || []).join("\n\n");
        document.getElementById("poinBerita").value = (item.poin || []).join("\n");
        document.getElementById("judulFormBerita").textContent = "Edit Berita";
        document.getElementById("btnSimpanBerita").textContent = "Perbarui Berita";
        document.getElementById("btnBatalEditBerita").hidden = false;
      } else {
        const list = ambilDaftarBerita();
        if (!list[idx] || !confirm(`Hapus berita "${list[idx].judul}"?`)) return;
        simpanDaftarBerita(list.filter((_, i) => i !== idx));
        renderAdminBerita();
        setStatus(statusBerita, "Berita dihapus.", "success");
      }
    });
  });
}

formBerita.addEventListener("submit", (e) => {
  e.preventDefault();
  const judul = document.getElementById("judulBerita").value.trim();
  const kategori = document.getElementById("kategoriBerita").value;
  const tanggal = document.getElementById("tanggalBerita").value.trim();
  const slugRaw = document.getElementById("slugBerita").value.trim();
  const ringkasan = document.getElementById("ringkasanBerita").value.trim();
  const paragraf = document.getElementById("isiBerita").value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const poin = document.getElementById("poinBerita").value.split("\n").map((p) => p.trim()).filter(Boolean);

  if (!judul || !tanggal || !ringkasan || !paragraf.length) {
    setStatus(statusBerita, "Lengkapi semua kolom wajib.", "error");
    return;
  }

  const daftar = [...ambilDaftarBerita()];
  let slug = buatSlug(slugRaw || judul);
  if (daftar.some((d, i) => d.slug === slug && i !== idxBeritaEdit)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const obj = { slug, tanggal, kategori, ringkasan, judul, paragraf, poin };
  if (idxBeritaEdit !== null && daftar[idxBeritaEdit]) {
    daftar[idxBeritaEdit] = obj;
    setStatus(statusBerita, "Berita diperbarui.", "success");
  } else {
    daftar.unshift(obj);
    setStatus(statusBerita, "Berita ditambahkan.", "success");
  }
  simpanDaftarBerita(daftar);
  renderAdminBerita();
  resetFormBerita();
});

document.getElementById("btnBatalEditBerita").addEventListener("click", resetFormBerita);
document.getElementById("btnResetBerita").addEventListener("click", () => {
  if (!confirm("Reset berita ke data bawaan?")) return;
  resetDaftarBerita();
  renderAdminBerita();
  resetFormBerita();
  setStatus(statusBerita, "Berita direset ke bawaan.", "success");
});

// --- GURU & STAF ---
let idxGuruEdit = null;
let fotoGuruData = "";
const formGuru = document.getElementById("formGuruAdmin");
const statusGuru = document.getElementById("statusGuruAdmin");
const previewGuru = document.getElementById("previewFotoGuru");
const teksPreviewGuru = document.getElementById("teksPreviewGuru");

function setPreviewGuru(src) {
  fotoGuruData = src || "";
  if (fotoGuruData) {
    previewGuru.src = fotoGuruData;
    previewGuru.hidden = false;
    teksPreviewGuru.textContent = "Foto siap disimpan.";
  } else {
    previewGuru.hidden = true;
    previewGuru.removeAttribute("src");
    teksPreviewGuru.textContent = "Menggunakan avatar bawaan jika foto kosong.";
  }
}

function resetFormGuru() {
  idxGuruEdit = null;
  formGuru.reset();
  setPreviewGuru("");
  document.getElementById("judulFormGuru").textContent = "Tambah Guru / Staf";
  document.getElementById("btnSimpanGuru").textContent = "Simpan Guru / Staf";
  document.getElementById("btnBatalEditGuru").hidden = true;
}

document.getElementById("fileFotoGuru").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await kompresGambarKeDataURL(file, 480, 0.82);
    document.getElementById("urlFotoGuru").value = "";
    setPreviewGuru(dataUrl);
  } catch (err) {
    setStatus(statusGuru, err.message, "error");
  }
});

document.getElementById("urlFotoGuru").addEventListener("input", (e) => {
  const val = e.target.value.trim();
  if (val) {
    document.getElementById("fileFotoGuru").value = "";
    setPreviewGuru(val);
  } else {
    setPreviewGuru("");
  }
});

function renderAdminGuru() {
  const daftar = ambilDaftarGuru();
  document.getElementById("jumlahGuru").textContent = String(daftar.length);
  const wadah = document.getElementById("daftarGuruAdmin");
  wadah.innerHTML = daftar
    .map(
      (g, idx) => `
      <div class="admin-item admin-item-media">
        <img src="${g.foto || AVATAR_FALLBACK}" alt="${g.nama}" class="admin-thumb-avatar" onerror="this.onerror=null;this.src='${AVATAR_FALLBACK}';" />
        <div class="admin-item-body">
          <span class="badge">${g.jabatan}</span>
          <h4 class="admin-item-title">${g.nama}</h4>
          <p class="small-note">${[g.bidang, g.nip ? `NIP: ${g.nip}` : ""].filter(Boolean).join(" • ")}</p>
          <div class="admin-item-actions">
            <button type="button" class="btn-small" data-act="edit-g" data-idx="${idx}">Edit</button>
            <button type="button" class="btn-small btn-danger" data-act="del-g" data-idx="${idx}">Hapus</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  wadah.querySelectorAll("button").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    btn.addEventListener("click", () => {
      if (btn.dataset.act === "edit-g") {
        const item = ambilDaftarGuru()[idx];
        if (!item) return;
        idxGuruEdit = idx;
        document.getElementById("namaGuru").value = item.nama;
        document.getElementById("jabatanGuru").value = item.jabatan;
        document.getElementById("bidangGuru").value = item.bidang || "";
        document.getElementById("nipGuru").value = item.nip || "";
        document.getElementById("urlFotoGuru").value = item.foto?.startsWith("data:") ? "" : item.foto || "";
        setPreviewGuru(item.foto || "");
        document.getElementById("judulFormGuru").textContent = "Edit Guru / Staf";
        document.getElementById("btnSimpanGuru").textContent = "Perbarui Guru / Staf";
        document.getElementById("btnBatalEditGuru").hidden = false;
      } else {
        const list = ambilDaftarGuru();
        if (!list[idx] || !confirm(`Hapus data "${list[idx].nama}"?`)) return;
        simpanDaftarGuru(list.filter((_, i) => i !== idx));
        renderAdminGuru();
        setStatus(statusGuru, "Data guru/staf dihapus.", "success");
      }
    });
  });
}

formGuru.addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = document.getElementById("namaGuru").value.trim();
  const jabatan = document.getElementById("jabatanGuru").value.trim();
  const bidang = document.getElementById("bidangGuru").value.trim();
  const nip = document.getElementById("nipGuru").value.trim();
  if (!nama || !jabatan) {
    setStatus(statusGuru, "Nama dan jabatan wajib diisi.", "error");
    return;
  }

  const daftar = [...ambilDaftarGuru()];
  const item = {
    id: idxGuruEdit !== null && daftar[idxGuruEdit] ? daftar[idxGuruEdit].id : `guru-${Date.now()}`,
    nama,
    jabatan,
    bidang,
    nip,
    foto: fotoGuruData
  };

  if (idxGuruEdit !== null && daftar[idxGuruEdit]) {
    daftar[idxGuruEdit] = item;
    setStatus(statusGuru, "Data guru/staf diperbarui.", "success");
  } else {
    daftar.push(item);
    setStatus(statusGuru, "Data guru/staf ditambahkan.", "success");
  }
  simpanDaftarGuru(daftar);
  renderAdminGuru();
  resetFormGuru();
});

document.getElementById("btnBatalEditGuru").addEventListener("click", resetFormGuru);
document.getElementById("btnResetGuru").addEventListener("click", () => {
  if (!confirm("Reset data guru & staf ke bawaan?")) return;
  resetDaftarGuru();
  renderAdminGuru();
  resetFormGuru();
  setStatus(statusGuru, "Data guru & staf direset.", "success");
});

// --- GALERI FOTO ---
let idxGaleriEdit = null;
let fotoGaleriData = "";
const formGaleri = document.getElementById("formGaleriAdmin");
const statusGaleri = document.getElementById("statusGaleriAdmin");
const previewGaleri = document.getElementById("previewFotoGaleri");
const teksPreviewGaleri = document.getElementById("teksPreviewGaleri");

function setPreviewGaleri(src) {
  fotoGaleriData = src || "";
  if (fotoGaleriData) {
    previewGaleri.src = fotoGaleriData;
    previewGaleri.hidden = false;
    teksPreviewGaleri.textContent = "Foto galeri siap disimpan.";
  } else {
    previewGaleri.hidden = true;
    previewGaleri.removeAttribute("src");
    teksPreviewGaleri.textContent = "Pilih file atau masukkan URL foto.";
  }
}

function resetFormGaleri() {
  idxGaleriEdit = null;
  formGaleri.reset();
  document.getElementById("tanggalGaleri").value = tanggalHariIni();
  setPreviewGaleri("");
  document.getElementById("judulFormGaleri").textContent = "Tambah Foto Galeri";
  document.getElementById("btnSimpanGaleri").textContent = "Simpan ke Galeri";
  document.getElementById("btnBatalEditGaleri").hidden = true;
}

document.getElementById("fileFotoGaleri").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await kompresGambarKeDataURL(file, 900, 0.8);
    document.getElementById("urlFotoGaleri").value = "";
    setPreviewGaleri(dataUrl);
  } catch (err) {
    setStatus(statusGaleri, err.message, "error");
  }
});

document.getElementById("urlFotoGaleri").addEventListener("input", (e) => {
  const val = e.target.value.trim();
  if (val) {
    document.getElementById("fileFotoGaleri").value = "";
    setPreviewGaleri(val);
  } else {
    setPreviewGaleri("");
  }
});

function renderAdminGaleri() {
  const daftar = ambilDaftarGaleri();
  document.getElementById("jumlahGaleri").textContent = String(daftar.length);
  const wadah = document.getElementById("daftarGaleriAdmin");
  wadah.innerHTML = daftar
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
            <button type="button" class="btn-small" data-act="edit-gl" data-idx="${idx}">Edit</button>
            <button type="button" class="btn-small btn-danger" data-act="del-gl" data-idx="${idx}">Hapus</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  wadah.querySelectorAll("button").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    btn.addEventListener("click", () => {
      if (btn.dataset.act === "edit-gl") {
        const item = ambilDaftarGaleri()[idx];
        if (!item) return;
        idxGaleriEdit = idx;
        document.getElementById("judulGaleri").value = item.judul;
        document.getElementById("kategoriGaleri").value = item.kategori || "Akademik";
        document.getElementById("tanggalGaleri").value = item.tanggal || "";
        document.getElementById("deskripsiGaleri").value = item.deskripsi || "";
        document.getElementById("urlFotoGaleri").value = item.foto?.startsWith("data:") ? "" : item.foto || "";
        setPreviewGaleri(item.foto || "");
        document.getElementById("judulFormGaleri").textContent = "Edit Foto Galeri";
        document.getElementById("btnSimpanGaleri").textContent = "Perbarui Foto Galeri";
        document.getElementById("btnBatalEditGaleri").hidden = false;
      } else {
        const list = ambilDaftarGaleri();
        if (!list[idx] || !confirm(`Hapus foto "${list[idx].judul}"?`)) return;
        simpanDaftarGaleri(list.filter((_, i) => i !== idx));
        renderAdminGaleri();
        setStatus(statusGaleri, "Foto dihapus dari galeri.", "success");
      }
    });
  });
}

formGaleri.addEventListener("submit", (e) => {
  e.preventDefault();
  const judul = document.getElementById("judulGaleri").value.trim();
  const kategori = document.getElementById("kategoriGaleri").value;
  const tanggal = document.getElementById("tanggalGaleri").value.trim();
  const deskripsi = document.getElementById("deskripsiGaleri").value.trim();
  if (!judul || !fotoGaleriData) {
    setStatus(statusGaleri, "Judul dan foto galeri wajib diisi.", "error");
    return;
  }

  const daftar = [...ambilDaftarGaleri()];
  const obj = {
    id: idxGaleriEdit !== null && daftar[idxGaleriEdit] ? daftar[idxGaleriEdit].id : `galeri-${Date.now()}`,
    judul,
    kategori,
    tanggal,
    deskripsi,
    foto: fotoGaleriData
  };

  if (idxGaleriEdit !== null && daftar[idxGaleriEdit]) {
    daftar[idxGaleriEdit] = obj;
    setStatus(statusGaleri, "Foto galeri diperbarui.", "success");
  } else {
    daftar.unshift(obj);
    setStatus(statusGaleri, "Foto ditambahkan ke galeri.", "success");
  }
  simpanDaftarGaleri(daftar);
  renderAdminGaleri();
  resetFormGaleri();
});

document.getElementById("btnBatalEditGaleri").addEventListener("click", resetFormGaleri);
document.getElementById("btnResetGaleri").addEventListener("click", () => {
  if (!confirm("Reset galeri ke data bawaan?")) return;
  resetDaftarGaleri();
  renderAdminGaleri();
  resetFormGaleri();
  setStatus(statusGaleri, "Galeri direset ke bawaan.", "success");
});

// --- LOGIN, KUNCI & EKSPOR ---
function muatSemuaAdmin() {
  renderAdminBerita();
  resetFormBerita();
  renderAdminGuru();
  resetFormGuru();
  renderAdminGaleri();
  resetFormGaleri();
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputKode.value.trim() === KODE_AKSES_ADMIN) {
    sessionStorage.setItem(KEYS.ADMIN_SESSION, "1");
    inputKode.value = "";
    statusLogin.textContent = "";
    perbaruiKunci();
    muatSemuaAdmin();
  } else {
    setStatus(statusLogin, "Kode akses tidak sesuai.", "error");
  }
});

btnKunci.addEventListener("click", () => {
  sessionStorage.removeItem(KEYS.ADMIN_SESSION);
  perbaruiKunci();
});

btnExportJson.addEventListener("click", () => {
  const payload = JSON.stringify(
    {
      dieksportPada: new Date().toISOString(),
      berita: ambilDaftarBerita(),
      guruDanStaf: ambilDaftarGuru(),
      galeri: ambilDaftarGaleri()
    },
    null,
    2
  );
  const blob = new Blob([payload], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cadangan-website-sekolah.json";
  a.click();
  URL.revokeObjectURL(url);
});

perbaruiKunci();
if (sessionStorage.getItem(KEYS.ADMIN_SESSION) === "1") {
  muatSemuaAdmin();
}
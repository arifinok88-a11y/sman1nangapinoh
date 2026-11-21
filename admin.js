const KODE_AKSES_ADMIN = "SEKOLAH2026";
const SESI_ADMIN_KEY = "sma_hb_admin_terbuka";

const panelLoginAdmin = document.getElementById("panelLoginAdmin");
const formLoginAdmin = document.getElementById("formLoginAdmin");
const inputKodeAdmin = document.getElementById("inputKodeAdmin");
const statusLoginAdmin = document.getElementById("statusLoginAdmin");
const workspaceAdmin = document.getElementById("workspaceAdmin");

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
const btnExportBerita = document.getElementById("btnExportBerita");
const btnResetBerita = document.getElementById("btnResetBerita");
const btnKunciAdmin = document.getElementById("btnKunciAdmin");

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

function perbaruiStatusKunci() {
  const terbuka = sessionStorage.getItem(SESI_ADMIN_KEY) === "1";
  if (panelLoginAdmin) panelLoginAdmin.hidden = terbuka;
  if (workspaceAdmin) workspaceAdmin.hidden = !terbuka;
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
  const daftar = ambilDaftarBerita();
  const item = daftar[idx];
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
          <button type="button" class="btn-small" data-aksi="edit" data-idx="${idx}">Edit</button>
          <button type="button" class="btn-small btn-danger" data-aksi="hapus" data-idx="${idx}">Hapus</button>
        </div>
      </div>
    `
    )
    .join("");

  daftarBeritaAdmin.querySelectorAll("button[data-aksi]").forEach((btn) => {
    const idx = Number(btn.dataset.idx);
    const aksi = btn.dataset.aksi;

    btn.addEventListener("click", () => {
      if (aksi === "edit") {
        isiFormUntukEdit(idx);
      } else if (aksi === "hapus") {
        const daftarSaatIni = ambilDaftarBerita();
        const target = daftarSaatIni[idx];
        if (!target) return;
        const yakin = confirm(`Hapus berita "${target.judul}" dari daftar browser ini?`);
        if (!yakin) return;

        const sisa = daftarSaatIni.filter((_, i) => i !== idx);
        simpanDaftarBerita(sisa);
        if (indexSedangDiedit === idx) {
          bersihkanFormBerita();
        }
        renderDaftarAdmin();
        setStatusAdmin(`Berita "${target.judul}" dihapus.`, "success");
      }
    });
  });
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
      renderDaftarAdmin();
      bersihkanFormBerita();
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
    const bentrok = daftar.some((item, i) => item.slug === slugFinal && i !== indexSedangDiedit);
    if (bentrok) {
      slugFinal = `${slugFinal}-${Date.now().toString().slice(-4)}`;
    }

    const beritaBaru = {
      slug: slugFinal,
      tanggal,
      kategori,
      ringkasan,
      judul,
      paragraf,
      poin
    };

    if (indexSedangDiedit !== null && daftar[indexSedangDiedit]) {
      daftar[indexSedangDiedit] = beritaBaru;
      simpanDaftarBerita(daftar);
      setStatusAdmin(`Berita "${judul}" berhasil diperbarui.`, "success");
    } else {
      daftar.unshift(beritaBaru);
      simpanDaftarBerita(daftar);
      setStatusAdmin(`Berita "${judul}" berhasil ditambahkan.`, "success");
    }

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

if (btnExportBerita) {
  btnExportBerita.addEventListener("click", () => {
    const jsonStr = JSON.stringify(ambilDaftarBerita(), null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data-berita-sekolah.json";
    link.click();
    URL.revokeObjectURL(url);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jsonStr).then(
        () => setStatusAdmin("JSON berita diunduh & disalin ke clipboard untuk ditempel ke DATA_BERITA di script.js.", "success"),
        () => setStatusAdmin("File data-berita-sekolah.json berhasil diunduh.", "success")
      );
    } else {
      setStatusAdmin("File data-berita-sekolah.json berhasil diunduh.", "success");
    }
  });
}

if (btnResetBerita) {
  btnResetBerita.addEventListener("click", () => {
    const yakin = confirm("Kembalikan daftar berita ke data bawaan di script.js?");
    if (!yakin) return;
    resetDaftarBerita();
    bersihkanFormBerita();
    renderDaftarAdmin();
    setStatusAdmin("Daftar berita dikembalikan ke data bawaan.", "success");
  });
}

perbaruiStatusKunci();
if (sessionStorage.getItem(SESI_ADMIN_KEY) === "1") {
  renderDaftarAdmin();
  bersihkanFormBerita();
}
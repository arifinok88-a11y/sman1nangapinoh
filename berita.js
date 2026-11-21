const detailContainer = document.getElementById("detailBerita");

if (detailContainer && typeof ambilDaftarBerita === "function") {
  const daftarBerita = ambilDaftarBerita();
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const berita = daftarBerita.find((item) => item.slug === slug) || daftarBerita[0];

  document.title = `${berita.judul} — SMA Harapan Bangsa`;

  detailContainer.innerHTML = `
    <div class="announcement-meta">
      <span class="announcement-date">${berita.tanggal}</span>
      <span class="badge">${berita.kategori}</span>
    </div>
    <h1>${berita.judul}</h1>
    <div class="detail-body">
      ${berita.paragraf.map((p) => `<p>${p}</p>`).join("")}
      ${
        berita.poin && berita.poin.length
          ? `<ul class="detail-points">${berita.poin.map((pt) => `<li>${pt}</li>`).join("")}</ul>`
          : ""
      }
    </div>
  `;
}
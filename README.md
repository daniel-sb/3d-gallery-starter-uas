# 3D Art Gallery — Starter Code UAS

Starter project galeri seni 3D pakai **Three.js + Vite**. Sudah jalan penuh:
karakter bisa jalan-jalan (WASD), klik lukisan untuk zoom ke karya, patung di
tengah ruangan, lantai/tembok/atap bertekstur.

Tugas kalian: kembangkan project ini (ganti karya seni, karakter, tata ruang,
tambah interaksi, dll — lihat instruksi UAS).

> 📖 **Baca [`MANUAL.md`](./MANUAL.md)** untuk panduan lengkap: penjelasan tiap
> script, prosedur kustomisasi (lukisan/karakter/tembok), pengenalan agentic
> coding (Claude Code / Codex) + contoh prompt, dan cara deploy.

## Cara menjalankan

Butuh **Node.js** (https://nodejs.org) dan editor (mis. VS Code).

```bash
npm install      # sekali saja, install dependency
npm run dev      # jalankan dev server → buka http://localhost:5173
```

`npm run dev` auto-reload tiap kalian save file.

## Kontrol

| Tombol | Aksi |
|--------|------|
| W A S D | Gerak karakter |
| Mouse | Lihat sekeliling |
| Space | Toggle pointer lock |
| Klik lukisan | Zoom ke karya (klik lagi / WASD / Esc untuk keluar) |
| M | Menu • Enter | Mulai jelajah • Esc | Stop |

## Struktur project

```
index.html        # halaman utama
main.js           # entry point
style.css         # styling UI
modules/          # semua logika scene (dipecah per fitur)
  ├─ paintings.js / paintingData.js  # lukisan & datanya
  ├─ paintingFocus.js                # zoom saat lukisan diklik
  ├─ player.js / movement.js         # karakter & gerakan
  ├─ statue.js                       # patung tengah ruangan
  ├─ floor.js / walls.js / ceiling.js
  ├─ lighting.js                     # pencahayaan
  └─ ...
public/           # aset statis (gambar, model 3D .glb/.gltf, suara)
  ├─ artworks/    # gambar lukisan (1.jpg, 2.jpg, ...)
  ├─ models/      # model 3D
  └─ img/         # tekstur
```

## Yang sering diubah mahasiswa

- **Ganti lukisan** → taruh gambar di `public/artworks/` dan edit `modules/paintingData.js`
  (judul, artist, deskripsi, posisi di tembok).
- **Ganti karakter** → ganti file `.glb` di `public/models/guide/` dan sesuaikan
  konstanta di atas `modules/player.js` (scale, offset).
- **Ganti patung** → ganti `.glb` di `public/models/statue/` dan path di `modules/statue.js`.
- **Ganti tekstur lantai/tembok** → edit `modules/floor.js` / `walls.js`.

> ⚠️ Kalau memuat aset baru dengan path absolut (`loader.load("/...")`),
> gunakan prefix `import.meta.env.BASE_URL` (lihat contoh di `floor.js`/`statue.js`)
> supaya tetap jalan saat di-deploy ke GitHub Pages.

## Deploy ke GitHub Pages (opsional)

1. Di `vite.config.js`, set `base: "/nama-repo-kalian/"`.
2. `npm run build` → menghasilkan folder `dist/`.
3. Push isi `dist/` ke branch `gh-pages` repo kalian, lalu aktifkan
   **Settings → Pages → branch `gh-pages`**.

---

Berbasis tutorial "3D Art Gallery using Three.js" oleh Emilian Kasemi
(https://github.com/theringsofsaturn/3D-art-gallery).
Lisensi: CC BY-NC-SA 4.0.

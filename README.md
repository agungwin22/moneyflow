# 💰 MoneyFlow – Personal Accounting App

**MoneyFlow** adalah aplikasi web pencatatan keuangan pribadi yang modern, ringan, dan responsif. Dibangun dengan HTML5, CSS vanilla (tanpa framework), dan JavaScript ES6 modular. Aplikasi ini membantu kamu memantau pemasukan dan pengeluaran dengan mudah, lengkap dengan fitur CRUD, ekspor/impor CSV, serta tampilan dark theme yang nyaman di mata.

🌐 **Demo Online:** https://moneyflowid.netlify.app/  
📦 **Repository:** [github.com/agungwin22/moneyflow](https://github.com/agungwin22/moneyflow)

---

## ✨ Fitur Unggulan

### 1. 📝 Manajemen Transaksi (CRUD)

- **Tambah** pemasukan atau pengeluaran dengan form yang mudah
- **Edit** transaksi yang sudah ada melalui modal popup
- **Hapus** transaksi dengan konfirmasi
- **Lihat** daftar transaksi dalam tabel dengan saldo berjalan otomatis

### 2. 📁 Impor & Ekspor CSV

- **Ekspor** semua data transaksi ke file CSV (backup/migrasi data)
- **Impor** file CSV untuk menambahkan banyak transaksi sekaligus
- Validasi format CSV otomatis + notifikasi jumlah data berhasil diimpor

### 3. 💾 Penyimpanan Lokal (localStorage)

- Data tersimpan di browser kamu (tanpa perlu server)
- Aplikasi tetap berfungsi offline setelah pertama kali diakses
- Reset data kapan saja ke kondisi kosong

### 4. 🎨 Tampilan Modern & Responsif

- Dark theme dominan dengan aksen biru, hijau, merah
- Tampilan mobile-friendly (tombol sentuh minimal 44px)
- Animasi modal dan transisi halus

### 5. 🔐 (Persiapan) Login Pengguna

- Halaman login sederhana (simpel untuk integrasi Supabase nanti)
- Dropdown profil di dashboard (login/register placeholder)

---

## 🛠️ Teknologi yang Digunakan

| Teknologi            | Keterangan                                          |
| -------------------- | --------------------------------------------------- |
| HTML5                | Struktur halaman                                    |
| CSS3 Vanilla         | Styling modular (variables, components, responsive) |
| JavaScript ES6       | Logika aplikasi & manipulasi DOM                    |
| Font Awesome 6       | Ikon-ikon keren                                     |
| Google Fonts (Inter) | Tipografi modern                                    |
| localStorage         | Penyimpanan data tanpa backend                      |

> Tidak menggunakan Tailwind CSS atau framework eksternal lainnya untuk styling.

---

## 🚀 Cara Menggunakan

### Prasyarat

- Browser modern (Chrome, Firefox, Edge, Safari)
- Koneksi internet untuk pertama kali (mengambil Font Awesome & Google Fonts)
- **Live Server** atau web server lokal (karena menggunakan ES6 modules)

### Langkah-langkah

1. **Clone repository**

   ```bash
   git clone https://github.com/agungwin22/moneyflow.git
   cd moneyflow
   ```

2. **Jalankan dengan Live Server** (rekomendasi)
   - Jika pakai VS Code: instal ekstensi "Live Server", lalu klik kanan `index.html` → "Open with Live Server"
   - Atau pakai Python: `python -m http.server 8000`
   - Atau pakai Node.js: `npx http-server`

3. **Buka aplikasi di browser**
   - Dashboard: `http://localhost:8000/index.html`

4. **Mulai mencatat keuangan**
   - Tambah transaksi melalui form di dashboard
   - Lihat total saldo otomatis berubah
   - Edit/hapus transaksi kapan saja
   - Ekspor data ke CSV atau impor dari CSV

> ⚠️ **Catatan:** Aplikasi ini menggunakan ES6 modules, jadi HARUS dijalankan melalui web server (tidak bisa langsung double-click `index.html`).

---

## 📝 Contoh Penggunaan

### Menambah Pemasukan

1. Isi tanggal: `2025-03-20`
2. Deskripsi: `Gaji Maret`
3. Pemasukan: `5000000`
4. Klik **Tambah**

### Menambah Pengeluaran

1. Isi tanggal: `2025-03-21`
2. Deskripsi: `Belanja Bulanan`
3. Pengeluaran: `750000`
4. Klik **Tambah**

### Ekspor Data

- Klik tombol **Export CSV** → file `moneyflow_export_YYYYMMDD_HHMMSS.csv` akan terunduh

### Impor Data

- Siapkan file CSV dengan format:
  ```csv
  Tanggal,Deskripsi,Pemasukan,Pengeluaran
  2025-03-01,Gaji Bulanan,5000000,0
  2025-03-02,Beli bahan makanan,0,250000
  ```
- Klik **Import CSV** → pilih file → data akan ditambahkan

---

## 🗺️ Rencana Pengembangan (Roadmap)

- [x] CRUD transaksi
- [x] Impor & ekspor CSV
- [x] Tampilan dark theme responsif
- [x] Struktur kode modular
- [x] Halaman login sederhana
- [ ] Integrasi **Supabase** (autentikasi & database cloud)
- [ ] Grafik pemasukan vs pengeluaran
- [ ] Kategori transaksi
- [ ] Filter & pencarian
- [ ] Ekspor laporan PDF per bulan
- [ ] PWA (installable & offline support)

---

## 🤝 Kontribusi

Kontribusi sangat terbuka! Silakan fork repository ini, buat branch fitur, dan ajukan pull request.

1. Fork proyek
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur X'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buka Pull Request

---

⭐ **Jangan lupa beri bintang jika proyek ini bermanfaat!**

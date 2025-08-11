# 📘 Dokumentasi Proyek Web SPK (Sistem Pendukung Keputusan berbasis GIS)

## 🔗 Tautan Aplikasi

- **URL Web:** [https://gis-dss-oilpalm.vercel.app/](https://gis-dss-oilpalm.vercel.app/)

# **Kredensial:**

- username : admin
- password : admin

* **Screenshot Web:** ![Screenshot Web](https://github.com/ren-zi-fa/spk-ahp/blob/main/image/web.png)

## Petunjuk Instalasi

```bash
git clone https://github.com/ren-zi-fa/spk-ahp.git

cd spk-ahp

pnpm install | npm install | bun install | yarn install

```

** buat file .env **

```bash
cp .example.env .env
```

** buat auth secret **

```bash
openssl rand -base64 32
```

- copy dan paste kedalam file .env
- masukkan connection string neon atau bisa juga dengan postgresql biasa

** menjalankan aplikasi **

```bash
pnpm dev |npm run dev| bun dev | yarn dev

```

## ⚙️ Teknologi & Dependensi Utama

- **Framework:** Next.js 15
- **State Management:** React / Zustand
- **Database:** PostgreSQL serverless (NEON)

### 📦 Library Dependensi Utama

- `ahp-calc`: ^1.2.7 — untuk perhitungan AHP (Analytical Hierarchy Process)
- `leaflet`: ^1.9.4 — untuk visualisasi dan manipulasi peta
- `recharts`: ^2.15.3 — untuk menampilkan chart hasil AHP
- `zod`: ^3.25.67 — untuk validasi skema data form
- `prisma`: ORM untuk koneksi database PostgreSQL

---

## 🧩 Struktur Fitur Utama Berdasarkan Use Case & Diagram

### 1. 🔐 **Login Workflow**

- Halaman login digunakan untuk autentikasi user menggunakan username & password.
- Hanya user yang sudah terdaftar (admin/internal) dapat login. Tidak tersedia fitur registrasi.
- Jika login berhasil, diarahkan ke halaman Dashboard.

### 2. 📁 **Manage Analysis Workflow**

- User melihat daftar analysis yang pernah dibuat.
- Fitur tindakan:

  - **Create**: membuat analysis baru
  - **Show / Edit**: membuka analysis untuk input data
  - **Delete**: menghapus analysis
  - **Mapping**: manipulasi wilayah via peta

### 3. ✍️ **Create Analysis + Input Data Workflow**

- User membuat analysis dengan nama tertentu.
- Setelah membuat analysis:

  - User bisa **input kriteria** dan **alternatif** melalui halaman input
  - Alternatif dapat ditambahkan dengan klik marker di peta (Leaflet)
  - Data dapat dilihat dan dihapus

### 4. ⚖️ **Process AHP Workflow**

- Setelah input data lengkap, user klik "Process This Data"
- Masuk ke halaman proses AHP:

  - Input pairwise comparison untuk **kriteria**
  - Input pairwise untuk **alternatif terhadap tiap kriteria**
  - Klik tombol **Process** untuk menghitung hasil

### 5. 📊 **Result Page Workflow**

- Hasil berupa **chart ranking alternatif** ditampilkan menggunakan `recharts`
- Tersedia informasi lengkap seperti:

  - Nilai normalisasi, lamda, CI, CR, dan status konsistensi

- Fitur tambahan:

  - **Simpan ke database** (jika belum disimpan)
  - **Export to PDF**: screenshot hasil ranking + info ke file PDF

### 6. 🗺️ **Mapping Workflow**

- User klik tombol "Mapping" untuk masuk ke mode manipulasi wilayah
- Menggunakan library **GEOMAN + Leaflet**
- User bisa menggambar area, lalu klik **Take Area**
- Sistem akan **screenshot peta** dan menyimpan hasilnya sebagai gambar

### 7. 👤 **Manage Account Workflow**

- User bisa mengganti username & password
- Sebelum update, muncul **modal verifikasi** (jawaban rahasia/security check)
- Jika valid, perubahan disimpan dan user akan diminta logout untuk mengaktifkan update

---

## 📌 Catatan

- Sistem ini berbasis **client-server** dan semua proses AHP dilakukan di sisi client menggunakan `ahp-calc` kunjungi https://github.com/ren-zi-fa/ahp-calc untuk lebih detail
- Sistem tidak memiliki pendaftaran user (admin only)
- Fitur mapping dan screenshot sangat penting dalam presentasi hasil kepada publik/eksternal

---

created by renzi febriandika

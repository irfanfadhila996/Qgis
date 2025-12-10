# 🏥 WebGIS Fasilitas Kesehatan Kabupaten Jepara

Aplikasi pemetaan interaktif untuk menampilkan dan mengelola data fasilitas kesehatan di Kabupaten Jepara menggunakan HTML, CSS, dan JavaScript murni dengan Leaflet.js.

## ✨ Fitur Utama

### 🗺️ Peta Interaktif
- Peta fullscreen dan responsif menggunakan Leaflet.js
- Tiles OpenStreetMap
- Zoom dan pan interaktif
- Layer control untuk filter kategori

### 📍 Marker & Popup
- Marker dengan ikon berbeda per jenis:
  - 🔴 Merah = Rumah Sakit
  - 🟢 Hijau = Puskesmas
  - 🔵 Biru = Klinik
- Popup informatif dengan detail fasilitas
- Aksi edit dan hapus langsung dari popup

### ➕ CRUD Fasilitas
- **Create**: Tambah lokasi baru via form atau klik peta
- **Read**: Lihat daftar dan detail semua fasilitas
- **Update**: Edit data fasilitas yang sudah ada
- **Delete**: Hapus fasilitas dengan konfirmasi

### 🔍 Pencarian & Filter
- Search box untuk cari fasilitas berdasarkan nama/alamat
- Layer control untuk ON/OFF kategori
- Highlight hasil pencarian

### 📊 Dashboard Statistik
- Jumlah Rumah Sakit
- Jumlah Puskesmas
- Jumlah Klinik
- Update real-time

### 🎨 UI/UX Modern
- Font Poppins
- Card design dengan shadow
- Smooth animations
- Dark mode toggle 🌙
- Responsive untuk mobile

### 💾 Data Persistence
- LocalStorage untuk simpan data
- Data tetap ada setelah refresh
- Export data ke JSON

### 🌍 Fitur Tambahan
- **Geolocation**: Tombol "Lokasi Saya" untuk zoom ke posisi user
- **Pick Location**: Klik peta untuk pilih koordinat
- **Zoom to Facility**: Langsung zoom ke fasilitas dari list
- **Export Data**: Download semua data sebagai JSON
- **Legenda**: Visual guide untuk jenis fasilitas

## 📁 Struktur File

```
webgis-faskes-jepara/
├── index.html      # Struktur HTML aplikasi
├── style.css       # Styling lengkap dengan dark mode
├── script.js       # Logic aplikasi dan interaksi peta
└── README.md       # Dokumentasi ini
```

## 🚀 Cara Menjalankan

1. **Download/Clone** semua file ke folder lokal
2. **Buka** file `index.html` di browser modern (Chrome, Firefox, Edge, Safari)
3. **Selesai!** Aplikasi langsung berjalan tanpa instalasi

> **Catatan**: Tidak perlu web server, cukup buka file HTML langsung di browser.

## 📝 Data Sample Awal

Aplikasi sudah dilengkapi dengan 5 data sample:
- RSUD Dr Rehatta
- RSUD Kelet
- RSUD R.A. Kartini
- RS Graha Husada
- Puskesmas Bangsri I

## 🎯 Cara Menggunakan

### Tambah Fasilitas Baru
1. Isi form di sidebar kiri
2. Atau klik tombol "📍 Pilih dari Peta" lalu klik lokasi di peta
3. Klik "Tambah Lokasi"

### Edit Fasilitas
1. Klik marker di peta atau tombol "Edit" di list
2. Ubah data di modal yang muncul
3. Klik "Simpan Perubahan"

### Hapus Fasilitas
1. Klik tombol "Hapus" di popup atau list
2. Konfirmasi penghapusan

### Cari Fasilitas
1. Ketik nama/alamat di search box
2. Hasil akan di-highlight otomatis

### Export Data
1. Klik tombol 💾 di header
2. File JSON akan terdownload

### Dark Mode
1. Klik tombol 🌙 di header
2. Tema akan berubah dan tersimpan

## 🛠️ Teknologi

- **HTML5**: Struktur aplikasi
- **CSS3**: Styling modern dengan custom properties
- **JavaScript (Vanilla)**: Logic tanpa framework
- **Leaflet.js 1.9.4**: Library peta interaktif
- **OpenStreetMap**: Tiles peta gratis

## 📱 Responsive Design

Aplikasi otomatis menyesuaikan tampilan untuk:
- Desktop (> 1024px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🎨 Kustomisasi

### Ubah Warna Tema
Edit variabel CSS di `style.css`:
```css
:root {
    --primary-color: #2563eb;
    --rs-color: #dc2626;
    --puskesmas-color: #16a34a;
    --klinik-color: #2563eb;
}
```

### Ubah Posisi Awal Peta
Edit di `script.js`:
```javascript
map = L.map('map').setView([-6.5889, 110.6684], 11);
```

### Tambah Jenis Fasilitas Baru
1. Tambah option di dropdown (index.html)
2. Tambah warna di CSS (style.css)
3. Tambah icon di JavaScript (script.js)

## 🔒 Browser Support

- Chrome/Edge (Chromium) ✅
- Firefox ✅
- Safari ✅
- Opera ✅
- IE 11 ❌ (tidak didukung)

## 📄 Lisensi

Free to use untuk keperluan edukasi dan non-komersial.

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk Kabupaten Jepara

---

**Selamat menggunakan! Jika ada pertanyaan atau bug, silakan laporkan.**

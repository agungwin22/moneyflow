// utils.js - Fungsi utilitas umum

// *
//  * Format angka ke format Rupiah
//  * @param {number} angka - Angka yang akan diformat
//  * @returns {string} - String format Rupiah
 
export function formatRupiah(angka) {
  if (isNaN(angka) || angka === null) angka = 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}

// *
//  * Format tanggal ISO (YYYY-MM-DD) ke DD/MM/YYYY
//  * @param {string} isoString - Tanggal dalam format ISO
//  * @returns {string} - Tanggal dalam format DD/MM/YYYY
 
export function formatDate(isoString) {
  if (!isoString) return '-';
  const [tahun, bulan, hari] = isoString.split('-');
  return `${hari}/${bulan}/${tahun}`;
}

// *
//  * Validasi transaksi: salah satu pemasukan/pengeluaran > 0 dan tidak negatif
//  * @param {number} pemasukan 
//  * @param {number} pengeluaran 
//  * @returns {boolean}
 
export function isValidTransaction(pemasukan, pengeluaran) {
  const pem = Number(pemasukan) || 0;
  const peng = Number(pengeluaran) || 0;
  return (pem > 0 || peng > 0) && pem >= 0 && peng >= 0;
}

// *
//  * Membuat ID unik (crypto.randomUUID dengan fallback sederhana)
//  * @returns {string} - ID unik
 
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// utils.js - tambahkan fungsi ini

// *
//  * Menampilkan notifikasi toast
//  * @param {string} message - Pesan yang ditampilkan
//  * @param {string} type - 'success', 'error', atau 'info'
 
export function showNotification(message, type = 'info') {
  // Hapus notifikasi lama jika ada
  const oldNotification = document.querySelector('.notification');
  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Auto remove setelah 3 detik
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
// csv.js - Import dan Export CSV
import { generateId, isValidTransaction, showNotification } from './utils.js';

/**
 * Export transaksi ke file CSV
 * @param {Array} transactions 
 */
export function exportToCSV(transactions) {
  if (transactions.length === 0) {
    showNotification('Tidak ada data untuk di-export.', 'error');
    return;
  }
  let csvContent = "Tanggal,Deskripsi,Pemasukan,Pengeluaran\n";
  transactions.forEach(t => {
    csvContent += `${t.tanggal},${t.deskripsi || ''},${t.pemasukan || 0},${t.pengeluaran || 0}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
  const filename = `moneyflow_export_${timestamp}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import transaksi dari file CSV
 * @param {File} file - File CSV yang diupload
 * @param {Function} callback - Fungsi yang dipanggil dengan array data baru
 */
export function importFromCSV(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      showNotification('File CSV tidak valid atau kosong.', 'error');
      return;
    }

    const header = lines[0].split(',').map(h => h.trim());
    if (header[0] !== 'Tanggal' || header[1] !== 'Deskripsi' || header[2] !== 'Pemasukan' || header[3] !== 'Pengeluaran') {
      showNotification('Format CSV harus memiliki header: Tanggal,Deskripsi,Pemasukan,Pengeluaran', 'error');
      return;
    }

    let berhasil = 0;
    const dataBaru = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(s => s.trim());
      if (row.length < 4) continue;
      const [tanggal, deskripsi, pemasukanStr, pengeluaranStr] = row;
      const pemasukan = Number(pemasukanStr) || 0;
      const pengeluaran = Number(pengeluaranStr) || 0;
      
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(tanggal);
      if (!isValidDate || !deskripsi || !isValidTransaction(pemasukan, pengeluaran)) {
        continue;
      }
      dataBaru.push({
        id: generateId(),
        tanggal,
        deskripsi,
        pemasukan,
        pengeluaran
      });
      berhasil++;
    }

    if (berhasil > 0) {
      callback(dataBaru, berhasil);
    } else {
      showNotification('Tidak ada data valid yang diimpor.', 'error');
    }
  };
  reader.readAsText(file);
}
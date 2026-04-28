// ui.js - Manipulasi DOM dan rendering
import { formatRupiah, formatDate } from './utils.js';
import { sortTransactions, computeRunningBalance, getTotalSaldo } from './transaction.js';

// Elemen-elemen DOM yang sering digunakan (akan diinisialisasi dari app.js)
let elements = {};

/**
 * Menyimpan referensi elemen DOM
 * @param {Object} domElements 
 */
export function initUI(domElements) {
  elements = domElements;
}

/**
 * Merender tabel transaksi dan total saldo
 * @param {Array} transactions 
 */
export function renderTable(transactions) {
  const sorted = sortTransactions(transactions);
  const withBalance = computeRunningBalance(sorted);
  const total = getTotalSaldo(transactions);
  
  elements.totalSaldo.textContent = formatRupiah(total);

  if (withBalance.length === 0) {
    elements.tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-muted);">Belum ada transaksi.</td></tr>`;
    return;
  }

  let html = '';
  withBalance.forEach((trx, index) => {
    const pemasukanRp = formatRupiah(trx.pemasukan || 0);
    const pengeluaranRp = formatRupiah(trx.pengeluaran || 0);
    const saldoRp = formatRupiah(trx.runningBalance);
    const tglFormat = formatDate(trx.tanggal);

    html += `<tr>
      <td>${index + 1}</td>
      <td>${tglFormat}</td>
      <td style="max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${trx.deskripsi || '-'}</td>
      <td class="text-green">${pemasukanRp}</td>
      <td class="text-red">${pengeluaranRp}</td>
      <td class="text-white">${saldoRp}</td>
      <td>
        <div class="action-cell">
          <button data-id="${trx.id}" class="btn-icon btn-icon-edit"><i class="fas fa-pencil-alt"></i></button>
          <button data-id="${trx.id}" class="btn-icon btn-icon-delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  });
  elements.tableBody.innerHTML = html;
}

/**
 * Menampilkan modal edit dengan data transaksi
 * @param {Object} transaction - Data transaksi yang akan diedit
 */
export function showEditModal(transaction) {
  elements.editId.value = transaction.id;
  elements.editTanggal.value = transaction.tanggal || '';
  elements.editDeskripsi.value = transaction.deskripsi || '';
  elements.editPemasukan.value = transaction.pemasukan || 0;
  elements.editPengeluaran.value = transaction.pengeluaran || 0;
  
  elements.modalEdit.classList.remove('hidden');
}

/**
 * Menyembunyikan modal edit
 */
export function hideEditModal() {
  elements.modalEdit.classList.add('hidden');
  // Reset form
  elements.editId.value = '';
  elements.editTanggal.value = '';
  elements.editDeskripsi.value = '';
  elements.editPemasukan.value = '';
  elements.editPengeluaran.value = '';
}

/**
 * Membersihkan form tambah transaksi
 */
export function resetFormTambah() {
  elements.inputTanggal.value = '';
  elements.inputDeskripsi.value = '';
  elements.inputPemasukan.value = '';
  elements.inputPengeluaran.value = '';
}
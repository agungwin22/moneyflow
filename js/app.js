// app.js - Entry point
import { loadTransactions, saveTransactions } from './storage.js';
import { addTransaction, updateTransaction, deleteTransaction } from './transaction.js';
import { initUI, renderTable, showEditModal, hideEditModal, resetFormTambah } from './ui.js';
import { exportToCSV, importFromCSV } from './csv.js';
import { isValidTransaction, generateId } from './utils.js';

// ===== State =====
let transactions = [];

// ===== Referensi DOM =====
const elements = {
  totalSaldo: document.getElementById('total-saldo'),
  tableBody: document.getElementById('table-body'),
  inputTanggal: document.getElementById('tanggal'),
  inputDeskripsi: document.getElementById('deskripsi'),
  inputPemasukan: document.getElementById('pemasukan'),
  inputPengeluaran: document.getElementById('pengeluaran'),
  btnTambah: document.getElementById('btn-tambah'),
  modalEdit: document.getElementById('modal-edit'),
  editId: document.getElementById('edit-id'),
  editTanggal: document.getElementById('edit-tanggal'),
  editDeskripsi: document.getElementById('edit-deskripsi'),
  editPemasukan: document.getElementById('edit-pemasukan'),
  editPengeluaran: document.getElementById('edit-pengeluaran'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCancelEdit: document.getElementById('btn-cancel-edit'),
  formEdit: document.getElementById('form-edit'),
  btnImport: document.getElementById('btn-import'),
  btnExport: document.getElementById('btn-export'),
  btnReset: document.getElementById('btn-reset'),
  fileImport: document.getElementById('file-import'),
  // Elemen baru untuk profil dropdown
  profileBtn: document.getElementById('profile-btn'),
  dropdownMenu: document.getElementById('dropdown-menu'),
  loginBtn: document.getElementById('login-btn'),
  registerBtn: document.getElementById('register-btn')
};

// ===== Inisialisasi UI =====
initUI(elements);

// ===== Fungsi pembantu =====
function updateAndRender(newTransactions) {
  transactions = newTransactions;
  saveTransactions(transactions);
  renderTable(transactions);
}

// ===== Event Handlers untuk Transaksi =====
function handleTambah(e) {
  e.preventDefault();
  const tanggal = elements.inputTanggal.value.trim();
  const deskripsi = elements.inputDeskripsi.value.trim();
  const pemasukan = Number(elements.inputPemasukan.value) || 0;
  const pengeluaran = Number(elements.inputPengeluaran.value) || 0;

  if (!tanggal || !deskripsi) {
    alert('Tanggal dan deskripsi harus diisi!');
    return;
  }
  if (!isValidTransaction(pemasukan, pengeluaran)) {
    alert('Salah satu dari Pemasukan atau Pengeluaran harus lebih dari 0!');
    return;
  }

  const newTrx = {
    id: generateId(),
    tanggal,
    deskripsi,
    pemasukan,
    pengeluaran
  };
  const updated = addTransaction(transactions, newTrx);
  updateAndRender(updated);
  resetFormTambah();
}

function handleDelete(id) {
  if (confirm('Yakin ingin menghapus transaksi ini?')) {
    const updated = deleteTransaction(transactions, id);
    updateAndRender(updated);
  }
}

function handleEdit(id) {
  const trx = transactions.find(t => t.id === id);
  if (trx) showEditModal(trx);
}

function handleSimpanEdit(e) {
  e.preventDefault();
  const id = elements.editId.value;
  const tanggal = elements.editTanggal.value;
  const deskripsi = elements.editDeskripsi.value.trim();
  const pemasukan = Number(elements.editPemasukan.value) || 0;
  const pengeluaran = Number(elements.editPengeluaran.value) || 0;

  if (!tanggal || !deskripsi) {
    alert('Tanggal dan deskripsi harus diisi!');
    return;
  }
  if (!isValidTransaction(pemasukan, pengeluaran)) {
    alert('Salah satu dari Pemasukan atau Pengeluaran harus lebih dari 0!');
    return;
  }

  const updated = updateTransaction(transactions, id, { tanggal, deskripsi, pemasukan, pengeluaran });
  updateAndRender(updated);
  hideEditModal();
}

function handleReset() {
  if (confirm('Reset data? Semua transaksi akan dihapus permanen.')) {
    updateAndRender([]);
  }
}

function handleExport() {
  exportToCSV(transactions);
}

function handleImport() {
  elements.fileImport.click();
}

function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    importFromCSV(file, (dataBaru, berhasil) => {
      const updated = [...transactions, ...dataBaru];
      updateAndRender(updated);
      alert(`${berhasil} data berhasil diimpor.`);
    });
  }
  elements.fileImport.value = '';
}

// ===== HANDLER UNTUK PROFIL DROPDOWN =====
function toggleDropdown(e) {
  e.stopPropagation();
  elements.dropdownMenu.classList.toggle('show');
}

function closeDropdown() {
  elements.dropdownMenu.classList.remove('show');
}

function handleLogin() {
  closeDropdown();
  alert('Fitur Login akan segera hadir!');
}

function handleRegister() {
  closeDropdown();
  alert('Fitur Register akan segera hadir!');
}

// ===== Event Delegation untuk tombol edit/hapus di tabel =====
elements.tableBody.addEventListener('click', (e) => {
  const btnEdit = e.target.closest('.btn-icon-edit');
  if (btnEdit) {
    const id = btnEdit.dataset.id;
    handleEdit(id);
    return;
  }
  const btnDelete = e.target.closest('.btn-icon-delete');
  if (btnDelete) {
    const id = btnDelete.dataset.id;
    handleDelete(id);
  }
});

// ===== Daftarkan Event Listener =====
elements.btnTambah.addEventListener('click', handleTambah);

elements.btnCloseModal.addEventListener('click', hideEditModal);
elements.btnCancelEdit.addEventListener('click', hideEditModal);
elements.formEdit.addEventListener('submit', handleSimpanEdit);

// Klik di luar modal untuk menutup
window.addEventListener('click', (e) => {
  if (e.target === elements.modalEdit) {
    hideEditModal();
  }
});

elements.btnExport.addEventListener('click', handleExport);
elements.btnImport.addEventListener('click', handleImport);
elements.fileImport.addEventListener('change', handleFileChange);
elements.btnReset.addEventListener('click', handleReset);

// ===== Event Listener untuk Profil Dropdown =====
if (elements.profileBtn) {
  elements.profileBtn.addEventListener('click', toggleDropdown);
}

if (elements.loginBtn) {
  elements.loginBtn.addEventListener('click', handleLogin);
}

if (elements.registerBtn) {
  elements.registerBtn.addEventListener('click', handleRegister);
}

// Tutup dropdown jika klik di luar area dropdown
window.addEventListener('click', (e) => {
  const isInsideDropdown = elements.profileBtn?.contains(e.target) || elements.dropdownMenu?.contains(e.target);
  if (!isInsideDropdown && elements.dropdownMenu) {
    closeDropdown();
  }
});

// ===== Inisialisasi Awal =====
transactions = loadTransactions();
renderTable(transactions);
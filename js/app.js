// app.js - Entry point dengan proteksi halaman
import { supabase } from './supabase.js';
import { loadTransactions, addTransaction as addTransactionDB, updateTransaction as updateTransactionDB, deleteTransaction as deleteTransactionDB } from './database.js';
import { initUI, renderTable, showEditModal, hideEditModal, resetFormTambah } from './ui.js';
import { exportToCSV, importFromCSV } from './csv.js';
import { isValidTransaction, showNotification } from './utils.js';

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
  profileBtn: document.getElementById('profile-btn'),
  dropdownMenu: document.getElementById('dropdown-menu')
};

// ===== Inisialisasi UI =====
initUI(elements);

// ===== Fungsi Refresh =====
async function refreshTransactions() {
  transactions = await loadTransactions();
  renderTable(transactions);
}

// ===== UPDATE DROPDOWN DENGAN INFO USER & LOGOUT =====
function updateDropdownForUser(user) {
  if (!elements.dropdownMenu) return;
  const fullName = user.user_metadata?.full_name || user.email || 'User';
  elements.dropdownMenu.innerHTML = `
    <div class="dropdown-item user-info" style="border-bottom: 1px solid var(--border-color); opacity:0.8; cursor:default;">
      <i class="fas fa-user-circle"></i> ${fullName}
    </div>
    <button class="dropdown-item" id="logout-btn">
      <i class="fas fa-sign-out-alt"></i> Logout
    </button>
  `;
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      showNotification('Anda telah logout.', 'info');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    });
  }
}

// ===== PROTEKSI HALAMAN =====
async function protectPage() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return false;
  }
  updateDropdownForUser(session.user);
  return true;
}

// ===== Event Handlers untuk Transaksi =====
async function handleTambah(e) {
  e.preventDefault();
  const tanggal = elements.inputTanggal.value.trim();
  const deskripsi = elements.inputDeskripsi.value.trim();
  const pemasukan = Number(elements.inputPemasukan.value) || 0;
  const pengeluaran = Number(elements.inputPengeluaran.value) || 0;

  if (!tanggal || !deskripsi) {
    showNotification('Tanggal dan deskripsi harus diisi!', 'error');
    return;
  }
  if (!isValidTransaction(pemasukan, pengeluaran)) {
    showNotification('Salah satu dari Pemasukan atau Pengeluaran harus lebih dari 0!', 'error');
    return;
  }

  const newTrx = { tanggal, deskripsi, pemasukan, pengeluaran };
  const added = await addTransactionDB(newTrx);
  if (added) {
    await refreshTransactions();
    resetFormTambah();
    showNotification('Transaksi berhasil ditambahkan!', 'success');
  } else {
    showNotification('Gagal menambahkan transaksi.', 'error');
  }
}

async function handleDelete(id) {
  if (confirm('Yakin ingin menghapus transaksi ini?')) {
    const success = await deleteTransactionDB(id);
    if (success) {
      await refreshTransactions();
      showNotification('Transaksi berhasil dihapus!', 'success');
    } else {
      showNotification('Gagal menghapus transaksi.', 'error');
    }
  }
}

function handleEdit(id) {
  const trx = transactions.find(t => t.id === id);
  if (trx) showEditModal(trx);
}

async function handleSimpanEdit(e) {
  e.preventDefault();
  const id = elements.editId.value;
  const tanggal = elements.editTanggal.value;
  const deskripsi = elements.editDeskripsi.value.trim();
  const pemasukan = Number(elements.editPemasukan.value) || 0;
  const pengeluaran = Number(elements.editPengeluaran.value) || 0;

  if (!tanggal || !deskripsi) {
    showNotification('Tanggal dan deskripsi harus diisi!', 'error');
    return;
  }
  if (!isValidTransaction(pemasukan, pengeluaran)) {
    showNotification('Salah satu dari Pemasukan atau Pengeluaran harus lebih dari 0!', 'error');
    return;
  }

  const updated = await updateTransactionDB(id, { tanggal, deskripsi, pemasukan, pengeluaran });
  if (updated) {
    await refreshTransactions();
    hideEditModal();
    showNotification('Transaksi berhasil diperbarui!', 'success');
  } else {
    showNotification('Gagal memperbarui transaksi.', 'error');
  }
}

async function handleReset() {
  if (confirm('Reset data? Semua transaksi akan dihapus permanen.')) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', session.user.id);
      if (!error) {
        await refreshTransactions();
        showNotification('Semua data berhasil direset', 'info');
      } else {
        showNotification('Gagal mereset data.', 'error');
      }
    }
  }
}

function handleExport() {
  if (transactions.length === 0) {
    showNotification('Tidak ada data untuk di-export.', 'error');
    return;
  }
  exportToCSV(transactions);
  showNotification('Data berhasil diekspor!', 'success');
}

function handleImport() {
  elements.fileImport.click();
}

async function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    importFromCSV(file, async (dataBaru, berhasil) => {
      for (const item of dataBaru) {
        await addTransactionDB({
          tanggal: item.tanggal,
          deskripsi: item.deskripsi,
          pemasukan: item.pemasukan,
          pengeluaran: item.pengeluaran
        });
      }
      await refreshTransactions();
      showNotification(`${berhasil} data berhasil diimpor.`, 'success');
    });
  }
  elements.fileImport.value = '';
}

// ===== HANDLER UNTUK PROFIL DROPDOWN =====
function toggleDropdown(e) {
  e.stopPropagation();
  if (elements.dropdownMenu) elements.dropdownMenu.classList.toggle('show');
}

function closeDropdown() {
  if (elements.dropdownMenu) elements.dropdownMenu.classList.remove('show');
}

// ===== Event Delegation untuk tombol edit/hapus di tabel =====
if (elements.tableBody) {
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
}

// ===== Daftarkan Event Listener =====
if (elements.btnTambah) elements.btnTambah.addEventListener('click', handleTambah);
if (elements.btnCloseModal) elements.btnCloseModal.addEventListener('click', hideEditModal);
if (elements.btnCancelEdit) elements.btnCancelEdit.addEventListener('click', hideEditModal);
if (elements.formEdit) elements.formEdit.addEventListener('submit', handleSimpanEdit);

// Klik di luar modal untuk menutup
window.addEventListener('click', (e) => {
  if (e.target === elements.modalEdit) {
    hideEditModal();
  }
});

if (elements.btnExport) elements.btnExport.addEventListener('click', handleExport);
if (elements.btnImport) elements.btnImport.addEventListener('click', handleImport);
if (elements.fileImport) elements.fileImport.addEventListener('change', handleFileChange);
if (elements.btnReset) elements.btnReset.addEventListener('click', handleReset);

// ===== Event Listener untuk Profil Dropdown =====
if (elements.profileBtn) {
  elements.profileBtn.addEventListener('click', toggleDropdown);
}

// Tutup dropdown jika klik di luar area dropdown
window.addEventListener('click', (e) => {
  const isInsideDropdown = elements.profileBtn?.contains(e.target) || elements.dropdownMenu?.contains(e.target);
  if (!isInsideDropdown && elements.dropdownMenu) {
    closeDropdown();
  }
});

// ===== Inisialisasi Utama dengan Proteksi =====
(async () => {
  const isLoggedIn = await protectPage();
  if (isLoggedIn) {
    await refreshTransactions();
  }
})();
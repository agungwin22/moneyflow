// transaction.js - Logika bisnis transaksi

/**
 * Mengurutkan transaksi berdasarkan tanggal (ASC), jika sama urutkan berdasarkan id
 * @param {Array} transactions 
 * @returns {Array} - Transaksi terurut
 */
export function sortTransactions(transactions) {
  return [...transactions].sort((a, b) => {
    if (a.tanggal === b.tanggal) {
      return a.id.localeCompare(b.id);
    }
    return a.tanggal.localeCompare(b.tanggal);
  });
}

/**
 * Menambahkan saldo berjalan ke setiap transaksi (running balance)
 * @param {Array} sortedTransactions - Transaksi sudah terurut
 * @returns {Array} - Transaksi dengan properti runningBalance
 */
export function computeRunningBalance(sortedTransactions) {
  let running = 0;
  return sortedTransactions.map(t => {
    running += (Number(t.pemasukan) || 0) - (Number(t.pengeluaran) || 0);
    return { ...t, runningBalance: running };
  });
}

/**
 * Menghitung total saldo dari semua transaksi
 * @param {Array} transactions 
 * @returns {number} - Total saldo
 */
export function getTotalSaldo(transactions) {
  return transactions.reduce((acc, curr) => {
    return acc + (Number(curr.pemasukan) || 0) - (Number(curr.pengeluaran) || 0);
  }, 0);
}

/**
 * Menambahkan transaksi baru ke array
 * @param {Array} transactions 
 * @param {Object} newTransaction 
 * @returns {Array} - Array baru
 */
export function addTransaction(transactions, newTransaction) {
  return [...transactions, newTransaction];
}

/**
 * Memperbarui transaksi berdasarkan id
 * @param {Array} transactions 
 * @param {string} id 
 * @param {Object} updatedFields 
 * @returns {Array} - Array baru
 */
export function updateTransaction(transactions, id, updatedFields) {
  return transactions.map(t => t.id === id ? { ...t, ...updatedFields } : t);
}

/**
 * Menghapus transaksi berdasarkan id
 * @param {Array} transactions 
 * @param {string} id 
 * @returns {Array} - Array baru
 */
export function deleteTransaction(transactions, id) {
  return transactions.filter(t => t.id !== id);
}
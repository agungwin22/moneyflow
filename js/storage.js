// storage.js - Mengelola localStorage dan data contoh
import { generateId } from './utils.js';

const STORAGE_KEY = 'moneyflow_data';


/**
 * Memuat data dari localStorage. Jika kosong atau rusak, kembalikan array kosong.
 * @returns {Array} - Array transaksi
 */
export function loadTransactions() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Pastikan setiap item memiliki id
      return data.map(t => ({
        ...t,
        id: t.id || generateId()
      }));
    } catch (e) {
      return []; // jika rusak, mulai kosong
    }
  }
  return []; // tidak ada data, mulai kosong
}

/**
 * Menyimpan data transaksi ke localStorage
 * @param {Array} transactions 
 */
export function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
// database.js - Operasi CRUD ke Supabase
import { supabase } from './supabase.js';

// *
//  * Ambil semua transaksi milik user yang sedang login
//  * @returns {Array} - Array transaksi (sudah diurutkan berdasarkan tanggal)
 
export async function loadTransactions() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('tanggal', { ascending: true });

  if (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
  return data || [];
}

// *
//  * Tambah transaksi baru
//  * @param {Object} transaction - { tanggal, deskripsi, pemasukan, pengeluaran }
//  * @returns {Object|null} - Transaksi yang baru ditambahkan atau null jika error
 
export async function addTransaction(transaction) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: session.user.id,
      tanggal: transaction.tanggal,
      deskripsi: transaction.deskripsi,
      pemasukan: transaction.pemasukan,
      pengeluaran: transaction.pengeluaran
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
  return data;
}

// *
//  * Update transaksi berdasarkan id
//  * @param {string} id - UUID transaksi
//  * @param {Object} updates - Field yang diupdate (tanggal, deskripsi, pemasukan, pengeluaran)
//  * @returns {Object|null} - Transaksi yang sudah diupdate atau null jika error
 
export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    return null;
  }
  return data;
}

// *
//  * Hapus transaksi berdasarkan id
//  * @param {string} id - UUID transaksi
//  * @returns {boolean} - true jika berhasil
 
export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
  return true;
}
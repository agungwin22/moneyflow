// Ganti kredensial dari project setting
const SUPABASE_URL = "https://qrdvszwdkhypiodxbgwd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZHZzendka2h5cGlvZHhiZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDMxNTksImV4cCI6MjA5NDExOTE1OX0.hsgdEnxVBWHi9pVPVDbGxvk9EXtOLoqMrwc8YcYEjkU";

// inisialisai client
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// api/db.js
// File ini adalah Vercel Serverless Function.
// Fungsinya adalah untuk membaca environment variables yang sudah Anda atur di Vercel
// dan mengirimkannya ke frontend (client-side) dengan aman.

export default function handler(request, response) {
  // Ambil URL dan Kunci Anon dari environment variables di server Vercel
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  // Lakukan pengecekan untuk memastikan variabel ada di Vercel
  if (!supabaseUrl || !supabaseAnonKey) {
    // Jika salah satu atau keduanya tidak ditemukan, kirim pesan error
    return response.status(500).json({ 
      error: 'Supabase URL atau Anon Key tidak diatur di environment variables.' 
    });
  }

  // Jika berhasil, kirimkan kunci sebagai response JSON
  response.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
  });
}

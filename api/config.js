// File ini akan menjadi endpoint di: /api/config
// Fungsinya untuk mengirim Supabase keys dengan aman ke browser.

export default function handler(request, response) {
  // Ambil variabel dari pengaturan Vercel
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  // Cek apakah keys sudah diatur di Vercel
  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(500).json({ 
      error: 'Environment variables Supabase tidak diatur di Vercel.' 
    });
  }

  // Kirim keys sebagai JSON
  response.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
  });
}

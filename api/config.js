// File: /api/config.js
// Endpoint ini sekarang lebih aman dengan memeriksa 'Referer' header.

export default function handler(request, response) {
  // 1. Dapatkan URL asal permintaan (referer) dari browser
  const referer = request.headers.referer;

  // 2. Dapatkan URL resmi aplikasi kamu dari environment variable Vercel
  // Vercel secara otomatis menyediakan variabel 'VERCEL_URL'
  const allowedDomain = `https://` + process.env.VERCEL_URL;

  // 3. Logika Keamanan:
  // Hanya berikan keys jika permintaan datang dari domain yang diizinkan.
  // Pengecekan 'referer && referer.startsWith(allowedDomain)' memastikan
  // permintaan BUKAN dari akses langsung atau dari website lain.
  if (referer && referer.startsWith(allowedDomain)) {
    // Permintaan valid, kirimkan keys
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return response.status(500).json({ 
        error: 'Environment variables Supabase tidak diatur dengan benar di Vercel.' 
      });
    }

    response.status(200).json({
      supabaseUrl,
      supabaseAnonKey,
    });
  } else {
    // Permintaan tidak valid, tolak akses!
    response.status(403).json({ 
      error: 'Akses ditolak.' 
    });
  }
}


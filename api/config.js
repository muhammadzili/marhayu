// File: /api/config.js
// Logika diperbarui untuk menangani beberapa domain yang diizinkan (produksi & preview).

export default function handler(request, response) {
  const referer = request.headers.referer;

  // 1. Definisikan semua origin/domain yang diizinkan dalam sebuah daftar
  const allowedOrigins = [
    // Domain produksi utama (dari Vercel env var SITE_URL)
    process.env.SITE_URL ? `https://${process.env.SITE_URL}` : null,
    // URL deployment preview Vercel (dari Vercel env var VERCEL_URL)
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean); // Menghapus nilai yang kosong/null dari daftar

  // (Untuk debugging di Vercel Log)
  console.log("Request Referer:", referer);
  console.log("Allowed Origins:", allowedOrigins);

  // Pastikan ada setidaknya satu origin yang diizinkan
  if (allowedOrigins.length === 0) {
      return response.status(500).json({ 
        error: 'Environment variable SITE_URL atau VERCEL_URL tidak ditemukan.'
      });
  }

  try {
    // Ekstrak origin dari URL referer (e.g., "https://marhayu.vercel.app")
    const refererOrigin = referer ? new URL(referer).origin : null;
    
    // 2. Logika Keamanan Utama:
    // Cek apakah origin dari referer ada di dalam daftar yang kita izinkan.
    if (refererOrigin && allowedOrigins.includes(refererOrigin)) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        return response.status(500).json({ 
          error: 'Environment variables Supabase tidak diatur.' 
        });
      }

      return response.status(200).json({
        supabaseUrl,
        supabaseAnonKey,
      });
    } else {
      // Tolak akses jika origin tidak ada dalam daftar
      return response.status(403).json({ 
        error: 'Akses ditolak karena origin tidak diizinkan.',
        details: `Origin yang diizinkan: ${allowedOrigins.join(', ')}. Origin yang diterima: ${refererOrigin || 'tidak ada'}.`
      });
    }
  } catch (error) {
      console.error("Error saat mem-parsing URL referer:", error);
      return response.status(400).json({
          error: 'Header Referer tidak valid.'
      });
  }
}


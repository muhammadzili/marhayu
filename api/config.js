// File: /api/config.js
// Logika diperbarui untuk menangani domain produksi dan preview Vercel dengan benar.

export default function handler(request, response) {
  const referer = request.headers.referer;
  
  // Dapatkan environment dari Vercel ('production', 'preview', 'development')
  const vercelEnv = process.env.VERCEL_ENV;
  
  // Dapatkan host resmi aplikasi
  // Jika di produksi, gunakan SITE_URL. Jika tidak, gunakan VERCEL_URL.
  const allowedHost = vercelEnv === 'production' 
    ? process.env.SITE_URL 
    : process.env.VERCEL_URL;

  // (Untuk debugging)
  console.log("Request Referer:", referer);
  console.log("Vercel Environment:", vercelEnv);
  console.log("Allowed Host:", allowedHost);

  // Pastikan host yang diizinkan sudah diatur
  if (!allowedHost) {
      return response.status(500).json({ 
        error: 'Environment variable SITE_URL atau VERCEL_URL tidak ditemukan.'
      });
  }

  try {
    const refererHost = referer ? new URL(referer).host : null;
    
    // Logika Keamanan Utama:
    // Bandingkan host dari referer dengan host yang diizinkan.
    if (refererHost === allowedHost) {
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
      // Tolak akses jika host tidak cocok
      return response.status(403).json({ 
        error: 'Akses ditolak karena host tidak cocok.',
        details: `Host yang diharapkan: ${allowedHost}, Host yang diterima: ${refererHost || 'tidak ada'}.`
      });
    }
  } catch (error) {
      console.error("Error saat mem-parsing URL referer:", error);
      return response.status(400).json({
          error: 'Header Referer tidak valid.'
      });
  }
}


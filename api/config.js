// File: /api/config.js
// Endpoint ini sekarang lebih aman dengan memeriksa 'Referer' host, 
// cara ini lebih andal di lingkungan Vercel.

export default function handler(request, response) {
  // 1. Dapatkan URL asal permintaan (referer) dan host aplikasi dari Vercel
  const referer = request.headers.referer;
  // VERCEL_URL adalah host kanonis (e.g., marhayu.vercel.app) yang disediakan Vercel
  const allowedHost = process.env.VERCEL_URL;
  
  // (Untuk debugging) Kamu bisa melihat log ini di dashboard Vercel
  console.log("Request Referer:", referer);
  console.log("Allowed Host (from VERCEL_URL):", allowedHost);

  // Pastikan variabel VERCEL_URL ada
  if (!allowedHost) {
      return response.status(500).json({ 
        error: 'VERCEL_URL environment variable tidak ditemukan.'
      });
  }

  try {
    // 2. Ekstrak 'host' dari URL referer
    const refererHost = referer ? new URL(referer).host : null;
    console.log("Extracted Referer Host:", refererHost);

    // 3. Logika Keamanan Utama:
    // Bandingkan host dari referer dengan host resmi aplikasi di Vercel.
    if (refererHost === allowedHost) {
      // Permintaan valid, kirimkan keys
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        return response.status(500).json({ 
          error: 'Environment variables Supabase tidak diatur dengan benar di Vercel.' 
        });
      }

      return response.status(200).json({
        supabaseUrl,
        supabaseAnonKey,
      });
    } else {
      // Permintaan tidak valid (host tidak cocok atau referer tidak ada), tolak akses!
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


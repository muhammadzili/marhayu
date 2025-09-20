// api/db.js
// Versi ini diperbarui dengan keamanan yang lebih ketat.

export default function handler(request, response) {
  // --- Pemeriksaan Keamanan Tingkat Tinggi ---

  // 1. Hanya izinkan metode 'GET'.
  // Metode lain seperti POST, PUT, DELETE, dll. akan ditolak.
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Blokir akses langsung dari browser.
  // Header 'sec-fetch-site' akan bernilai 'none' jika URL diakses langsung,
  // dan 'same-origin' jika di-fetch oleh JavaScript dari halaman di domain yang sama.
  // Ini adalah cara paling efektif untuk mencegah akses langsung.
  const secFetchSite = request.headers['sec-fetch-site'];
  if (secFetchSite !== 'same-origin') {
     return response.status(403).json({ error: 'Forbidden: Direct access is not allowed.' });
  }
  
  // 3. (Lapisan Tambahan) Verifikasi 'Referer'
  // Memastikan permintaan datang dari domain aplikasi Anda yang sebenarnya.
  // Vercel secara otomatis menyediakan `process.env.VERCEL_URL`.
  const referer = request.headers['referer'];
  const allowedDomain = process.env.VERCEL_URL;

  // Di lingkungan development, VERCEL_URL mungkin tidak ada, jadi kita longgarkan sedikit.
  // Namun di production, pemeriksaan ini akan berjalan.
  if (allowedDomain && (!referer || !referer.startsWith(`https://${allowedDomain}`))) {
       return response.status(403).json({ error: 'Forbidden: Invalid origin.' });
  }

  // --- Logika Utama (jika semua pemeriksaan keamanan lolos) ---

  // Ambil URL dan Kunci Anon dari environment variables di server Vercel
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Jika salah satu atau keduanya tidak ditemukan, kirim pesan error
    return response.status(500).json({ 
      error: 'Server configuration error.' 
    });
  }

  // Kirimkan kunci sebagai response JSON
  response.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
  });
}


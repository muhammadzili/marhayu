// api/db.js
// Versi ini diperbarui dengan keamanan yang lebih fleksibel untuk development.

export default function handler(request, response) {
  // --- Pemeriksaan Keamanan ---

  // 1. Hanya izinkan metode 'GET'.
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Blokir akses langsung dari browser (ketika URL diketik di address bar).
  // Permintaan dari skrip (seperti fetch) akan memiliki nilai selain 'none'.
  // Ini adalah perbaikan utama untuk mengatasi error 403 di lingkungan lokal.
  const secFetchSite = request.headers['sec-fetch-site'];
  if (secFetchSite === 'none') {
     return response.status(403).json({ error: 'Forbidden: Direct access is not allowed.' });
  }
  
  // 3. (Lapisan Tambahan) Verifikasi 'Referer' di lingkungan produksi.
  // Memastikan permintaan datang dari domain aplikasi Anda yang sebenarnya.
  const referer = request.headers['referer'];
  const host = request.headers['host'];

  // Pemeriksaan ini hanya berjalan di lingkungan produksi Vercel untuk keamanan maksimal.
  if (process.env.NODE_ENV === 'production' && (!referer || new URL(referer).host !== host)) {
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


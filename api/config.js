// File: /api/config.js
// Logika diperbarui untuk memblokir akses langsung dan hanya mengizinkan
// permintaan yang berasal dari halaman web di domain yang sama.

export default function handler(request, response) {
  // 1. Gunakan header 'Sec-Fetch-Site' untuk keamanan yang lebih andal
  // Header ini dikirim oleh browser modern untuk mengindikasikan asal permintaan.
  // 'same-origin': Permintaan berasal dari halaman di situs Anda (misal: auth.html).
  // 'none': Pengguna mengetik URL langsung di browser.
  // 'cross-site': Permintaan dari situs lain.
  const secFetchSite = request.headers['sec-fetch-site'];

  // (Untuk debugging di Vercel Log)
  console.log("Request Header 'Sec-Fetch-Site':", secFetchSite);

  // 2. Logika Keamanan Utama:
  // Hanya izinkan permintaan jika header-nya adalah 'same-origin'.
  if (secFetchSite === 'same-origin') {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return response.status(500).json({
        error: 'Environment variables Supabase tidak diatur.'
      });
    }
    
    // Set header agar respons tidak di-cache oleh browser
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');

    return response.status(200).json({
      supabaseUrl,
      supabaseAnonKey,
    });
  } else {
    // Tolak semua jenis permintaan lain, termasuk akses langsung ('none')
    return response.status(403).json({
      error: 'Akses ditolak.',
      details: `Permintaan ini tampaknya merupakan akses langsung atau dari sumber yang tidak diizinkan.`
    });
  }
}


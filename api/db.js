// api/db.js
// Versi ini diperbarui dengan metode "secret handshake" untuk keandalan maksimal.

export default function handler(request, response) {
  // --- Pemeriksaan Keamanan ---

  // 1. Hanya izinkan metode 'GET'.
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. SOLUSI MUTAKHIR: Periksa header kustom ('X-Requested-With').
  // Ini adalah "secret handshake". Hanya permintaan dari skrip fetch kita
  // yang akan memiliki header ini. Akses langsung dari browser tidak akan memilikinya.
  // Ini menyelesaikan masalah 403 saat development secara andal.
  if (request.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return response.status(403).json({ error: 'Forbidden: Direct access is not allowed.' });
  }

  // 3. (Lapisan Tambahan) Blokir rendering sebagai dokumen.
  // Ini sebagai pengaman tambahan jika ada browser yang tidak mengirim header di atas.
  if (request.headers['sec-fetch-dest'] === 'document') {
    return response.status(403).json({ error: 'Forbidden' });
  }

  // --- Logika Utama (jika semua pemeriksaan keamanan lolos) ---

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
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


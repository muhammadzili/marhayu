// api/db.js
// Versi ini menambahkan penanganan CORS yang benar untuk menyelesaikan error 403.

export default function handler(request, response) {
  // --- Penanganan CORS (Cross-Origin Resource Sharing) ---
  
  // Izinkan permintaan dari origin mana pun. Keamanan kita tidak bergantung pada ini,
  // melainkan pada header kustom di bawah. Ini penting agar preflight request berhasil.
  response.setHeader('Access-Control-Allow-Origin', '*'); 
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

  // Jika ini adalah "preflight request" (metode OPTIONS), browser sedang memeriksa
  // izin CORS. Kita harus meresponsnya dengan status 200 OK agar browser melanjutkan.
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // --- Pemeriksaan Keamanan untuk GET ---
  
  // Hanya izinkan metode GET setelah preflight berhasil.
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
  
  // Pemeriksaan "secret handshake" tetap menjadi kunci keamanan utama kita
  // untuk memblokir akses langsung dari URL di browser.
  if (request.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return response.status(403).json({ error: 'Forbidden: Direct access is not allowed.' });
  }
  
  // --- Logika Utama ---
  
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


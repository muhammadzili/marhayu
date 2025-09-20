// api/db.js
// Versi ini disederhanakan. Logika keamanan dipindahkan ke vercel.json.

export default function handler(request, response) {
  // Satu-satunya pemeriksaan yang kita butuhkan di sini adalah metodenya.
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- Logika Utama ---
  // Vercel.json akan memblokir semua permintaan yang tidak sah
  // sebelum mereka sampai ke titik ini.

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


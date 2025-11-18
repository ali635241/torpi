/** @type {import('next').NextConfig} */

const nextConfig = {
  // reactStrictMode: true, 
  
  async rewrites() {
    return [
      {
        // Bizim Next.js projemize /api/proxy/ BİRŞEY olarak gelen istekleri...
        source: '/api/proxy/:path*',
        
        // Arka planda https://torpidoda-api.railway.app/api/v1/BİRŞEY olarak yönlendir.
        destination: 'https://torpidoda-api.railway.app/api/v1/:path*', // <-- /api/v1 eklendi
      },
    ];
  },
};

module.exports = nextConfig;
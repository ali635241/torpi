import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

// SEO ve Başlık için Metadata objesi
export const metadata = {
  title: 'Torpidoda - Araç ve Belge Yönetim Sistemi',
  description: 'Araç ve belgelerinizi tek bir platformda yönetin, hatırlatıcıları kaçırmayın.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* Font Awesome CDN linki */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body>
        <Header />
        <main>
          {children} {/* Sayfalarınız buraya gelecek */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
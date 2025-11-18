'use client'; 

import { useState, Suspense, useEffect } from 'react'; 
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; 
import api from '../../../lib/api'; // ../../../lib/api yolu düzeltildi
import styles from './verify.module.css'; // Yeni CSS

// Suspense ile useSearchParams'ı kullanmak için içerik component'i
function ServiceVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get('contact'); // URL'den contact'ı al (e-posta veya tel)

  // --- State'ler ---
  const [code, setCode] = useState(''); // Doğrulama kodu
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

   // --- Rota Koruma ---
   useEffect(() => {
    if (!contact) {
      console.warn("URL'de contact bilgisi bulunamadı, kayıt sayfasına yönlendiriliyor...");
      router.replace('/service/register'); 
    }
   }, [contact, router]);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!code || code.length !== 6) { // Varsayılan 6 hane
      setError('Lütfen 6 haneli doğrulama kodunu girin.');
      return;
    }

    setIsLoading(true);

    // --- SİMÜLASYON ---
    // Backend CORS'u düzeltince gerçek API isteği atılmalı
    // (API dokümanında servis doğrulama için özel endpoint belirtilmemiş, 
    // müşteri tarafındaki /auth/verify-phone benzeri bir endpoint olabilir)
    console.log(`--- SİMÜLASYON: Servis Doğrulama İsteği ---`);
    console.log({ contact: contact, code: '******' }); 

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    // Simülasyon: Kod kontrolü
    if (code === "000000") { // Test için yanlış kod
        console.log('--- SİMÜLASYON: Kod hatalı ---');
        setError("Girilen doğrulama kodu hatalı veya süresi dolmuş.");
        setIsLoading(false);
        return;
    }

    console.log('--- SİMÜLASYON: Hesap doğrulandı! Giriş sayfasına yönlendiriliyor... ---');
    setSuccessMessage('Hesabınız başarıyla doğrulandı. Şimdi giriş yapabilirsiniz.');
    setIsLoading(false);

    // 2 saniye sonra servis login'e yönlendir
    setTimeout(() => {
        router.push('/service/login'); // Henüz var olmayan servis login sayfası
    }, 2000);
  };

  // Eğer contact yoksa yükleniyor göster
  if (!contact) {
      return <div className={styles.loading}>Yönlendiriliyor...</div>;
  }

  // İletişim bilgisini maskeleme (opsiyonel)
  let maskedContact = contact;
    if (contact.includes('@')) {
        const parts = contact.split('@');
        if (parts[0].length > 3) maskedContact = `${parts[0].substring(0, 1)}***${parts[0].substring(parts[0].length - 1)}@${parts[1]}`;
    } else {
        const digitsOnly = contact.replace(/\D/g, '');
        if (digitsOnly.length >= 10) maskedContact = `${digitsOnly.substring(0, 3)}***${digitsOnly.substring(digitsOnly.length - 4)}`;
    }


  return (
    // forgotPassword stiline benzer
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}><i className="fas fa-tools"></i></div>
        <div className={styles.logoText}>TORPİDODA - Servis Paneli</div>
      </Link>

      <h2 className={styles.title}>Hesap Doğrulama</h2>
      <p className={styles.subtitle}>
        Lütfen <strong>{maskedContact}</strong> adresine gönderilen 6 haneli doğrulama kodunu girin. (WhatsApp ve E-posta kontrol ediniz)
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        {/* Form alanları (başarı mesajı yoksa göster) */}
        {!successMessage && (
            <>
                {/* İletişim Bilgisi (Sadece Gösterim) */}
                <div className={styles.formGroup}>
                    <label>Doğrulanacak Hesap</label>
                    <input type="text" value={contact} readOnly disabled className={`${styles.input} ${styles.disabledInput}`} />
                </div>

                {/* Doğrulama Kodu */}
                <div className={styles.formGroup}>
                    <label htmlFor="code">Doğrulama Kodu *</label>
                    <input
                        type="tel" // Rakam klavyesi
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Sadece rakam
                        required
                        maxLength={6}
                        placeholder="6 haneli kodu girin"
                        className={styles.input}
                    />
                </div>

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Doğrulanıyor...' : 'Hesabı Doğrula'}
                </button>
            </>
        )}
      </form>

      {/* Sadece başarı mesajı yoksa göster */}
      {!successMessage && (
        <div className={styles.footerText}>
            Kodu almadınız mı?
            <Link href="/service/register" className={styles.link}> Tekrar Kayıt Olmayı Deneyin</Link>
            {/* TODO: API'de varsa "Kodu Tekrar Gönder" butonu eklenebilir */}
        </div>
      )}
    </div>
  );
}

// Ana Sayfa Bileşeni (Suspense ile)
export default function ServiceVerifyPage() {
  return (
    // useSearchParams için Suspense zorunlu
    <Suspense fallback={<div className={styles.loading}>Yükleniyor...</div>}>
      <ServiceVerifyContent />
    </Suspense>
  );
}
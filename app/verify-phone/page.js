'use client'; // Form ve hook'lar için zorunlu

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../lib/api'; // API istemcimiz
import styles from './verify.module.css'; // Yeni CSS modülümüz

// Suspense (askıya alma) ile useSearchParams'ı doğru kullanmak için
// sayfa içeriğini ayrı bir component'e alıyoruz.
function VerifyPhoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone'); // URL'den telefonu al

  const [code, setCode] = useState(''); // 6 haneli kod
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!code || code.length !== 6) {
      setError('Lütfen 6 haneli doğrulama kodunu girin.');
      setIsLoading(false);
      return;
    }

    // --- SİMÜLASYON (CORS HATASI NEDENİYLE) ---
    // Backend'deki CORS hatası düzeltilene kadar bu simülasyonu kullanıyoruz.
    
    console.log('--- SİMÜLASYON: Doğrulama isteği ---');
    console.log({ phone: phone, code: code });
    
    // Sahte gecikme
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Sahte başarı mesajı
    alert('Telefon doğrulandı. Artık giriş yapabilirsiniz.');
    router.push('/login'); // Başarılı, login'e yönlendir

    
    /*
    // --- ORİJİNAL (CORS HATASI VEREN) KOD ---
    // Backend düzeltildiğinde bu blok açılmalı ve üstteki simülasyon silinmeli.
    try {
      // API'ye doğrulama isteği at
      const response = await api.post('/auth/verify-phone', {
        phone: phone, // URL'den alınan telefon
        code: code,   // Kullanıcının girdiği kod
      });

      // Başarılı!
      alert(response.message || 'Telefon doğrulandı. Artık giriş yapabilirsiniz.');
      router.push('/login');

    } catch (err) {
      // Hata (örn: kod yanlış)
      console.error('Doğrulama hatası:', err);
      setError(err.message || 'Doğrulama kodu hatalı veya süresi dolmuş.');
      setIsLoading(false);
    }
    */
  };

  // Telefon numarasını maskeleme (örn: 555***4567)
  const maskedPhone = phone ? `${phone.substring(0, 3)}***${phone.substring(6)}` : 'telefon numaranıza';

  return (
    <div className={styles.verifyContainer}> 
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}><i className="fas fa-car"></i></div>
        <div className={styles.logoText}>TORPİDODA</div>
      </Link>

      <h2 className={styles.title}>Telefon Doğrulama</h2>
      <p className={styles.subtitle}>
        Lütfen <strong>{maskedPhone}</strong> gelen 6 haneli doğrulama kodunu girin.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.inputGroup}>
          <i className="fas fa-hashtag"></i>
          <input
            type="tel"
            id="code"
            placeholder="Doğrulama Kodu"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Sadece rakam
            required
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
        </button>
      </form>

      <div className={styles.footerText}>
        Kodu almadınız mı? 
        <Link href="/register" className={styles.link}>Tekrar kayıt olmayı deneyin.</Link>
      </div>
    </div>
  );
}

// Ana Sayfa Bileşeni (Suspense sarmalayıcısı ile)
export default function VerifyPhonePage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <VerifyPhoneContent />
    </Suspense>
  );
}
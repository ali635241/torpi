'use client'; // Form ve hook'lar için

import { useState, Suspense, useEffect } from 'react'; // Suspense ve useEffect eklendi
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams eklendi
import api from '../../lib/api'; 
import styles from './resetPassword.module.css'; 

// Suspense ile useSearchParams'ı kullanmak için içerik component'i
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get('contact'); // URL'den contact'ı al

  // --- State'ler ---
  const [code, setCode] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

   // --- Rota Koruma ---
   useEffect(() => {
    if (!contact) {
      console.warn("URL'de contact bilgisi bulunamadı, yönlendiriliyor...");
      router.replace('/forgot-password'); 
    }
   }, [contact, router]);


  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    // --- Frontend Validasyon ---
    if (!code || !newPassword || !newPasswordConfirm) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
     // API dokümanına göre kod 6 haneli
     if (code.length !== 6) { 
       setError('Sıfırlama kodu 6 haneli olmalıdır.');
       return;
     }
    if (newPassword !== newPasswordConfirm) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }
    // Minimum şifre uzunluğu
    if (newPassword.length < 8) { 
        setError('Yeni şifre en az 8 karakter olmalıdır.');
        return;
    }

    setIsLoading(true);

    // API'nin istediği veri
    const resetData = {
      phoneOrEmail: contact, 
      code: code,
      newPassword: newPassword,
    };

    // --- SİMÜLASYON ---
    console.log(`--- SİMÜLASYON: Şifre Sıfırlama İsteği ---`);
    console.log({ phoneOrEmail: contact, code: '******', newPassword: '***' }); 

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    // Simülasyon: Kod kontrolü
    if (code === "000000") { 
        console.log('--- SİMÜLASYON: Kod hatalı ---');
        setError("Girilen sıfırlama kodu hatalı veya süresi dolmuş.");
        setIsLoading(false);
        return;
    }

    console.log('--- SİMÜLASYON: Şifre sıfırlandı! Giriş sayfasına yönlendiriliyor... ---');
    setSuccessMessage('Şifreniz başarıyla sıfırlandı. Şimdi giriş yapabilirsiniz.');
    setIsLoading(false);

    // 2 saniye sonra login'e yönlendir
    setTimeout(() => {
        router.push('/login');
    }, 2000);
  };

  // Eğer contact yoksa yükleniyor göster
  if (!contact) {
      return <div className={styles.loading}>Yönlendiriliyor...</div>;
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}><i className="fas fa-car"></i></div>
        <div className={styles.logoText}>TORPİDODA</div>
      </Link>

      <h2 className={styles.title}>Yeni Şifre Belirle</h2>
      <p className={styles.subtitle}>
        <strong>{contact}</strong> adresine gönderilen 6 haneli kodu ve yeni şifrenizi girin.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        {!successMessage && (
            <>
                {/* İletişim Bilgisi */}
                <div className={styles.formGroup}>
                    <label>Telefon / E-posta</label>
                    <input
                        type="text"
                        value={contact}
                        readOnly
                        disabled
                        className={`${styles.input} ${styles.disabledInput}`}
                    />
                </div>

                {/* Sıfırlama Kodu */}
                <div className={styles.formGroup}>
                    <label htmlFor="code">Sıfırlama Kodu *</label>
                    <input
                        type="tel" 
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} 
                        required
                        maxLength={6}
                        placeholder="6 haneli kodu girin"
                        className={styles.input}
                    />
                </div>

                {/* Yeni Şifre */}
                <div className={styles.formGroup}>
                    <label htmlFor="newPassword">Yeni Şifre *</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Yeni şifrenizi girin (en az 8 karakter)"
                        className={styles.input}
                    />
                </div>

                {/* Yeni Şifre Tekrar */}
                <div className={styles.formGroup}>
                    <label htmlFor="newPasswordConfirm">Yeni Şifre (Tekrar) *</label>
                    <input
                        type="password"
                        id="newPasswordConfirm"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        required
                        placeholder="Yeni şifrenizi tekrar girin"
                        className={styles.input}
                    />
                    {newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm && (
                        <p className={styles.passwordMismatchError}>Yeni şifreler eşleşmiyor!</p>
                    )}
                </div>

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor...' : 'Şifreyi Sıfırla'}
                </button>
            </>
        )}
      </form>

      {!successMessage && (
        <div className={styles.footerText}>
            Sorun mu yaşıyorsunuz?
            <Link href="/forgot-password" className={styles.link}> Tekrar Kod İste</Link>
        </div>
      )}
    </div>
  );
}

// Ana Sayfa Bileşeni (Suspense ile)
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Yükleniyor...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api'; 
import styles from './forgotPassword.module.css'; 

export default function ForgotPasswordPage() {
  const router = useRouter();

  // --- State'ler ---
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); 

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!phoneOrEmail) {
      setError('Lütfen telefon numaranızı veya e-posta adresinizi girin.');
      return;
    }

    setIsLoading(true);

    // --- SİMÜLASYON ---
    console.log(`--- SİMÜLASYON: Şifre Sıfırlama Kodu İsteği ---`);
    console.log({ phoneOrEmail });

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    // Başarı mesajını göster
    let maskedValue = phoneOrEmail;
    if (phoneOrEmail.includes('@')) {
        const parts = phoneOrEmail.split('@');
        if (parts[0].length > 3) {
            maskedValue = `${parts[0].substring(0, 1)}***${parts[0].substring(parts[0].length - 1)}@${parts[1]}`;
        }
    } else {
        const digitsOnly = phoneOrEmail.replace(/\D/g, '');
        if (digitsOnly.length === 10) {
            maskedValue = `${digitsOnly.substring(0, 3)}***${digitsOnly.substring(6)}`;
        }
    }
    setSuccessMessage(`Şifre sıfırlama kodu ${maskedValue} adresine gönderildi (Simülasyon). Lütfen kodu girin.`);
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}><i className="fas fa-car"></i></div>
        <div className={styles.logoText}>TORPİDODA</div>
      </Link>

      <h2 className={styles.title}>Şifremi Unuttum</h2>
      <p className={styles.subtitle}>
        Hesabınıza kayıtlı telefon numarasını veya e-posta adresini girin. Size bir sıfırlama kodu göndereceğiz.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Hata Mesajı */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {/* Başarı Mesajı */}
        {successMessage && (
            <div className={styles.successMessage}>
                {successMessage}
                <br />
                <Link href={`/reset-password?contact=${encodeURIComponent(phoneOrEmail)}`} className={styles.resetLink}>
                    Şimdi Sıfırlama Kodunu Girin
                </Link>
            </div>
        )}

        {/* Sadece mesaj yoksa formu göster */}
        {!successMessage && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="phoneOrEmail">Telefon veya E-posta *</label>
              <input
                type="text"
                id="phoneOrEmail"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                required
                placeholder="5xx xxx xxxx veya ornek@email.com"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Kodu Gönder'}
            </button>
          </>
        )}
      </form>

      <div className={styles.footerText}>
        Şifrenizi hatırladınız mı?
        <Link href="/login" className={styles.link}> Giriş Yap</Link>
      </div>
    </div>
  );
}
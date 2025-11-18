'use client'; 

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import api from '../../../lib/api'; // ../../../lib/api yolu düzeltildi
import styles from './login.module.css'; // Yeni CSS

export default function ServiceLoginPage() {
  const router = useRouter(); 

  // --- State'ler ---
  // Müşteri login'deki gibi 'login' (e-posta/tel), 'password', 'rememberMe' kullanalım
  const [login, setLogin] = useState(''); 
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    setIsLoading(true);

    if (!login || !password) {
      setError('E-posta/Telefon ve şifre alanları zorunludur.');
      setIsLoading(false);
      return;
    }

    // --- SİMÜLASYON (CORS Hatası nedeniyle) ---
    // Backend CORS'u düzeltince gerçek API isteği atılmalı (örn: api.post('/service/auth/login', ...))
    console.log('--- SİMÜLASYON: Servis Giriş isteği ---');
    console.log({ login: login, password: '***', rememberMe: rememberMe });

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    // Simülasyon: Giriş Başarılı
    // Sahte 'accessToken'ı tarayıcıya kaydet (Müşteri token'ından farklı olabilir)
    // Şimdilik aynı anahtarı kullanalım, gerçek implementasyonda ayrılabilir.
    localStorage.setItem('accessToken', 'MOCK_SERVICE_TOKEN_eyJh...'); 
    // localStorage.setItem('serviceUser', JSON.stringify({ /* sahte servis kullanıcı bilgisi */ })); // Opsiyonel

    setIsLoading(false);
    
    // Kullanıcıyı Servis Kontrol Paneline (/service/dashboard) yönlendir
    // Bu sayfa henüz yok (404 alacağız)
    router.push('/service/dashboard'); 
  };

  return (
    // Müşteri login stiline benzer
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}><i className="fas fa-tools"></i></div>
        <div className={styles.logoText}>TORPİDODA - Servis Paneli</div>
      </Link>

      <h2 className={styles.title}>Servis Paneli Girişi</h2>
      <p className={styles.subtitle}>
        İşletme hesabınıza veya çalışan hesabınıza giriş yapın.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* E-posta veya Telefon */}
        <div className={styles.formGroup}>
            <label htmlFor="login">E-posta / Telefon *</label>
            <input 
              type="text" 
              id="login"
              placeholder="Firma e-postası veya telefon" 
              required 
              value={login} 
              onChange={(e) => setLogin(e.target.value)} 
              className={styles.input}
            />
        </div>
          
        {/* Şifre */}
        <div className={styles.formGroup}>
            <label htmlFor="password">Şifre *</label>
            <input 
              type="password" 
              id="password"
              placeholder="Şifreniz" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={styles.input}
            />
        </div>
          
        {/* Seçenekler */}
        <div className={styles.options}>
            <div className={styles.rememberMe}>
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <label htmlFor="remember">Beni Hatırla</label>
            </div>
            {/* Şimdilik şifre sıfırlama linki koymayalım, müşteri tarafıyla karışabilir */}
            {/* <Link href="/service/forgot-password" className={styles.forgotPassword}>Şifremi Unuttum?</Link> */}
        </div>
          
        {/* Buton */}
        <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
          
        <div className={styles.footerText}>
            Henüz servis kaydınız yok mu? 
            <Link href="/service/register" className={styles.link}> Servis Kaydı Oluştur</Link>
        </div>
      </form>
    </div>
  );
}
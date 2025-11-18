'use client'; 

import Link from 'next/link';
import styles from './login.module.css'; 
import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; // Yönlendirme için
import api from '../../lib/api'; // API istemcimiz (simülasyonda olsak da import kalsın)

export default function LoginPage() {
  
  const router = useRouter(); 
  
  // Tab state (zaten vardı)
  const [activeTab, setActiveTab] = useState('individual');

  // --- Form state'leri ---
  const [login, setLogin] = useState(''); // Telefon veya E-posta
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Beni Hatırla

  // --- UI (Arayüz) state'leri ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Form gönderim (submit) fonksiyonu (SİMÜLASYONLU) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    setIsLoading(true);

    if (!login || !password) {
      setError('Telefon/E-posta ve şifre alanları zorunludur.');
      setIsLoading(false);
      return;
    }

    // --- API SİMÜLASYONU (CORS Hatası nedeniyle) ---
    // Backend'deki CORS hatası düzeltildiğinde bu simülasyon kaldırılmalı
    // ve aşağıdaki 'try...catch' bloğu açılmalıdır.
    
    console.log('--- SİMÜLASYON: Giriş isteği ---');
    console.log({
      login: login,
      password: password,
      rememberMe: rememberMe,
    });

    // Sahte gecikme
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Sahte 'accessToken'ı tarayıcıya kaydet 
    localStorage.setItem('accessToken', 'MOCK_TOKEN_eyJh...bu_sahte_bir_tokendir');

    setIsLoading(false);
    
    // Kullanıcıyı Kontrol Paneline (/dashboard) yönlendir
    router.push('/dashboard');

    /*
    // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
    // Backend düzeltildiğinde bu blok açılmalı ve üstteki simülasyon silinmeli.
    try {
      const response = await api.post('/auth/login', {
        login: login,
        password: password,
        rememberMe: rememberMe,
      });

      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      setIsLoading(false);
      router.push('/dashboard');

    } catch (err) {
      console.error('Giriş hatası:', err);
      setError(err.message || 'Giriş sırasında bir hata oluştu.');
      setIsLoading(false);
    }
    */
  };
  
  // Tab değiştiğinde form state'lerini temizle
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLogin('');
    setPassword('');
    setRememberMe(false);
    setError(null);
  };

  return (
    <div className={`${styles.loginContainer} pageContainer`}>
      <div className={styles.loginLeft}>
        {/* ... (Sol taraf, logo ve özellikler) ... */}
        <Link href="/" className={styles.loginLogo}>
          <div className={styles.loginLogoIcon}>
            <i className="fas fa-car"></i>
          </div>
          <div className={styles.loginLogoText}>TORPİDODA</div>
        </Link>
        <div className={styles.panelContent}>
          <h2>Araç Belgeleriniz Dijitalde!</h2>
          <p>Araç belgelerinin dijitalleştirilmesi ile birlikte daha fazla zaman kazanın.</p>
          <div className={styles.features}>
            <div className={styles.feature}>
                <i className="fas fa-file-invoice"></i>
                <div>Araç ruhsatı, sigorta, muayene ve tüm belgeler tek platformda</div>
            </div>
            <div className={styles.feature}>
                <i className="fas fa-shield-alt"></i>
                <div>Güvenli dijital arşivleme ile belgeleriniz koruma altında</div>
            </div>
            <div className={styles.feature}>
                <i className="fas fa-mobile-alt"></i>
                <div>Araç belgelerinize her yerden ve her cihazdan erişim</div>
            </div>
            <div className={styles.feature}>
                <i className="fas fa-bell"></i>
                <div>Son kullanma tarihi yaklaşan belgeler için otomatik hatırlatma</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.loginRight}>
        <div className={styles.tabs}>
          {/* Tab'lar handleTabChange fonksiyonunu çağırıyor */}
          <div 
            className={`${styles.tab} ${activeTab === 'individual' ? styles.active : ''}`} 
            onClick={() => handleTabChange('individual')}
          >
            Bireysel Giriş
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'corporate' ? styles.active : ''}`}
            onClick={() => handleTabChange('corporate')}
          >
            Kurumsal Giriş
          </div>
        </div>
        
        {/* Hata Mesajı Alanı */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Bireysel Giriş Formu */}
        <form 
          className={`${styles.loginForm} ${activeTab === 'individual' ? styles.active : ''}`} 
          id="individual-form"
          onSubmit={handleSubmit} 
        >
          <h2 className={styles.formTitle}>Bireysel Hesabınıza Giriş Yapın</h2>
          <p className={styles.formSubtitle}>Telefon numaranızı veya e-postanızı girin</p>
          
          <div className={styles.inputGroup}>
            <i className="fas fa-user"></i>
            <input 
              type="text" 
              placeholder="Telefon Numarası veya E-posta" 
              required 
              value={login} 
              onChange={(e) => setLogin(e.target.value)} 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input 
              type="password" 
              placeholder="Parola" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <div className={styles.options}>
            <div className={styles.rememberMe}>
              <input 
                type="checkbox" 
                id="individual-remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <label htmlFor="individual-remember">Beni Hatırla</label>
            </div>
            <Link href="/forgot-password" className={styles.forgotPassword}>Şifremi Unuttum</Link>
          </div>
          
          <button type="submit" className={styles.loginBtnForm} disabled={isLoading}>
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
          
          <div className={styles.registerSection}>
            Henüz kayıt olmadınız mı? 
            <Link href="/register" className={styles.registerLink}>Kayıt Ol</Link>
          </div>
        </form>
        
        {/* Kurumsal Giriş Formu (Aynı simülasyonu kullanır) */}
        <form 
          className={`${styles.loginForm} ${activeTab === 'corporate' ? styles.active : ''}`} 
          id="corporate-form"
          onSubmit={handleSubmit} 
        >
          <h2 className={styles.formTitle}>Kurumsal Hesabınıza Giriş Yapın</h2>
          <p className={styles.formSubtitle}>Kurumsal telefon veya e-postanızı girin</p>
          
          <div className={styles.inputGroup}>
            <i className="fas fa-user-tie"></i>
            <input 
              type="text" 
              placeholder="Kurumsal Telefon veya E-posta" 
              required 
              value={login} 
              onChange={(e) => setLogin(e.target.value)} 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input 
              type="password" 
              placeholder="Kurumsal Parola" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <div className={styles.options}>
            <div className={styles.rememberMe}>
              <input 
                type="checkbox" 
                id="corporate-remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <label htmlFor="corporate-remember">Beni Hatırla</label>
            </div>
            <Link href="/forgot-password" className={styles.forgotPassword}>Şifremi Unuttum</Link>
          </div>
          
          <button type="submit" className={styles.loginBtnForm} disabled={isLoading}>
            {isLoading ? 'Giriş Yapılıyor...' : 'Kurumsal Giriş'}
          </button>
        </form>
      </div>
    </div>
  );
}
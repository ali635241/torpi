'use client'; 

import Link from 'next/link';
import styles from './register.module.css'; 
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import api from '../../lib/api'; // Gerçek API istemcimiz (Proxy'li)

// Sahte İl/İlçe verisi
const mockCities = [
  { id: 1, name: "Adana" }, { id: 6, name: "Ankara" }, { id: 34, name: "İstanbul" }, { id: 35, name: "İzmir" }, { id: 55, name: "Samsun" }, { id: 63, name: "Şanlıurfa" },
];
const mockDistricts = { 34: ["Kadıköy", "Beşiktaş", "Şişli"], 6: ["Çankaya", "Yenimahalle"], 35: ["Konak", "Bornova"], 63: ["Eyyübiye", "Haliliye", "Karaköprü"] }; 


export default function RegisterPage() {
  const router = useRouter(); 

  // --- Form alanları için state'ler ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [kvkk, setKvkk] = useState(false);
  const [promotions, setPromotions] = useState(false);
  const [city, setCity] = useState(''); 
  
  // --- UI state'leri ---
  const [cities, setCities] = useState([]); 
  const [districts, setDistricts] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // Validasyon state'leri
  const [passwordStrength, setPasswordStrength] = useState(0); 
  const [passwordMatchMessage, setPasswordMatchMessage] = useState({ text: '', color: '' }); 

  // --- Şehir listesini yükle ---
  useEffect(() => {
    // Şimdilik sahte veriyi kullanalım
    setCities(mockCities);
  }, []); 

  // İl değiştikçe ilçeleri güncelle
  useEffect(() => {
    if (city) {
        const selectedCityData = mockCities.find(c => c.name === city);
        setDistricts(mockDistricts[selectedCityData?.id] || []);
    } else {
        setDistricts([]);
    }
  }, [city]);


  // === HELPER FONKSİYONLARIN TAM TANIMLARI ===
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 10) { value = value.substring(0, 10); }
    if (value.length > 6) { value = `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6)}`; }
    else if (value.length > 3) { value = `${value.substring(0, 3)} ${value.substring(3)}`; }
    setPhone(value);
  };

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength += 25; 
    if (/[A-Z]/.test(pass)) strength += 25; 
    if (/\d/.test(pass)) strength += 25; 
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength += 25; 
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
    checkPasswordMatch(newPassword, confirmPassword);
  };

  const checkPasswordMatch = (pass, confirmPass) => {
    if (confirmPass.length > 0) {
      if (pass !== confirmPass) {
        setPasswordMatchMessage({ text: 'Şifreler eşleşmiyor', color: '#e74c3c' });
      } else {
        setPasswordMatchMessage({ text: 'Şifreler eşleşiyor', color: '#2ecc71' });
      }
    } else {
      setPasswordMatchMessage({ text: '', color: '' });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    checkPasswordMatch(password, newConfirmPassword);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return '#e74c3c';
    if (passwordStrength < 75) return '#f39c12';
    return '#2ecc71';
  };
  // === HELPER FONKSİYONLARIN SONU ===


  // --- handleSubmit (GERÇEK API'ye Bağlı) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    // --- Frontend Validasyonları ---
    if (!firstName || !lastName || !phone || !password || !confirmPassword) { 
      setError('Lütfen tüm zorunlu (*) alanları doldurunuz.');
      return;
    }
    if (!kvkk) { setError('KVKK onayı gereklidir.'); return; }
    if (password !== confirmPassword) { setError('Şifreler eşleşmiyor.'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalıdır.'); return; } 
    
    const formattedPhone = phone.replace(/\s/g, ''); 
    if (formattedPhone.length !== 10 || !formattedPhone.startsWith('5')) { 
        setError('Telefon numarası 10 hane olmalı ve 5 ile başlamalıdır (Örn: 5xx xxx xxxx)');
        return;
    }
    
    setIsLoading(true); 

    const registrationData = {
      phone: formattedPhone, 
      email: email || undefined, 
      password: password,
      passwordConfirm: confirmPassword, 
      firstName: firstName,
      lastName: lastName,
      city: city || undefined, 
    };

    // --- GERÇEK API İSTEĞİ (Proxy üzerinden) ---
    try {
      // Proxy üzerinden POST /auth/register isteği at
      const response = await api.post('/auth/register', registrationData); 

      console.log('Kayıt Başarılı:', response);
      
      // Başarılı!
      // Kullanıcıyı telefon doğrulama sayfasına yönlendir
      router.push(`/verify-phone?phone=${formattedPhone}`);

    } catch (err) {
      // API'den gelen hatayı göster
      console.error('Kayıt hatası:', err);
      setError(err.message || 'Kayıt sırasında bir hata oluştu.');
      setIsLoading(false);
    }
  };


  // --- JSX (HTML) Kısmı ---
  return (
    // === YENİ: Arka Plan Kapsayıcı ===
    <div className={styles.pageBackground}> 
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <Link href="/" className={styles.registerLogo}>
            <div className={styles.registerLogoIcon}> <i className="fas fa-car"></i> </div>
            <div className={styles.registerLogoText}>TORPİDODA</div>
          </Link>
          <h2>Hesabınızı Oluşturun</h2>
          <p>Araç belgelerinizi dijitalleştirmek için kayıt olun ve zamandan tasarruf edin</p>
        </div>
        
        <div className={styles.registrationForm}>
          <h2 className={styles.formTitle}>Kayıt Formu</h2>
          
          <form id="registration-form" onSubmit={handleSubmit}>
            {error && ( <div className={styles.errorMessage}> {error} </div> )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="first-name">Adınız *</label>
                <div className={styles.inputGroup}>
                  <i className="fas fa-user"></i>
                  <input type="text" id="first-name" placeholder="Adınız" required 
                         value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="last-name">Soyadınız *</label>
                <div className={styles.inputGroup}>
                  <i className="fas fa-user"></i>
                  <input type="text" id="last-name" placeholder="Soyadınız" required 
                         value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Telefon Numarası *</label>
                <div className={styles.inputGroup}>
                  <i className="fas fa-phone"></i>
                  <input type="tel" id="phone" placeholder="5xx xxx xxxx" required 
                         value={phone} onChange={handlePhoneChange} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">E-posta Adresi</label>
                <div className={styles.inputGroup}>
                  <i className="fas fa-envelope"></i>
                  <input type="email" id="email" placeholder="ornek@email.com" 
                         value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Şehir/İlçe (Sahte veriden) */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">Şehir (Opsiyonel)</label>
                <div className={styles.inputGroup}>
                   <i className="fas fa-map-marker-alt"></i>
                   <select id="city" value={city} onChange={e => setCity(e.target.value)} className={styles.selectInput}>
                       <option value="">Şehir Seçiniz...</option>
                       {cities.map((c) => ( <option key={c.id} value={c.name}>{c.name}</option> ))}
                   </select>
                </div>
              </div>
               {/* İlçe (Şimdilik eklemeyelim) */}
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Şifre Oluşturun *</label>
                <div className={styles.inputGroup}>
                  <i className="fas fa-lock"></i>
                  <input type="password" id="password" placeholder="Şifrenizi girin (min 6 karakter)" required 
                         value={password} onChange={handlePasswordChange} />
                </div>
                <div className={styles.passwordStrength}>
                    <div className={styles.passwordStrengthBar} style={{ width: `${passwordStrength}%`, backgroundColor: getStrengthColor() }}></div>
                </div>
                <div className={styles.passwordInfo}>Şifreniz en az 6 karakter, bir büyük harf, bir rakam ve bir özel karakter içermelidir.</div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirm-password">Şifreyi Tekrarla *</label>
                <div className={styles.inputGroup}>
                  <i className="fas fa-lock"></i>
                  <input type="password" id="confirm-password" placeholder="Şifrenizi tekrar girin" required 
                         value={confirmPassword} onChange={handleConfirmPasswordChange} />
                </div>
                <div className={styles.passwordInfo} style={{ color: passwordMatchMessage.color }}>
                  {passwordMatchMessage.text}
                </div>
              </div>
            </div>
            
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <div className={styles.checkboxGroup}>
                <input type="checkbox" id="kvkk" required 
                       checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} />
                <label htmlFor="kvkk"> <a href="/legal/kvkk" target="_blank">Kişisel Verilerin Korunması Kanunu (KVKK)</a>... metnini okudum...</label>
              </div>
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <div className={styles.checkboxGroup}>
                <input type="checkbox" id="promotions" 
                       checked={promotions} onChange={(e) => setPromotions(e.target.checked)} />
                <label htmlFor="promotions"> ...kampanya, yenilik ve hizmetler hakkında... almak istiyorum...</label>
              </div>
            </div>
            
            <button type="submit" className={styles.registerBtn} disabled={isLoading}>
                {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>
          
          <div className={styles.loginSection}>
            Zaten bir hesabınız var mı? 
            <Link href="/login" className={styles.loginLink}> Giriş Yapın </Link>
          </div>
        </div>
        
        <div className={styles.footer}>
            © {new Date().getFullYear()} Torpidoda. Tüm hakları saklıdır.
        </div>
      </div>
    </div>
  );
}
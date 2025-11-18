'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api'; 
import styles from './profile.module.css'; 

// Sahte Kullanıcı Verisi 
const mockUser = {
  id: "mock-user-123",
  firstName: "Ahmet",
  lastName: "Yılmaz",
  phone: "5551234567",
  email: "ahmet@example.com",
  city: "İstanbul",
  profilePhoto: "https://via.placeholder.com/150",
  isPhoneVerified: true,
  notificationSettings: { emailEnabled: true, pushEnabled: false }
};

// Sahte Şehir Listesi (register/page.js'den)
const mockCities = [ { id: 6, name: "Ankara" }, { id: 34, name: "İstanbul" }, { id: 35, name: "İzmir" }, /* ... diğerleri ... */ ];

export default function ProfilePage() {
  const router = useRouter();

  // --- Form State'leri ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState(''); // Telefonu sadece gösterelim, düzenletmeyelim
  // Bildirim ayarları için state'ler
  const [emailEnabled, setEmailEnabled] = useState(true);
  // const [pushEnabled, setPushEnabled] = useState(false); // Web'de push yok

  // --- UI State'leri ---
  const [isLoading, setIsLoading] = useState(true); // Veri yükleme + Kaydetme
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Başarı mesajı

  // --- Veri Yükleme (SİMÜLASYON) ---
  useEffect(() => {
    // 1. Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    // 2. Sahte Kullanıcı Verisini Yükle
    // Backend CORS'u düzeltince gerçek api.get('/user/profile') isteği atılmalı
    console.log("--- SİMÜLASYON: Profil verisi yükleniyor ---");
    setFirstName(mockUser.firstName);
    setLastName(mockUser.lastName);
    setEmail(mockUser.email || ''); // E-posta yoksa boş string
    setCity(mockUser.city || '');   // Şehir yoksa boş string
    setPhone(mockUser.phone);     // Telefonu state'e al (düzenlenemez)
    setEmailEnabled(mockUser.notificationSettings?.emailEnabled ?? true); // Null check
    // setPushEnabled(mockUser.notificationSettings?.pushEnabled ?? false);
    setIsLoading(false);

  }, [router]);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsLoading(true);

    // --- Frontend Validasyon (Basit) ---
    if (!firstName || !lastName) {
      setError('Ad ve Soyad alanları zorunludur.');
      setIsLoading(false);
      return;
    }

    // API'ye gönderilecek güncel veri [cite: 206-212]
    const updatedUserData = {
      firstName,
      lastName,
      email: email || undefined, // Boşsa gönderme
      city: city || undefined,   // Boşsa gönderme
    };

    // --- SİMÜLASYON (CORS Hatası nedeniyle) ---
    console.log(`--- SİMÜLASYON: Profil Güncelleme isteği ---`);
    console.log(updatedUserData);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    console.log('--- SİMÜLASYON: Profil güncellendi! ---');
    setSuccessMessage('Profil bilgileriniz başarıyla güncellendi.'); // Başarı mesajı göster
    // Opsiyonel: localStorage'daki kullanıcı bilgisini de güncelleyebiliriz
    // const updatedMockUser = { ...mockUser, ...updatedUserData };
    // localStorage.setItem('user', JSON.stringify(updatedMockUser));
    setIsLoading(false);

    /*
    // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
    // Backend CORS'u düzeltince bu açılmalı.
    try {
        const response = await api.patch('/user/profile', updatedUserData);
        setSuccessMessage('Profil bilgileriniz başarıyla güncellendi.');
        // İsteğe bağlı: Güncellenmiş kullanıcı verisini localStorage'a yaz
        // localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
        console.error("Profil güncelleme hatası:", err);
        setError(err.message || "Profil güncellenirken bir hata oluştu.");
    } finally {
        setIsLoading(false);
    }
    */
  };

   // --- Bildirim Ayarı Kaydetme (SİMÜLASYON) ---
   const handleNotificationSubmit = async (e) => {
       e.preventDefault();
       setError(null);
       setSuccessMessage('');
       setIsLoading(true); // Ayrı bir loading state de olabilir

       const notificationSettings = { emailEnabled };

       // --- SİMÜLASYON ---
       console.log(`--- SİMÜLASYON: Bildirim Ayarları Güncelleme isteği ---`);
       console.log(notificationSettings);
       await new Promise(resolve => setTimeout(resolve, 1000));
       console.log('--- SİMÜLASYON: Bildirim ayarları güncellendi! ---');
       setSuccessMessage('Bildirim ayarlarınız başarıyla güncellendi.');
       setIsLoading(false);

        /*
        // --- ORİJİNAL KOD ---
        try {
            await api.patch('/user/notification-settings', notificationSettings);
            setSuccessMessage('Bildirim ayarlarınız başarıyla güncellendi.');
        } catch (err) {
            console.error("Bildirim ayarı güncelleme hatası:", err);
            setError(err.message || "Bildirim ayarları güncellenirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
        */
   };


  // --- Render ---
  if (isLoading && !firstName) { // Henüz veri yükleniyorsa
      return <div className={styles.loading}>Profil Yükleniyor...</div>;
  }

  return (
    <div className={`${styles.profileContainer} pageContainer`}>
      <h1 className={styles.title}>Profil Bilgileri</h1>

      {/* Başarı Mesajı */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {/* Hata Mesajı */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Profil Bilgileri Formu */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">Adınız *</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Soyadınız *</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div className={styles.formRow}>
           <div className={styles.formGroup}>
            <label htmlFor="phone">Telefon Numarası (Değiştirilemez)</label>
            <input type="tel" id="phone" value={phone} readOnly disabled className={styles.disabledInput}/>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-posta Adresi</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com"/>
          </div>
        </div>
         <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="city">Şehir</label>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Şehir Seçiniz...</option>
              {/* Şehir listesi sahte veriden */}
              {mockCities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
           {/* Profil fotoğrafı yükleme alanı eklenebilir */}
           <div className={styles.formGroup}>
                <label>Profil Fotoğrafı</label>
                <div className={styles.profilePhoto}>
                    <img src={mockUser.profilePhoto} alt="Profil Fotoğrafı" />
                    {/* TODO: Fotoğraf Yükleme Butonu eklenebilir */}
                    <button type="button" className={styles.photoUploadButton} disabled>Değiştir (Yakında)</button>
                </div>
           </div>
        </div>
        

        <div className={styles.buttonContainer}>
          {/* Şifre Değiştir Linki Buraya Taşındı */}
            <Link href="/profile/change-password" className={styles.secondaryButton}> {/* Yeni stil sınıfı */}
                Şifre Değiştir
            </Link>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
          </button>
          
        </div>
      </form>

      {/* Bildirim Ayarları Formu */}
      <form onSubmit={handleNotificationSubmit} className={`${styles.form} ${styles.notificationForm}`}>
           <h2 className={styles.formTitle}>Bildirim Ayarları</h2>
            <div className={styles.checkboxGroup}>
                 <input
                    type="checkbox"
                    id="emailEnabled"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                />
                <label htmlFor="emailEnabled">
                    E-posta ile bilgilendirme almak istiyorum (Hatırlatıcılar vb.).
                </label>
            </div>
            {/* Push bildirimleri web'de yok */}
           <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
              </button>
           </div>
      </form>

       

    </div>
  );
}
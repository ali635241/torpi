'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api'; 
import styles from './dashboard.module.css'; // Yeni CSS modülümüzü kullanacağız

// --- Sahte Veriler (Tasarımına uygun olarak güncellendi) ---
// Not: Artık 'dashboardSummary' ve 'cars'ı birleştirebiliriz
// veya 'latestCar'ı 'cars' listesinden alabiliriz.
const mockUserCars = [
 { 
   id: "mock-car-1", 
   plate: "34 ABC 123", 
   brand: "Toyota", 
   model: "Corolla Hybrid", 
   year: 2020, 
   carType: "Hybrid", 
   inspectionDate: "2025-08-15", 
   insuranceDate: "2024-12-10", 
   kaskoDate: "2024-12-10", 
   lastMaintenanceKm: 42500, 
   nextMaintenanceKm: 52500, // Yeni alan
   score: 85 
 }, 
 { 
   id: "mock-car-2", 
   plate: "16 FGH 789", 
   brand: "Renault", 
   model: "Megane", 
   year: 2021, 
   carType: "Sedan", 
   inspectionDate: "2025-05-20", 
   insuranceDate: "2024-12-12", 
   kaskoDate: null, // Kasko yok
   lastMaintenanceKm: 78200, 
   nextMaintenanceKm: 90000, 
   score: 75 
 },
 { 
   id: "mock-car-3", 
   plate: "35 XYZ 456", 
   brand: "Ford", 
   model: "Focus", 
   year: 2019, 
   carType: "Hatchback", 
   inspectionDate: "2025-03-12", 
   insuranceDate: "2025-02-05", 
   kaskoDate: "2025-02-05", 
   lastMaintenanceKm: 63400, 
   nextMaintenanceKm: 75000, 
   score: 65 
 },
];

// Sahte Hatırlatıcı Verisi (Tasarımına uygun)
const mockReminders = [
    { id: "rem-1", type: "Muayene Yenileme", carInfo: "34 ABC 123 - Toyota Corolla", dueDate: "2025-08-15", daysRemaining: 15, level: 'danger' }, // Kırmızı
    { id: "rem-2", type: "Sigorta Yenileme", carInfo: "16 FGH 789 - Renault Megane", dueDate: "2024-12-12", daysRemaining: 10, level: 'warning' }, // Turuncu
    { id: "rem-3", type: "Bakım Zamanı", carInfo: "34 ABC 123 - Toyota Corolla", dueDate: null, kmRemaining: 1500, level: 'success' }, // Yeşil (KM bazlı)
    { id: "rem-4", type: "Kasko Yenileme", carInfo: "35 XYZ 456 - Ford Focus", dueDate: "2025-02-05", daysRemaining: 25, level: 'info' }, // Mavi/Gri
];
// --- Sahte Veri Sonu ---


export default function DashboardPage() {
  const router = useRouter();

  // --- State'ler ---
  const [cars, setCars] = useState([]); 
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // 1. Token Kontrolü (Rota Koruma)
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/'); return; }

    // 2. Sahte Veriyi Yükle (Simülasyon)
    console.log("--- SİMÜLASYON: Müşteri Dashboard verisi yükleniyor ---");
    setCars(mockUserCars); 
    setReminders(mockReminders);
    setIsLoading(false);
    
    // TODO: Backend CORS düzelince:
    // const carsPromise = api.get('/car');
    // const remindersPromise = api.get('/reminder?status=pending');
    // const [carsData, remindersData] = await Promise.all([carsPromise, remindersPromise]);
    // setCars(carsData.data.cars);
    // setReminders(remindersData.data);
    
  }, [router]);
  
  // --- Helper Fonksiyonlar ---
  // (Buraya handleDeleteCar, getScoreStatus vb. eklenebilir, şimdilik listeleme için gerekmiyor)
   const formatDate = (dateString) => {
       if (!dateString) return '-';
       try { return new Date(dateString).toLocaleDateString('tr-TR'); } catch (e) { return '-'; }
   };
   const formatKm = (km) => {
       if (!km && km !== 0) return '-';
       try { return `${km.toLocaleString('tr-TR')} km`; } catch (e) { return '-'; }
   };

  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Kontrol Paneli Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/">Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }

  // Son eklenen aracı (veya ilk aracı) bul
  const latestCar = cars[0];
  // Diğer araçları bul
  const otherCars = cars.slice(1);

  return (
    <div className={`${styles.dashboardContainer} pageContainer`}>
      {/* Sayfa Başlığı ve Eylem Butonları */}
      <div className={styles.header}>
         <h1 className={styles.welcomeMessage}> 
            Kontrol Paneli
         </h1> 
         {/* Eylem Butonları */}
         <div className={styles.actionButtons}>
            <Link href="/cars/add" className={styles.actionButton}> <i className="fas fa-plus"></i> Yeni Araç Ekle </Link>
            <Link href="/documents/upload" className={styles.actionButton}> <i className="fas fa-upload"></i> Belge Yükle </Link>
            {/* === YENİ BUTON === */}
        <Link 
            href="/appointments/add" // Bu sayfayı bir sonraki adımda oluşturacağız
            className={`${styles.actionButton} ${styles.appointmentButton}`} // Yeni stil sınıfı
        > 
            <i className="fas fa-calendar-plus"></i> Randevu Al 
        </Link>
        {/* === YENİ BUTON SONU === */}
         </div>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Ana İçerik Grid'i (Sol: Araçlar, Sağ: Hatırlatıcılar) */}
      <div className={styles.mainGrid}>
          
          {/* === Sol Sütun: Araçlar === */}
          <div className={styles.carsColumn}>
              {/* Son Eklenen Araç (Büyük Kart) */}
              {latestCar && (
                  <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Son Eklenen Araç</h2>
                      <div className={styles.latestCarCard}>
                          <div className={styles.latestCarHeader}>
                              <div className={styles.carIcon}> <i className="fas fa-car-side"></i> </div>
                              <div className={styles.carInfo}>
                                  <h3>{latestCar.plate}</h3>
                                  <p>{latestCar.brand} {latestCar.model}</p>
                              </div>
                              {/* TODO: Araç Puanı eklenebilir */}
                          </div>
                          <div className={styles.latestCarDetails}>
                              <div className={styles.detailItem}><span>Muayene Tarihi</span> <strong>{formatDate(latestCar.inspectionDate)}</strong></div>
                              <div className={styles.detailItem}><span>Sigorta Bitiş</span> <strong>{formatDate(latestCar.insuranceDate)}</strong></div>
                              <div className={styles.detailItem}><span>Kasko Bitiş</span> <strong>{formatDate(latestCar.kaskoDate)}</strong></div>
                              <div className={styles.detailItem}><span>Son Bakım</span> <strong>{formatKm(latestCar.lastMaintenanceKm)}</strong></div>
                              <div className={styles.detailItem}><span>Sonraki Bakım</span> <strong>{formatKm(latestCar.nextMaintenanceKm)}</strong></div>
                              <div className={styles.detailItem}><span>Araç Tipi</span> <strong>{latestCar.carType}</strong></div>
                          </div>
                          {/* TODO: Detay/Düzenle Linkleri */}
                          <div className={styles.cardActions}>
                              <Link href={`/cars/${latestCar.id}`} className={styles.actionLink}>Detaylar <i className="fas fa-arrow-right"></i></Link>
                          </div>
                      </div>
                  </div>
              )}

              {/* Diğer Araçlar (Küçük Kartlar) */}
              {otherCars.length > 0 && (
                  <div className={styles.section}>
                      <h2 className={styles.sectionTitle}>Araçlarım</h2>
                      <div className={styles.otherCarsGrid}>
                          {otherCars.map(car => (
                              <div key={car.id} className={styles.otherCarCard}>
                                  <div className={styles.latestCarHeader}> {/* Aynı stili kullanabiliriz */}
                                      <div className={styles.carIcon}><i className="fas fa-car-side"></i></div>
                                      <div className={styles.carInfo}>
                                          <h3>{car.plate}</h3>
                                          <p>{car.brand} {car.model}</p>
                                      </div>
                                  </div>
                                  <div className={styles.otherCarDetails}>
                                     <p>Muayene: {formatDate(car.inspectionDate)}</p>
                                     <p>Sigorta: {formatDate(car.insuranceDate)}</p>
                                     {/* ... daha fazla detay eklenebilir */}
                                  </div>
                                   <div className={styles.cardActions}>
                                      <Link href={`/cars/${car.id}`} className={styles.actionLink}>Detaylar <i className="fas fa-arrow-right"></i></Link>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
          
          {/* === Sağ Sütun: Hatırlatıcılar === */}
          <div className={styles.remindersColumn}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Yaklaşan Hatırlatıcılar</h2>
                    {reminders.length > 0 ? (
                        <div className={styles.remindersList}>
                            {reminders.map(reminder => (
                                <div key={reminder.id} className={`${styles.reminderItem} ${styles[reminder.level]}`}> {/* Seviyeye göre stil */}
                                    <div className={styles.reminderInfo}>
                                        <h4>{reminder.type}</h4>
                                        <p>{reminder.carInfo}</p>
                                    </div>
                                    <div className={styles.reminderTime}>
                                        {reminder.daysRemaining ? `${reminder.daysRemaining} gün kaldı` 
                                         : reminder.kmRemaining ? `${formatKm(reminder.kmRemaining)} kaldı`
                                         : '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noDataMessage}>Aktif hatırlatıcınız bulunmuyor.</p>
                    )}
                </div>
          </div>
          
      </div> {/* mainGrid sonu */}

    </div> // dashboardContainer sonu
  );
}
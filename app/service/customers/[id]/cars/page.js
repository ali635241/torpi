'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../../lib/api'; // ../../../../../lib/api yolu
// Müşteri dashboard'ındaki araç kartı stillerini kullanalım
import styles from '../../../../dashboard/dashboard.module.css'; 

// --- Sahte Veriler (Tekrar tanımlıyoruz) ---
const mockCustomersData = [
 { id: "cust-1", firstName: "Ali", lastName: "Veli", phone: "0555 111 2233", email: "ali.veli@email.com", city: "İstanbul", district: "Kadıköy", carCount: 1 },
 { id: "cust-2", firstName: "Ayşe", lastName: "Yılmaz", phone: "0544 999 8877", email: "ayse.yilmaz@email.com", city: "Ankara", district: "Çankaya", carCount: 2 },
 { id: "cust-3", firstName: "Mehmet", lastName: "Demir", phone: "0533 123 4567", email: "m.demir@email.com", city: "İzmir", district: "Bornova", carCount: 0 },
];
// Araç verisine 'ownerId' ekleyerek hangi müşteriye ait olduğunu belirtelim
const mockCarsData = [
 { ownerId: "cust-1", id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla", year: 2020, carType: "Sedan", inspectionDate: "2025-12-15", insuranceDate: "2025-11-20", kaskoDate: "2025-11-20", lastMaintenanceKm: 45000, score: 85 },
 { ownerId: "cust-2", id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic", year: 2021, carType: "Sedan", inspectionDate: "2026-01-10", insuranceDate: "2025-12-05", kaskoDate: null, lastMaintenanceKm: 25000, score: 55 },
 { ownerId: "cust-2", id: "mock-car-3", plate: "35DEF456", brand: "Ford", model: "Focus", year: 2019, carType: "Hatchback", inspectionDate: "2025-07-01", insuranceDate: "2025-06-15", kaskoDate: "2025-06-15", lastMaintenanceKm: 60000, score: 75 }, // Ayşe Yılmaz'ın ikinci aracı
];
// --- Sahte Veri Sonu ---

export default function CustomerCarsPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id; // URL'den müşteri ID'sini al

  // --- State'ler ---
  const [customer, setCustomer] = useState(null); // Müşteri bilgisi
  const [cars, setCars] = useState([]); // Bu müşterinin araçları
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Veri Yükleme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/service/login'); return; }

    // Sahte veriden müşteriyi ve araçlarını bul
    console.log(`--- SİMÜLASYON: Müşteri (${customerId}) araçları yükleniyor ---`);
    const foundCustomer = mockCustomersData.find(c => c.id === customerId);
    const foundCars = mockCarsData.filter(car => car.ownerId === customerId); // Sadece bu müşterinin araçları

    if (foundCustomer) {
      setCustomer(foundCustomer);
      setCars(foundCars);
      setError(null);
    } else {
      console.error(`Müşteri bulunamadı ID: ${customerId}`);
      setError(`Müşteri bulunamadı (ID: ${customerId}). Araçlar listelenemiyor.`);
    }
    setIsLoading(false);

    // TODO: Backend CORS düzelince gerçek API istekleri
    // const customerPromise = api.get(`/service/customers/${customerId}`);
    // const carsPromise = api.get(`/service/customers/${customerId}/cars`);
    // Promise.all([customerPromise, carsPromise]).then(([customerRes, carsRes]) => { ... })

  }, [customerId, router]);

   // --- Araç Silme Fonksiyonu (Simülasyonlu - dashboard'dan uyarlandı) ---
   const handleDeleteCar = async (carId, carPlate) => {
    if (!window.confirm(`${carPlate} plakasını silmek istediğinizden emin misiniz?`)) return;
    console.log(`--- SİMÜLASYON: Araç Siliniyor: ${carId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCars(currentCars => currentCars.filter(car => car.id !== carId));
    alert(`${carPlate} plakalı araç başarıyla silindi (Simülasyon).`);
    // TODO: Gerçek API isteği (api.delete(`/service/cars/${carId}`)) - Endpoint değişebilir
  };

  // Puan rengi helper'ı
  const getScoreStatus = (score) => { if (typeof score !== 'number') return ''; if (score >= 80) return styles.scoreGood; if (score >= 60) return styles.scoreMedium; return styles.scoreBad; };


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Müşteri Araçları Yükleniyor...</div>; }
  // Yükleme hatası veya müşteri bulunamadıysa
  if (error) {
     return (
         <div className={styles.container}> {/* Ana container */}
              <div className={styles.header}>
                 <h1 className={styles.title}>Hata</h1>
                  <Link href="/service/customers" className={styles.backButton}> {/* Geri butonu için stil lazım */}
                     <i className="fas fa-arrow-left"></i> Müşteri Listesine Dön
                 </Link>
              </div>
              <div className={styles.errorMessage}>{error}</div>
         </div>
     );
   }
   if (!customer) { return <div className={styles.loading}>Müşteri bilgileri bulunamadı.</div>;}


  return (
    // dashboard.module.css stillerini kullanıyoruz
    <div className={`${styles.dashboardContainer} pageContainer`}>
      {/* Sayfa Başlığı ve Yeni Ekle Butonu */}
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>{customer.firstName} {customer.lastName} - Araçları ({cars.length})</h1>
            {/* Müşteri detaylarına link eklenebilir */}
            <Link href={`/service/customers/edit/${customerId}`} className={styles.customerDetailLink}>Müşteri Bilgilerini Düzenle</Link>
        </div>
         {/* Yeni Araç Ekle butonu, customerId'yi query parametresi olarak taşır */}
        <Link href={`/service/customers/${customerId}/cars/add`} className={styles.actionButton} style={{backgroundColor: 'var(--primary-600)', color: 'white'}}>
             <i className="fas fa-plus"></i> Bu Müşteriye Araç Ekle
             {/* Not: /service/customers/[id]/cars/add sayfası henüz yok */}
        </Link>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Araç Listesi */}
      {cars.length === 0 ? (
        <p className={styles.noCarsMessage}>Bu müşteriye ait kayıtlı araç bulunmuyor.</p>
      ) : (
        <div className={styles.carsGrid} style={{marginTop: '30px'}}>
          {cars.map(car => (
            // Dashboard'daki araç kartının aynısını kullanıyoruz
             <div key={car.id} className={styles.carCard}>
                <div className={styles.cardHeader}>
                    {/* Plaka (Detay sayfasına link yok, burası zaten listenin bir parçası) */}
                    <div className={styles.plateContainer}>
                         <span className={styles.plate}>{car.plate}</span>
                        {typeof car.score === 'number' && (
                            <span className={`${styles.scoreBadge} ${getScoreStatus(car.score)}`}>
                                <i className="fas fa-star"></i> {car.score}/100
                            </span>
                        )}
                    </div>
                    <span className={styles.carType}>{car.carType || 'Belirtilmemiş'}</span>
                </div>
                <h3 className={styles.carModel}>{car.brand} {car.model} ({car.year || 'Yıl Yok'})</h3>
                <div className={styles.carDetails}>
                  <p><i className="fas fa-calendar-alt"></i> Muayene: {car.inspectionDate ? new Date(car.inspectionDate).toLocaleDateString('tr-TR') : '-'}</p>
                  <p><i className="fas fa-shield-alt"></i> Sigorta: {car.insuranceDate ? new Date(car.insuranceDate).toLocaleDateString('tr-TR') : '-'}</p>
                  <p><i className="fas fa-car-crash"></i> Kasko: {car.kaskoDate ? new Date(car.kaskoDate).toLocaleDateString('tr-TR') : '-'}</p>
                  <p><i className="fas fa-tachometer-alt"></i> Son Bakım: {car.lastMaintenanceKm ? `${car.lastMaintenanceKm.toLocaleString('tr-TR')} km` : '-'}</p>
                </div>
                <div className={styles.cardActions}>
                   {/* TODO: Araç Detay, İşlem Ekle gibi butonlar eklenebilir */}
                   <button className={`${styles.actionButton} ${styles.editButton}`} disabled>Düzenle (Yakında)</button>
                   <button
                     className={`${styles.actionButton} ${styles.deleteButton}`}
                     onClick={() => handleDeleteCar(car.id, car.plate)}
                   >
                     Sil
                   </button>
                </div>
              </div>
          ))}
        </div>
      )}

       {/* Geri Dön Butonu */}
       <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link href="/service/customers" className={styles.backButton}> {/* Geri butonu için stil lazım */}
                 <i className="fas fa-arrow-left"></i> Müşteri Listesine Geri Dön
            </Link>
       </div>
    </div>
  );
}
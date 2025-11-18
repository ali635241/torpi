'use client'; // Hook'lar ve localStorage için

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api'; // (Simülasyon olsa da import kalsın)
import styles from './cars.module.css'; // CSS modülümüz

// API Dokümanındaki Sahte Araç Verisi 
const mockCarsData = [ // İsmi değiştirdim ki state ile karışmasın
 {
  id: "mock-car-1",
  plate: "34ABC123",
  brand: "Toyota",
  model: "Corolla",
  year: 2020,
  carType: "Sedan",
  inspectionDate: "2025-12-15",
  insuranceDate: "2025-11-20",
  kaskoDate: "2025-11-20",
  lastMaintenanceKm: 45000
 },
 {
  id: "mock-car-2",
  plate: "06XYZ789",
  brand: "Honda",
  model: "Civic",
  year: 2021,
  carType: "Sedan",
  inspectionDate: "2026-01-10",
  insuranceDate: "2025-12-05",
  kaskoDate: null, // Kasko yoksa null olabilir
  lastMaintenanceKm: 25000
 }
];

export default function CarsListPage() {
  const router = useRouter();

  // --- State'ler ---
  const [cars, setCars] = useState([]); // Araç listesi için
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // 1. Token Kontrolü (Rota Koruma)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // 2. API yerine sahte veriyi yükle
    // Backend CORS'u düzelttiğinde bu sahte veri silinip
    // gerçek API isteği ile değiştirilmelidir.
    setCars(mockCarsData); // Sahte araç listesini state'e ata
    setIsLoading(false);

  }, [router]);

  // --- Silme Fonksiyonu (Simülasyonlu) ---
  const handleDelete = async (carId, carPlate) => {
    if (!window.confirm(`${carPlate} plakasını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    // --- SİMÜLASYON ---
    console.log(`--- SİMÜLASYON: Araç Siliniyor: ${carId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Sahte gecikme
    setCars(currentCars => currentCars.filter(car => car.id !== carId)); // State'den kaldır
    alert(`${carPlate} plakalı araç başarıyla silindi (Simülasyon).`);

    /*
    // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
    // Backend düzeltildiğinde bu açılmalı.
    try {
        // setIsLoading(true); // Gerekirse loading eklenebilir
        await api.delete(`/car/${carId}`);
        setCars(currentCars => currentCars.filter(car => car.id !== carId));
        alert(`${carPlate} plakalı araç başarıyla silindi.`);
    } catch (err) {
        console.error("Araç silme hatası:", err);
        setError(err.message || "Araç silinirken bir hata oluştu.");
    } finally {
        // setIsLoading(false);
    }
    */
  };


  // --- Render ---

  if (isLoading) {
    return <div className={styles.loading}>Araçlarım Yükleniyor...</div>;
  }

  if (error) {
    // Silme işlemi sırasında bir hata olursa burası gösterilebilir
    return <div className={styles.loading}>Hata: {error}</div>;
  }

  return (
    <div className={`${styles.carsContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Araçlarım ({cars.length})</h1>
        <Link href="/cars/add" className={styles.addButton}>
          <i className="fas fa-plus"></i> Yeni Araç Ekle
        </Link>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>} {/* Silme hatası için */}


      {cars.length === 0 ? (
        <p className={styles.noCarsMessage}>Henüz hiç araç eklememişsiniz.</p>
      ) : (
        <div className={styles.carsGrid}>
          {cars.map(car => (
            <div key={car.id} className={styles.carCard}>
              <div className={styles.cardHeader}>
                <span className={styles.plate}>{car.plate}</span>
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
                 {/* TODO: Detay, Düzenle butonları */}
                 <button className={styles.actionButton}>Detaylar</button>
                 <button className={`${styles.actionButton} ${styles.editButton}`}>Düzenle</button>
                 {/* Sil butonuna onClick eklendi */}
                 <button
                   className={`${styles.actionButton} ${styles.deleteButton}`}
                   onClick={() => handleDelete(car.id, car.plate)}
                 >
                   Sil
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
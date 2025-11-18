'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // useParams eklendi
import Link from 'next/link';
import api from '../../../../lib/api'; // ../../../lib/api yolu düzeltildi
// Stil dosyasını 'add' klasöründen import ediyoruz
import styles from '../../add/addCar.module.css';

// Sahte Araç Verisi (cars/page.js'den kopyaladık)
const mockCarsData = [
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla", year: 2020, carType: "Sedan", inspectionDate: "2025-12-15", insuranceDate: "2025-11-20", kaskoDate: "2025-11-20", lastMaintenanceKm: 45000 },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic", year: 2021, carType: "Sedan", inspectionDate: "2026-01-10", insuranceDate: "2025-12-05", kaskoDate: null, lastMaintenanceKm: 25000 }
];

// API Dokümanındaki Araç Tipleri (add/page.js'den kopyaladık)
const carTypes = [ "Sedan", "Hatchback", "SUV", "Station Wagon", "Coupe", "MPV", "Pickup", "Ticari", "Motosiklet", "Diğer" ];

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams(); // URL'den parametreleri almak için
  const carId = params.id; // URL'deki [id] kısmını al (örn: 'mock-car-1')

  // --- Form State'leri ---
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [carType, setCarType] = useState('');
  const [chassisNo, setChassisNo] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [insuranceDate, setInsuranceDate] = useState('');
  const [kaskoDate, setKaskoDate] = useState('');
  const [lastMaintenanceKm, setLastMaintenanceKm] = useState('');

  // --- UI State'leri ---
  const [isLoading, setIsLoading] = useState(true); // Veri yükleme + Kaydetme
  const [error, setError] = useState(null);

  // --- Veri Yükleme (SİMÜLASYON) ---
  useEffect(() => {
    // 1. Token Kontrolü (Rota Koruma)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // 2. API yerine sahte veriden aracı bul
    console.log(`--- SİMÜLASYON: Araç verisi yükleniyor ID: ${carId} ---`);
    const carToEdit = mockCarsData.find(car => car.id === carId);

    if (carToEdit) {
      // Bulunan aracın verileriyle state'leri doldur
      setPlate(carToEdit.plate || '');
      setBrand(carToEdit.brand || '');
      setModel(carToEdit.model || '');
      setYear(carToEdit.year?.toString() || ''); // number to string
      setCarType(carToEdit.carType || '');
      setChassisNo(carToEdit.chassisNo || '');
      // Tarihleri YYYY-MM-DD formatına çevir (input[type=date] için)
      setInspectionDate(carToEdit.inspectionDate ? carToEdit.inspectionDate.split('T')[0] : '');
      setInsuranceDate(carToEdit.insuranceDate ? carToEdit.insuranceDate.split('T')[0] : '');
      setKaskoDate(carToEdit.kaskoDate ? carToEdit.kaskoDate.split('T')[0] : '');
      setLastMaintenanceKm(carToEdit.lastMaintenanceKm?.toString() || ''); // number to string
      setError(null);
    } else {
      console.error(`Araç bulunamadı ID: ${carId}`);
      setError(`Düzenlenecek araç bulunamadı (ID: ${carId}).`);
    }
    setIsLoading(false); // Yükleme bitti

  }, [carId, router]); // carId değişirse effect tekrar çalışır

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Frontend Validasyon ---
    if (!plate || !brand || !model) {
      setError('Plaka, Marka ve Model alanları zorunludur.');
      return;
    }
    const plateRegex = /^[0-9]{2,3}[A-Z]{1,3}[0-9]{2,4}$/i;
    if (!plateRegex.test(plate.replace(/\s/g, ''))) {
        setError('Lütfen geçerli bir plaka formatı girin (örn: 34ABC123).');
        return;
    }

    setIsLoading(true);

    // API'ye gönderilecek veriyi oluştur
    const updatedCarData = {
      plate: plate.replace(/\s/g, '').toUpperCase(),
      brand, model,
      year: year ? parseInt(year) : undefined,
      carType: carType || undefined,
      chassisNo: chassisNo || undefined,
      inspectionDate: inspectionDate || undefined,
      insuranceDate: insuranceDate || undefined,
      kaskoDate: kaskoDate || undefined,
      lastMaintenanceKm: lastMaintenanceKm ? parseInt(lastMaintenanceKm) : undefined,
    };

    // --- SİMÜLASYON (CORS Hatası nedeniyle) ---
    console.log(`--- SİMÜLASYON: Araç Güncelleme isteği ID: ${carId} ---`);
    console.log(updatedCarData);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    console.log('--- SİMÜLASYON: Araç güncellendi! Dashboarda yönlendiriliyor... ---');
    alert('Araç başarıyla güncellendi (Simülasyon)');
    router.push('/dashboard');

  };

  // --- Render ---
  if (isLoading && !plate) { // Henüz veri yükleniyorsa
      return <div className={styles.loading}>Araç Bilgileri Yükleniyor...</div>;
  }
   if (error && !plate) { // Veri yüklenirken hata olduysa veya araç bulunamadıysa
       return <div className={styles.loading}>Hata: {error}</div>;
   }

  return (
    // 'addCar.module.css' stillerini kullanıyoruz
    <div className={`${styles.addCarContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Aracı Düzenle ({plate})</h1>
        <Link href="/dashboard" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Form alanları 'add' sayfasıyla aynı, 'value' ve 'onChange' state'lere bağlı */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="plate">Plaka *</label>
            <input type="text" id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} required placeholder="34ABC123" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="brand">Marka *</label>
            <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required placeholder="Toyota" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="model">Model *</label>
            <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} required placeholder="Corolla" />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="year">Yıl</label>
            <input type="number" id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2020" min="1900" max={new Date().getFullYear() + 1} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="carType">Araç Tipi</label>
            <select id="carType" value={carType} onChange={(e) => setCarType(e.target.value)}>
              <option value="">Seçiniz...</option>
              {carTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="chassisNo">Şase Numarası</label>
            <input type="text" id="chassisNo" value={chassisNo} onChange={(e) => setChassisNo(e.target.value)} placeholder="ABC123XYZ..." />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="inspectionDate">Muayene Tarihi</label>
            <input type="date" id="inspectionDate" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="insuranceDate">Sigorta Bitiş Tarihi</label>
            <input type="date" id="insuranceDate" value={insuranceDate} onChange={(e) => setInsuranceDate(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="kaskoDate">Kasko Bitiş Tarihi</label>
            <input type="date" id="kaskoDate" value={kaskoDate} onChange={(e) => setKaskoDate(e.target.value)} />
          </div>
        </div>
        <div className={styles.formRow}>
           <div className={styles.formGroup} style={{ flexBasis: '50%' }}>
            <label htmlFor="lastMaintenanceKm">Son Bakım Kilometresi</label>
            <input type="number" id="lastMaintenanceKm" value={lastMaintenanceKm} onChange={(e) => setLastMaintenanceKm(e.target.value)} placeholder="45000" min="0" />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {/* Buton metni isLoading durumuna göre değişiyor */}
            {isLoading && !plate ? 'Yükleniyor...' : isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
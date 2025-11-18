'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; // API istemcimiz
import styles from './addCar.module.css'; // Yeni CSS modülümüz

// API Dokümanındaki Araç Tipleri [cite: 330-341]
const carTypes = [
  "Sedan", "Hatchback", "SUV", "Station Wagon", "Coupe",
  "MPV", "Pickup", "Ticari", "Motosiklet", "Diğer"
];

export default function AddCarPage() {
  const router = useRouter();

  // --- Form State'leri ---
  // API dokümanına göre alanları ekliyoruz [cite: 311-323]
  const [plate, setPlate] = useState(''); // Zorunlu [cite: 324]
  const [brand, setBrand] = useState(''); // Zorunlu [cite: 324]
  const [model, setModel] = useState(''); // Zorunlu [cite: 324]
  const [year, setYear] = useState('');
  const [carType, setCarType] = useState('');
  const [chassisNo, setChassisNo] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [insuranceDate, setInsuranceDate] = useState('');
  const [kaskoDate, setKaskoDate] = useState('');
  const [lastMaintenanceKm, setLastMaintenanceKm] = useState('');

  // --- UI State'leri ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Frontend Validasyon ---
    if (!plate || !brand || !model) {
      setError('Plaka, Marka ve Model alanları zorunludur.');
      return;
    }
    // Basit plaka formatı kontrolü (API daha detaylı kontrol edecek) [cite: 325-329]
    const plateRegex = /^[0-9]{2,3}[A-Z]{1,3}[0-9]{2,4}$/i; // Boşluksuz formatı kontrol et
    if (!plateRegex.test(plate.replace(/\s/g, ''))) {
        setError('Lütfen geçerli bir plaka formatı girin (örn: 34ABC123).');
        return;
    }

    setIsLoading(true);

    // API'ye gönderilecek veriyi oluştur
    const carData = {
      plate: plate.replace(/\s/g, '').toUpperCase(), // Boşlukları sil, büyük harfe çevir [cite: 329]
      brand,
      model,
      year: year ? parseInt(year) : undefined, // Sayıya çevir veya gönderme
      carType: carType || undefined,
      chassisNo: chassisNo || undefined,
      inspectionDate: inspectionDate || undefined,
      insuranceDate: insuranceDate || undefined,
      kaskoDate: kaskoDate || undefined,
      lastMaintenanceKm: lastMaintenanceKm ? parseInt(lastMaintenanceKm) : undefined,
    };

    // --- SİMÜLASYON (CORS Hatası nedeniyle) ---
    console.log('--- SİMÜLASYON: Araç Ekleme isteği ---');
    console.log(carData);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    console.log('--- SİMÜLASYON: Araç eklendi! Dashboarda yönlendiriliyor... ---');
    alert('Araç başarıyla eklendi (Simülasyon)'); // Kullanıcıya bilgi ver
    router.push('/dashboard'); // Başarılı, dashboard'a yönlendir

    /*
    // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
    // Backend CORS'u düzeltince bu açılmalı.
    try {
        await api.post('/car', carData);
        alert('Araç başarıyla eklendi!');
        router.push('/dashboard');
    } catch (err) {
        console.error("Araç ekleme hatası:", err);
        setError(err.message || "Araç eklenirken bir hata oluştu.");
        setIsLoading(false);
    }
    */
  };

  return (
    <div className={`${styles.addCarContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Yeni Araç Ekle</h1>
        <Link href="/dashboard" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Zorunlu Alanlar */}
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

        {/* Opsiyonel Alanlar */}
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

        {/* Tarih Alanları */}
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

        {/* Bakım Alanı */}
        <div className={styles.formRow}>
           <div className={styles.formGroup} style={{ flexBasis: '50%' }}>
            <label htmlFor="lastMaintenanceKm">Son Bakım Kilometresi</label>
            <input type="number" id="lastMaintenanceKm" value={lastMaintenanceKm} onChange={(e) => setLastMaintenanceKm(e.target.value)} placeholder="45000" min="0" />
          </div>
        </div>

        {/* Buton */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : 'Aracı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
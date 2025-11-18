    'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; // ../../../lib/api yolu düzeltildi
import styles from './addReminder.module.css'; // Yeni CSS modülümüz

// --- Sahte Veriler ---
const mockCarsData = [ // Kullanıcının araçları
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" }
];
// API Dokümanındaki Hatırlatıcı Tipleri [cite: 547-551]
const reminderTypes = [
  { value: "inspection", label: "Muayene" },
  { value: "insurance", label: "Sigorta" },
  { value: "kasko", label: "Kasko" },
  { value: "maintenance", label: "Rutin Bakım" },
];
// --- Sahte Veri Sonu ---


export default function AddReminderPage() {
  const router = useRouter();

  // --- Form State'leri ---
  const [cars, setCars] = useState([]); // Araç listesi
  const [selectedCarId, setSelectedCarId] = useState(''); // Seçilen araç ID'si
  const [selectedType, setSelectedType] = useState(''); // Seçilen tip
  const [dueDate, setDueDate] = useState(''); // Seçilen tarih

  // --- UI State'leri ---
  const [isLoading, setIsLoading] = useState(true); // Sayfa yükleme + Kaydetme
  const [error, setError] = useState(null);

  // --- Araç Listesi Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // 1. Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    // 2. Sahte Araç Listesini Yükle
    // Backend CORS'u düzeltince gerçek api.get('/car?limit=100') gibi bir istek atılmalı
    setCars(mockCarsData);
    setIsLoading(false);
  }, [router]);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedCarId || !selectedType || !dueDate) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    // Basit tarih kontrolü (geçmiş tarih olmasın gibi)
    if (new Date(dueDate) < new Date().setHours(0,0,0,0)) {
        setError('Bitiş tarihi geçmiş bir tarih olamaz.');
        return;
    }

    setIsLoading(true);

    const reminderData = {
      carId: selectedCarId,
      type: selectedType,
      dueDate: dueDate,
    };

    // --- SİMÜLASYON (CORS Hatası nedeniyle) ---
    console.log('--- SİMÜLASYON: Hatırlatıcı Oluşturma isteği ---');
    console.log(reminderData);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    console.log('--- SİMÜLASYON: Hatırlatıcı oluşturuldu! Listeye yönlendiriliyor... ---');
    alert('Hatırlatıcı başarıyla oluşturuldu (Simülasyon).');
    router.push('/reminders'); // Başarılı, listeye yönlendir

    /*
    // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
    // Backend CORS'u düzeltince bu açılmalı.
    try {
        await api.post('/reminder', reminderData);
        alert('Hatırlatıcı başarıyla oluşturuldu!');
        router.push('/reminders');
    } catch (err) {
        console.error("Hatırlatıcı oluşturma hatası:", err);
        setError(err.message || "Hatırlatıcı oluşturulurken bir hata oluştu.");
        setIsLoading(false);
    }
    */
  };

  // --- Render ---
   if (isLoading && cars.length === 0) { // Henüz araçlar yükleniyorsa
      return <div className={styles.loading}>Yükleniyor...</div>;
   }

  return (
    // 'addCar.module.css' stillerine benzer stiller kullanacağız
    <div className={`${styles.addReminderContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Yeni Hatırlatıcı Ekle</h1>
        <Link href="/reminders" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Araç Seçimi */}
        <div className={styles.formGroup}>
          <label htmlFor="car">Araç Seçimi *</label>
          <select id="car" value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)} required>
            <option value="">Hatırlatıcı hangi araç için?</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>{car.plate} - {car.brand} {car.model}</option>
            ))}
          </select>
        </div>

        {/* Hatırlatıcı Tipi Seçimi */}
        <div className={styles.formGroup}>
          <label htmlFor="reminderType">Hatırlatıcı Tipi *</label>
          <select id="reminderType" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} required>
            <option value="">Hatırlatıcı tipini seçin...</option>
            {reminderTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Bitiş Tarihi Seçimi */}
        <div className={styles.formGroup}>
          <label htmlFor="dueDate">Bitiş Tarihi *</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            // Geçmiş tarihleri seçmeyi engelle (tarayıcı desteği değişebilir)
            min={new Date().toISOString().split("T")[0]}
          />
        </div>


        {/* Buton */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading && cars.length > 0 ? 'Kaydediliyor...' : 'Hatırlatıcı Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}
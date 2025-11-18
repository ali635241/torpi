'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api'; // API istemcimiz
import styles from './addAppointment.module.css'; // Yeni stil dosyamız

// --- Sahte Veriler ---
// 1. Müşterinin KENDİ Araçları (Normalde API'den gelir)
const mockMyCars = [
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" },
 { id: "mock-car-3", plate: "35 XYZ 456", brand: "Ford", model: "Focus" },
];
// 2. Randevu Alınabilecek Servislerin Listesi (Normalde API'den gelir)
const mockServiceList = [
    { id: "service-1", name: "Örnek Servis A.Ş. (İstanbul)" },
    { id: "service-2", name: "Ankara Hızlı Bakım (Ankara)" },
    { id: "service-3", name: "Ege Oto Tamir (İzmir)" },
];
// --- Sahte Veri Sonu ---


export default function AddAppointmentPage() {
    const router = useRouter();

    // --- State'ler ---
    const [myCars, setMyCars] = useState([]); // Müşterinin araçları
    const [services, setServices] = useState([]); // Servis listesi
    
    const [selectedCarId, setSelectedCarId] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [notes, setNotes] = useState(''); // Açıklama

    const [isLoading, setIsLoading] = useState(true); // Veri yükleme + Kaydetme
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // --- Veri Yükleme (SİMÜLASYON) ---
    useEffect(() => {
        // Token Kontrolü
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/login'); return; }
        
        // Sahte verileri yükle
        console.log("--- SİMÜLASYON: Müşterinin araçları ve servis listesi yükleniyor ---");
        // TODO: Backend CORS düzelince:
        // const carsPromise = api.get('/car'); //
        // const servicesPromise = api.get('/services/list'); // (API'de bu endpoint yok, varsayımsal)
        // const [carsData, servicesData] = await Promise.all([carsPromise, servicesPromise]);
        // setMyCars(carsData.data.cars);
        // setServices(servicesData.data);
        
        setMyCars(mockMyCars);
        setServices(mockServiceList);
        setIsLoading(false); 
        
    }, [router]);


    // --- Form Gönderim (SİMÜLASYON) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Validasyon
        if (!selectedCarId || !selectedServiceId || !dateTime) {
            setError('Lütfen araç, servis ve tarih/saat seçimi yapınız.');
            return;
        }
        if (new Date(dateTime) < new Date()) {
             setError('Randevu tarihi geçmiş bir tarih/saat olamaz.');
             return;
        }

        setIsLoading(true);

        const appointmentData = { 
            carId: selectedCarId, 
            serviceId: selectedServiceId, 
            dateTime, 
            notes,
            status: 'pending_approval' // Müşteri talebi 'Onay Bekliyor' olarak başlar
        };

        // --- SİMÜLASYON ---
        console.log("--- SİMÜLASYON: Yeni Randevu Talebi Gönderiliyor ---");
        console.log(appointmentData);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Sahte gecikme

        console.log("--- SİMÜLASYON: Randevu talebi alındı. Servis onayına düştü. ---");
        setSuccessMessage('Randevu talebiniz başarıyla alındı. Servis onayı sonrası size bildirilecektir.');
        setIsLoading(false);
        
        // Formu temizle (opsiyonel)
        setSelectedCarId(''); setSelectedServiceId(''); setDateTime(''); setNotes('');

        // 3 saniye sonra dashboard'a yönlendir
        setTimeout(() => {
             router.push('/dashboard'); 
        }, 3000);
        
        /*
        // --- ORİJİNAL KOD (API'de bu endpoint henüz yok) ---
        try {
            await api.post('/appointments/request', appointmentData); 
            setSuccessMessage('Randevu talebiniz başarıyla alındı...');
            // ... (yönlendirme)
        } catch (err) {
            console.error("Randevu talebi hatası:", err);
            setError(err.message || "Randevu talebi oluşturulurken bir hata oluştu.");
            setIsLoading(false);
        }
        */
    };

    // --- Render ---
    if (isLoading && myCars.length === 0) { 
      return <div className={styles.loading}>Yükleniyor...</div>;
    }

    return (
        <div className={`${styles.addAppointmentContainer} pageContainer`}> 
            <div className={styles.formContainer}>
                
                <div className={styles.header}>
                    <h1 className={styles.title}>Yeni Randevu Al</h1>
                    <Link href="/dashboard" className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
                    </Link>
                </div>
                <p className={styles.subtitle}>Aşağıdaki formu doldurarak seçtiğiniz servisten randevu talep edebilirsiniz.</p>


                <form onSubmit={handleSubmit}>
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    {/* Sadece başarı mesajı yoksa formu göster */}
                    {!successMessage && (
                        <>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="car">Araç Seçimi *</label>
                                    <select id="car" value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} required>
                                        <option value="">Lütfen aracınızı seçin...</option>
                                        {myCars.map(car => (
                                            <option key={car.id} value={car.id}>{car.plate} - {car.brand} {car.model}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="service">Servis Seçimi *</label>
                                    <select id="service" value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)} required>
                                        <option value="">Lütfen servis seçin...</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.id}>{service.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="dateTime">Randevu Tarih ve Saati *</label>
                                    <input type="datetime-local" id="dateTime" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="notes">Açıklama (İsteğe bağlı)</label>
                                    <textarea id="notes" rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Aracınızdaki sorunu veya talebinizi kısaca açıklayınız..."></textarea>
                                </div>
                            </div>

                            <div className={styles.buttonContainer}> 
                                <button type="submit" className={styles.submitButton} disabled={isLoading}> 
                                    {isLoading ? 'Randevu Alınıyor...' : 'Randevu Talebi Gönder'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
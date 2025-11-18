'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
// === YOL DÜZELTMESİ (5 seviye geri) ===
import api from '../../../../../lib/api'; 
// === DÜZELTME SONU ===
// Stil dosyasını MÜŞTERİ panelindeki cars/add klasöründen import ediyoruz
import styles from '../../../add/addCar.module.css'; 

// --- Sahte Araç Verisi (Sadece başlıkta göstermek için) ---
const mockCarsData = [
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" },
 { id: "mock-car-3", plate: "35 XYZ 456", brand: "Ford", model: "Focus" },
];
// --- Sahte Veri Sonu ---


export default function AddHistoryRecordPage() {
    const router = useRouter();
    const params = useParams();
    const carId = params.id; // URL'den araç ID'sini al

    // --- State'ler ---
    const [car, setCar] = useState(null); 
    const [date, setDate] = useState(''); 
    const [serviceType, setServiceType] = useState(''); 
    const [parts, setParts] = useState(''); 
    const [notes, setNotes] = useState(''); 
    const [cost, setCost] = useState(''); 

    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // --- Araç Bilgisini Yükle (SİMÜLASYON) ---
    useEffect(() => {
        // Token Kontrolü
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/login'); return; }
        
        // Sahte veriden aracı bul
        console.log(`--- SİMÜLASYON: Araç bilgisi yükleniyor ID: ${carId} ---`);
        const foundCar = mockCarsData.find(c => c.id === carId);
        
        if (foundCar) {
            setCar(foundCar);
        } else {
            setError("Kayıt eklenecek araç bulunamadı.");
        }
        setIsLoading(false); 
        
    }, [carId, router]);


    // --- Form Gönderim (SİMÜLASYON) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        if (!date || !serviceType) {
            setError('Lütfen Tarih ve İşlem Türü alanlarını doldurun.');
            return;
        }
        
        setIsLoading(true);

        const recordData = { 
            carId: carId, 
            source: 'user', 
            jobId: null, 
            date, 
            type: serviceType, 
            parts: parts.split(',').map(p => p.trim()), 
            notes,
            cost: cost ? parseFloat(cost) : 0
        };

        // --- SİMÜLASYON ---
        console.log("--- SİMÜLASYON: Yeni Kullanıcı Servis Kaydı Ekleniyor ---");
        console.log(recordData);
        // Normalde: mockServiceHistory.push(recordData); (ama mock data burada tanımlı değil)
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        console.log("--- SİMÜLASYON: Kayıt eklendi. Araç detayına yönlendiriliyor... ---");
        setSuccessMessage('Servis kaydınız başarıyla eklendi.');
        setIsLoading(false);
        
        // 2 saniye sonra araç detay sayfasına geri dön
        setTimeout(() => {
             router.push(`/cars/${carId}`); 
        }, 2000);
    };

    // --- Render ---
    if (isLoading && !car) { 
      return <div className={styles.loading}>Yükleniyor...</div>;
    }
    if (error && !car) {
        return (
             <div className={`${styles.addCarContainer} pageContainer`}>
                  <div className={styles.header}>
                     <h1 className={styles.title}>Hata</h1>
                     <Link href="/dashboard" className={styles.backButton}>
                         <i className="fas fa-arrow-left"></i> Geri Dön
                     </Link>
                  </div>
                 <div className={styles.errorMessage}>{error}</div>
             </div>
        );
    }
    if (!car) return null; // Araç yoksa

    return (
        // cars/add/addCar.module.css stillerini kullanıyoruz
        <div className={`${styles.addCarContainer} pageContainer`}> 
            <div className={styles.formContainer}> 
                
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Kullanıcı Servis Kaydı Ekle</h1>
                        <p className={styles.subtitle}>Araç: {car.plate} - {car.brand} {car.model}</p>
                    </div>
                    <Link href={`/cars/${carId}`} className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i> Geri Dön
                    </Link>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    {!successMessage && (
                        <>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="date">İşlem Tarihi *</label>
                                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="serviceType">İşlem Türü *</label>
                                    <input type="text" id="serviceType" value={serviceType} onChange={e => setServiceType(e.target.value)} required placeholder="Örn: Yağ Değişimi, Lastik Tamiri"/>
                                </div>
                            </div>
                            
                            <div className={styles.formRow}>
                                <div className={styles.formGroup} style={{flexBasis: '100%'}}>
                                    <label htmlFor="parts">Değişen Parçalar / Malzemeler</label>
                                    <textarea id="parts" rows={2} value={parts} onChange={e => setParts(e.target.value)} placeholder="Virgülle (,) ayırarak yazın..."></textarea>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup} style={{flexBasis: '100%'}}>
                                    <label htmlFor="notes">Notlar</label>
                                    <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="İşlemle ilgili notlarınız..."></textarea>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup} style={{flexBasis: '40%'}}>
                                    <label htmlFor="cost">Toplam Maliyet (TL)</label>
                                    <input type="number" id="cost" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" min="0" step="0.01" />
                                </div>
                            </div>

                            <div className={styles.buttonContainer}> 
                                <button type="submit" className={styles.submitButton} disabled={isLoading}> 
                                    {isLoading ? 'Kaydediliyor...' : 'Kaydı Ekle'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
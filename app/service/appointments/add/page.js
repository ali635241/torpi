'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Stil dosyasını service/register klasöründen import edelim (genel form stilleri)
import styles from '../../register/register.module.css'; 
import api from '../../../../lib/api'; // ../../../../lib/api yolu

// --- Sahte Veriler ---
const mockCustomersData = [
 { id: "cust-1", firstName: "Ali", lastName: "Veli" },
 { id: "cust-2", firstName: "Ayşe", lastName: "Yılmaz" },
 { id: "cust-3", firstName: "Mehmet", lastName: "Demir" },
];
const mockCarsData = [ // ownerId eklenmişti
 { ownerId: "cust-1", id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { ownerId: "cust-2", id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" },
 { ownerId: "cust-2", id: "mock-car-3", plate: "35DEF456", brand: "Ford", model: "Focus" }, 
];
// --- Sahte Veri Sonu ---

export default function AddAppointmentPage() {
    const router = useRouter();

    // --- State'ler ---
    const [customers, setCustomers] = useState([]); // Müşteri listesi
    const [cars, setCars] = useState([]); // Seçilen müşterinin araçları
    
    const [selectedCustomerId, setSelectedCustomerId] = useState(''); // Seçilen müşteri ID'si
    const [selectedCarId, setSelectedCarId] = useState(''); // Seçilen araç ID'si
    const [dateTime, setDateTime] = useState(''); // Randevu Tarih/Saat
    const [serviceType, setServiceType] = useState(''); // İşlem Türü
    const [notes, setNotes] = useState(''); // Notlar

    const [isLoading, setIsLoading] = useState(true); // Veri yükleme + Kaydetme
    const [error, setError] = useState(null);

    // --- Müşteri Listesi Yükle (SİMÜLASYON) ---
    useEffect(() => {
        // Token Kontrolü
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/service/login'); return; }
        
        // Sahte Müşteri Listesini Yükle
        console.log("--- SİMÜLASYON: Müşteri listesi yükleniyor ---");
        setCustomers(mockCustomersData);
        setIsLoading(false); 
        
        // TODO: Backend CORS düzelince gerçek api.get('/service/customers?limit=1000') gibi bir istek atılmalı
    }, [router]);

    // --- Müşteri seçildiğinde araç listesini güncelle (SİMÜLASYON) ---
    useEffect(() => {
        if (selectedCustomerId) {
            console.log(`--- SİMÜLASYON: ${selectedCustomerId} ID'li müşterinin araçları yükleniyor ---`);
            const customerCars = mockCarsData.filter(car => car.ownerId === selectedCustomerId);
            setCars(customerCars);
            setSelectedCarId(''); // Önceki araç seçimini sıfırla
            // TODO: Backend CORS düzelince gerçek api.get(`/service/customers/${selectedCustomerId}/cars`) gibi bir istek atılmalı
        } else {
            setCars([]); // Müşteri seçilmediyse araç listesini boşalt
            setSelectedCarId('');
        }
    }, [selectedCustomerId]);


    // --- Form Gönderim (SİMÜLASYON) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selectedCustomerId || !selectedCarId || !dateTime || !serviceType) {
            setError('Lütfen müşteri, araç, tarih/saat ve işlem türü alanlarını doldurun.');
            return;
        }
        // Basit tarih kontrolü
         if (new Date(dateTime) < new Date()) {
             setError('Randevu tarihi geçmiş bir tarih/saat olamaz.');
             return;
         }

        setIsLoading(true);

        const appointmentData = { 
            customerId: selectedCustomerId, 
            carId: selectedCarId, 
            dateTime, 
            serviceType, 
            notes,
            // API dokümanında belirtilmese de, randevu oluştururken status 'pending_approval' olabilir
            status: 'pending_approval' 
        };

        // --- SİMÜLASYON ---
        console.log("--- SİMÜLASYON: Yeni Randevu Ekleme İsteği ---");
        console.log(appointmentData);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        console.log("--- SİMÜLASYON: Randevu eklendi. Listeye yönlendiriliyor... ---");
        alert('Randevu başarıyla oluşturuldu (Simülasyon).');
        router.push('/service/appointments'); // Başarılı, listeye yönlendir
        
        /*
        // --- ORİJİNAL KOD ---
        // TODO: Backend CORS düzelince bu açılmalı (API endpoint varsayımsal: POST /service/appointments)
        try {
            await api.post('/service/appointments', appointmentData); 
            alert('Randevu başarıyla oluşturuldu!');
            router.push('/service/appointments'); 
        } catch (err) {
            console.error("Randevu ekleme hatası:", err);
            setError(err.message || "Randevu eklenirken bir hata oluştu.");
            setIsLoading(false);
        }
        */
    };

    // --- Render ---
   if (isLoading && customers.length === 0) { // Henüz müşteriler yükleniyorsa
      return <div className={styles.loading}>Yükleniyor...</div>;
   }

    return (
        // service/register stillerini kullanıyoruz
        <div className={styles.container}> 
            <div className={styles.form} style={{maxWidth: '700px'}}> 
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Yeni Randevu Ekle</h2>
                     <Link href="/service/appointments" className={styles.backButton}> {/* Geri butonu */}
                         <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                     </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    {/* Müşteri Seçimi */}
                    <div className={styles.formGroup}>
                        <label htmlFor="customer">Müşteri Seçimi *</label>
                        <select id="customer" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} required>
                            <option value="">Müşteri Seçiniz...</option>
                            {customers.map(cust => (
                                <option key={cust.id} value={cust.id}>{cust.firstName} {cust.lastName} ({cust.phone})</option>
                            ))}
                        </select>
                    </div>

                    {/* Araç Seçimi (Müşteri seçilince aktif olur) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="car">Araç Seçimi *</label>
                        <select id="car" value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} required disabled={!selectedCustomerId || cars.length === 0}>
                            <option value="">{selectedCustomerId ? (cars.length > 0 ? 'Araç Seçiniz...' : 'Bu müşterinin kayıtlı aracı yok') : 'Önce Müşteri Seçiniz...'}</option>
                            {cars.map(car => (
                                <option key={car.id} value={car.id}>{car.plate} - {car.brand} {car.model}</option>
                            ))}
                        </select>
                         {/* Müşterinin aracı yoksa veya müşteri seçilmediyse yeni araç ekleme linki */}
                         {selectedCustomerId && cars.length === 0 && (
                             <p className={styles.helperText}>Bu müşteriye <Link href={`/service/customers/${selectedCustomerId}/cars/add`} className={styles.helperLink}>yeni araç ekleyebilirsiniz</Link>.</p>
                         )}
                    </div>

                    {/* Tarih ve Saat */}
                    <div className={styles.formGroup}>
                        <label htmlFor="dateTime">Randevu Tarih ve Saati *</label>
                        <input type="datetime-local" id="dateTime" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
                    </div>

                    {/* İşlem Türü */}
                     <div className={styles.formGroup}>
                        <label htmlFor="serviceType">İşlem Türü *</label>
                        {/* Burayı select veya input yapabiliriz. Şimdilik input. */}
                        <input type="text" id="serviceType" value={serviceType} onChange={e => setServiceType(e.target.value)} required placeholder="Örn: Periyodik Bakım, Fren Kontrolü"/>
                    </div>

                    {/* Notlar */}
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">Notlar</label>
                        <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Randevu ile ilgili ek notlar..."></textarea>
                    </div>


                    <div style={{textAlign: 'right', marginTop: '30px'}}> 
                        <button type="submit" className={styles.button} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}> 
                            {isLoading ? 'Kaydediliyor...' : 'Randevu Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
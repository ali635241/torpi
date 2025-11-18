'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
// === STİL IMPORT YOLUNU KONTROL ET ===
// Bu dosya app/service/appointments/edit/[id]/page.js olduğu için,
// app/service/appointments/add/addAppointment.module.css dosyasına ulaşmak için:
// ../../add/addAppointment.module.css olmalı.
import styles from '../../add/addAppointment.module.css'; 
import api from '../../../../../lib/api'; 

// --- Sahte Veriler ---
const mockAppointmentsData = [
 { id: "appt-1", customerId: "cust-1", customerName: "Ali Veli", carId: "mock-car-1", carPlate: "34ABC123", dateTime: "2025-10-25T10:00:00", serviceType: "Periyodik Bakım", status: "pending_approval", notes: "Müşteri aradı, 10 bin bakımı." },
 { id: "appt-2", customerId: "cust-2", customerName: "Ayşe Yılmaz", carId: "mock-car-2", carPlate: "06XYZ789", dateTime: "2025-10-25T14:00:00", serviceType: "Fren Kontrolü", status: "confirmed", notes: "Frenlerden ses geliyormuş." },
 { id: "appt-3", customerId: "cust-1", customerName: "Ali Veli", carId: "mock-car-1", carPlate: "34ABC123", dateTime: "2025-10-26T09:00:00", serviceType: "Lastik Değişimi", status: "confirmed", notes: "Kışlık lastikler takılacak." },
 { id: "appt-4", customerId: "cust-3", customerName: "Mehmet Demir", carId: "mock-car-3", carPlate: "35DEF456", dateTime: "2025-10-24T11:00:00", serviceType: "Yağ Değişimi", status: "completed", notes: "Yağ ve filtre değişti." }, 
 { id: "appt-5", customerId: "cust-2", customerName: "Ayşe Yılmaz", carId: "mock-car-3", carPlate: "35DEF456", dateTime: "2025-10-27T13:00:00", serviceType: "Genel Kontrol", status: "pending_approval", notes: "Web sitesinden talep geldi." }, 
];
// Durumlar
const statusLabels = { pending_approval: "Onay Bekliyor", confirmed: "Onaylandı", completed: "Tamamlandı", cancelled: "İptal Edildi" };
const appointmentStatuses = ["pending_approval", "confirmed", "completed", "cancelled"]; 
// --- Sahte Veri Sonu ---


export default function EditAppointmentPage() {
    const router = useRouter();
    const params = useParams();
    const appointmentId = params.id; 

    // --- State'ler ---
    const [appointment, setAppointment] = useState(null); 
    const [dateTime, setDateTime] = useState(''); 
    const [serviceType, setServiceType] = useState(''); 
    const [notes, setNotes] = useState(''); 
    const [status, setStatus] = useState(''); 

    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // --- Veri Yükleme (SİMÜLASYON) ---
    useEffect(() => {
        // Token Kontrolü
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/service/login'); return; }
        
        // Sahte veriden randevuyu bul
        console.log(`--- SİMÜLASYON: Düzenlenecek Randevu verisi yükleniyor ID: ${appointmentId} ---`);
        const appointmentToEdit = mockAppointmentsData.find(a => a.id === appointmentId);

        if (appointmentToEdit) {
            setAppointment(appointmentToEdit); 
             try {
                const dt = new Date(appointmentToEdit.dateTime);
                const year = dt.getFullYear();
                const month = String(dt.getMonth() + 1).padStart(2, '0');
                const day = String(dt.getDate()).padStart(2, '0');
                const hours = String(dt.getHours()).padStart(2, '0');
                const minutes = String(dt.getMinutes()).padStart(2, '0');
                setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
            } catch (e) { setDateTime(''); }
            setServiceType(appointmentToEdit.serviceType || '');
            setNotes(appointmentToEdit.notes || '');
            setStatus(appointmentToEdit.status || '');
            setError(null);
        } else {
            console.error(`Randevu bulunamadı ID: ${appointmentId}`);
            setError(`Düzenlenecek randevu bulunamadı (ID: ${appointmentId}).`);
        }
        setIsLoading(false); 
        
    }, [appointmentId, router]);

    // --- Form Gönderim (SİMÜLASYON - Güncelleme) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Validasyon
        if (!dateTime || !serviceType || !status) { setError('Lütfen tarih/saat, işlem türü ve durum alanlarını doldurun.'); return; }
         if (new Date(dateTime) < new Date().setHours(0,0,0,0) && status !== 'completed' && status !== 'cancelled') { setError('Geçmiş bir tarih için sadece "Tamamlandı" veya "İptal Edildi" durumu seçilebilir.'); return; }

        setIsLoading(true);

        const updatedAppointmentData = { dateTime, serviceType, notes, status };

        // --- SİMÜLASYON ---
        console.log(`--- SİMÜLASYON: Randevu Güncelleme İsteği ID: ${appointmentId} ---`);
        console.log(updatedAppointmentData);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        console.log("--- SİMÜLASYON: Randevu güncellendi. Listeye yönlendiriliyor... ---");
        setSuccessMessage('Randevu bilgileri başarıyla güncellendi (Simülasyon).');
        setIsLoading(false);
        setAppointment(prev => ({...prev, ...updatedAppointmentData})); // State'i güncelle
        
        setTimeout(() => { router.push('/service/appointments'); }, 2000);
    };

    // --- İş Emrine Dönüştür (Simülasyon) ---
    const handleConvertToJob = () => {
        if (!appointment) return;
        console.log(`--- SİMÜLASYON: İş Emrine Dönüştürülüyor: Randevu ID ${appointmentId} ---`);
        const queryParams = new URLSearchParams({
            // Müşteri ve Araç ID'leri mock datada eksik, düzeltelim
            customerId: appointment.customerId || 'UNKNOWN_CUSTOMER', 
            carId: appointment.carId || 'UNKNOWN_CAR', 
            serviceType: appointment.serviceType || '',
            notes: appointment.notes || '',
        }).toString();
        router.push(`/service/jobs/add?${queryParams}`);
    };


   // --- Render ---
   if (isLoading && !appointment) { return <div className={styles.loading}>Randevu Bilgileri Yükleniyor...</div>; }
   if (error && !appointment) { /* ... (Hata render'ı) ... */ }
   if (!appointment) return null; 


    return (
        // addAppointment.module.css stillerini kullanıyoruz
        <div className={styles.addReminderContainer}> 
            <div className={styles.form} style={{maxWidth: '700px'}}> 
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Randevu Düzenle</h2>
                     <Link href="/service/appointments" className={styles.backButton}> 
                         <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                     </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    {/* Müşteri ve Araç Bilgisi (Düzenlenemez) */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}> 
                            <label>Müşteri / Araç</label> 
                            <input type="text" value={`${appointment.customerName} (${appointment.carPlate})`} disabled className={styles.disabledInput} /> 
                        </div>
                    </div>

                    {/* Tarih ve Saat */}
                    <div className={styles.formGroup}>
                        <label htmlFor="dateTime">Randevu Tarih ve Saati *</label>
                        <input type="datetime-local" id="dateTime" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
                    </div>

                    {/* İşlem Türü */}
                     <div className={styles.formGroup}>
                        <label htmlFor="serviceType">İşlem Türü *</label>
                        <input type="text" id="serviceType" value={serviceType} onChange={e => setServiceType(e.target.value)} required placeholder="Örn: Periyodik Bakım"/>
                    </div>

                    {/* Durum */}
                    <div className={styles.formGroup}>
                        <label htmlFor="status">Durum *</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value)} required>
                            {appointmentStatuses.map(s => (
                                <option key={s} value={s}>{statusLabels[s] || s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Notlar */}
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">Notlar</label>
                        <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Randevu ile ilgili ek notlar..."></textarea>
                    </div>

                    <div className={styles.buttonContainer} style={{justifyContent: 'space-between'}}> 
                        {/* İş Emrine Dönüştür Butonu */}
                        {appointment.status === 'confirmed' && (
                             <button type="button" onClick={handleConvertToJob} className={styles.convertToJobButton} disabled={isLoading}>
                                 <i className="fas fa-clipboard-check"></i> İş Emrine Dönüştür
                             </button>
                        )}
                         {appointment.status !== 'confirmed' && <div />} 

                        <button type="submit" className={styles.submitButton} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}> 
                            {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Helper fonksiyonlar (Eğer silindiyse tekrar eklenmeli)
const formatDateTime_placeholder = (dateTimeString) => { /*...*/ };
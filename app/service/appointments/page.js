'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; 
import styles from './appointments.module.css'; 

// --- Sahte Randevu Verisi ---
const mockAppointmentsData = [
 { id: "appt-1", customerName: "Ali Veli", carPlate: "34ABC123", dateTime: "2025-10-25T10:00:00", serviceType: "Periyodik Bakım", status: "pending_approval", notes: "Müşteri aradı, 10 bin bakımı." },
 { id: "appt-2", customerName: "Ayşe Yılmaz", carPlate: "06XYZ789", dateTime: "2025-10-25T14:00:00", serviceType: "Fren Kontrolü", status: "confirmed", notes: "Frenlerden ses geliyormuş." },
 { id: "appt-3", customerName: "Ali Veli", carPlate: "34ABC123", dateTime: "2025-10-26T09:00:00", serviceType: "Lastik Değişimi", status: "confirmed", notes: "Kışlık lastikler takılacak." },
 { id: "appt-4", customerName: "Mehmet Demir", carPlate: "35DEF456", dateTime: "2025-10-24T11:00:00", serviceType: "Yağ Değişimi", status: "completed", notes: "Yağ ve filtre değişti." }, 
 { id: "appt-5", customerName: "Ayşe Yılmaz", carPlate: "35DEF456", dateTime: "2025-10-27T13:00:00", serviceType: "Genel Kontrol", status: "pending_approval", notes: "Web sitesinden talep geldi." }, 
];
// --- Sahte Veri Sonu ---

// Durum Etiketleri ve Stilleri
const statusLabels = { pending_approval: "Onay Bekliyor", confirmed: "Onaylandı", completed: "Tamamlandı", cancelled: "İptal Edildi" };
const statusStyles = { pending_approval: styles.pending, confirmed: styles.confirmed, completed: styles.completed, cancelled: styles.cancelled };
// Tip etiketleri (handle fonksiyonlarında kullanmak için)
const reminderTypeLabels = { "Periyodik Bakım": "Periyodik Bakım", "Fren Kontrolü": "Fren Kontrolü", "Lastik Değişimi": "Lastik Değişimi", "Yağ Değişimi": "Yağ Değişimi", "Genel Kontrol": "Genel Kontrol" };


export default function ServiceAppointmentsPage() {
  const router = useRouter();

  // --- State'ler ---
  const [appointments, setAppointments] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [filterStatus, setFilterStatus] = useState(''); // Filtreleme

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }

    // Sahte Randevu Verisini Yükle
    console.log("--- SİMÜLASYON: Servis Randevu Listesi yükleniyor ---");
    const sortedData = mockAppointmentsData.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    setAppointments(sortedData);
    setIsLoading(false);

  }, [router]);

  // --- Aksiyon Fonksiyonları (Simülasyonlu) ---
  const handleUpdateStatus = async (apptId, newStatus, apptInfo) => { 
     const statusText = statusLabels[newStatus] || newStatus;
     if (!window.confirm(`${apptInfo} randevusunu "${statusText}" olarak işaretlemek istediğinizden emin misiniz?`)) return; 

     console.log(`--- SİMÜLASYON: Randevu (${apptId}) Durumu Güncelleniyor: ${newStatus} ---`);
     await new Promise(resolve => setTimeout(resolve, 500)); 
     setAppointments(current => current.map(appt => 
         appt.id === apptId ? { ...appt, status: newStatus } : appt
     )); 
     alert(`${apptInfo} randevusu başarıyla "${statusText}" olarak işaretlendi (Simülasyon).`); 
  };

  const handleDeleteAppointment = async (apptId, apptInfo) => {
    if (!window.confirm(`${apptInfo} randevusunu silmek istediğinizden emin misiniz?`)) return;
    console.log(`--- SİMÜLASYON: Randevu Siliniyor: ${apptId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setAppointments(current => current.filter(appt => appt.id !== apptId)); 
    alert(`${apptInfo} randevusu başarıyla silindi (Simülasyon).`);
  };

  // Tarih ve Saati Formatlama
  const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return '-';
      try {
          const date = new Date(dateTimeString);
          return `${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
      } catch (e) { return '-'; }
  };

  // Filtrelenmiş Liste
  const filteredReminders = filterStatus 
    ? appointments.filter(r => r.status === filterStatus) 
    : appointments;


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Randevular Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login">Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }

  return (
    <div className={`${styles.appointmentsContainer} pageContainer`}> 
      {/* === HEADER (DÜZELTİLMİŞ YAPI) === */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
             <h1 className={styles.title}>Randevu Yönetimi ({filteredReminders.length})</h1> 
             <Link href="/service/dashboard" className={styles.backButton}>
                 <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
             </Link>
        </div>
        <div className={styles.headerRightButtons}>
            <Link 
                href="/service/scheduler" // Bu sayfa henüz yok (404 verecek)
                className={`${styles.actionButton} ${styles.schedulerButton}`}
            >
                <i className="fas fa-calendar-alt"></i> Randevu Planla
            </Link>
            <Link 
                href="/service/appointments/add" 
                className={`${styles.actionButton} ${styles.addButton}`}
            >
                 <i className="fas fa-calendar-plus"></i> Yeni Randevu Ekle
            </Link>
        </div>
      </div>
      {/* === HEADER SONU === */}

       {/* Filtreleme Seçenekleri */}
        <div className={styles.filters}>
            <label htmlFor="statusFilter">Duruma Göre Filtrele:</label>
            <select 
                id="statusFilter" 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
            >
                <option value="">Tümü</option>
                <option value="pending_approval">Onay Bekliyor</option>
                <option value="confirmed">Onaylandı</option>
                <option value="completed">Tamamlandı</option>
                <option value="cancelled">İptal Edildi</option> 
            </select>
        </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Randevu Tablosu */}
      {appointments.length === 0 ? (
        <p className={styles.noDataMessage}>Henüz hiç randevu kaydı yok.</p>
      ) : filteredReminders.length === 0 ? (
          <p className={styles.noDataMessage}>Seçilen filtreye uygun randevu bulunamadı.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.appointmentTable}>
            <thead>
              <tr>
                <th>Tarih & Saat</th>
                <th>Müşteri</th>
                <th>Araç Plakası</th>
                <th>İşlem Türü</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredReminders.map(appt => ( 
                <tr key={appt.id}>
                  <td>{formatDateTime(appt.dateTime)}</td>
                  <td>{appt.customerName}</td>
                  <td>{appt.carPlate}</td>
                  <td>{appt.serviceType}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusStyles[appt.status] || ''}`}>
                      {statusLabels[appt.status] || appt.status}
                    </span>
                  </td>
                  <td className={styles.actions}>
                     {appt.status === 'pending_approval' && (
                         <> 
                            <button className={`${styles.actionButton} ${styles.confirmButton}`} title="Onayla" onClick={() => handleUpdateStatus(appt.id, 'confirmed', `${appt.customerName} - ${appt.serviceType}`)} > <i className="fas fa-check"></i> </button>
                            <button className={`${styles.actionButton} ${styles.cancelButton}`} title="Reddet/İptal Et" onClick={() => handleUpdateStatus(appt.id, 'cancelled', `${appt.customerName} - ${appt.serviceType}`)} > <i className="fas fa-times"></i> </button>
                         </>
                     )}
                     {appt.status === 'confirmed' && (
                          <button className={`${styles.actionButton} ${styles.cancelButton}`} title="İptal Et" onClick={() => handleUpdateStatus(appt.id, 'cancelled', `${appt.customerName} - ${appt.serviceType}`)} > <i className="fas fa-calendar-times"></i> </button>
                     )}
                     {/* Düzenle Butonu (Şimdilik Devre Dışı) */}
                     <button className={`${styles.actionButton} ${styles.editButton}`} title="Düzenle" disabled>
                         <i className="fas fa-edit"></i>
                     </button>
                     <button className={`${styles.actionButton} ${styles.deleteButton}`} title="Sil" onClick={() => handleDeleteAppointment(appt.id, `${appt.customerName} - ${appt.serviceType}`)}>
                       <i className="fas fa-trash"></i>
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
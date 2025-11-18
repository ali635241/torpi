'use client'; 

import React from 'react'; // <-- 1. React importu eklendi (Hata için)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; 
import styles from './scheduler.module.css'; 

// --- Sahte Veriler ---
const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00",
];
const mockScheduledAppointments = [
 { id: "appt-1", carPlate: "34ABC123", customerName: "Ali Veli", serviceType: "Periyodik Bakım", time: "10:00", status: "confirmed" },
 { id: "appt-2", carPlate: "06XYZ789", customerName: "Ayşe Yılmaz", serviceType: "Fren Kontrolü", time: "14:00", status: "confirmed" },
 { id: "appt-5", carPlate: "35DEF456", customerName: "Ayşe Yılmaz", serviceType: "Genel Kontrol", time: "11:00", status: "pending_approval" }, 
];
// --- Sahte Veri Sonu ---


export default function ServiceSchedulerPage() {
  const router = useRouter();

  // --- State'ler ---
  const [appointments, setAppointments] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [currentDate, setCurrentDate] = useState(new Date()); 

  // --- Veri Çekme (SİMÜLASYON - Tarihe göre) ---
  useEffect(() => {
    // 1. Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }
    
    // 2. Yüklemeyi başlat
    setIsLoading(true);
    setAppointments([]); // Önceki veriyi temizle
    
    console.log(`--- SİMÜLASYON: Randevu planı yükleniyor (Tarih: ${currentDate.toLocaleDateString('tr-TR')}) ---`);
    
    // Simülasyon: Sadece "bugün" için mock datayı göster, başka günler boş olsun
    const today = new Date();
    if (currentDate.toDateString() === today.toDateString()) {
        // Sahte gecikme
        setTimeout(() => {
            setAppointments(mockScheduledAppointments);
            setIsLoading(false);
        }, 500);
    } else {
        // Diğer günler boş (API'den boş liste gelmiş gibi)
        setTimeout(() => {
            setAppointments([]);
            setIsLoading(false);
        }, 500);
    }
    // TODO: Gerçek API: api.get(`/service/appointments/by-date?date=${currentDate.toISOString()}`);

  }, [router, currentDate]); // Tarih değişince de çalışır

  // === YENİ: Tarih Değiştirme Fonksiyonu ===
  const handleDateChange = (daysToAdd) => {
      setCurrentDate(prevDate => {
          const newDate = new Date(prevDate);
          newDate.setDate(newDate.getDate() + daysToAdd);
          return newDate;
      });
  };

  // === YENİ: Saati ve Tarihi input formatına (YYYY-MM-DDTHH:mm) çevir ===
  const formatDateTimeForInput = (date, time) => {
      const [hours, minutes] = time.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0); // saniye/ms sıfırla
      
      // Timezone offset'ini hesaba kat (örn: +03:00)
      const tzOffset = newDate.getTimezoneOffset() * 60000; // milisaniye
      // Offset'i çıkararak yerel saati UTC gibi göster
      const localISOTime = new Date(newDate.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISOTime;
  };

  // --- Helper: Saati kontrol et ---
  const getAppointmentForSlot = (time) => {
      return appointments.find(appt => appt.time === time);
  };

  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Planlama Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login">Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }

  return (
    <div className={`${styles.schedulerContainer} pageContainer`}> 
      {/* Sayfa Başlığı ve Geri Butonu */}
      <div className={styles.header}>
         <div className={styles.headerLeft}>
             <h1 className={styles.title}>Randevu Planlama</h1>
             <Link href="/service/appointments" className={styles.backButton}>
                 <i className="fas fa-arrow-left"></i> Randevu Listesine Dön
             </Link>
        </div>
         {/* === GÜNCELLENDİ: Tarih Seçici Butonları === */}
         <div className={styles.dateSelector}>
             <button onClick={() => handleDateChange(-1)} title="Önceki Gün"><i className="fas fa-chevron-left"></i></button>
             <strong>{currentDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
             <button onClick={() => handleDateChange(1)} title="Sonraki Gün"><i className="fas fa-chevron-right"></i></button>
         </div>
         {/* === GÜNCELLEME SONU === */}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Saatlik Plan Grid'i */}
      <div className={styles.calendarGrid}>
          <div className={styles.gridHeader}>Saat</div>
          <div className={styles.gridHeader}>Durum / Müşteri Bilgisi</div>

          {/* Saat dilimlerini map'le */}
          {timeSlots.map(time => {
              const appointment = getAppointmentForSlot(time);
              
              return (
                  <React.Fragment key={time}>
                      <div className={styles.timeSlot}>{time}</div>
                      
                      {appointment ? (
                          // DOLU Slot
                          <div className={`${styles.appointmentBlock} ${styles[appointment.status]}`}>
                              <div className={styles.appointmentInfo}>
                                  <strong>{appointment.customerName} ({appointment.carPlate})</strong>
                                  <span>{appointment.serviceType}</span>
                              </div>
                              {appointment.status === 'pending_approval' && (
                                  <span className={styles.statusTag}>Onay Bekliyor</span>
                              )}
                          </div>
                      ) : (
                          // BOŞ Slot
                          <div className={styles.emptySlot}>
                              <span>Boş</span>
                              {/* === GÜNCELLENDİ: + Butonu Link oldu === */}
                              <Link 
                                  href={`/service/appointments/add?dateTime=${formatDateTimeForInput(currentDate, time)}`}
                                  className={styles.addSlotButtonLink}
                                  title={`${time} için yeni randevu ekle`}
                              >
                                  +
                              </Link>
                              {/* === GÜNCELLEME SONU === */}
                          </div>
                      )}
                  </React.Fragment>
              );
          })}

      </div> {/* calendarGrid sonu */}
    </div>
  );
}
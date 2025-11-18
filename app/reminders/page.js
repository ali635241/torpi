'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api'; 
import styles from './reminders.module.css'; 

// --- Sahte Veriler ---
// Sahte Hatırlatıcı Verisi 
const mockRemindersData = [
 { id: "mock-reminder-1", carId: "mock-car-1", carPlate: "34ABC123", type: "inspection", dueDate: "2025-12-15", status: "pending", daysRemaining: 64, notificationSent: true, createdAt: "2025-10-01T10:00:00.000Z" },
 { id: "mock-reminder-2", carId: "mock-car-1", carPlate: "34ABC123", type: "insurance", dueDate: "2025-11-20", status: "pending", daysRemaining: 39, notificationSent: false, createdAt: "2025-10-01T10:00:00.000Z" },
 { id: "mock-reminder-3", carId: "mock-car-2", carPlate: "06XYZ789", type: "maintenance", dueDate: "2025-11-05", status: "pending", daysRemaining: 24, notificationSent: true, createdAt: "2025-10-02T11:00:00.000Z" },
 { id: "mock-reminder-4", carId: "mock-car-2", carPlate: "06XYZ789", type: "inspection", dueDate: "2025-09-10", status: "expired", daysRemaining: -38, notificationSent: true, createdAt: "2025-08-01T09:00:00.000Z" }, // Süresi geçmiş örnek
 { id: "mock-reminder-5", carId: "mock-car-1", carPlate: "34ABC123", type: "kasko", dueDate: "2025-10-15", status: "completed", daysRemaining: 0, notificationSent: true, createdAt: "2025-09-01T12:00:00.000Z", completedAt: "2025-10-14T15:00:00.000Z" } // Tamamlanmış örnek
];
// --- Sahte Veri Sonu ---

// Tip etiketleri
const reminderTypeLabels = { inspection: "Muayene", insurance: "Sigorta", kasko: "Kasko", maintenance: "Bakım" };
// Durum etiketleri
const reminderStatusLabels = { pending: "Bekliyor", completed: "Tamamlandı", expired: "Süresi Geçti" };


export default function RemindersListPage() {
  const router = useRouter();

  // --- State'ler ---
  const [reminders, setReminders] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState(''); // Filtreleme için

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }

    // Sahte veriyi yükle
    // Backend CORS'u düzeltince gerçek api.get('/reminder') isteği atılmalı
    setReminders(mockRemindersData); 
    setIsLoading(false);
  }, [router]);

  // --- Silme Fonksiyonu (Simülasyonlu) ---
  const handleDeleteReminder = async (reminderId, reminderInfo) => {
    if (!window.confirm(`${reminderInfo} hatırlatıcısını silmek istediğinizden emin misiniz?`)) return;
    console.log(`--- SİMÜLASYON: Hatırlatıcı Siliniyor: ${reminderId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setReminders(current => current.filter(r => r.id !== reminderId)); 
    alert(`${reminderInfo} hatırlatıcısı başarıyla silindi (Simülasyon).`);
    // TODO: Gerçek API isteği (api.delete(`/reminder/${reminderId}`))
  };

  // --- Tamamlandı İşaretleme Fonksiyonu (Simülasyonlu) ---
  const handleCompleteReminder = async (reminderId, reminderInfo) => {
     if (!window.confirm(`${reminderInfo} hatırlatıcısını tamamlandı olarak işaretlemek istediğinizden emin misiniz?`)) return;
     console.log(`--- SİMÜLASYON: Hatırlatıcı Tamamlanıyor: ${reminderId} ---`);
     await new Promise(resolve => setTimeout(resolve, 500));
     // State'i güncelle
     setReminders(current => current.map(r => 
         r.id === reminderId 
         ? { ...r, status: 'completed', completedAt: new Date().toISOString(), daysRemaining: 0 } // Yeni status ve tarih
         : r 
     ));
     alert(`${reminderInfo} hatırlatıcısı tamamlandı olarak işaretlendi (Simülasyon).`);
     // TODO: Gerçek API isteği (api.patch(`/reminder/${reminderId}`, { status: 'completed' }))
  };

  // --- Filtrelenmiş Hatırlatıcılar ---
  const filteredReminders = filterStatus 
    ? reminders.filter(r => r.status === filterStatus) 
    : reminders;


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Hatırlatıcılar Yükleniyor...</div>; }
  if (error) { return <div className={styles.loading}>Hata: {error}</div>; }

  return (
    <div className={`${styles.remindersContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hatırlatıcılar ({filteredReminders.length})</h1>
        {/* TODO: Yeni Hatırlatıcı Ekle butonu/linki */}
        <Link href="/reminders/add" className={styles.addButton}>
             <i className="fas fa-plus"></i> Yeni Hatırlatıcı Ekle
        </Link>
      </div>

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
                <option value="pending">Bekliyor</option>
                <option value="completed">Tamamlandı</option>
                <option value="expired">Süresi Geçti</option>
            </select>
        </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {reminders.length === 0 ? (
        <p className={styles.noRemindersMessage}>Henüz hiç hatırlatıcı yok.</p>
      ) : filteredReminders.length === 0 ? (
          <p className={styles.noRemindersMessage}>Seçilen filtreye uygun hatırlatıcı bulunamadı.</p>
      ) : (
        <div className={styles.remindersList}>
          {filteredReminders.map(reminder => (
            <div key={reminder.id} className={`${styles.reminderItem} ${styles[reminder.status]}`}> {/* Duruma göre stil */}
              <div className={styles.reminderIcon}>
                <i className={
                  reminder.type === 'inspection' ? 'fas fa-search' :
                  reminder.type === 'insurance' ? 'fas fa-shield-alt' :
                  reminder.type === 'kasko' ? 'fas fa-car-crash' :
                  reminder.type === 'maintenance' ? 'fas fa-tools' : 'fas fa-bell'
                }></i>
              </div>
              <div className={styles.reminderInfo}>
                <span className={styles.reminderCarPlate}>{reminder.carPlate}</span>
                <span className={styles.reminderType}>{reminderTypeLabels[reminder.type] || reminder.type}</span>
                <span className={styles.reminderDate}>
                    {reminder.status === 'completed' ? `Tamamlandı: ${new Date(reminder.completedAt).toLocaleDateString('tr-TR')}` 
                     : `Bitiş: ${new Date(reminder.dueDate).toLocaleDateString('tr-TR')}`}
                </span>
              </div>
              <div className={styles.reminderStatus}>
                 <span className={`${styles.statusBadge} ${styles[reminder.status]}`}>
                    {reminderStatusLabels[reminder.status] || reminder.status}
                 </span>
                 {reminder.status === 'pending' && reminder.daysRemaining > 0 && (
                     <span className={styles.daysRemaining}>{reminder.daysRemaining} gün kaldı</span>
                 )}
                  {reminder.status === 'pending' && reminder.daysRemaining <= 0 && (
                     <span className={`${styles.daysRemaining} ${styles.expired}`}>Süresi Doldu!</span>
                 )}
                 {reminder.status === 'expired' && (
                     <span className={`${styles.daysRemaining} ${styles.expired}`}>Süresi Geçti</span>
                 )}
              </div>
              <div className={styles.reminderActions}>
                 {/* Sadece 'bekliyor' durumundakiler tamamlanabilir */}
                 {reminder.status === 'pending' && (
                     <button
                        className={`${styles.actionButton} ${styles.completeButton}`}
                        title="Tamamlandı İşaretle"
                        onClick={() => handleCompleteReminder(reminder.id, `${reminder.carPlate} - ${reminderTypeLabels[reminder.type]}`)}
                     >
                         <i className="fas fa-check-circle"></i>
                     </button>
                 )}
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  title="Sil"
                  onClick={() => handleDeleteReminder(reminder.id, `${reminder.carPlate} - ${reminderTypeLabels[reminder.type]}`)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
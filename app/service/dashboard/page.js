'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; // ../../../lib/api yolu düzeltildi
import styles from './dashboard.module.css'; // Yeni CSS

// --- Sahte Dashboard Verisi (Faz 1B Dokümanına Göre) ---
const mockServiceDashboardData = {
  companyName: "Örnek Servis A.Ş.", // Giriş yapan firma/kullanıcı adı
  dailyAppointments: 5, // [cite: 114]
  ongoingJobs: 3, // [cite: 115]
  completedToday: 2, // [cite: 116]
  waitingApproval: 1, // [cite: 117]
  lowStockItems: 2, // [cite: 118] (Sadece sayı)
  averageCarScore: 72, // [cite: 119]
  recentActivity: [ // Örnek son aktiviteler
      { id: 1, type: "Randevu", description: "34ABC123 için yeni randevu oluşturuldu.", time: "10:30" },
      { id: 2, type: "İşlem", description: "06XYZ789 işlemi tamamlandı.", time: "11:15" },
      { id: 3, type: "Onay", description: "34ABC123 için müşteri onayı bekleniyor.", time: "11:45" },
  ]
};
// --- Sahte Veri Sonu ---


export default function ServiceDashboardPage() {
  const router = useRouter();

  // --- State'ler ---
  const [dashboardData, setDashboardData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  // --- Çıkış Yap Fonksiyonu ---
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    // localStorage.removeItem('serviceUser'); // Gerekirse
    router.push('/service/login'); 
  };

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // 1. Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }

    // 2. Sahte Dashboard Verisini Yükle
    // Backend CORS'u düzeltince gerçek api.get('/service/dashboard') gibi bir istek atılmalı
    console.log("--- SİMÜLASYON: Servis Dashboard verisi yükleniyor ---");
    setDashboardData(mockServiceDashboardData);
    setIsLoading(false);

  }, [router]);

  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Servis Paneli Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login" onClick={handleLogout}>Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }
  if (!dashboardData) { return <div className={styles.loading}>Veri bulunamadı.</div>; } // Ekstra kontrol

  // Puan rengi helper'ı (Müşteri dashboard'dan)
  const getScoreStatus = (score) => { if (score >= 80) return styles.scoreGood; if (score >= 60) return styles.scoreMedium; return styles.scoreBad; };


  return (
    // Servis paneli layout'u zaten app/service/layout.js'de
    <div className={styles.dashboardContainer}>
      {/* Sayfa Başlığı ve Çıkış */}
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>Kontrol Paneli</h1>
            <p className={styles.companyName}>{dashboardData.companyName}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <i className="fas fa-sign-out-alt"></i> Çıkış Yap
        </button>
      </div>

      {/* Hızlı İstatistik Kartları */}
      <div className={styles.statsGrid}>
          <div className={styles.statCard}> <i className="fas fa-calendar-alt"></i> <span>Günlük Randevu</span> <strong>{dashboardData.dailyAppointments}</strong> </div>
          <div className={styles.statCard}> <i className="fas fa-tasks"></i> <span>Devam Eden İşler</span> <strong>{dashboardData.ongoingJobs}</strong> </div>
          <div className={styles.statCard}> <i className="fas fa-check-circle"></i> <span>Bugün Bitenler</span> <strong>{dashboardData.completedToday}</strong> </div>
          <div className={styles.statCard}> <i className="fas fa-hourglass-half"></i> <span>Onay Bekleyen</span> <strong>{dashboardData.waitingApproval}</strong> </div>
          <div className={styles.statCard}> <i className="fas fa-box-open"></i> <span>Düşük Stok</span> <strong>{dashboardData.lowStockItems}</strong> </div>
          {/* Araç Puanı Kartı */}
          <div className={`${styles.statCard} ${styles.scoreCard}`}>
              <i className="fas fa-star"></i>
              <span>Ort. Araç Puanı</span>
              <strong className={getScoreStatus(dashboardData.averageCarScore)}>
                  {dashboardData.averageCarScore}/100
              </strong>
          </div>
      </div>

       {/* Hızlı Erişim Linkleri */}
       <div className={styles.quickLinks}>
            <Link href="/service/appointments" className={styles.quickLink}><i className="fas fa-calendar-plus"></i> Randevu Yönetimi</Link>
            <Link href="/service/jobs" className={styles.quickLink}><i className="fas fa-clipboard-list"></i> İş Emirleri</Link>
            {/* --- BURAYI GÜNCELLE --- */}
            <Link href="/service/customers" className={styles.quickLink}><i className="fas fa-users"></i> Müşteriler</Link>
            {/* --- GÜNCELLEME SONU --- */}
            {/* --- YENİ LİNK --- */}
            <Link href="/service/employees" className={styles.quickLink}><i className="fas fa-users-cog"></i> Çalışanlar</Link>
            {/* --- BURAYI GÜNCELLE --- */}
            <Link href="/service/analytics" className={styles.quickLink}><i className="fas fa-chart-line"></i> Raporlar</Link>
            {/* --- GÜNCELLEME SONU --- */}
       </div>


      {/* Son Aktiviteler */}
      <div className={styles.activitySection}>
          <h2 className={styles.sectionTitle}>Son Aktiviteler</h2>
          {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <ul className={styles.activityList}>
                  {dashboardData.recentActivity.map(activity => (
                      <li key={activity.id} className={styles.activityItem}>
                          <span className={styles.activityTime}>{activity.time}</span>
                          <span className={`${styles.activityType} ${styles[activity.type.toLowerCase()]}`}>{activity.type}</span>
                          <span className={styles.activityDesc}>{activity.description}</span>
                      </li>
                  ))}
              </ul>
          ) : (
              <p>Henüz aktivite yok.</p>
          )}
      </div>

    </div>
  );
}
'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; 
import styles from './jobs.module.css'; 

// --- Sahte İş Emri Verisi (Faz 1B Dokümanına Göre) ---
// İş Emri Durumları: Açık, Müşteri Onayı Bekliyor, Devam Ediyor, Tamamlandı, İptal Edildi
const mockJobsData = [
 { id: "job-1", customerName: "Ali Veli", carPlate: "34ABC123", serviceType: "Periyodik Bakım", status: "in_progress", assignedTo: "Mehmet Usta", startDate: "2025-10-25T10:30:00", estimatedCost: 1250 },
 { id: "job-2", customerName: "Ayşe Yılmaz", carPlate: "06XYZ789", serviceType: "Fren Kontrolü", status: "waiting_customer_approval", assignedTo: "Ahmet Usta", startDate: "2025-10-25T14:15:00", estimatedCost: 850, notes: "Ön balatalar değişecek, diskler tornalanacak." },
 { id: "job-3", customerName: "Mehmet Demir", carPlate: "35DEF456", serviceType: "Yağ Değişimi", status: "completed", assignedTo: "Mehmet Usta", startDate: "2025-10-24T11:00:00", completionDate: "2025-10-24T13:00:00", totalCost: 600 },
 { id: "job-4", customerName: "Ali Veli", carPlate: "34ABC123", serviceType: "Lastik Değişimi", status: "open", assignedTo: null, startDate: "2025-10-26T09:00:00", notes: "Kışlık lastikler depodan getirilecek." }, // Henüz başlamamış
];
// --- Sahte Veri Sonu ---

// Durum Etiketleri ve Stilleri
const statusLabels = { open: "Açık", waiting_customer_approval: "Onay Bekliyor", in_progress: "Devam Ediyor", completed: "Tamamlandı", cancelled: "İptal Edildi" };
const statusStyles = { open: styles.open, waiting_customer_approval: styles.waiting, in_progress: styles.progress, completed: styles.completed, cancelled: styles.cancelled };


export default function ServiceJobsPage() {
  const router = useRouter();

  // --- State'ler ---
  const [jobs, setJobs] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  // TODO: Filtreleme state'leri (Durum, Teknisyen, Tarih Aralığı)

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }

    // Sahte İş Emri Verisini Yükle
    // Backend CORS'u düzeltince gerçek api.get('/service/jobs') gibi bir istek atılmalı
    console.log("--- SİMÜLASYON: Servis İş Emri Listesi yükleniyor ---");
    // Veriyi başlangıç tarihine göre sıralayalım (yeniden eskiye)
    const sortedData = mockJobsData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    setJobs(sortedData);
    setIsLoading(false);

  }, [router]);

  // --- Silme Fonksiyonu (Simülasyonlu - Opsiyonel, belki sadece iptal vardır?) ---
  const handleDeleteJob = async (jobId, jobInfo) => {
    if (!window.confirm(`${jobInfo} iş emrini silmek istediğinizden emin misiniz? (Bu işlem geri alınamaz!)`)) return;
    console.log(`--- SİMÜLASYON: İş Emri Siliniyor: ${jobId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setJobs(current => current.filter(job => job.id !== jobId)); 
    alert(`${jobInfo} iş emri başarıyla silindi (Simülasyon).`);
    // TODO: Gerçek API isteği (api.delete(`/service/jobs/${jobId}`))
  };

  // Tarih Formatlama
  const formatDate = (dateString) => {
      if (!dateString) return '-';
      try { return new Date(dateString).toLocaleDateString('tr-TR'); } catch (e) { return '-'; }
  };


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>İş Emirleri Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login">Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }

  return (
    <div className={`${styles.jobsContainer} pageContainer`}> 
      {/* Sayfa Başlığı ve Yeni Ekle Butonu */}
      <div className={styles.header}>
         <div className={styles.headerLeft}>
             <h1 className={styles.title}>İş Emirleri ({jobs.length})</h1>
             <Link href="/service/dashboard" className={styles.backButton}>
                 <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
             </Link>
        </div>
         {/* TODO: /service/jobs/add sayfası henüz yok */}
        <Link href="/service/jobs/add" className={styles.addButton}>
             <i className="fas fa-plus"></i> Yeni İş Emri Başlat
        </Link>
      </div>

      {/* TODO: Filtreleme ve Arama Alanı */}
      {/* <div className={styles.filters}> ... </div> */}

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* İş Emri Tablosu */}
      {jobs.length === 0 ? (
        <p className={styles.noDataMessage}>Henüz hiç iş emri yok.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.jobTable}>
            <thead>
              <tr>
                <th>Başlangıç Tarihi</th>
                <th>Müşteri</th>
                <th>Araç Plakası</th>
                <th>İşlem Türü</th>
                <th>Atanan Teknisyen</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{formatDate(job.startDate)}</td>
                  <td>{job.customerName}</td>
                  <td>{job.carPlate}</td>
                  <td>{job.serviceType}</td>
                  <td>{job.assignedTo || '-'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusStyles[job.status] || ''}`}>
                      {statusLabels[job.status] || job.status}
                    </span>
                  </td>
                  <td className={styles.actions}>
                     {/* --- YENİ: Detay İkonu <Link> oldu --- */}
                     <Link
                         href={`/service/jobs/${job.id}`} // Dinamik rota
                         className={`${styles.actionButton} ${styles.detailButton}`}
                         title="Detayları Gör / Düzenle"
                     >
                         <i className="fas fa-eye"></i> {/* Veya fas fa-edit */}
                     </Link>
                     {/* --- DEĞİŞİKLİK SONU --- */}
                     {/* Belki sadece 'Açık' veya 'İptal' durumundakiler silinebilir? */}
                     {/* { (job.status === 'open' || job.status === 'cancelled') && ( */}
                         <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Sil"
                            onClick={() => handleDeleteJob(job.id, `${job.carPlate} - ${job.serviceType}`)}
                         >
                           <i className="fas fa-trash"></i>
                         </button>
                     {/* )} */}
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
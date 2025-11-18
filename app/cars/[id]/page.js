'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';
import styles from './carDetail.module.css';

// --- Sahte Veriler (Puan Kaldırıldı, Servis Geçmişine 'source' eklendi) ---
const mockCarsData = [
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla", year: 2020, carType: "Sedan", chassisNo: "JT2BF18K5X0123456", inspectionDate: "2025-12-15", insuranceDate: "2025-11-20", kaskoDate: "2025-11-20", lastMaintenanceKm: 45000 },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic", year: 2021, carType: "Sedan", chassisNo: "ABCDEFGHIJKL12345", inspectionDate: "2026-01-10", insuranceDate: "2025-12-05", kaskoDate: null, lastMaintenanceKm: 25000 }
];
const mockServiceHistory = [
  { id: "hist-1", carId: "mock-car-1", jobId: "JOB-1001", type: "Periyodik Bakım", date: "2025-08-15", technician: "Mehmet Usta (Yetkili Servis)", parts: ["Yağ Filtresi", "Hava Filtresi", "Motor Yağı"], cost: 1250, notes: "Genel kontrol yapıldı.", source: "service" },
  { id: "hist-2", carId: "mock-car-1", jobId: "JOB-0950", type: "Fren Onarımı", date: "2025-05-02", technician: "Ahmet Usta (Özel Servis)", parts: ["Ön Fren Balataları"], cost: 800, notes: "Frenlerden ses geliyordu, balatalar değişti.", source: "service" },
  { id: "hist-4", carId: "mock-car-1", jobId: null, type: "Lastik Değişimi", date: "2025-04-01", technician: "Kullanıcı Kaydı", parts: ["4 adet yaz lastiği"], cost: 4000, notes: "Lastikleri kendim değiştirdim.", source: "user" },
  { id: "hist-3", carId: "mock-car-2", jobId: "JOB-1005", type: "Periyodik Bakım", date: "2025-09-20", technician: "Mehmet Usta (Yetkili Servis)", parts: ["Yağ Filtresi", "Polen Filtresi", "Motor Yağı"], cost: 1100, notes: "İlk bakım.", source: "service" }
];
// --- Sahte Veri Sonu ---


export default function CarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id;

  // --- State'ler ---
  const [car, setCar] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false); 
  const [activeTab, setActiveTab] = useState('service'); 

  // --- Veri Yükleme (SİMÜLASYON) ---
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
    
    const foundCar = mockCarsData.find(c => c.id === carId);
    const foundHistory = mockServiceHistory.filter(h => h.carId === carId).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (foundCar) {
      setCar(foundCar);
      setHistory(foundHistory); 
      setError(null);
    } else {
      setError(`Araç bulunamadı (ID: ${carId}).`);
    }
    setIsLoading(false);
  }, [carId, router]);

  // --- Helper Fonksiyonlar ---
   const handleDeleteCar = async () => {
       if (!car) return;
       if (!window.confirm(`${car.plate} plakasını silmek istediğinizden emin misiniz?`)) return;
       console.log(`--- SİMÜLASYON: Araç Siliniyor: ${carId} ---`);
       await new Promise(resolve => setTimeout(resolve, 500));
       alert(`${car.plate} plakalı araç başarıyla silindi (Simülasyon).`);
       router.push('/dashboard');
   };
   const formatDate = (dateString) => {
       if (!dateString) return '-';
       try { return new Date(dateString).toLocaleDateString('tr-TR'); } catch (e) { return '-'; }
   };
   const formatKm = (km) => {
       if (!km && km !== 0) return '-';
       try { return `${km.toLocaleString('tr-TR')} km`; } catch (e) { return '-'; }
   };

  const serviceRecords = history.filter(h => h.source === 'service');
  const userRecords = history.filter(h => h.source === 'user');

  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Araç Detayları Yükleniyor...</div>; }
  if (error) { 
      return (
         <div className={`${styles.detailContainer} pageContainer`}>
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
  if (!car) { return <div className={styles.loading}>Araç bulunamadı.</div>; }

  return (
    <div className={`${styles.detailContainer} pageContainer`}>
      {/* Header */}
      <div className={styles.header}>
        <div> <h1 className={styles.plateTitle}>{car.plate}</h1> <p className={styles.modelSubTitle}>{car.brand} {car.model} ({car.year || 'Yıl Belirtilmemiş'})</p> </div>
        <Link href="/dashboard" className={styles.backButton}> <i className="fas fa-arrow-left"></i> Araç Listesine Geri Dön </Link>
      </div>

      {/* Aksiyon Butonları */}
      <div className={styles.actionButtons}>
          <Link href={`/cars/${car.id}/edit`} className={`${styles.actionButton} ${styles.editButton}`}> <i className="fas fa-edit"></i> Düzenle </Link>
          <Link href={`/cars/${car.id}/documents`} className={`${styles.actionButton} ${styles.docsButton}`}> <i className="fas fa-folder-open"></i> Belgeler </Link>
          <button onClick={handleDeleteCar} className={`${styles.actionButton} ${styles.deleteButton}`}> <i className="fas fa-trash"></i> Sil </button>
      </div>

       {/* === GÜNCELLENDİ: Detay Bilgileri (İçerik Geri Eklendi) === */}
       <div className={styles.detailsGrid}>
           {/* Sol Sütun */}
           <div className={styles.detailCard}>
               <h3 className={styles.cardTitle}>Temel Bilgiler</h3>
               <div className={styles.detailItem}><span>Araç Tipi:</span> <strong>{car.carType || '-'}</strong></div>
               <div className={styles.detailItem}><span>Şase No:</span> <strong>{car.chassisNo || '-'}</strong></div>
               <div className={styles.detailItem}><span>Yıl:</span> <strong>{car.year || '-'}</strong></div>
           </div>
           {/* Sağ Sütun */}
           <div className={styles.detailCard}>
               <h3 className={styles.cardTitle}>Takvim & Bakım</h3>
               <div className={styles.detailItem}><span>Muayene Tarihi:</span> <strong>{formatDate(car.inspectionDate)}</strong></div>
               <div className={styles.detailItem}><span>Sigorta Bitiş:</span> <strong>{formatDate(car.insuranceDate)}</strong></div>
               <div className={styles.detailItem}><span>Kasko Bitiş:</span> <strong>{formatDate(car.kaskoDate)}</strong></div>
               <div className={styles.detailItem}><span>Son Bakım KM:</span> <strong>{formatKm(car.lastMaintenanceKm)}</strong></div>
           </div>
       </div>
       {/* === GÜNCELLEME SONU === */}


        {/* === GÜNCELLENDİ: Servis Geçmişi Bölümü (Sekmeli ve Butonlu) === */}
        <div className={styles.historySection}>
            <div className={styles.sectionTitleWithButton}> 
                <h2 className={styles.sectionTitle}>Servis Geçmişi</h2>
                <button 
                    className={styles.toggleHistoryButton} 
                    onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                >
                    {isHistoryVisible ? 'Geçmişi Gizle' : 'Geçmişi Göster'}
                    <i className={`fas ${isHistoryVisible ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
            </div>

            {isHistoryVisible && (
                <div className={styles.historyContent}> 
                    
                    {/* === GÜNCELLENDİ: Sekme Butonları ve Yeni Kayıt Butonu === */}
                    <div className={styles.historyTabsContainer}>
                        <div className={styles.historyTabs}>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'service' ? styles.active : ''}`}
                                onClick={() => setActiveTab('service')}
                            >
                                <i className="fas fa-tools"></i> Servis Kayıtları ({serviceRecords.length})
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'user' ? styles.active : ''}`}
                                onClick={() => setActiveTab('user')}
                            >
                                <i className="fas fa-user-edit"></i> Kullanıcı Kayıtları ({userRecords.length})
                            </button>
                        </div>
                        {/* === YENİ BUTON (Kullanıcı Kaydı Ekle) === */}
                        <Link 
                            href={`/cars/${carId}/history/add`} // Bu sayfayı sonra oluşturacağız
                            className={styles.addHistoryButton}
                        >
                            <i className="fas fa-plus"></i> Kendi Kaydını Ekle
                        </Link>
                    </div>
                    {/* === GÜNCELLEME SONU === */}

                    
                    {/* Aktif Sekmeye Göre Liste */}
                    {activeTab === 'service' && (
                        serviceRecords.length === 0 ? (
                            <p className={styles.noHistoryMessage}>Bu araç için henüz servis kaydı bulunmuyor.</p>
                        ) : (
                            <div className={styles.historyList}>
                                {serviceRecords.map(item => (
                                    <div key={item.id} className={styles.historyItem}>
                                        <div className={styles.historyHeader}>
                                            <span className={styles.historyDate}>{formatDate(item.date)}</span>
                                            <span className={styles.serviceCode}>Servis Kodu: {item.jobId}</span>
                                            <span className={styles.historyType}>{item.type}</span>
                                        </div>
                                        <div className={styles.historyBody}>
                                            {item.parts && item.parts.length > 0 && (<p><strong>Değişen Parçalar:</strong> {item.parts.join(', ')}</p>)}
                                            {item.notes && <p><strong>Notlar:</strong> {item.notes}</p>}
                                            <p><strong>Servis:</strong> {item.technician || 'Bilinmiyor'}</p>
                                        </div>
                                        <div className={styles.historyFooter}>
                                            <span>Toplam Maliyet:</span>
                                            <strong>{item.cost ? `${item.cost.toLocaleString('tr-TR')} TL` : '-'}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                    
                    {activeTab === 'user' && (
                        userRecords.length === 0 ? (
                            <p className={styles.noHistoryMessage}>Sizin tarafınızdan eklenmiş bir kayıt bulunmuyor. "Kendi Kaydını Ekle" butonu ile ekleyebilirsiniz.</p>
                        ) : (
                            <div className={styles.historyList}>
                                {userRecords.map(item => (
                                    <div key={item.id} className={styles.historyItem}>
                                        <div className={styles.historyHeader} style={{justifyContent: 'space-between'}}>
                                            <span className={styles.historyDate}>{formatDate(item.date)}</span>
                                            <span className={styles.historyType}>{item.type}</span>
                                        </div>
                                        <div className={styles.historyBody}>
                                            {item.parts && item.parts.length > 0 && (<p><strong>Parçalar/Malzemeler:</strong> {item.parts.join(', ')}</p>)}
                                            {item.notes && <p><strong>Notlar:</strong> {item.notes}</p>}
                                        </div>
                                        <div className={styles.historyFooter}>
                                            <span>Toplam Maliyet:</span>
                                            <strong>{item.cost ? `${item.cost.toLocaleString('tr-TR')} TL` : '-'}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>

    </div>
  );
}
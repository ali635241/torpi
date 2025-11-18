'use client'; 

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; 
import Link from 'next/link';
import api from '../../../../lib/api'; 
// --- DİKKAT: Doğru stil dosyasını import ettiğimizden emin olalım ---
import styles from '../../../documents/documents.module.css';

// --- Sahte Veriler ---
const mockCarsData = [
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" }
];
const mockDocumentsData = [
 { id: "mock-doc-1", carId: "mock-car-1", type: "insurance", fileName: "sigorta-2025.pdf", fileSize: 245678, url: "#", uploadedAt: "2025-10-01T10:00:00.000Z" },
 { id: "mock-doc-2", carId: "mock-car-1", type: "inspection", fileName: "muayene-2025.pdf", fileSize: 189234, url: "#", uploadedAt: "2025-10-05T14:30:00.000Z" },
 { id: "mock-doc-3", carId: "mock-car-2", type: "kasko", fileName: "kasko-honda.pdf", fileSize: 312500, url: "#", uploadedAt: "2025-11-01T09:15:00.000Z" }
];
const documentTypeLabels = { insurance: "Sigorta Poliçesi", kasko: "Kasko Poliçesi", inspection: "Muayene Belgesi", expertise: "Ekspertiz Raporu" };
// --- Sahte Veri Sonu ---

export default function CarDocumentsPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id; 

  // --- State'ler ---
  const [carDetails, setCarDetails] = useState(null); 
  const [documents, setDocuments] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Veri Çekme ve Filtreleme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }

    // Sahte veriden aracı ve belgelerini bul
    console.log(`--- SİMÜLASYON: Araç (${carId}) belgeleri yükleniyor ---`);
    const foundCar = mockCarsData.find(c => c.id === carId);
    const foundDocs = mockDocumentsData.filter(doc => doc.carId === carId);

    if (foundCar) {
      setCarDetails(foundCar);
      setDocuments(foundDocs);
      setError(null);
    } else {
      console.error(`Araç bulunamadı ID: ${carId}`);
      setError(`Araç bulunamadı (ID: ${carId}). Belgeler listelenemiyor.`);
    }
    setIsLoading(false);

  }, [carId, router]);

  // --- Belge Silme Fonksiyonu (Simülasyonlu) ---
  const handleDeleteDocument = async (docId, docFileName) => {
    if (!window.confirm(`'${docFileName}' adlı belgeyi silmek istediğinizden emin misiniz?`)) return;
    console.log(`--- SİMÜLASYON: Belge Siliniyor: ${docId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setDocuments(currentDocs => currentDocs.filter(doc => doc.id !== docId));
    alert(`'${docFileName}' adlı belge başarıyla silindi (Simülasyon).`);
  };

   // Dosya boyutunu formatlama
   const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes'; 
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
   }

  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Belgeler Yükleniyor...</div>; }
  if (error && !carDetails) { // Sadece araç bulunamadıysa hata göster
     return (
         <div className={`${styles.docsContainer} pageContainer`}>
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

  return (
    <div className={`${styles.docsContainer} pageContainer`}>
      <div className={styles.header}>
        {/* Başlık (Basitleştirilmiş Yapı) */}
        <div> 
            <h1 className={styles.title}> 
                {carDetails?.plate} - Belgeler
            </h1>
            <p className={styles.carSubTitle}> 
              {carDetails?.brand} {carDetails?.model}
            </p>
        </div>
        
        {/* Yeni Belge Yükle butonu */}
        <Link href={`/documents/upload?carId=${carId}`} className={styles.uploadButton}>
          <i className="fas fa-upload"></i> Bu Araca Belge Yükle
        </Link>
      </div>

      {/* Silme hatası için */}
      {error && <div className={styles.errorMessage}>{error}</div>} 

      {documents.length === 0 ? (
        <p className={styles.noDocsMessage}>Bu araç için henüz belge yüklenmemiş.</p>
      ) : (
         <div className={styles.docItems}> 
            {documents.map(doc => (
              <div key={doc.id} className={styles.docItem}>
                <div className={styles.docIcon}>
                  <i className={doc.fileName.endsWith('.pdf') ? "fas fa-file-pdf" : "fas fa-file-image"}></i>
                </div>
                <div className={styles.docInfo}>
                  <span className={styles.docFileName}>{doc.fileName}</span>
                  <span className={styles.docMeta}>
                    {documentTypeLabels[doc.type] || doc.type} - {formatBytes(doc.fileSize)} - Yüklenme: {new Date(doc.uploadedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className={styles.docActions}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className={styles.actionButton} title="Görüntüle/İndir">
                    <i className="fas fa-eye"></i>
                  </a>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Sil"
                    onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
      )}

      {/* Geri Dön Butonu */}
       <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link 
                href="/dashboard" 
                className={styles.backButton} // <-- SINIF BURADA KULLANILIYOR
            >
                 <i className="fas fa-arrow-left"></i> Kontrol Paneline Geri Dön
            </Link>
       </div>
    </div>
  );
}
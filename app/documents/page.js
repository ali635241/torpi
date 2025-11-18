'use client'; // Hook'lar ve localStorage için

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api'; // (Simülasyon olsa da import kalsın)
import styles from './documents.module.css'; // Yeni CSS modülümüz

// --- API Dokümanındaki Sahte Veriler ---
// Sahte Araç Verisi (ID ve Plaka eşleşmesi için)
const mockCarsData = [
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" }
];
// Sahte Belge Verisi 
const mockDocumentsData = [
 { id: "mock-doc-1", carId: "mock-car-1", type: "insurance", fileName: "sigorta-2025.pdf", fileSize: 245678, url: "#", uploadedAt: "2025-10-01T10:00:00.000Z" },
 { id: "mock-doc-2", carId: "mock-car-1", type: "inspection", fileName: "muayene-2025.pdf", fileSize: 189234, url: "#", uploadedAt: "2025-10-05T14:30:00.000Z" },
 { id: "mock-doc-3", carId: "mock-car-2", type: "kasko", fileName: "kasko-honda.pdf", fileSize: 312500, url: "#", uploadedAt: "2025-11-01T09:15:00.000Z" }
];
// --- Sahte Veri Sonu ---

// Belge tiplerini etiketlerle eşleştirmek için helper object
const documentTypeLabels = {
  insurance: "Sigorta Poliçesi",
  kasko: "Kasko Poliçesi",
  inspection: "Muayene Belgesi",
  expertise: "Ekspertiz Raporu"
};

export default function DocumentsListPage() {
  const router = useRouter();

  // --- State'ler ---
  const [documentsByCar, setDocumentsByCar] = useState({}); // Belgeleri araca göre gruplamak için
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Veri Çekme ve Gruplama (SİMÜLASYON) ---
  useEffect(() => {
    // 1. Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // 2. API yerine sahte veriyi yükle ve grupla
    // Backend CORS'u düzelttiğinde bu sahte veriler silinip
    // gerçek API istekleri (api.get('/car') ve api.get('/document/car/:carId')) ile değiştirilmelidir.

    // Belgeleri araç plakasına göre grupla
    const groupedDocs = mockDocumentsData.reduce((acc, doc) => {
      const car = mockCarsData.find(c => c.id === doc.carId);
      const carPlate = car ? `${car.plate} (${car.brand} ${car.model})` : "Bilinmeyen Araç"; // Araç bulunamazsa
      if (!acc[carPlate]) {
        acc[carPlate] = [];
      }
      acc[carPlate].push(doc);
      return acc;
    }, {});

    setDocumentsByCar(groupedDocs);
    setIsLoading(false);

  }, [router]);

  // --- Belge Silme Fonksiyonu (Simülasyonlu) ---
  const handleDeleteDocument = async (docId, docFileName) => {
    if (!window.confirm(`'${docFileName}' adlı belgeyi silmek istediğinizden emin misiniz?`)) {
      return;
    }

    // --- SİMÜLASYON ---
    console.log(`--- SİMÜLASYON: Belge Siliniyor: ${docId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Sahte gecikme

    // Belgeyi state'den kaldırarak UI'ı güncelle
    setDocumentsByCar(currentDocsByCar => {
      const updatedDocs = { ...currentDocsByCar };
      // Hangi araç grubunda olduğunu bul ve o gruptan sil
      for (const plate in updatedDocs) {
        updatedDocs[plate] = updatedDocs[plate].filter(doc => doc.id !== docId);
        // Eğer grupta hiç belge kalmazsa, o grubu da silebiliriz (isteğe bağlı)
        // if (updatedDocs[plate].length === 0) {
        //   delete updatedDocs[plate];
        // }
      }
      return updatedDocs;
    });

    alert(`'${docFileName}' adlı belge başarıyla silindi (Simülasyon).`);

    /*
    // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
    // Backend düzeltildiğinde bu açılmalı.
    try {
        await api.delete(`/document/${docId}`);
        // State'i güncelle... (Yukarıdaki gibi)
        alert(`'${docFileName}' adlı belge başarıyla silindi.`);
    } catch (err) {
        console.error("Belge silme hatası:", err);
        setError(err.message || "Belge silinirken bir hata oluştu.");
    }
    */
  };

   // Dosya boyutunu okunabilir formata çeviren helper
   const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
   }

  // --- Render ---

  if (isLoading) {
    return <div className={styles.loading}>Belgelerim Yükleniyor...</div>;
  }

  if (error) {
    return <div className={styles.loading}>Hata: {error}</div>;
  }

  const carPlates = Object.keys(documentsByCar);

  return (
    <div className={`${styles.docsContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Belgelerim</h1>
        <Link href="/documents/upload" className={styles.uploadButton}>
          <i className="fas fa-upload"></i> Yeni Belge Yükle
        </Link>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {carPlates.length === 0 ? (
        <p className={styles.noDocsMessage}>Henüz hiç belge yüklememişsiniz.</p>
      ) : (
        <div className={styles.docsList}>
          {/* Araç plakasına göre döngü */}
          {carPlates.map(plate => (
            <div key={plate} className={styles.carGroup}>
              <h2 className={styles.carPlateTitle}>{plate}</h2>
              <div className={styles.docItems}>
                {/* O araca ait belgeler için döngü */}
                {documentsByCar[plate].map(doc => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
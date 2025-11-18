'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; 
import styles from './upload.module.css'; 

// Sahte Araç Verisi
const mockCarsData = [
 { id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" }
];

// Belge Tipleri
const documentTypes = [
  { value: "insurance", label: "Sigorta Poliçesi" },
  { value: "insurance", label: "Kaza Raporu" },
  { value: "kasko", label: "Kasko Poliçesi" },
  { value: "inspection", label: "Muayene Belgesi" },
  { value: "expertise", label: "Ekspertiz Raporu" }
];

export default function UploadDocumentPage() {
  const router = useRouter();

  // --- State'ler ---
  const [cars, setCars] = useState([]); 
  const [selectedCarId, setSelectedCarId] = useState(''); 
  const [selectedDocType, setSelectedDocType] = useState(''); 
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);

  // --- Araç Listesi Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    // Sahte Araç Listesini Yükle
    setCars(mockCarsData);
    setIsLoading(false);
  }, [router]);

  // --- Dosya Seçildiğinde State'i Güncelle ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Frontend Kontrolleri
      if (file.size > 10 * 1024 * 1024) { // 10MB
         setError("Dosya boyutu en fazla 10MB olabilir.");
         setSelectedFile(null); 
         e.target.value = null; 
         return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
         setError("Sadece PDF, JPG veya PNG dosyaları yükleyebilirsiniz.");
         setSelectedFile(null);
         e.target.value = null;
         return;
      }
      setError(null); 
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedCarId || !selectedDocType || !selectedFile) {
      setError('Lütfen araç, belge tipi seçin ve bir dosya yükleyin.');
      return;
    }

    setIsLoading(true);

    // --- SİMÜLASYON ---
    console.log('--- SİMÜLASYON: Belge Yükleme isteği ---');
    console.log({
        carId: selectedCarId,
        documentType: selectedDocType,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type
    });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Sahte gecikme

    console.log('--- SİMÜLASYON: Belge yüklendi! Dashboarda yönlendiriliyor... ---');
    alert(`'${selectedFile.name}' adlı belge başarıyla yüklendi (Simülasyon).`);
    router.push('/dashboard');
  };

  // --- Render ---
   if (isLoading && cars.length === 0) { 
      return <div className={styles.loading}>Yükleniyor...</div>;
   }

  return (
    <div className={`${styles.uploadContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Belge Yükle</h1>
        <Link href="/dashboard" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Araç Seçimi */}
        <div className={styles.formGroup}>
          <label htmlFor="car">Araç Seçimi *</label>
          <select id="car" value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)} required>
            <option value="">Hangi araç için?</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>{car.plate} - {car.brand} {car.model}</option>
            ))}
          </select>
        </div>

        {/* Belge Tipi Seçimi */}
        <div className={styles.formGroup}>
          <label htmlFor="docType">Belge Tipi *</label>
          <select id="docType" value={selectedDocType} onChange={(e) => setSelectedDocType(e.target.value)} required>
            <option value="">Belge tipini seçin...</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Dosya Seçimi */}
        <div className={styles.formGroup}>
          <label htmlFor="file">Dosya Seçin *</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
            accept=".pdf,.jpg,.jpeg,.png" // Kabul edilen dosya türleri
            className={styles.fileInput}
          />
          {selectedFile && <p className={styles.fileName}>Seçilen dosya: {selectedFile.name}</p>}
        </div>

        {/* Kurallar */}
         <div className={styles.rules}>
            <p><i className="fas fa-info-circle"></i> İzin verilen formatlar: PDF, JPG, PNG</p>
            <p><i className="fas fa-hdd"></i> Maksimum dosya boyutu: 10MB</p>
         </div>

        {/* Buton */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading && cars.length > 0 ? 'Yükleniyor...' : 'Belgeyi Yükle'}
          </button>
        </div>
      </form>
    </div>
  );
}
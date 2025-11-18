'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../../../lib/api'; // ../../../../../../lib/api yolu
// Stil dosyasını MÜŞTERİ panelindeki cars/add klasöründen import ediyoruz
import styles from '../../../../../cars/add/addCar.module.css'; 

// --- Sahte Veriler ---
// Müşteri adını göstermek için
const mockCustomersData = [
 { id: "cust-1", firstName: "Ali", lastName: "Veli" },
 { id: "cust-2", firstName: "Ayşe", lastName: "Yılmaz" },
 { id: "cust-3", firstName: "Mehmet", lastName: "Demir" },
];
// Araç Tipleri (Müşteri panelindeki add/page.js'den)
const carTypes = [ "Sedan", "Hatchback", "SUV", "Station Wagon", "Coupe", "MPV", "Pickup", "Ticari", "Motosiklet", "Diğer" ];
// --- Sahte Veri Sonu ---


export default function AddCarToCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id; // URL'den müşteri ID'sini al

  // --- State'ler ---
  const [customer, setCustomer] = useState(null); // Müşteri bilgisi
  // Form State'leri (Müşteri panelindeki addCar ile aynı)
  const [plate, setPlate] = useState(''); 
  const [brand, setBrand] = useState(''); 
  const [model, setModel] = useState(''); 
  const [year, setYear] = useState('');
  const [carType, setCarType] = useState('');
  const [chassisNo, setChassisNo] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [insuranceDate, setInsuranceDate] = useState('');
  const [kaskoDate, setKaskoDate] = useState('');
  const [lastMaintenanceKm, setLastMaintenanceKm] = useState('');

  const [isLoading, setIsLoading] = useState(true); // Veri yükleme + Kaydetme
  const [error, setError] = useState(null);

  // --- Müşteri Bilgisini Yükle (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/service/login'); return; }

    // Sahte veriden müşteriyi bul
    console.log(`--- SİMÜLASYON: Müşteri bilgisi yükleniyor ID: ${customerId} ---`);
    const foundCustomer = mockCustomersData.find(c => c.id === customerId);

    if (foundCustomer) {
      setCustomer(foundCustomer);
      setError(null);
    } else {
      console.error(`Müşteri bulunamadı ID: ${customerId}`);
      setError(`Araç eklenecek müşteri bulunamadı (ID: ${customerId}).`);
    }
    setIsLoading(false); 
    
    // TODO: Backend CORS düzelince gerçek API isteği (api.get(`/service/customers/${customerId}`))

  }, [customerId, router]);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validasyon (Müşteri panelindeki addCar ile aynı)
    if (!plate || !brand || !model) { setError('Plaka, Marka ve Model alanları zorunludur.'); return; }
    const plateRegex = /^[0-9]{2,3}[A-Z]{1,3}[0-9]{2,4}$/i; 
    if (!plateRegex.test(plate.replace(/\s/g, ''))) { setError('Lütfen geçerli bir plaka formatı girin (örn: 34ABC123).'); return; }

    setIsLoading(true);

    const carData = {
      // API'nin müşteri ID'sini nasıl beklediğini bilmiyoruz, varsayımsal olarak ekleyelim
      ownerCustomerId: customerId, // Servis paneli için ek alan olabilir
      plate: plate.replace(/\s/g, '').toUpperCase(), brand, model,
      year: year ? parseInt(year) : undefined, carType: carType || undefined,
      chassisNo: chassisNo || undefined, inspectionDate: inspectionDate || undefined,
      insuranceDate: insuranceDate || undefined, kaskoDate: kaskoDate || undefined,
      lastMaintenanceKm: lastMaintenanceKm ? parseInt(lastMaintenanceKm) : undefined,
    };

    // --- SİMÜLASYON ---
    console.log(`--- SİMÜLASYON: Müşteriye Araç Ekleme isteği (Müşteri ID: ${customerId}) ---`);
    console.log(carData);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    console.log(`--- SİMÜLASYON: Araç eklendi! Müşteri araç listesine yönlendiriliyor... ---`);
    alert('Araç başarıyla eklendi (Simülasyon).');
    router.push(`/service/customers/${customerId}/cars`); // Müşterinin araç listesine geri dön

    /*
    // --- ORİJİNAL KOD ---
    // TODO: Backend CORS düzelince bu açılmalı (API endpoint varsayımsal: POST /service/cars)
    try {
        await api.post('/service/cars', carData); // Veya farklı bir endpoint
        alert('Araç başarıyla eklendi!');
        router.push(`/service/customers/${customerId}/cars`); 
    } catch (err) {
        console.error("Araç ekleme hatası:", err);
        setError(err.message || "Araç eklenirken bir hata oluştu.");
        setIsLoading(false);
    }
    */
  };

   // --- Render ---
   if (isLoading && !customer) { return <div className={styles.loading}>Yükleniyor...</div>; }
   if (error && !customer) { 
     return (
         <div className={styles.addCarContainer}> {/* Ana container */}
              <div className={styles.header}>
                 <h1 className={styles.title}>Hata</h1>
                 {/* Geri butonu genel müşteri listesine gitsin */}
                  <Link href="/service/customers" className={styles.backButton}> 
                     <i className="fas fa-arrow-left"></i> Müşteri Listesine Dön
                 </Link>
              </div>
              <div className={styles.errorMessage}>{error}</div>
         </div>
     );
   }
   if (!customer) return null; // Müşteri yoksa hiçbir şey gösterme (hata zaten gösterildi)


  return (
    // Müşteri panelindeki cars/add stillerini kullanıyoruz
    <div className={`${styles.addCarContainer} pageContainer`}> 
      <div className={styles.header}>
        {/* Başlıkta müşteri adını gösterelim */}
        <div>
            <h1 className={styles.title}>Yeni Araç Ekle</h1>
            <p className={styles.customerName}>Müşteri: {customer.firstName} {customer.lastName}</p> {/* Yeni Stil */}
        </div>
        {/* Geri butonu müşterinin araç listesine dönsün */}
        <Link href={`/service/customers/${customerId}/cars`} className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Form alanları (Müşteri panelindeki addCar ile aynı) */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}> <label htmlFor="plate">Plaka *</label> <input type="text" id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} required placeholder="34ABC123" /> </div>
          <div className={styles.formGroup}> <label htmlFor="brand">Marka *</label> <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required placeholder="Toyota" /> </div>
          <div className={styles.formGroup}> <label htmlFor="model">Model *</label> <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} required placeholder="Corolla" /> </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}> <label htmlFor="year">Yıl</label> <input type="number" id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2020" min="1900" max={new Date().getFullYear() + 1} /> </div>
          <div className={styles.formGroup}> <label htmlFor="carType">Araç Tipi</label> <select id="carType" value={carType} onChange={(e) => setCarType(e.target.value)}> <option value="">Seçiniz...</option> {carTypes.map(type => <option key={type} value={type}>{type}</option>)} </select> </div>
          <div className={styles.formGroup}> <label htmlFor="chassisNo">Şase Numarası</label> <input type="text" id="chassisNo" value={chassisNo} onChange={(e) => setChassisNo(e.target.value)} placeholder="ABC123XYZ..." /> </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}> <label htmlFor="inspectionDate">Muayene Tarihi</label> <input type="date" id="inspectionDate" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} /> </div>
          <div className={styles.formGroup}> <label htmlFor="insuranceDate">Sigorta Bitiş Tarihi</label> <input type="date" id="insuranceDate" value={insuranceDate} onChange={(e) => setInsuranceDate(e.target.value)} /> </div>
          <div className={styles.formGroup}> <label htmlFor="kaskoDate">Kasko Bitiş Tarihi</label> <input type="date" id="kaskoDate" value={kaskoDate} onChange={(e) => setKaskoDate(e.target.value)} /> </div>
        </div>
        <div className={styles.formRow}>
           <div className={styles.formGroup} style={{ flexBasis: '50%' }}> <label htmlFor="lastMaintenanceKm">Son Bakım Kilometresi</label> <input type="number" id="lastMaintenanceKm" value={lastMaintenanceKm} onChange={(e) => setLastMaintenanceKm(e.target.value)} placeholder="45000" min="0" /> </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : 'Aracı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
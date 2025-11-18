'use client';

import React, { useState, useEffect } from 'react'; // React importu eklendi
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Stil dosyasını service/register klasöründen import ediyoruz
import styles from '../../register/register.module.css'; 
import api from '../../../../lib/api'; 

// --- Sahte Veriler (GÜNCELLENDİ: Müşterilere 'phone' eklendi) ---
const mockCustomersData = [
 { id: "cust-1", firstName: "Ali", lastName: "Veli", phone: "0555 111 2233"},
 { id: "cust-2", firstName: "Ayşe", lastName: "Yılmaz", phone: "0544 999 8877"},
 { id: "cust-3", firstName: "Mehmet", lastName: "Demir", phone: "0533 123 4567"},
];
const mockCarsData = [ 
 { ownerId: "cust-1", id: "mock-car-1", plate: "34ABC123", brand: "Toyota", model: "Corolla" },
 { ownerId: "cust-2", id: "mock-car-2", plate: "06XYZ789", brand: "Honda", model: "Civic" },
 { ownerId: "cust-2", id: "mock-car-3", plate: "35DEF456", brand: "Ford", model: "Focus" }, 
];
const mockTechnicians = ["Mehmet Usta", "Ahmet Usta", "Ali Teknisyen"];
// --- Sahte Veri Sonu ---


export default function AddJobPage() {
    const router = useRouter();

    // --- Form State'leri ---
    const [customers, setCustomers] = useState([]); 
    const [cars, setCars] = useState([]); 
    
    const [selectedCustomerId, setSelectedCustomerId] = useState(''); 
    const [phone, setPhone] = useState(''); // <-- Telefon state'i
    const [selectedCarId, setSelectedCarId] = useState(''); 
    const [serviceType, setServiceType] = useState(''); 
    const [assignedTo, setAssignedTo] = useState(''); 
    const [notes, setNotes] = useState(''); 

    // === YENİ: Parça State'leri ===
    const [partsUsed, setPartsUsed] = useState([]); // Eklenen parçaların listesi
    const [newPartName, setNewPartName] = useState('');
    const [newPartQty, setNewPartQty] = useState(1);
    const [newPartPrice, setNewPartPrice] = useState('');
    const [newPartSource, setNewPartSource] = useState('İçeride');
    // === YENİ STATE'LER SONU ===

    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);

    // --- Müşteri Listesi Yükle (SİMÜLASYON) ---
    useEffect(() => {
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/service/login'); return; }
        
        console.log("--- SİMÜLASYON: Müşteri listesi yükleniyor ---");
        setCustomers(mockCustomersData);
        setIsLoading(false); 
    }, [router]);

    // --- Müşteri seçildiğinde araç listesini VE TELEFONU güncelle ---
    useEffect(() => {
        if (selectedCustomerId) {
            console.log(`--- SİMÜLASYON: ${selectedCustomerId} ID'li müşterinin bilgileri yükleniyor ---`);
            const foundCustomer = mockCustomersData.find(c => c.id === selectedCustomerId);
            const customerCars = mockCarsData.filter(car => car.ownerId === selectedCustomerId);
            
            setPhone(foundCustomer?.phone || ''); // Telefonu ayarla
            setCars(customerCars);
            setSelectedCarId(''); 
        } else {
            setPhone(''); // Müşteri seçilmezse telefonu temizle
            setCars([]); 
            setSelectedCarId('');
        }
    }, [selectedCustomerId]);


    // === YENİ: Parça Ekleme Fonksiyonu (Simülasyonlu) ===
    const handleAddPart = (e) => {
      e.preventDefault();
      setError(null); // Önceki hataları temizle
      if (!newPartName || !newPartQty || !newPartPrice) {
          setError("Parça eklemek için lütfen parça adı, adet ve fiyatı girin."); return;
      }
      const qty = parseInt(newPartQty);
      const price = parseFloat(newPartPrice);
      if (isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) { setError("Lütfen adet ve fiyat için geçerli sayılar girin."); return; }
      
      console.log(`--- SİMÜLASYON: Parça listeye eklendi ---`);
      const newPart = { 
          id: `temp-part-${Date.now()}`, // Geçici ID
          name: newPartName, 
          quantity: qty, 
          price: price, 
          source: newPartSource 
      }; 
      setPartsUsed(prevParts => [...prevParts, newPart]); // Parçayı state listesine ekle
      // Formu temizle
      setNewPartName(''); setNewPartQty(1); setNewPartPrice(''); setNewPartSource('İçeride');
    };

    // === YENİ: Parça Silme Fonksiyonu (Simülasyonlu) ===
   const handleDeletePart = async (partId, partName) => { 
       if (!window.confirm(`'${partName}' adlı parçayı listeden silmek istediğinizden emin misiniz?`)) return;
       console.log(`--- SİMÜLASYON: Parça listeden siliniyor (ID ${partId}) ---`);
       setPartsUsed(prevParts => prevParts.filter(part => part.id !== partId)); 
   };
   // === YENİ FONKSİYONLAR SONU ===


    // --- Form Gönderim (GÜNCELLENDİ: Parçalar eklendi) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selectedCustomerId || !selectedCarId || !serviceType || !phone) {
            setError('Lütfen müşteri, telefon, araç ve işlem türü alanlarını doldurun.');
            return;
        }
        
        setIsLoading(true);

        const jobData = { 
            customerId: selectedCustomerId, 
            phone: phone, // <-- YENİ
            carId: selectedCarId, 
            serviceType, 
            notes,
            assignedTo: assignedTo || null, 
            startDate: new Date().toISOString(), 
            status: 'open',
            partsUsed: partsUsed, // <-- YENİ
            laborCost: 0 
        };

        // --- SİMÜLASYON ---
        console.log("--- SİMÜLASYON: Yeni İş Emri Oluşturma İsteği ---");
        console.log(jobData);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        console.log("--- SİMÜLASYON: İş Emri oluşturuldu! Listeye yönlendiriliyor... ---");
        alert('İş emri başarıyla oluşturuldu (Simülasyon).');
        router.push('/service/jobs'); 
    };


   // --- Render ---
   if (isLoading && customers.length === 0) { 
      return <div className={styles.loading}>Yükleniyor...</div>;
   }

    return (
        <div className={styles.container}> 
            <div className={styles.form} style={{maxWidth: '800px'}}> 
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Yeni İş Emri Başlat</h2>
                     <Link href="/service/jobs" className={styles.backButton}> 
                         <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                     </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    <h3 className={styles.formSectionTitle}>Müşteri ve Araç Bilgileri</h3>
                    <div className={styles.formRow}>
                        {/* Müşteri Seçimi */}
                        <div className={styles.formGroup}>
                            <label htmlFor="customer">Müşteri Seçimi *</label>
                            <select id="customer" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} required>
                                <option value="">Müşteri Seçiniz...</option>
                                {customers.map(cust => (
                                    <option key={cust.id} value={cust.id}>{cust.firstName} {cust.lastName}</option>
                                ))}
                            </select>
                        </div>
                        {/* === GÜNCELLENDİ: Telefon Numarası (Elle Girilebilir) === */}
                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Telefon Numarası *</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} // <-- Artık düzenlenebilir
                                placeholder="05XX XXX XX XX"
                                required
                            />
                        </div>
                    </div>

                    {/* Araç Seçimi */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup} style={{flexBasis: '100%'}}>
                            <label htmlFor="car">Araç Seçimi *</label>
                            <select id="car" value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} required disabled={!selectedCustomerId || cars.length === 0}>
                                <option value="">{selectedCustomerId ? (cars.length > 0 ? 'Araç Seçiniz...' : 'Bu müşterinin kayıtlı aracı yok') : 'Önce Müşteri Seçiniz...'}</option>
                                {cars.map(car => (
                                    <option key={car.id} value={car.id}>{car.plate} - {car.brand} {car.model}</option>
                                ))}
                            </select>
                             {selectedCustomerId && cars.length === 0 && (
                                 <p className={styles.helperText}>Bu müşteriye <Link href={`/service/customers/${selectedCustomerId}/cars/add`} className={styles.helperLink}>yeni araç ekleyebilirsiniz</Link>.</p>
                             )}
                        </div>
                    </div>

                    <h3 className={styles.formSectionTitle}>İşlem Detayları</h3>
                    {/* İşlem Türü ve Teknisyen */}
                    <div className={styles.formRow}>
                         <div className={styles.formGroup}>
                            <label htmlFor="serviceType">İşlem Türü *</label>
                            <input type="text" id="serviceType" value={serviceType} onChange={e => setServiceType(e.target.value)} required placeholder="Örn: Periyodik Bakım, Arıza Tespiti"/>
                        </div>
                         <div className={styles.formGroup}>
                            <label htmlFor="assignedTo">Atanacak Teknisyen</label>
                             <select id="assignedTo" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                                <option value="">Seçiniz (Opsiyonel)...</option>
                                {mockTechnicians.map(tech => (
                                    <option key={tech} value={tech}>{tech}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Notlar */}
                    <div className={styles.formRow}>
                        <div className={styles.formGroup} style={{flexBasis: '100%'}}>
                            <label htmlFor="notes">İş Emri Notları (Müşteri Talebi)</label>
                            <textarea id="notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Müşteri talepleri, yapılacak işlemler veya gözlemler..."></textarea>
                        </div>
                    </div>

                    
                    {/* === YENİ: Parça Ekleme Bölümü === */}
                    <h3 className={styles.formSectionTitle}>Değişen Parçalar</h3>
                    <div className={styles.partsSection}> 
                        {/* Parça Listesi */}
                        {partsUsed.length > 0 ? (
                            <ul className={styles.partsList}>
                                {partsUsed.map((part, index) => ( 
                                    <li key={part.id}> 
                                        <span> {part.quantity}x {part.name} ({part.source}) - {(part.price * part.quantity).toLocaleString('tr-TR')} TL </span>
                                        <button type="button" className={`${styles.actionButtonSmall} ${styles.deleteButtonSmall}`} title="Parçayı Sil" onClick={() => handleDeletePart(part.id, part.name)}> <i className="fas fa-times"></i> </button>
                                    </li> 
                                ))}
                            </ul>
                        ) : <p className={styles.noDataSubMessage}>Henüz parça eklenmedi.</p>}
                        
                        {/* Yeni Parça Ekleme Formu */}
                        <form onSubmit={handleAddPart} className={styles.addPartForm}>
                            <div className={styles.formGroup}><label>Parça Adı *</label><input type="text" placeholder="Parça Adı" value={newPartName} onChange={e=>setNewPartName(e.target.value)} /></div>
                            <div className={styles.formGroup} style={{flexBasis: '100px'}}><label>Adet *</label><input type="number" placeholder="Adet" value={newPartQty} onChange={e=>setNewPartQty(e.target.value)} min="1" /></div>
                            <div className={styles.formGroup} style={{flexBasis: '150px'}}><label>Birim Fiyat (TL) *</label><input type="number" placeholder="Fiyat" value={newPartPrice} onChange={e=>setNewPartPrice(e.target.value)} min="0" step="0.01" /></div>
                            <div className={styles.formGroup} style={{flexBasis: '150px'}}><label>Kaynak *</label><select value={newPartSource} onChange={e=>setNewPartSource(e.target.value)}> <option value="İçeride">İçeride (Servis)</option> <option value="Dışarıda">Dışarıda (Müşteri)</option> </select></div>
                            <button type="submit" className={styles.addPartButton}>Ekle</button> 
                        </form>
                    </div>
                    {/* === YENİ BÖLÜM SONU === */}


                    <div style={{textAlign: 'right', marginTop: '30px'}}> 
                        <button type="submit" className={styles.button} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}> 
                            {isLoading ? 'Kaydediliyor...' : 'İş Emrini Başlat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api'; 
import styles from './jobDetail.module.css'; 

// --- Sahte Veriler (Global'de veya ayrı bir dosyada olması daha iyi olur) ---
let mockJobsData = [
 { id: "job-1", customerId: "cust-1", customerName: "Ali Veli", carId: "mock-car-1", carPlate: "34ABC123", carModel: "Toyota Corolla", serviceType: "Periyodik Bakım", status: "in_progress", assignedTo: "Mehmet Usta", startDate: "2025-10-25T10:30:00", estimatedCost: 1250, partsUsed: [{ id:"part-1", name: "Yağ Filtresi", quantity: 1, price: 150, source: "İçeride" }], laborCost: 400, notes: "Genel kontrol yapıldı." },
 { id: "job-2", customerId: "cust-2", customerName: "Ayşe Yılmaz", carId: "mock-car-2", carPlate: "06XYZ789", carModel: "Honda Civic", serviceType: "Fren Kontrolü", status: "waiting_customer_approval", assignedTo: "Ahmet Usta", startDate: "2025-10-25T14:15:00", estimatedCost: 850, partsUsed: [{ id:"part-2", name: "Ön Fren Balatası", quantity: 2, price: 600, source: "Dışarıda" }], laborCost: 250, notes: "Ön balatalar değişecek, diskler tornalanacak. Müşteri onayı bekleniyor." },
 { id: "job-3", customerId: "cust-3", customerName: "Mehmet Demir", carId: "mock-car-3", carPlate: "35DEF456", carModel: "Ford Focus", serviceType: "Yağ Değişimi", status: "completed", assignedTo: "Mehmet Usta", startDate: "2025-10-24T11:00:00", completionDate: "2025-10-24T13:00:00", partsUsed: [{ id:"part-3", name: "Yağ Filtresi", quantity: 1, price: 100, source: "İçeride" }, { id:"part-4", name: "Motor Yağı 5L", quantity: 1, price: 400, source: "İçeride" }], laborCost: 100, totalCost: 600 },
 { id: "job-4", customerId: "cust-1", customerName: "Ali Veli", carId: "mock-car-1", carPlate: "34ABC123", carModel: "Toyota Corolla", serviceType: "Lastik Değişimi", status: "open", assignedTo: null, startDate: "2025-10-26T09:00:00", notes: "Kışlık lastikler depodan getirilecek.", partsUsed: [], laborCost: 50 },
];
let mockJobDocuments = [
  { id: "doc-job-1", jobId: "job-1", type: "Servis Formu", fileName: "job-1-servis-formu.pdf", url: "#", createdAt: "2025-10-25T11:00:00Z" },
  { id: "doc-job-2", jobId: "job-3", type: "Fatura", fileName: "job-3-fatura-12345.pdf", url: "#", createdAt: "2025-10-24T13:05:00Z" },
  { id: "doc-job-3", jobId: "job-3", type: "Servis Formu", fileName: "job-3-servis-detay.pdf", url: "#", createdAt: "2025-10-24T13:00:00Z" }
];
// --- Sahte Veri Sonu ---

// Durum Etiketleri ve Stilleri
const statusLabels = { open: "Açık", waiting_customer_approval: "Onay Bekliyor", in_progress: "Devam Ediyor", completed: "Tamamlandı", cancelled: "İptal Edildi" };
const statusStyles = { open: styles.open, waiting_customer_approval: styles.waiting, in_progress: styles.progress, completed: styles.completed, cancelled: styles.cancelled };


export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id; 

  // --- State'ler ---
  const [job, setJob] = useState(null); 
  const [documents, setDocuments] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [newPartName, setNewPartName] = useState('');
  const [newPartQty, setNewPartQty] = useState(1);
  const [newPartPrice, setNewPartPrice] = useState('');
  const [newPartSource, setNewPartSource] = useState('İçeride');
  const [newLaborCost, setNewLaborCost] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState(''); 

  // === HELPER FONKSİYONLARIN TAM TANIMLARI ===
   // Toplam Maliyeti Hesapla
   const calculateTotalCost = (currentJob) => {
       const partsTotal = currentJob?.partsUsed?.reduce((sum, p) => sum + (p.price * p.quantity), 0) || 0;
       const laborTotal = currentJob?.laborCost || 0;
       return partsTotal + laborTotal;
   };
   // Başarı mesajını temizleme
   const clearSuccessMessage = () => { setTimeout(() => setSuccessMessage(''), 3000); };
   
   // Tarih/Saat Formatlama
   const formatDateTime = (dateTimeString) => {
       if (!dateTimeString) return '-';
       try { const date = new Date(dateTimeString); return `${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`; } catch (e) { return '-'; }
   };
   
   // Sadece Tarih Formatlama (HATALI OLAN FONKSİYON - DÜZELTİLDİ)
   const formatDate = (dateString) => { // Argüman adı 'dateString'
       if (!dateString) return '-'; // Kontrol 'dateString' olmalı
       try { return new Date(dateString).toLocaleDateString('tr-TR'); } catch (e) { return '-'; } // Kullanım 'dateString' olmalı
   };
  // === HELPER SONU ===


  // --- Veri Yükleme (SİMÜLASYON) ---
  useEffect(() => {
    setIsLoading(true); setError(null); setJob(null); setDocuments([]); setInvoiceStatus('');
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/service/login'); return; }

    console.log(`--- SİMÜLASYON: İş Emri (${jobId}) detayı ve belgeleri yükleniyor ---`);
    const timer = setTimeout(() => {
        const foundJob = mockJobsData.find(j => j.id === jobId); 
        const foundDocs = mockJobDocuments.filter(doc => doc.jobId === jobId).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); 
        if (foundJob) {
          setJob(JSON.parse(JSON.stringify(foundJob))); 
          setDocuments(foundDocs); 
          if (foundDocs.some(doc => doc.type === 'Fatura')) {
              setInvoiceStatus('Fatura zaten oluşturulmuş.');
          }
          setError(null);
        } else {
          console.error(`İş Emri bulunamadı ID: ${jobId}`);
          setError(`İş Emri bulunamadı (ID: ${jobId}).`);
        }
        setIsLoading(false); 
    }, 500); 
    return () => clearTimeout(timer);
  }, [jobId, router]);

  
  // --- Aksiyon Fonksiyonları (Simülasyonlu) ---
  const handleUpdateStatus = async (newStatus) => {
     if (!job) return;
     const statusText = statusLabels[newStatus] || newStatus;
     if (!window.confirm(`${job.carPlate} iş emrini "${statusText}" olarak güncellemek istediğinizden emin misiniz?`)) return;
     console.log(`--- SİMÜLASYON: İş Emri (${jobId}) Durumu Güncelleniyor: ${newStatus} ---`);
     await new Promise(resolve => setTimeout(resolve, 500));
     setJob(prevJob => {
         const updatedJob = { ...prevJob, status: newStatus };
         if (newStatus === 'completed') {
             updatedJob.completionDate = new Date().toISOString(); 
             updatedJob.totalCost = calculateTotalCost(updatedJob); 
         }
         return updatedJob;
     });
     setSuccessMessage(`İş Emri başarıyla "${statusText}" olarak güncellendi.`);
     clearSuccessMessage(); 
  };
  const handleAddPart = (e) => {
      e.preventDefault();
      if (!newPartName || !newPartQty || !newPartPrice) { setError("Lütfen parça adı, adet ve fiyatı girin."); return; }
      const qty = parseInt(newPartQty); const price = parseFloat(newPartPrice);
      if (isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) { setError("Lütfen adet ve fiyat için geçerli sayılar girin."); return; }
      console.log(`--- SİMÜLASYON: Parça Ekleniyor ---`, { name: newPartName, quantity: qty, price: price, source: newPartSource });
      const newPart = { id: `part-${Date.now()}`, name: newPartName, quantity: qty, price: price, source: newPartSource }; 
      setJob(prevJob => ({ ...prevJob, partsUsed: [...(prevJob.partsUsed || []), newPart] }));
      setNewPartName(''); setNewPartQty(1); setNewPartPrice(''); setNewPartSource('İçeride');
      setSuccessMessage("Parça başarıyla eklendi."); clearSuccessMessage();
  };
   const handleUpdateLabor = () => {
       setError(null); 
       if (!newLaborCost) { setError("Lütfen işçilik ücretini girin."); return; }
       const labor = parseFloat(newLaborCost);
       if (isNaN(labor) || labor < 0) { setError("Geçerli bir işçilik ücreti girin."); return; }
       console.log(`--- SİMÜLASYON: İşçilik Güncelleniyor ---`, { laborCost: labor });
       setJob(prevJob => ({ ...prevJob, laborCost: labor }));
       setNewLaborCost(''); 
       setSuccessMessage("İşçilik ücreti başarıyla güncellendi."); clearSuccessMessage();
   };
   const handleDeletePart = async (partId, partName) => { 
       if (!job || !job.partsUsed) return; 
       if (!window.confirm(`'${partName}' adlı parçayı listeden silmek istediğinizden emin misiniz?`)) return;
       console.log(`--- SİMÜLASYON: Parça Siliniyor (ID ${partId}): ${partName} ---`);
       await new Promise(resolve => setTimeout(resolve, 300)); 
       setJob(prevJob => ({ ...prevJob, partsUsed: prevJob.partsUsed.filter((part) => (part.id || partName) !== (partId || partName)) })); 
       setSuccessMessage(`'${partName}' adlı parça başarıyla silindi.`); clearSuccessMessage();
   };
   const handleDeleteDocument = async (docId, docFileName) => {
    if (!window.confirm(`'${docFileName}' adlı belgeyi silmek istediğinizden emin misiniz?`)) return;
    console.log(`--- SİMÜLASYON: Belge Siliniyor: ${docId} ---`);
    await new Promise(resolve => setTimeout(resolve, 300));
    setDocuments(currentDocs => currentDocs.filter(doc => doc.id !== docId));
    setSuccessMessage(`'${docFileName}' adlı belge başarıyla silindi (Simülasyon).`); clearSuccessMessage();
  };
  const handleCreateInvoice = async () => {
    if (!job || job.status !== 'completed') return; 
    setInvoiceStatus('Fatura oluşturuluyor...'); 
    setIsLoading(true); 
    console.log(`--- SİMÜLASYON: Fatura Oluşturuluyor/Gönderiliyor: İş Emri ID ${jobId} ---`);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log('--- SİMÜLASYON: Fatura oluşturuldu ve gönderildi! ---');
    setInvoiceStatus('Fatura oluşturuldu ve müşteriye gönderildi (Simülasyon).');
    const newInvoiceDoc = { id: `doc-inv-${Date.now()}`, jobId: jobId, type: "Fatura", fileName: `fatura-${job.carPlate}-${new Date().toLocaleDateString('tr-CA')}.pdf`, url: "#", createdAt: new Date().toISOString() };
    mockJobDocuments.push(newInvoiceDoc); 
    setDocuments(prevDocs => [newInvoiceDoc, ...prevDocs]); 
    setIsLoading(false);
    setTimeout(() => setInvoiceStatus('Fatura zaten oluşturulmuş.'), 5000); 
  };
  // --- Aksiyon Fonksiyonları Sonu ---


  // --- Render Kontrolleri ---
  if (isLoading) { return <div className={styles.loading}>İş Emri Detayları Yükleniyor...</div>; } 
  if (error) { 
     return (
         <div className={`${styles.jobDetailContainer} pageContainer`}> 
              <div className={styles.header}>
                 <h1 className={styles.title}>Hata</h1>
                  <Link href="/service/jobs" className={styles.backButton}> 
                     <i className="fas fa-arrow-left"></i> Geri Dön
                 </Link>
              </div>
              <div className={styles.errorMessage}>{error}</div>
         </div>
     ); 
  }
  if (!job) { 
       return (
         <div className={`${styles.jobDetailContainer} pageContainer`}> 
              <div className={styles.header}>
                 <h1 className={styles.title}>Hata</h1>
                  <Link href="/service/jobs" className={styles.backButton}> 
                     <i className="fas fa-arrow-left"></i> Geri Dön
                 </Link>
              </div>
              <div className={styles.errorMessage}>İş emri bilgileri yüklenirken beklenmedik bir sorun oluştu.</div>
         </div>
     ); 
  }
  // --- Kontroller Sonu ---

  // --- Başarılı Render ---
   const currentTotalCost = calculateTotalCost(job); 

  return (
    <div className={`${styles.jobDetailContainer} pageContainer`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>İş Emri Detayı #{job.id.substring(job.id.lastIndexOf('-') + 1)}</h1> 
            <span className={`${styles.statusBadge} ${statusStyles[job.status] || ''}`}> {statusLabels[job.status] || job.status} </span>
        </div>
        <Link href="/service/jobs" className={styles.backButton}> <i className="fas fa-arrow-left"></i> İş Emri Listesine Dön </Link>
      </div>

      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {invoiceStatus && !invoiceStatus.includes('oluşturulmuş') && <div className={styles.infoMessage}>{invoiceStatus}</div>} 

      {/* Ana Bilgiler */}
      <div className={styles.mainInfoGrid}> 
          <div className={styles.infoCard}>
              <h3>Müşteri Bilgileri</h3>
              <p><strong>Ad Soyad:</strong> {job.customerName}</p>
              <p><strong>Plaka:</strong> {job.carPlate}</p>
              <p><strong>Araç:</strong> {job.carModel}</p>
          </div>
          <div className={styles.infoCard}>
              <h3>İş Emri Bilgileri</h3>
              <p><strong>Başlangıç:</strong> {formatDateTime(job.startDate)}</p>
              <p><strong>İşlem Türü:</strong> {job.serviceType}</p>
              <p><strong>Atanan:</strong> {job.assignedTo || '-'}</p>
              {job.completionDate && <p><strong>Bitiş:</strong> {formatDateTime(job.completionDate)}</p>}
          </div>
      </div>

       {/* Notlar */}
       {job.notes && ( <div className={styles.notesSection}> <h3>Notlar / Müşteri Talebi</h3> <p>{job.notes}</p> </div> )}

      {/* Duruma Göre Aksiyonlar */}
      <div className={styles.actionButtons}> 
          {job.status === 'open' && ( <button onClick={() => handleUpdateStatus('in_progress')} className={styles.actionButtonPrimary}><i className="fas fa-play"></i> İşleme Başla</button> )}
          {job.status === 'in_progress' && ( <> <button onClick={() => handleUpdateStatus('waiting_customer_approval')} className={styles.actionButtonWarning}><i className="fas fa-paper-plane"></i> Müşteri Onayına Gönder</button> <button onClick={() => handleUpdateStatus('completed')} className={styles.actionButtonSuccess}><i className="fas fa-check-double"></i> İşlemi Tamamla</button> </> )}
           {job.status === 'waiting_customer_approval' && ( <> <button onClick={() => handleUpdateStatus('in_progress')} className={styles.actionButtonPrimary}><i className="fas fa-play"></i> Onay Alındı, Devam Et</button> <button onClick={() => handleUpdateStatus('cancelled')} className={styles.actionButtonDanger}><i className="fas fa-times"></i> Müşteri İptal Etti</button> </> )}
           { (job.status === 'open' || job.status === 'in_progress' || job.status === 'waiting_customer_approval') && ( <button onClick={() => handleUpdateStatus('cancelled')} className={styles.actionButtonDanger}><i className="fas fa-ban"></i> İş Emrini İptal Et</button> )}
      </div>

      {/* Parça ve İşçilik Yönetimi */}
      { (job.status === 'open' || job.status === 'in_progress' || job.status === 'waiting_customer_approval') && (
        <div className={styles.partsLaborGrid}>
             <div className={styles.partsSection}>
                <h3 className={styles.sectionTitle}><i className="fas fa-cogs"></i> Kullanılan Parçalar</h3>
                {job.partsUsed && job.partsUsed.length > 0 ? (
                    <ul className={styles.partsList}>
                        {job.partsUsed.map((part, index) => ( 
                            <li key={part.id || index}> 
                                <span> {part.quantity}x {part.name} ({part.source}) - {(part.price * part.quantity).toLocaleString('tr-TR')} TL </span>
                                <button type="button" className={`${styles.actionButtonSmall} ${styles.deleteButtonSmall}`} title="Parçayı Sil" onClick={() => handleDeletePart(part.id || index, part.name)}> <i className="fas fa-times"></i> </button>
                            </li> 
                        ))}
                    </ul>
                ) : <p className={styles.noDataSubMessage}>Henüz parça eklenmedi.</p>}
                <form onSubmit={handleAddPart} className={styles.addPartForm}>
                    <h4>Yeni Parça Ekle</h4>
                    <input type="text" placeholder="Parça Adı *" value={newPartName} onChange={e=>setNewPartName(e.target.value)} required />
                    <input type="number" placeholder="Adet *" value={newPartQty} onChange={e=>setNewPartQty(e.target.value)} min="1" required />
                    <input type="number" placeholder="Birim Fiyat (TL) *" value={newPartPrice} onChange={e=>setNewPartPrice(e.target.value)} min="0" step="0.01" required />
                     <select value={newPartSource} onChange={e=>setNewPartSource(e.target.value)}> <option value="İçeride">Kaynak: İçeride (Servis)</option> <option value="Dışarıda">Kaynak: Dışarıda (Müşteri)</option> </select>
                    <button type="submit" disabled={isLoading}>Ekle</button> 
                </form>
            </div>
            <div className={styles.laborSection}>
                 <h3 className={styles.sectionTitle}><i className="fas fa-user-clock"></i> İşçilik Ücreti</h3>
                 <p>Mevcut İşçilik: <strong>{job.laborCost ? `${job.laborCost.toLocaleString('tr-TR')} TL` : 'Belirlenmedi'}</strong></p>
                 <div className={styles.addLaborForm}>
                     <input type="number" placeholder="Yeni İşçilik (TL)" value={newLaborCost} onChange={e=>setNewLaborCost(e.target.value)} min="0" step="0.01" />
                     <button type="button" onClick={handleUpdateLabor} disabled={isLoading}>Güncelle</button> 
                 </div>
            </div>
        </div>
      )}

       {/* Toplam Maliyet */}
       <div className={styles.totalCostSection}>
           <div> 
               <h3>{job.status === 'completed' ? 'Toplam Fatura Tutarı' : 'Ara Toplam Maliyet'}</h3>
               <strong>{(job.status === 'completed' ? (job.totalCost ?? currentTotalCost) : currentTotalCost).toLocaleString('tr-TR')} TL</strong> 
               {job.status === 'completed' && job.totalCost && job.totalCost !== currentTotalCost && ( <small style={{display:'block', marginTop:'5px', color:'var(--gray-500)'}}> (Tamamlandığındaki kayıtlı maliyet: {job.totalCost.toLocaleString('tr-TR')} TL)</small> )}
               {job.status !== 'completed' && job.estimatedCost && ( <small style={{display:'block', marginTop:'5px', color:'var(--gray-500)'}}> (Tahmini maliyet: {job.estimatedCost.toLocaleString('tr-TR')} TL)</small> )}
           </div>
           
           {/* Fatura Butonu */}
           {job.status === 'completed' && (
                <button 
                    onClick={handleCreateInvoice} 
                    className={styles.invoiceButton} 
                    disabled={isLoading || (invoiceStatus && invoiceStatus.includes('oluşturuluyor')) || (invoiceStatus && invoiceStatus.includes('oluşturulmuş'))} 
                >
                    <i className="fas fa-file-invoice-dollar"></i> 
                    {(invoiceStatus && invoiceStatus.includes('oluşturulmuş')) ? 'Fatura Oluşturuldu' : (invoiceStatus && invoiceStatus.includes('oluşturuluyor')) ? 'Oluşturuluyor...' : 'Fatura Oluştur/Gönder'}
                </button>
           )}
       </div>

       {/* İlişkili Belgeler Bölümü */}
        <div className={styles.documentsSection}>
            <h2 className={styles.sectionTitle}><i className="fas fa-folder"></i> İlişkili Belgeler</h2>
            {documents.length === 0 ? (
                <p className={styles.noDataSubMessage}>Bu iş emrine ait belge bulunmuyor.</p>
            ) : (
                <ul className={styles.documentList}>
                    {documents.map(doc => (
                        <li key={doc.id}>
                            <span className={styles.docIcon}> <i className={doc.fileName.endsWith('.pdf') ? "fas fa-file-pdf" : "fas fa-file-image"}></i> </span>
                            <div className={styles.docInfo}> <span className={styles.docFileName}>{doc.fileName}</span> <span className={styles.docMeta}>{doc.type} - {formatDate(doc.createdAt)}</span> </div>
                            <div className={styles.docActions}>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className={styles.actionButtonSmall} title="Görüntüle/İndir"> <i className="fas fa-eye"></i> </a>
                                <button type="button" className={`${styles.actionButtonSmall} ${styles.deleteButtonSmall}`} title="Belgeyi Sil" onClick={() => handleDeleteDocument(doc.id, doc.fileName)}> <i className="fas fa-trash"></i> </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    </div> 
  );
}
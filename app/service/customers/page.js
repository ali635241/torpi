'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; 
import styles from './customers.module.css'; 

// --- Sahte Müşteri Verisi ---
const mockCustomersData = [
 { id: "cust-1", firstName: "Ali", lastName: "Veli", phone: "0555 111 2233", email: "ali.veli@email.com", city: "İstanbul", district: "Kadıköy", carCount: 1 }, 
 { id: "cust-2", firstName: "Ayşe", lastName: "Yılmaz", phone: "0544 999 8877", email: "ayse.yilmaz@email.com", city: "Ankara", district: "Çankaya", carCount: 2 },
 { id: "cust-3", firstName: "Mehmet", lastName: "Demir", phone: "0533 123 4567", email: "m.demir@email.com", city: "İzmir", district: "Bornova", carCount: 0 },
];
// --- Sahte Veri Sonu ---


export default function ServiceCustomersPage() {
  const router = useRouter();

  // --- State'ler ---
  const [customers, setCustomers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); // Arama için

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }

    // Sahte Veriyi Yükle
    console.log("--- SİMÜLASYON: Servis Müşteri Listesi yükleniyor ---");
    setCustomers(mockCustomersData);
    setIsLoading(false);

  }, [router]);

  // --- Silme Fonksiyonu (Simülasyonlu) ---
  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`${customerName} adlı müşteriyi silmek istediğinizden emin misiniz?`)) return;
    console.log(`--- SİMÜLASYON: Müşteri Siliniyor: ${customerId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setCustomers(current => current.filter(c => c.id !== customerId)); 
    alert(`${customerName} adlı müşteri başarıyla silindi (Simülasyon).`);
  };

  // --- Arama Filtreleme ---
   const filteredCustomers = customers.filter(customer =>
        (customer.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || // Null check eklendi
        (customer.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (customer.phone || '').includes(searchTerm) ||
        (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Müşteriler Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login">Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }

  return (
    <div className={`${styles.customersContainer} pageContainer`}> 
      {/* Sayfa Başlığı, Geri Dön ve Yeni Ekle Butonu */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
             <h1 className={styles.title}>Müşteriler ({filteredCustomers.length})</h1>
             <Link href="/service/dashboard" className={styles.backButton}>
                 <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
             </Link>
        </div>
        <Link href="/service/customers/add" className={styles.addButton}>
             <i className="fas fa-user-plus"></i> Yeni Müşteri Ekle
        </Link>
      </div>

      {/* Arama Çubuğu */}
      <div className={styles.searchBar}>
          <i className="fas fa-search"></i>
          <input
              type="text"
              placeholder="Müşteri adı, soyadı, telefon veya e-posta ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Müşteri Tablosu */}
      {customers.length === 0 ? (
        <p className={styles.noDataMessage}>Henüz hiç müşteri kaydı yok.</p>
      ) : filteredCustomers.length === 0 ? (
          <p className={styles.noDataMessage}>Arama kriterlerine uygun müşteri bulunamadı.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Telefon</th>
                <th>E-posta</th>
                <th>Şehir / İlçe</th>
                <th>Araç Sayısı</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.firstName} {customer.lastName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.city}{customer.district ? ` / ${customer.district}` : ''}</td>
                  <td>{customer.carCount}</td>
                  <td className={styles.actions}>
                     <Link
                         href={`/service/customers/edit/${customer.id}`} 
                         className={`${styles.actionButton} ${styles.editButton}`}
                         title="Düzenle"
                     >
                         <i className="fas fa-edit"></i>
                     </Link>
                     <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Sil"
                        onClick={() => handleDeleteCustomer(customer.id, `${customer.firstName} ${customer.lastName}`)}
                     >
                       <i className="fas fa-trash"></i>
                     </button>
                      <Link
                         href={`/service/customers/${customer.id}/cars`} 
                         className={`${styles.actionButton} ${styles.carButton}`}
                         title="Araçları Gör"
                      >
                         <i className="fas fa-car"></i>
                      </Link>
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
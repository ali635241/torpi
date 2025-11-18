'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; 
import styles from './inventory.module.css'; // Yeni CSS

// --- Sahte Stok Verisi ---
const mockInventoryData = [
 { id: "item-1", partCode: "FIL-OIL-001", name: "Yağ Filtresi (Toyota Uyumlu)", brand: "Marka A", inStock: 15, costPrice: 120.00, salePrice: 180.00 },
 { id: "item-2", partCode: "PAD-BRK-002", name: "Ön Fren Balatası (Honda Uyumlu)", brand: "Marka B", inStock: 8, costPrice: 550.00, salePrice: 850.00 },
 { id: "item-3", partCode: "OIL-MOT-001", name: "Motor Yağı 5W-30 5L", brand: "Marka C", inStock: 5, costPrice: 350.00, salePrice: 500.00 }, // Düşük stok
 { id: "item-4", partCode: "FIL-AIR-003", name: "Hava Filtresi (Ford Uyumlu)", brand: "Marka A", inStock: 22, costPrice: 80.00, salePrice: 130.00 },
];
// --- Sahte Veri Sonu ---

// Düşük stok sınırı
const LOW_STOCK_THRESHOLD = 10;

export default function ServiceInventoryPage() {
  const router = useRouter();

  // --- State'ler ---
  const [inventory, setInventory] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); // Arama

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }
    // TODO: Rol kontrolü (Admin, Servis Danışmanı, Teknisyen?)

    // Sahte Stok Verisini Yükle
    // Backend CORS'u düzeltince gerçek api.get('/service/inventory') gibi bir istek atılmalı
    console.log("--- SİMÜLASYON: Servis Stok Listesi yükleniyor ---");
    setInventory(mockInventoryData);
    setIsLoading(false);

  }, [router]);

  // --- Silme Fonksiyonu (Simülasyonlu) ---
  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`'${itemName}' adlı parçayı stoktan silmek istediğinizden emin misiniz?`)) return;
    console.log(`--- SİMÜLASYON: Stok Kalemi Siliniyor: ${itemId} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setInventory(current => current.filter(item => item.id !== itemId)); 
    alert(`'${itemName}' adlı parça başarıyla silindi (Simülasyon).`);
    // TODO: Gerçek API isteği (api.delete(`/service/inventory/${itemId}`))
  };

  // --- Arama Filtreleme ---
   const filteredInventory = inventory.filter(item =>
        (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.partCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Stok Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login">Tekrar giriş yapmayı deneyin.</Link></p> ... </div> ); }

  return (
    // customers.module.css'e benzer stiller
    <div className={`${styles.inventoryContainer} pageContainer`}> 
      {/* Sayfa Başlığı ve Yeni Ekle Butonu */}
      <div className={styles.header}>
         <div className={styles.headerLeft}>
             <h1 className={styles.title}>Stok Yönetimi ({filteredInventory.length})</h1>
             <Link href="/service/dashboard" className={styles.backButton}>
                 <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
             </Link>
        </div>
         {/* TODO: /service/inventory/add sayfası henüz yok */}
        <Link href="/service/inventory/add" className={styles.addButton}>
             <i className="fas fa-plus"></i> Yeni Parça Ekle
        </Link>
      </div>

      {/* Arama Çubuğu */}
      <div className={styles.searchBar}>
          <i className="fas fa-search"></i>
          <input
              type="text"
              placeholder="Parça adı, parça kodu veya marka ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Stok Tablosu */}
      {inventory.length === 0 ? (
        <p className={styles.noDataMessage}>Henüz hiç stok kaydı yok.</p>
      ) : filteredInventory.length === 0 ? (
          <p className={styles.noDataMessage}>Arama kriterlerine uygun parça bulunamadı.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Parça Kodu</th>
                <th>Parça Adı</th>
                <th>Marka</th>
                <th>Stok (Adet)</th>
                <th>Alış Fiyatı (TL)</th>
                <th>Satış Fiyatı (TL)</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => (
                <tr key={item.id} className={item.inStock < LOW_STOCK_THRESHOLD ? styles.lowStockRow : ''}>
                  <td>{item.partCode}</td>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>
                      <span className={`${styles.stockLevel} ${item.inStock < LOW_STOCK_THRESHOLD ? styles.lowStock : ''}`}>
                         {item.inStock}
                         {item.inStock < LOW_STOCK_THRESHOLD && <i className="fas fa-exclamation-triangle" title="Düşük Stok!"></i>}
                      </span>
                  </td>
                  <td>{item.costPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                  <td>{item.salePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                  <td className={styles.actions}>
                     {/* TODO: Düzenle linki /service/inventory/edit/[id] */}
                     <Link
                         href={`/service/inventory/edit/${item.id}`} // Dinamik rota
                         className={`${styles.actionButton} ${styles.editButton}`}
                         title="Düzenle / Stok Güncelle"
                     >
                         <i className="fas fa-edit"></i>
                     </Link>
                     <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Sil"
                        onClick={() => handleDeleteItem(item.id, item.name)}
                     >
                       <i className="fas fa-trash"></i>
                     </button>
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
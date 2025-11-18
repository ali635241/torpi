'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; 
import styles from './employees.module.css'; 

// --- Sahte Çalışan Verisi (Faz 1B Dokümanına Göre ) ---
// Roller: Admin, Servis Danışmanı, Teknisyen, Muhasebe
const mockEmployeesData = [
 { id: "emp-1", firstName: "Servet", lastName: "Sahibi", email: "admin@ornekservis.com", role: "Admin", isActive: true },
 { id: "emp-2", firstName: "Ayşe", lastName: "Çalışkan", email: "ayse.c@ornekservis.com", role: "Servis Danışmanı", isActive: true },
 { id: "emp-3", firstName: "Mehmet", lastName: "Usta", email: "mehmet.u@ornekservis.com", role: "Teknisyen", isActive: true },
 { id: "emp-4", firstName: "Fatma", lastName: "Hesap", email: "fatma.h@ornekservis.com", role: "Muhasebe", isActive: true },
 { id: "emp-5", firstName: "Ali", lastName: "Teknis", email: "ali.t@ornekservis.com", role: "Teknisyen", isActive: false }, // Pasif örnek
];
// --- Sahte Veri Sonu ---

// Rol Etiketleri
const roleLabels = { Admin: "Yönetici", "Servis Danışmanı": "Servis Danışmanı", Teknisyen: "Teknisyen", Muhasebe: "Muhasebe" };


export default function ServiceEmployeesPage() {
  const router = useRouter();

  // --- State'ler ---
  const [employees, setEmployees] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  // TODO: Arama/Filtreleme state'leri (Rol, Aktiflik)

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }
    // TODO: Rol kontrolü eklenebilir (Sadece Admin görebilir)

    // Sahte Çalışan Verisini Yükle
    // Backend CORS'u düzeltince gerçek api.get('/service/employees') gibi bir istek atılmalı
    console.log("--- SİMÜLASYON: Servis Çalışan Listesi yükleniyor ---");
    setEmployees(mockEmployeesData);
    setIsLoading(false);

  }, [router]);

  // --- Silme Fonksiyonu (Simülasyonlu - Pasif Yapma?) ---
  // Genellikle çalışanlar silinmez, pasif yapılır. Silme yerine 'Pasif Yap' ekleyelim.
  const handleToggleActive = async (employeeId, employeeName, currentStatus) => {
    const actionText = currentStatus ? "Pasif Yapmak" : "Aktif Etmek";
    const newStatus = !currentStatus;
    if (!window.confirm(`${employeeName} adlı çalışanı "${actionText}" istediğinizden emin misiniz?`)) return;

    console.log(`--- SİMÜLASYON: Çalışan (${employeeId}) Durumu Güncelleniyor: ${newStatus} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setEmployees(current => current.map(emp => 
        emp.id === employeeId ? { ...emp, isActive: newStatus } : emp
    )); 
    alert(`${employeeName} adlı çalışan başarıyla "${actionText}"ıldı (Simülasyon).`);
    // TODO: Gerçek API isteği (api.patch(`/service/employees/${employeeId}`, { isActive: newStatus }))
  };


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Çalışanlar Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login">Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }

  return (
    // customers.module.css'e benzer stiller kullanabiliriz
    <div className={`${styles.employeesContainer} pageContainer`}> 
      {/* Sayfa Başlığı ve Yeni Ekle Butonu */}
      <div className={styles.header}>
         <div className={styles.headerLeft}>
             <h1 className={styles.title}>Çalışan Yönetimi ({employees.length})</h1>
             <Link href="/service/dashboard" className={styles.backButton}>
                 <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
             </Link>
        </div>
         {/* TODO: /service/employees/add sayfası henüz yok */}
        <Link href="/service/employees/add" className={styles.addButton}>
             <i className="fas fa-user-plus"></i> Yeni Çalışan Ekle
        </Link>
      </div>

      {/* TODO: Filtreleme ve Arama Alanı */}
      {/* <div className={styles.filters}> ... </div> */}

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Çalışan Tablosu */}
      {employees.length === 0 ? (
        <p className={styles.noDataMessage}>Henüz hiç çalışan kaydı yok.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.employeeTable}>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Rol</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.firstName} {employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{roleLabels[employee.role] || employee.role}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${employee.isActive ? styles.active : styles.inactive}`}>
                      {employee.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                     {/* --- YENİ: Düzenle İkonu <Link> oldu --- */}
                     <Link
                         href={`/service/employees/edit/${employee.id}`} // Dinamik rota
                         className={`${styles.actionButton} ${styles.editButton}`}
                         title="Düzenle"
                     >
                         <i className="fas fa-edit"></i>
                     </Link>
                     {/* Aktif/Pasif Yap Butonu */}
                     <button
                        className={`${styles.actionButton} ${employee.isActive ? styles.deactivateButton : styles.activateButton}`}
                        title={employee.isActive ? "Pasif Yap" : "Aktif Et"}
                        onClick={() => handleToggleActive(employee.id, `${employee.firstName} ${employee.lastName}`, employee.isActive)}
                     >
                       {employee.isActive ? <i className="fas fa-user-slash"></i> : <i className="fas fa-user-check"></i>}
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
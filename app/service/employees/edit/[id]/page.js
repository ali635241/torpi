'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
// Stil dosyasını service/register klasöründen import edelim
import styles from '../../../register/register.module.css'; 
import api from '../../../../../lib/api'; 

// --- Sahte Veriler ---
const mockEmployeesData = [
 { id: "emp-1", firstName: "Servet", lastName: "Sahibi", email: "admin@ornekservis.com", role: "Admin", isActive: true, phone: "05001112233" }, // Phone ekledim
 { id: "emp-2", firstName: "Ayşe", lastName: "Çalışkan", email: "ayse.c@ornekservis.com", role: "Servis Danışmanı", isActive: true, phone: "05002223344" },
 { id: "emp-3", firstName: "Mehmet", lastName: "Usta", email: "mehmet.u@ornekservis.com", role: "Teknisyen", isActive: true, phone: "05003334455" },
 { id: "emp-4", firstName: "Fatma", lastName: "Hesap", email: "fatma.h@ornekservis.com", role: "Muhasebe", isActive: true, phone: "05004445566" },
 { id: "emp-5", firstName: "Ali", lastName: "Teknis", email: "ali.t@ornekservis.com", role: "Teknisyen", isActive: false, phone: "05005556677" }, 
];
const employeeRoles = ["Admin", "Servis Danışmanı", "Teknisyen", "Muhasebe"];
// --- Sahte Veri Sonu ---


export default function EditEmployeePage() {
    const router = useRouter();
    const params = useParams();
    const employeeId = params.id; 

    // --- State'ler ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(''); 
    const [phone, setPhone] = useState(''); 
    const [role, setRole] = useState(''); 
    const [isActive, setIsActive] = useState(true); 

    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // --- Veri Yükleme (SİMÜLASYON) ---
    useEffect(() => {
        // Token Kontrolü
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/service/login'); return; }
        
        // Sahte veriden çalışanı bul
        console.log(`--- SİMÜLASYON: Düzenlenecek Çalışan verisi yükleniyor ID: ${employeeId} ---`);
        const employeeToEdit = mockEmployeesData.find(e => e.id === employeeId);

        if (employeeToEdit) {
            // State'leri doldur
            setFirstName(employeeToEdit.firstName || '');
            setLastName(employeeToEdit.lastName || '');
            setEmail(employeeToEdit.email || '');
            setPhone(employeeToEdit.phone || ''); 
            setRole(employeeToEdit.role || '');
            setIsActive(employeeToEdit.isActive);
            setError(null);
        } else {
            console.error(`Çalışan bulunamadı ID: ${employeeId}`);
            setError(`Düzenlenecek çalışan bulunamadı (ID: ${employeeId}).`);
        }
        setIsLoading(false); 
        
    }, [employeeId, router]);

    // --- Form Gönderim (SİMÜLASYON) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Validasyon
        if (!firstName || !lastName || !email || !role) {
            setError('Ad, Soyad, E-posta ve Rol alanları zorunludur.');
            return;
        }

        setIsLoading(true);

        const updatedEmployeeData = { firstName, lastName, email, phone, role, isActive };

        // --- SİMÜLASYON ---
        console.log(`--- SİMÜLASYON: Çalışan Güncelleme İsteği ID: ${employeeId} ---`);
        console.log(updatedEmployeeData);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        console.log("--- SİMÜLASYON: Çalışan güncellendi. Listeye yönlendiriliyor... ---");
        setSuccessMessage('Çalışan bilgileri başarıyla güncellendi (Simülasyon).');
        setIsLoading(false);
        setTimeout(() => {
             router.push('/service/employees');
        }, 2000);
    };


   // --- Render ---
   // Önce yükleniyor durumunu kontrol et
   if (isLoading) { return <div className={styles.loading}>Çalışan Bilgileri Yükleniyor...</div>; } 
   // Sonra hata durumunu kontrol et (Veri yüklenirken veya bulunamazsa)
   if (error) { 
     return (
         <div className={styles.container}> {/* Ana container */}
              <div className={styles.form} style={{maxWidth: '700px'}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                       <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Hata</h2>
                        <Link href="/service/employees" className={styles.backButton}>
                            <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                        </Link>
                   </div>
                   <div className={styles.errorMessage}>{error}</div>
              </div>
         </div>
     );
   }
   // Eğer yükleme bitti, hata yok ama 'firstName' hala boşsa (beklenmedik durum)
   if (!firstName) { 
        return ( <div className={styles.loading}>Çalışan bilgileri yüklenemedi.</div> );
   }


    // --- Başarılı Render ---
    return (
        // service/register stillerini kullanıyoruz
        <div className={styles.container}> 
            <div className={styles.form} style={{maxWidth: '700px'}}> 
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Çalışan Düzenle</h2>
                     <Link href="/service/employees" className={styles.backButton}> 
                         <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                     </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>} 
                    
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}> <label htmlFor="firstName">Ad *</label> <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required /> </div>
                        <div className={styles.formGroup}> <label htmlFor="lastName">Soyad *</label> <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required /> </div>
                    </div>
                    <div className={styles.formRow}>
                         <div className={styles.formGroup}> <label htmlFor="email">E-posta (Giriş için) *</label> <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required /> </div>
                         <div className={styles.formGroup}> <label htmlFor="phone">Telefon</label> <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05XX XXX XX XX"/> </div> 
                    </div>
                     <div className={styles.formRow}>
                         <div className={styles.formGroup}>
                            <label htmlFor="role">Rol *</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value)} required>
                                <option value="">Çalışan Rolünü Seçiniz...</option>
                                {employeeRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                         <div className={styles.formGroup} style={{ alignSelf: 'flex-end' }}> 
                             <div className={styles.checkboxGroupSingle}> 
                                <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                                <label htmlFor="isActive">Çalışan Aktif</label>
                            </div>
                         </div>
                    </div>

                    <div style={{textAlign: 'right', marginTop: '30px'}}> 
                        <button type="submit" className={styles.button} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}> 
                             {/* Buton metni isLoading'e göre değişmeli (firstName kontrolü kaldırıldı) */}
                             {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Stil dosyasını service/register klasöründen import edelim
import styles from '../../register/register.module.css'; 
import api from '../../../../lib/api'; // ../../../../lib/api yolu

// Roller (Faz 1B Dokümanından )
const employeeRoles = ["Admin", "Servis Danışmanı", "Teknisyen", "Muhasebe"];

export default function AddEmployeePage() {
    const router = useRouter();

    // --- State'ler ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(''); // Giriş için kullanılacak
    const [phone, setPhone] = useState(''); // Opsiyonel olabilir
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [role, setRole] = useState(''); // Seçilen rol

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Rota Koruma ---
     useEffect(() => {
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/service/login'); }
        // TODO: Rol kontrolü (Sadece Admin ekleyebilmeli)
     }, [router]);

    // --- Form Gönderim (SİMÜLASYON) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // --- Frontend Validasyon ---
        if (!firstName || !lastName || !email || !password || !passwordConfirm || !role) {
            setError('Lütfen tüm zorunlu (*) alanları doldurun.');
            return;
        }
        if (password !== passwordConfirm) {
            setError('Şifreler uyuşmuyor.');
            return;
        }
         if (password.length < 8) { // Minimum şifre
            setError('Şifre en az 8 karakter olmalıdır.');
            return;
         }

        setIsLoading(true);

        const employeeData = { firstName, lastName, email, phone, password, role, isActive: true /* Yeni çalışan aktif başlasın */ };

        // --- SİMÜLASYON ---
        console.log("--- SİMÜLASYON: Yeni Çalışan Ekleme İsteği ---");
        console.log({ ...employeeData, password: '***' }); // Şifreyi loglama
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        console.log("--- SİMÜLASYON: Çalışan eklendi. Listeye yönlendiriliyor... ---");
        alert('Çalışan başarıyla eklendi (Simülasyon).');
        router.push('/service/employees'); // Başarılı, listeye yönlendir
        
        /*
        // --- ORİJİNAL KOD ---
        // TODO: Backend CORS düzelince bu açılmalı (API endpoint varsayımsal: POST /service/employees)
        try {
            await api.post('/service/employees', employeeData); 
            alert('Çalışan başarıyla eklendi!');
            router.push('/service/employees'); 
        } catch (err) {
            console.error("Çalışan ekleme hatası:", err);
            setError(err.message || "Çalışan eklenirken bir hata oluştu (örn: e-posta zaten kayıtlı).");
            setIsLoading(false);
        }
        */
    };

    return (
        // service/register stillerini kullanıyoruz
        <div className={styles.container}> 
            <div className={styles.form} style={{maxWidth: '700px'}}> 
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Yeni Çalışan Ekle</h2>
                     <Link href="/service/employees" className={styles.backButton}> {/* Geri butonu */}
                         <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                     </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}> <label htmlFor="firstName">Ad *</label> <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required /> </div>
                        <div className={styles.formGroup}> <label htmlFor="lastName">Soyad *</label> <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required /> </div>
                    </div>
                    <div className={styles.formRow}>
                         <div className={styles.formGroup}> <label htmlFor="email">E-posta (Giriş için) *</label> <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required /> </div>
                         <div className={styles.formGroup}> <label htmlFor="phone">Telefon</label> <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05XX XXX XX XX"/> </div> {/* Opsiyonel */}
                    </div>
                     <div className={styles.formRow}>
                         <div className={styles.formGroup}>
                            <label htmlFor="role">Rol *</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value)} required>
                                <option value="">Çalışan Rolünü Seçiniz...</option>
                                {employeeRoles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                 <div className={styles.formRow}>
                    <div className={styles.formGroup}> <label htmlFor="password">Şifre *</label> <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="En az 8 karakter"/> </div>
                    <div className={styles.formGroup}> <label htmlFor="passwordConfirm">Şifre Tekrar *</label> <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required /> </div>
                </div>

                {/* Checkbox'lara gerek yok */}

                    <div style={{textAlign: 'right', marginTop: '30px'}}> 
                        <button type="submit" className={styles.button} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}> 
                            {isLoading ? 'Kaydediliyor...' : 'Çalışanı Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
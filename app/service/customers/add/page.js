'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Stil dosyasını service/register klasöründen import edelim (benzer form yapısı)
import styles from '../../register/register.module.css'; 
import api from '../../../../lib/api'; // ../../../../lib/api yolu

// Sahte İl/İlçe verisi (register/page.js'den)
const mockCities = [ { id: 6, name: "Ankara" }, { id: 34, name: "İstanbul" }, { id: 35, name: "İzmir" }, /* ... */ ];
const mockDistricts = { 34: ["Kadıköy", "Beşiktaş", "Şişli"], 6: ["Çankaya", "Yenimahalle"], 35: ["Konak", "Bornova"] };

export default function AddCustomerPage() {
    const router = useRouter();

    // --- State'ler (Faz 1B Dokümanına Göre ) ---
    const [firstName, setFirstName] = useState(''); // İsim
    const [lastName, setLastName] = useState('');   // Soyisim
    const [phone, setPhone] = useState('');       // Telefon
    const [email, setEmail] = useState('');       // E-posta
    const [city, setCity] = useState('');         // İl
    const [district, setDistrict] = useState(''); // İlçe
    // Adres alanı dokümanda belirtilmiş ama İl/İlçe yeterli olabilir şimdilik.

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Rota Koruma ---
     useEffect(() => {
        const token = localStorage.getItem('accessToken'); 
        if (!token) { router.push('/service/login'); }
     }, [router]);

    // --- Form Gönderim (SİMÜLASYON) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // --- Frontend Validasyon ---
        if (!firstName || !lastName || !phone) { // Zorunlu alanlar
            setError('Ad, Soyad ve Telefon alanları zorunludur.');
            return;
        }
        // Basit telefon format kontrolü (opsiyonel)
        // const phoneRegex = /^05[0-9]{2} [0-9]{3} [0-9]{2} [0-9]{2}$/;
        // if (!phoneRegex.test(phone)) {
        //     setError('Telefon numarasını 05XX XXX XX XX formatında girin.');
        //     return;
        // }

        setIsLoading(true);

        const customerData = { firstName, lastName, phone, email, city, district };

        // --- SİMÜLASYON ---
        console.log("--- SİMÜLASYON: Yeni Müşteri Ekleme İsteği ---");
        console.log(customerData);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

        console.log("--- SİMÜLASYON: Müşteri eklendi. Listeye yönlendiriliyor... ---");
        alert('Müşteri başarıyla eklendi (Simülasyon).');
        router.push('/service/customers'); // Başarılı, listeye yönlendir
        
        /*
        // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
        // Backend CORS'u düzeltince bu açılmalı.
        // API endpoint'i varsayımsal: /service/customers
        try {
            await api.post('/service/customers', customerData);
            alert('Müşteri başarıyla eklendi!');
            router.push('/service/customers'); 
        } catch (err) {
            console.error("Müşteri ekleme hatası:", err);
            // API'den gelen hatayı göster (örn: telefon zaten kayıtlı)
            setError(err.message || "Müşteri eklenirken bir hata oluştu.");
            setIsLoading(false);
        }
        */
    };

    return (
        // service/register stillerini kullanıyoruz
        <div className={styles.container}> 
            <div className={styles.form} style={{maxWidth: '700px'}}> {/* Formu biraz daraltalım */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Yeni Müşteri Ekle</h2>
                     <Link href="/service/customers" className={styles.backButton}> {/* Geri butonu için stil lazım */}
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
                         <div className={styles.formGroup}> <label htmlFor="phone">Telefon (05XX...)*</label> <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="05XX XXX XX XX"/> </div>
                         <div className={styles.formGroup}> <label htmlFor="email">E-posta</label> <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} /> </div> {/* Zorunlu değil */}
                    </div>
                     <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="city">İl</label>
                            <select id="city" value={city} onChange={e => { setCity(e.target.value); setDistrict(''); }}> 
                                <option value="">İl Seçiniz...</option>
                                {mockCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="district">İlçe</label>
                            <select id="district" value={district} onChange={e => setDistrict(e.target.value)} disabled={!city}>
                                <option value="">Önce İl Seçiniz...</option>
                                {city && mockDistricts[mockCities.find(c => c.name === city)?.id]?.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Checkbox'lara gerek yok */}

                    <div style={{textAlign: 'right', marginTop: '30px'}}> {/* Butonu sağa al */}
                        <button type="submit" className={styles.button} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}> {/* Buton genişliğini ayarla */}
                            {isLoading ? 'Kaydediliyor...' : 'Müşteriyi Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
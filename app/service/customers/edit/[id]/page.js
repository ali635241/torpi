'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
// Stil dosyasını service/register klasöründen import edelim (benzer form yapısı)
import styles from '../../../register/register.module.css'; // ../../../register yolu
import api from '../../../../../lib/api'; // ../../../../../lib/api yolu

// Sahte Veriler (customers/page.js'den)
const mockCustomersData = [
 { id: "cust-1", firstName: "Ali", lastName: "Veli", phone: "0555 111 2233", email: "ali.veli@email.com", city: "İstanbul", district: "Kadıköy", carCount: 1 },
 { id: "cust-2", firstName: "Ayşe", lastName: "Yılmaz", phone: "0544 999 8877", email: "ayse.yilmaz@email.com", city: "Ankara", district: "Çankaya", carCount: 2 },
 { id: "cust-3", firstName: "Mehmet", lastName: "Demir", phone: "0533 123 4567", email: "m.demir@email.com", city: "İzmir", district: "Bornova", carCount: 0 },
];
const mockCities = [ { id: 6, name: "Ankara" }, { id: 34, name: "İstanbul" }, { id: 35, name: "İzmir" }, /* ... */ ];
const mockDistricts = { 34: ["Kadıköy", "Beşiktaş", "Şişli"], 6: ["Çankaya", "Yenimahalle"], 35: ["Konak", "Bornova"] };

export default function EditCustomerPage() {
    const router = useRouter();
    const params = useParams();
    const customerId = params.id; // URL'den müşteri ID'sini al

    // --- State'ler ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');

    const [isLoading, setIsLoading] = useState(true); // Veri yükleme + Kaydetme
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // --- Veri Yükleme (SİMÜLASYON) ---
    useEffect(() => {
        // Token Kontrolü
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/service/login'); return; }

        // Sahte veriden müşteriyi bul
        console.log(`--- SİMÜLASYON: Düzenlenecek Müşteri verisi yükleniyor ID: ${customerId} ---`);
        const customerToEdit = mockCustomersData.find(c => c.id === customerId);

        if (customerToEdit) {
            // State'leri doldur
            setFirstName(customerToEdit.firstName || '');
            setLastName(customerToEdit.lastName || '');
            setPhone(customerToEdit.phone || '');
            setEmail(customerToEdit.email || '');
            setCity(customerToEdit.city || '');
            // İlçe listesinin yüklenebilmesi için il'in yüklenmesini beklemeye gerek yok,
            // il seçildiğinde ilçe zaten dolacak. Şimdilik direkt atayalım.
            setDistrict(customerToEdit.district || '');
            setError(null);
        } else {
            console.error(`Müşteri bulunamadı ID: ${customerId}`);
            setError(`Düzenlenecek müşteri bulunamadı (ID: ${customerId}).`);
        }
        setIsLoading(false); // Yükleme bitti

        // TODO: Backend CORS düzelince gerçek API isteği (api.get(`/service/customers/${customerId}`))

    }, [customerId, router]);

    // --- Form Gönderim (SİMÜLASYON) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Validasyon
        if (!firstName || !lastName || !phone) {
            setError('Ad, Soyad ve Telefon alanları zorunludur.');
            return;
        }

        setIsLoading(true);

        const updatedCustomerData = { firstName, lastName, phone, email, city, district };

        // --- SİMÜLASYON ---
        console.log(`--- SİMÜLASYON: Müşteri Güncelleme İsteği ID: ${customerId} ---`);
        console.log(updatedCustomerData);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

        console.log("--- SİMÜLASYON: Müşteri güncellendi. Listeye yönlendiriliyor... ---");
        setSuccessMessage('Müşteri bilgileri başarıyla güncellendi (Simülasyon).');
        setIsLoading(false);
        // 2 saniye sonra listeye yönlendir
        setTimeout(() => {
             router.push('/service/customers');
        }, 2000);

        /*
        // --- ORİJİNAL KOD ---
        // TODO: Backend CORS düzelince bu açılmalı (API endpoint varsayımsal: PATCH /service/customers/:id)
        try {
            await api.patch(`/service/customers/${customerId}`, updatedCustomerData);
            setSuccessMessage('Müşteri bilgileri başarıyla güncellendi!');
            setIsLoading(false);
             setTimeout(() => router.push('/service/customers'), 2000);
        } catch (err) {
            console.error("Müşteri güncelleme hatası:", err);
            setError(err.message || "Müşteri güncellenirken bir hata oluştu.");
            setIsLoading(false);
        }
        */
    };


   // --- Render ---
   // Yükleniyor veya hata durumu
   if (isLoading && !firstName) { return <div className={styles.loading}>Müşteri Bilgileri Yükleniyor...</div>; }
   if (error && !firstName) { // Sadece yükleme hatası varsa
     return (
         <div className={styles.container}> {/* Ana container */}
              <div className={styles.form} style={{maxWidth: '700px'}}>
                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                       <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Hata</h2>
                        <Link href="/service/customers" className={styles.backButton}>
                            <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                        </Link>
                   </div>
                   <div className={styles.errorMessage}>{error}</div>
              </div>
         </div>
     );
   }


    return (
        // service/register stillerini kullanıyoruz
        <div className={styles.container}>
            <div className={styles.form} style={{maxWidth: '700px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Müşteri Düzenle</h2>
                     <Link href="/service/customers" className={styles.backButton}>
                         <i className="fas fa-arrow-left"></i> Listeye Geri Dön
                     </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Başarı Mesajı */}
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {/* Hata Mesajı */}
                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}> <label htmlFor="firstName">Ad *</label> <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required /> </div>
                        <div className={styles.formGroup}> <label htmlFor="lastName">Soyad *</label> <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required /> </div>
                    </div>
                    <div className={styles.formRow}>
                         <div className={styles.formGroup}> <label htmlFor="phone">Telefon (05XX...)*</label> <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="05XX XXX XX XX"/> </div>
                         <div className={styles.formGroup}> <label htmlFor="email">E-posta</label> <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} /> </div>
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

                    <div style={{textAlign: 'right', marginTop: '30px'}}>
                        <button type="submit" className={styles.button} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}>
                            {/* Yükleme durumuna göre buton metni */}
                            {isLoading && firstName ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
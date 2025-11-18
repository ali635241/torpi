'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import styles from '../register/register.module.css'; // Stil dosyasını register'dan alıyor
import api from '../../../lib/api'; 

// --- Sahte Firma Verisi ---
const mockCompanyData = {
    companyName: "Örnek Servis A.Ş.",
    taxNumber: "1234567890",
    authorizedPerson: "Servet Sahibi",
    email: "admin@ornekservis.com",
    phone: "0500 111 2233",
    city: "İstanbul",
    district: "Kadıköy",
    addressDetail: "Örnek Mah. Test Sok. No:1 D:2", 
    logoUrl: "/images/logo.jpg" 
};
const mockCities = [ { id: 6, name: "Ankara" }, { id: 34, name: "İstanbul" }, { id: 35, name: "İzmir" } ];
const mockDistricts = { 34: ["Kadıköy", "Beşiktaş", "Şişli"], 6: ["Çankaya", "Yenimahalle"], 35: ["Konak", "Bornova"] };
// --- Sahte Veri Sonu ---


export default function ServiceSettingsPage() {
    const router = useRouter();

    // --- State'ler ---
    const [companyName, setCompanyName] = useState('');
    const [taxNumber, setTaxNumber] = useState(''); 
    const [authorizedPerson, setAuthorizedPerson] = useState('');
    const [email, setEmail] = useState(''); 
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [logoFile, setLogoFile] = useState(null); 
    const [logoPreview, setLogoPreview] = useState(mockCompanyData.logoUrl); 
    const fileInputRef = useRef(null); 
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // --- Veri Yükleme (SİMÜLASYON) ---
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/service/login'); return; }
        
        console.log("--- SİMÜLASYON: Firma ayarları yükleniyor ---");
        setCompanyName(mockCompanyData.companyName);
        setTaxNumber(mockCompanyData.taxNumber);
        setAuthorizedPerson(mockCompanyData.authorizedPerson);
        setEmail(mockCompanyData.email);
        setPhone(mockCompanyData.phone);
        setCity(mockCompanyData.city);
        setDistrict(mockCompanyData.district);
        setAddressDetail(mockCompanyData.addressDetail || '');
        setLogoPreview(mockCompanyData.logoUrl || '/images/default-logo.png');
        setIsLoading(false);
    }, [router]);

    // --- Logo Seçme Fonksiyonu ---
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setError(null); 
        if (!['image/jpeg', 'image/png'].includes(file.type)) { setError('Geçersiz dosya formatı. Lütfen JPG veya PNG seçin.'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('Dosya boyutu en fazla 5MB olabilir.'); return; }
        setLogoFile(file); 
        const reader = new FileReader();
        reader.onloadend = () => { setLogoPreview(reader.result); };
        reader.readAsDataURL(file);
    };

    // --- Logo Yükleme Simülasyonu ---
    const handleLogoUpload = async (file) => {
        if (!file) return true; 
        console.log(`--- SİMÜLASYON: Logo Yükleme İsteği: ${file.name} ---`);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        console.log("--- SİMÜLASYON: Logo başarıyla yüklendi ---");
        mockCompanyData.logoUrl = logoPreview; 
        return true; 
    };

    // --- Form Gönderim (Simülasyonlu) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        setIsLoading(true);

        if (!companyName || !authorizedPerson || !email || !phone || !city || !district) {
            setError('Lütfen tüm zorunlu (*) alanları doldurun.');
            setIsLoading(false);
            return;
        }
        
        const logoUploadSuccess = await handleLogoUpload(logoFile);
        if (!logoUploadSuccess) {
             setError("Logo yüklenirken bir hata oluştu.");
             setIsLoading(false);
             return;
        }

        const updatedSettingsData = { companyName, authorizedPerson, email, phone, city, district, addressDetail };
        console.log("--- SİMÜLASYON: Firma Ayarları Güncelleme İsteği ---");
        console.log(updatedSettingsData);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        console.log("--- SİMÜLASYON: Ayarlar güncellendi. ---");
        setSuccessMessage('Firma bilgileri ve logo başarıyla güncellendi (Simülasyon).');
        setIsLoading(false);
        Object.assign(mockCompanyData, updatedSettingsData);
        setLogoFile(null); 
    };

    // --- Render ---
    if (isLoading && !companyName) { return <div className={styles.loading}>Ayarlar Yükleniyor...</div>; }
   
    return (
        <div className={styles.container}> 
            <div className={styles.form} style={{maxWidth: '800px'}}> 
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <h2 className={styles.title} style={{marginBottom: 0, textAlign:'left'}}>Firma Ayarları</h2>
                     <Link href="/service/dashboard" className={styles.backButton}> 
                         <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
                     </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    <h3 className={styles.formSectionTitle}>Firma Bilgileri</h3>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}> <label htmlFor="companyName">Firma Adı *</label> <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required /> </div>
                        <div className={styles.formGroup}> <label htmlFor="taxNumber">Vergi Numarası (Değiştirilemez)</label> <input type="text" id="taxNumber" value={taxNumber} readOnly disabled className={styles.disabledInput}/> </div>
                    </div>
                     <div className={styles.formRow}>
                         <div className={styles.formGroup}>
                             <label>Firma Logosu</label>
                             <div className={styles.logoUploadArea}>
                                 <Image 
                                    src={logoPreview} 
                                    alt="Firma Logosu Önizleme" 
                                    width={80} 
                                    height={80} 
                                    className={styles.currentLogo} 
                                 />
                                 <input 
                                    type="file" 
                                    id="logoFile" 
                                    ref={fileInputRef} 
                                    onChange={handleLogoChange} 
                                    className={styles.fileInput} 
                                    accept="image/png, image/jpeg" 
                                 /> 
                                 {/* === DÜZELTME: Sadece .uploadButton sınıfı === */}
                                 <button 
                                    type="button" 
                                    className={styles.uploadButton} 
                                    onClick={() => fileInputRef.current?.click()} 
                                    disabled={isLoading}
                                 >
                                     Logoyu Değiştir
                                 </button>
                                 {/* === DÜZELTME SONU === */}
                                 {logoFile && <span className={styles.fileNameText}>Seçilen dosya: {logoFile.name}</span>}
                             </div>
                         </div>
                     </div>

                     <h3 className={styles.formSectionTitle}>Yetkili Bilgileri</h3>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}> <label htmlFor="authPerson">Yetkili Adı Soyadı *</label> <input type="text" id="authPerson" value={authorizedPerson} onChange={e => setAuthorizedPerson(e.target.value)} required /> </div>
                    </div>
                    <div className={styles.formRow}>
                         <div className={styles.formGroup}> <label htmlFor="email">E-posta (Giriş için) *</label> <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required /> </div>
                         <div className={styles.formGroup}> <label htmlFor="phone">Telefon (05XX...)*</label> <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="05XX XXX XX XX"/> </div> 
                    </div>

                    <h3 className={styles.formSectionTitle}>Adres Bilgileri</h3>
                     <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="city">İl *</label>
                            <select id="city" value={city} onChange={e => { setCity(e.target.value); setDistrict(''); }} required> 
                                <option value="">İl Seçiniz...</option>
                                {mockCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="district">İlçe *</label>
                            <select id="district" value={district} onChange={e => setDistrict(e.target.value)} required disabled={!city}>
                                <option value="">Önce İl Seçiniz...</option>
                                {city && mockDistricts[mockCities.find(c => c.name === city)?.id]?.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className={styles.formRow}>
                         <div className={styles.formGroup} style={{flexBasis: '100%'}}> 
                            <label htmlFor="addressDetail">Adres Detayı</label> 
                            <textarea id="addressDetail" rows={3} value={addressDetail} onChange={e => setAddressDetail(e.target.value)} placeholder="Mahalle, Sokak, No, Daire..."></textarea>
                        </div>
                    </div>

                    <div style={{textAlign: 'right', marginTop: '30px'}}> 
                        <button type="submit" className={styles.button} disabled={isLoading} style={{width: 'auto', padding: '14px 30px'}}> 
                            {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
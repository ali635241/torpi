'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './register.module.css'; // CSS modülümüz

// Sahte İl/İlçe verisi (İleride API'den çekilebilir)
const mockCities = [ { id: 6, name: "Ankara" }, { id: 34, name: "İstanbul" }, { id: 35, name: "İzmir" }, /* ... diğerleri ... */ ];
const mockDistricts = { 34: ["Kadıköy", "Beşiktaş", "Şişli"], 6: ["Çankaya", "Yenimahalle"], 35: ["Konak", "Bornova"] }; // İzmir eklendi

export default function ServiceRegisterPage() {
    const router = useRouter();

    // --- State'ler ---
    const [companyName, setCompanyName] = useState(''); // Firma adı
    const [taxNumber, setTaxNumber] = useState(''); // Vergi no
    const [authorizedPerson, setAuthorizedPerson] = useState(''); // Yetkili kişi
    const [email, setEmail] = useState(''); // E-posta
    const [phone, setPhone] = useState(''); // Telefon
    const [password, setPassword] = useState(''); // Şifre
    const [passwordConfirm, setPasswordConfirm] = useState(''); // Şifre tekrar
    const [city, setCity] = useState(''); // İl
    const [district, setDistrict] = useState(''); // İlçe
    const [termsAccepted, setTermsAccepted] = useState(false); // KVKK onayı

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // --- Frontend Validasyon ---
        if (password !== passwordConfirm) {
            setError('Şifreler uyuşmuyor.');
            return;
        }
        if (!termsAccepted) {
            setError('Devam etmek için KVKK ve Hizmet Şartları\'nı onaylamalısınız.');
            return;
        }

        setIsLoading(true);

        const registrationData = { companyName, taxNumber, authorizedPerson, email, phone, password, city, district };

        // --- SİMÜLASYON ---
        console.log("--- SİMÜLASYON: Servis Firması Kayıt İsteği ---");
        console.log(registrationData);
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("--- SİMÜLASYON: Kayıt başarılı. Doğrulama sayfasına yönlendiriliyor... ---");
        router.push(`/service/verify?contact=${encodeURIComponent(email)}`); // E-postayı URL'e uygun kodla
    };

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}>
                <div className={styles.logoIcon}><i className="fas fa-tools"></i></div>
                <div className={styles.logoText}>TORPİDODA - Servis Paneli</div>
            </Link>

            <h2 className={styles.title}>Servis Kaydı Oluştur</h2>
            <p className={styles.subtitle}>İşletmenizi dijitale taşıyın, müşteri ve işlem yönetiminizi kolaylaştırın.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formRow}>
                    <div className={styles.formGroup}> <label htmlFor="companyName">Firma Adı *</label> <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required /> </div>
                    <div className={styles.formGroup}> <label htmlFor="taxNumber">Vergi Numarası *</label> <input type="text" id="taxNumber" value={taxNumber} onChange={e => setTaxNumber(e.target.value)} required /> </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}> <label htmlFor="authPerson">Yetkili Adı Soyadı *</label> <input type="text" id="authPerson" value={authorizedPerson} onChange={e => setAuthorizedPerson(e.target.value)} required /> </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}> <label htmlFor="email">E-posta *</label> <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required /> </div>
                    <div className={styles.formGroup}> <label htmlFor="phone">Telefon (05XX...)*</label> <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="05XX XXX XX XX"/> </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="city">İl *</label>
                        <select id="city" value={city} onChange={e => { setCity(e.target.value); setDistrict(''); }} required> {/* İl değişince ilçeyi sıfırla */}
                            <option value="">İl Seçiniz...</option>
                            {mockCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="district">İlçe *</label>
                        <select id="district" value={district} onChange={e => setDistrict(e.target.value)} required disabled={!city}>
                            <option value="">Önce İl Seçiniz...</option>
                            {/* Seçilen ile göre ilçeleri filtrele */}
                            {city && mockDistricts[mockCities.find(c => c.name === city)?.id]?.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                 <div className={styles.formRow}>
                    <div className={styles.formGroup}> <label htmlFor="password">Şifre *</label> <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required /> </div>
                    <div className={styles.formGroup}> <label htmlFor="passwordConfirm">Şifre Tekrar *</label> <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required /> </div>
                </div>

                <div className={styles.checkboxGroup}>
                    <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                    {/* Linkleri ekleyelim (Bu sayfalar henüz yok) */}
                    <label htmlFor="terms"><Link href="/legal/kvkk" target="_blank">KVKK Aydınlatma Metni</Link>'ni ve <Link href="/legal/terms" target="_blank">Hizmet Şartları</Link>'nı okudum, anladım ve kabul ediyorum.</label>
                </div>

                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
                </button>
            </form>
            <div className={styles.footerText}>
                Zaten bir hesabınız var mı?
                <Link href="/service/login" className={styles.link}> Giriş Yap</Link> {/* Servis login'e link */}
            </div>
        </div>
    );
}
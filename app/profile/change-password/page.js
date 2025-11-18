'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api'; // ../../../lib/api yolu düzeltildi
import styles from './changePassword.module.css'; // Yeni CSS modülümüz

export default function ChangePasswordPage() {
  const router = useRouter();

  // --- Form State'leri ---
  // API dokümanına göre [cite: 163-168]
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // --- UI State'leri ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // --- Rota Koruma ---
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    // --- Frontend Validasyon ---
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setError('Lütfen tüm şifre alanlarını doldurun.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }
    // API şifre kurallarını burada da kontrol edebiliriz (örn: min 8 karakter)
    if (newPassword.length < 8) {
        setError('Yeni şifre en az 8 karakter olmalıdır.');
        return;
    }

    setIsLoading(true);

    const passwordData = {
      currentPassword,
      newPassword,
      newPasswordConfirm, // API bunu istiyor [cite: 167]
    };

    // --- SİMÜLASYON (CORS Hatası nedeniyle) ---
    console.log(`--- SİMÜLASYON: Şifre Değiştirme isteği ---`);
    console.log({ currentPassword: '***', newPassword: '***', newPasswordConfirm: '***' }); // Şifreleri loglama

    await new Promise(resolve => setTimeout(resolve, 1000)); // Sahte gecikme

    // Simülasyon: Mevcut şifre kontrolü (Normalde API yapar)
    if (currentPassword === "yanlisMevcutSifre") { // Test için yanlış şifre durumu
        console.log('--- SİMÜLASYON: Mevcut şifre hatalı ---');
        setError("Mevcut şifreniz hatalı.");
        setIsLoading(false);
        return;
    }

    console.log('--- SİMÜLASYON: Şifre değiştirildi! ---');
    setSuccessMessage('Şifreniz başarıyla değiştirildi.');
    // Formu temizle
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setIsLoading(false);
    // İsteğe bağlı: Kullanıcıyı profile geri yönlendir
    // setTimeout(() => router.push('/profile'), 2000);

    /*
    // --- ORİJİNAL (CORS HATASI VERECEK) KOD ---
    // Backend CORS'u düzeltince bu açılmalı.
    try {
        await api.post('/auth/change-password', passwordData);
        setSuccessMessage('Şifreniz başarıyla değiştirildi.');
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
        // İsteğe bağlı yönlendirme
        // setTimeout(() => router.push('/profile'), 2000);
    } catch (err) {
        console.error("Şifre değiştirme hatası:", err);
        // API'den gelen hatayı göster (örn: 401 Mevcut şifre hatalı [cite: 174-178])
        setError(err.message || "Şifre değiştirilirken bir hata oluştu.");
    } finally {
        setIsLoading(false);
    }
    */
  };

  return (
    // Profil sayfası stillerine benzer
    <div className={`${styles.changePasswordContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Şifre Değiştir</h1>
         <Link href="/profile" className={styles.backButton}>
             <i className="fas fa-arrow-left"></i> Profile Geri Dön
         </Link>
      </div>


      <form onSubmit={handleSubmit} className={styles.form}>

        {/* Başarı Mesajı */}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {/* Hata Mesajı */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Mevcut Şifre */}
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Mevcut Şifre *</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Mevcut şifrenizi girin"
          />
        </div>

        {/* Yeni Şifre */}
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">Yeni Şifre *</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Yeni şifrenizi girin (en az 8 karakter)"
          />
           {/* Opsiyonel: Şifre gücü göstergesi eklenebilir */}
        </div>

        {/* Yeni Şifre Tekrar */}
        <div className={styles.formGroup}>
          <label htmlFor="newPasswordConfirm">Yeni Şifre (Tekrar) *</label>
          <input
            type="password"
            id="newPasswordConfirm"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
            placeholder="Yeni şifrenizi tekrar girin"
          />
           {/* Opsiyonel: Şifre eşleşme kontrolü eklenebilir */}
           {newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm && (
               <p className={styles.passwordMismatchError}>Yeni şifreler eşleşmiyor!</p>
           )}
        </div>

        {/* Buton */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
          </button>
        </div>
      </form>
    </div>
  );
}
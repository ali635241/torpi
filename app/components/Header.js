'use client'; 

import Link from 'next/link';
import Image from 'next/image'; 
import styles from './Header.module.css';
import { useState, useEffect, useRef } from 'react'; 
import { useRouter } from 'next/navigation'; 

export default function Header() {
  const router = useRouter(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const menuRef = useRef(null); 
  let hoverTimeout = null; 

  // Giriş durumunu kontrol et
  useEffect(() => {
    const checkLoginStatus = () => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token); 
    };
    checkLoginStatus();
    window.addEventListener('popstate', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus); 
    return () => {
        window.removeEventListener('popstate', checkLoginStatus);
        window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Dışarı tıklamayı dinle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside); 
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]); 

  // Çıkış Yap
  const handleLogout = () => { 
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false); 
      setIsDropdownOpen(false); 
      router.push('/login'); 
  };
  
  // Masaüstü Hover Fonksiyonları
  const handleMouseEnter = () => {
      if (window.innerWidth >= 769) { 
          clearTimeout(hoverTimeout); 
          setIsDropdownOpen(true);
      }
  };
  const handleMouseLeave = () => {
      if (window.innerWidth >= 769) { 
          hoverTimeout = setTimeout(() => {
              setIsDropdownOpen(false);
          }, 200); 
      }
  };

  // Mobil/Desktop Tıklama Fonksiyonu
  const handleToggleClick = () => {
      clearTimeout(hoverTimeout); 
      setIsDropdownOpen(prev => !prev); 
  };


  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* === LOGO LİNKİ GÜNCELLENDİ === */}
        <Link href="/" className={styles.logo}> {/* <<< HER ZAMAN ANA SAYFAYA GİTSİN */}
            <Image src="/images/logo.jpg" alt="Torpidoda Logo" width={35} height={35} className={styles.logoImage} priority />
            <span>TORPİDODA</span>
        </Link>
        {/* === LİNK SONU === */}
        
        {/* Navigasyon Linkleri */}
        <div className={styles.navLinks}>
          <Link href="/">Ana Sayfa</Link>
          <Link href="/#features">Özellikler</Link>
          {isLoggedIn && <Link href="/dashboard">Kontrol Paneli</Link>}
          
        </div>
        
        {/* Sağ Buton/Menü Alanı */}
        <div className={styles.loginBtn} ref={menuRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {isLoggedIn ? (
            // Giriş Yapılmışsa
            <>
              <button className={styles.profileButton} onClick={handleToggleClick}>
                <i className="fas fa-user-circle"></i> Profilim 
                <i className={`fas ${isDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ${styles.chevronIcon}`}></i> 
              </button>
              <div className={`${styles.loginDropdown} ${isDropdownOpen ? styles.active : ''}`}>
                <Link href="/diagnostics" onClick={() => setIsDropdownOpen(false)}> <i className="fas fa-brain"></i> Arıza Analizi </Link>
                <Link href="/reminders" onClick={() => setIsDropdownOpen(false)}> <i className="fas fa-bell"></i> Hatırlatmalar </Link>
                <Link href="/profile" onClick={() => setIsDropdownOpen(false)}> <i className="fas fa-user-edit"></i> Profili Düzenle </Link>
                <button onClick={handleLogout} className={styles.logoutLink}> <i className="fas fa-sign-out-alt"></i> Çıkış Yap </button>
              </div>
            </>
          ) : (
            // Giriş Yapılmamışsa
            <Link href="/login" className={styles.loginButtonMain}> <i className="fas fa-sign-in-alt"></i> Giriş Yap </Link>
          )}
        </div>
      </div>
    </header>
  );
}
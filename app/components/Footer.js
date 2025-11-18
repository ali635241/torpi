// app/components/Footer.js (TAM KOD)

import Link from 'next/link';
// CSS modülünü import ettiğimizden emin olalım
import styles from './Footer.module.css'; 

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h3>TORPİDODA</h3>
          {/* Stil orijinal HTML'de yoktu, inline veya CSS modülünden gelebilir */}
          <p style={{ color: 'var(--gray-300, #cbd5e1)', marginTop: '20px', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Araç ve belge yönetiminde modern çözümler sunan platform
          </p>
        </div>
        
        <div className={styles.footerColumn}>
          <h3>Bağlantılar</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/"><i className="fas fa-home"></i> Ana Sayfa</Link></li>
            {/* Bu sayfalar henüz yok ama linkleri kalabilir */}
            <li><Link href="/about"><i className="fas fa-info-circle"></i> Hakkımızda</Link></li> 
            <li><Link href="/#features"><i className="fas fa-star"></i> Özellikler</Link></li>
            <li><Link href="/blog"><i className="fas fa-newspaper"></i> Blog</Link></li>
            {/* --- YENİ LİNK --- */}
            <li> 
                <Link href="/service/login"> 
                    <i className="fas fa-tools"></i> Servis Girişi 
                </Link> 
            </li>
            {/* --- YENİ LİNK SONU --- */}
          </ul>
        </div>
        
        <div className={styles.footerColumn}>
          <h3>Yasal</h3>
          <ul className={styles.footerLinks}>
             {/* Bu sayfalar henüz yok ama linkleri kalabilir */}
            <li><Link href="/legal/kvkk"><i className="fas fa-shield-alt"></i> KVKK</Link></li>
            <li><Link href="/legal/terms"><i className="fas fa-file-contract"></i> Kullanım Şartları</Link></li>
            <li><Link href="/legal/privacy"><i className="fas fa-lock"></i> Gizlilik Politikası</Link></li>
            <li><Link href="/legal/cookies"><i className="fas fa-cookie-bite"></i> Çerez Politikası</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerColumn}>
          <h3>İletişim</h3>
          {/* İletişim bilgilerini uygun şekilde güncelle */}
          <ul className={styles.footerLinks}>
            <li><a href="#"><i className="fas fa-map-marker-alt"></i> Eskişehir, Türkiye</a></li> {/* Lokasyonu güncelledim */}
            <li><a href="tel:+90XXXXXXXXXX"><i className="fas fa-phone"></i> +90 536 669 09 21</a></li> {/* Telefon numarasını gir */}
            <li><a href="mailto:info@torpidoda.com"><i className="fas fa-envelope"></i> info@torpidoda.com</a></li> {/* E-posta adresini gir */}
            {/* WhatsApp linkini ekle */}
            <li><a href="https://wa.me/90XXXXXXXXXX" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i> WhatsApp Destek</a></li> 
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        &copy; {new Date().getFullYear()} Torpidoda. Tüm hakları saklıdır. {/* Yılı dinamik yap */}
         {/* | <Link href="/service/login" className={styles.footerBottomLink}>Servis Paneli</Link> */}
      </div>
    </footer>
  );
}
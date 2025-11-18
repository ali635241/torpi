// app/page.js (TAM KOD - Parallax YOK - Tüm Bölümler DAHİL)

import Link from 'next/link';
import Image from 'next/image'; 
import styles from './page.module.css'; 

export default function HomePage() {
  return (
    // globals.css'deki .pageContainer'ın animasyonunu iptal etmek için
    <div style={{animation: 'none'}}>
      
      {/* === BÖLÜM 1: Torpidoda ile Tanışın (Tasarım 1) === */}
      <section className={`${styles.heroSection} ${styles.hero1}`}>
        <video 
          src="/videos/hero-mechanic.mp4" // Motor videosu
          autoPlay loop muted playsInline 
          className={styles.heroVideo}
        />
        {/* videoOverlay kaldırıldı */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Torpidoda ile Tanışın</h1>
          <p className={styles.heroSubtitle}>
            Aracını Tek Panelden Yönet, Belgelerini Güvenle Sakla, Aracının Değerini Koru
          </p>
          <p className={styles.heroDescription}>
            Kağıt evraklardan kurtul. Veri paylaşımını güvenli hale getir. İş verimliliğini %40 artır.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/register" className={styles.buttonOutline}>
                Başlayın
            </Link>
            <Link href="#section2" className={styles.buttonTransparent}>
                Daha Fazla
            </Link>
          </div>
        </div>
      </section>
      {/* === BÖLÜM 1 SONU === */}


      {/* === BÖLÜM 2: Araçlarını Ekle (Tasarım 2) === */}
      <section className={`${styles.heroSection} ${styles.hero2}`} id="section2">
        <video 
          src="/videos/hero-traffic.mp4" // Kavşak videosu
          autoPlay loop muted playsInline 
          className={styles.heroVideo}
        />
        {/* videoOverlay kaldırıldı */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Araçlarını Kolayca Ekleyebilir ve Yönetebilirsiniz</h1>
          <p className={styles.heroSubtitle}>Hatırlatılmasını istediğiniz tarihleri seçebilirsiniz</p>
        </div>
        <div className={styles.heroImageContainer}>
            <Image
                src="/images/dashboard-preview.png" // Dashboard önizlemesi
                alt="Dashboard Önizleme"
                width={900} 
                height={580} 
                className={styles.heroDashboardImage}
                priority
            />
        </div>
      </section>
      {/* === BÖLÜM 2 SONU === */}
      
      
      {/* === BÖLÜM 3: İçerik Bölümü (KAYBOLAN KISIMLAR) === */}
      {/* Normal içerik akışı */}
      
      {/* Features Section */}
      <section className={styles.section} id="features">
        <div className={styles.sectionTitle}>
          <div className={styles.sectionSubtitle}>Özelliklerimiz</div>
          <h2 className={styles.sectionMainTitle}>Torpidoda Neler Sunuyor?</h2>
          <p className={styles.sectionDescription}>Hem bireysel araç sahipleri hem de servisler için tasarlanmış modern çözümler.</p>
        </div>
        <div className={styles.featuresGrid}>
          {/* Tüm 6 özellik kartı */}
          <div className={styles.featureCard}><div className={styles.featureIcon}><i className="fas fa-car"></i></div><div className={styles.featureContent}><h3 className={styles.featureTitle}>Araç Yönetimi</h3><p className={styles.featureDescription}>Araç ekleme, düzenleme, plaka ve şase numarası ile araç takibi, muayene ve sigorta takibi.</p></div></div>
          <div className={styles.featureCard}><div className={styles.featureIcon}><i className="fas fa-file-pdf"></i></div><div className={styles.featureContent}><h3 className={styles.featureTitle}>Belge Yönetimi</h3><p className={styles.featureDescription}>Ekspertiz, sigorta, kasko ve muayene belgelerini güvenli şekilde yükleme ve yönetme.</p></div></div>
          <div className={styles.featureCard}><div className={styles.featureIcon}><i className="fas fa-bell"></i></div><div className={styles.featureContent}><h3 className={styles.featureTitle}>Akıllı Hatırlatıcılar</h3><p className={styles.featureDescription}>Muayene, sigorta ve bakım tarihleri için SMS, e-posta ve uygulama içi bildirimler.</p></div></div>
          <div className={styles.featureCard}><div className={styles.featureIcon}><i className="fas fa-star-half-alt"></i></div><div className={styles.featureContent}><h3 className={styles.featureTitle}>Araç Puanı Sistemi</h3><p className={styles.featureDescription}>Geçmiş bakım, km ve arıza verilerine dayalı 0-100 arası otomatik puanlama ile aracınızın kondisyonunu görün.</p></div></div>
          <div className={styles.featureCard}><div className={styles.featureIcon}><i className="fas fa-brain"></i></div><div className={styles.featureContent}><h3 className={styles.featureTitle}>AI Arıza Analizi</h3><p className={styles.featureDescription}>Aracınızdaki sorunu (örn: "Fren sesi") yazın, yapay zekâ muhtemel nedenleri ve önerileri anında analiz etsin.</p></div></div>
          <div className={styles.featureCard}><div className={styles.featureIcon}><i className="fas fa-user-cog"></i></div><div className={styles.featureContent}><h3 className={styles.featureTitle}>Güvenli Profil</h3><p className={styles.featureDescription}>Telefon doğrulamalı güvenli kayıt, giriş ve profil yönetimi ile KVKK uyumlu hesap yönetimi.</p></div></div>
        </div>
      </section>

      {/* "Nasıl Çalışır?" Bölümü */}
      <section className={`${styles.section} ${styles.howItWorksSection}`}>
            <div className={styles.sectionTitle}>
                <div className={styles.sectionSubtitle}>Kolay Başlangıç</div>
                <h2 className={styles.sectionMainTitle}>Sadece 3 Adımda Başlayın</h2>
            </div>
            <div className={styles.howItWorksGrid}>
                <div className={styles.howCard}><div className={styles.howIcon}><i className="fas fa-user-plus"></i><span>1</span></div><h3>Hesap Oluşturun</h3><p>Güvenli telefon doğrulaması ile saniyeler içinde ücretsiz hesabınızı oluşturun.</p></div>
                <div className={styles.howCard}><div className={styles.howIcon}><i className="fas fa-car-side"></i><span>2</span></div><h3>Aracınızı Ekleyin</h3><p>Plaka, model, muayene/sigorta tarihleri gibi temel bilgileri girerek aracınızı kaydedin.</p></div>
                <div className={styles.howCard}><div className={styles.howIcon}><i className="fas fa-tachometer-alt"></i><span>3</span></div><h3>Keyfini Çıkarın</h3><p>Belgelerinizi yükleyin, hatırlatıcıları ayarlayın ve aracınızın puanını takip edin. Gerisini biz hallederiz!</p></div>
            </div>
      </section>

      

      {/* Servis Paneli CTA Bölümü */}
      <section className={styles.serviceCtaSection}>
          <div className={styles.serviceCtaContent}>
              <i className="fas fa-tools"></i>
              <h2>Servis Sahibi veya İşletme misiniz?</h2>
              <p>Müşteri randevularınızı, iş emirlerinizi, parça ve işçilik kayıtlarınızı yönetmek için Servis Panelimizi keşfedin.</p>
              <Link href="/service/register" className={styles.serviceCtaButton}>
                  Servis Kaydı Oluşturun
              </Link>
          </div>
      </section>
      {/* === BÖLÜM 3 SONU === */}

    </div>
  );
}
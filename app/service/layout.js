// app/service/layout.js (TAM KOD - State ve Toggle Eklendi)
'use client'; // useState kullanacağımız için Client Component olmalı

import { useState } from 'react'; // useState import edildi
import Sidebar from './components/Sidebar'; 
import styles from './layout.module.css'; 

export default function ServiceLayout({ children }) {
  // --- YENİ: Sidebar'ın açık/kapalı durumunu tutan state ---
  // Varsayılan olarak açık (true) başlasın
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- YENİ: Sidebar durumunu değiştiren fonksiyon ---
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // --- YENİ KISIM SONU ---

  return (
    // Ana kapsayıcıya sidebar durumunu belirten bir class ekleyelim (opsiyonel ama faydalı olabilir)
    <div className={`${styles.serviceLayout} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}> 
      {/* Sidebar'a state'i ve toggle fonksiyonunu prop olarak geçirelim */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 

      {/* Ana içerik alanına da duruma göre class ekleyelim */}
      <main className={`${styles.mainContent} ${!isSidebarOpen ? styles.mainContentCollapsed : ''}`}> 
        {children} 
      </main>
    </div>
  );
}
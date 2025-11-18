'use client'; // <-- YENİ: Recharts tarayıcıda çalışır

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'; // <-- YENİ: Grafik bileşenleri import edildi
import api from '../../../lib/api'; 
import styles from './analytics.module.css'; 

// --- Sahte Analitik Verisi ---
const mockAnalyticsData = {
  totalRevenueMonthly: 15200.50,
  totalCostMonthly: 8750.00,
  jobDistribution: [ 
    { name: "Periyodik Bakım", count: 25 }, // 'type' -> 'name' olarak değiştirmek Recharts için daha kolay
    { name: "Fren Onarımı", count: 12 },
    { name: "Lastik Değişimi", count: 8 },
    { name: "Arıza Tespiti", count: 5 },
    { name: "Diğer", count: 10 },
  ],
  topTechnicians: [ 
      { name: "Mehmet Usta", completedJobs: 35 },
      { name: "Ahmet Usta", completedJobs: 28 },
      { name: "Ali Teknisyen", completedJobs: 15 }, // Bir kişi daha ekleyelim
  ],
  popularModels: [ 
      { model: "Toyota Corolla", count: 15 },
      { model: "Honda Civic", count: 10 },
      { model: "Ford Focus", count: 8 },
  ],
  supplyDistribution: { 
      inside: 65,
      outside: 35
  }
};
// PieChart için sahte veri (Tedarik Dağılımı)
const supplyPieData = [
    { name: 'İçeriden (Servis)', value: mockAnalyticsData.supplyDistribution.inside },
    { name: 'Dışarıdan (Müşteri)', value: mockAnalyticsData.supplyDistribution.outside },
];
// Pasta Grafiği Renkleri
const COLORS = ['#0284c7', '#f59e0b']; // Ana Mavi ve Turuncu

// --- Sahte Veri Sonu ---


export default function ServiceAnalyticsPage() {
  const router = useRouter();

  // --- State'ler ---
  const [analyticsData, setAnalyticsData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  // --- Veri Çekme (SİMÜLASYON) ---
  useEffect(() => {
    // Token Kontrolü
    const token = localStorage.getItem('accessToken'); 
    if (!token) { router.push('/service/login'); return; }

    // Sahte Veriyi Yükle
    console.log("--- SİMÜLASYON: Servis Analitik verisi yükleniyor ---");
    setAnalyticsData(mockAnalyticsData);
    setIsLoading(false);

  }, [router]);


  // --- Render ---
  if (isLoading) { return <div className={styles.loading}>Raporlar Yükleniyor...</div>; }
  if (error) { return ( <div className={styles.loading}> Hata: {error} <p><Link href="/service/login">Tekrar giriş yapmayı deneyin.</Link></p> </div> ); }
  if (!analyticsData) { return <div className={styles.loading}>Analiz verisi bulunamadı.</div>; }

   const profitMonthly = analyticsData.totalRevenueMonthly - analyticsData.totalCostMonthly;


  return (
    <div className={`${styles.analyticsContainer} pageContainer`}> 
      {/* Sayfa Başlığı ve Geri Butonu */}
      <div className={styles.header}>
         <div className={styles.headerLeft}>
             <h1 className={styles.title}>Raporlar ve Analitik</h1>
             <Link href="/service/dashboard" className={styles.backButton}>
                 <i className="fas fa-arrow-left"></i> Kontrol Paneline Dön
             </Link>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Analitik Kartları Grid */}
      <div className={styles.gridContainer}>
          
          {/* Gelir/Gider Kartı (Aynı) */}
          <div className={styles.reportCard}>
              <h3 className={styles.cardTitle}><i className="fas fa-lira-sign"></i> Aylık Finansal Özet</h3>
              <div className={styles.financialSummary}>
                  <div><span>Toplam Gelir:</span> <strong>{analyticsData.totalRevenueMonthly.toLocaleString('tr-TR', {style:'currency', currency:'TRY'})}</strong></div>
                  <div><span>Toplam Gider:</span> <strong>{analyticsData.totalCostMonthly.toLocaleString('tr-TR', {style:'currency', currency:'TRY'})}</strong></div>
                  <hr/>
                   <div className={profitMonthly >= 0 ? styles.profit : styles.loss}>
                      <span>Net Kar/Zarar:</span> 
                      <strong>{profitMonthly.toLocaleString('tr-TR', {style:'currency', currency:'TRY'})}</strong>
                  </div>
              </div>
          </div>

          {/* === YENİ: İşlem Türü Dağılımı Kartı (Pasta Grafik) === */}
          <div className={styles.reportCard}>
              <h3 className={styles.cardTitle}><i className="fas fa-tasks"></i> İşlem Türü Dağılımı (Adet)</h3>
              {/* Grafik için container (Yükseklik gerekli) */}
              <div className={styles.chartContainer}> 
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={analyticsData.jobDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80} // Pasta dilimi kalınlığı
                              fill="#8884d8"
                              dataKey="count" // 'count' değerine göre
                              nameKey="name" // 'name' etiketine göre
                              label={(entry) => `${entry.name} (${entry.count})`} // Etiket formatı
                          >
                            {/* Renkler (isteğe bağlı) */}
                             {analyticsData.jobDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip /> {/* Üzerine gelince detay */}
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
          {/* === YENİ KISIM SONU === */}


           {/* === YENİ: Teknisyen Performansı Kartı (Bar Grafik) === */}
          <div className={styles.reportCard}>
              <h3 className={styles.cardTitle}><i className="fas fa-user-cog"></i> Teknisyen Performansı (Tamamlanan İş)</h3>
               <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart 
                            data={analyticsData.topTechnicians} 
                            layout="vertical" /* Dikey bar grafiği */
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                         >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" /> {/* X ekseni sayılar (iş sayısı) */}
                            <YAxis dataKey="name" type="category" width={100}/> {/* Y ekseni isimler */}
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completedJobs" fill="#8884d8" name="Tamamlanan İş" />
                        </BarChart>
                    </ResponsiveContainer>
               </div>
          </div>
          {/* === YENİ KISIM SONU === */}


            {/* Popüler Modeller Kartı (Liste olarak kalsın) */}
          <div className={styles.reportCard}>
              <h3 className={styles.cardTitle}><i className="fas fa-car"></i> En Çok İşlem Yapılan Modeller</h3>
               <ul className={styles.listSummary}>
                  {analyticsData.popularModels.map(item => (
                     <li key={item.model}><span>{item.model}:</span> <strong>{item.count}</strong></li>
                  ))}
              </ul>
          </div>

          {/* Parça Tedarik Dağılımı Kartı (Pasta Grafik) */}
           <div className={styles.reportCard}>
              <h3 className={styles.cardTitle}><i className="fas fa-box"></i> Parça Tedarik Kaynağı</h3>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                                data={supplyPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40} // Ortası boş (Donut chart)
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                label={(entry) => `${entry.name}: %${entry.value}`}
                            >
                                {supplyPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
          </div>
          
      </div>
    </div>
  );
}
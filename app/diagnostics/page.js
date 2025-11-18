'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './diagnostics.module.css';

// Basit simülasyon fonksiyonu
const simulateAIAnalysis = (problemDescription) => {
    // Anahtar kelimelere göre basit cevaplar (gerçek AI yerine)
    const lowerCaseDesc = problemDescription.toLowerCase();
    if (lowerCaseDesc.includes('fren') && lowerCaseDesc.includes('ses')) {
        return {
            possibleCauses: ["Fren balataları aşınmış olabilir.", "Fren disklerinde yamulma olabilir.", "Fren hidroliği seviyesi düşük olabilir."],
            recommendations: ["En kısa sürede bir servise fren sistemini kontrol ettirmeniz önerilir.", "Balata veya disk değişimi gerekebilir."]
        };
    } else if (lowerCaseDesc.includes('motor') && (lowerCaseDesc.includes('ışık') || lowerCaseDesc.includes('lamba'))) {
         return {
            possibleCauses: ["Motor sensörlerinden birinde arıza olabilir (örn: Oksijen sensörü).", "Ateşleme sisteminde sorun olabilir (buji, bobin).", "Yakıt sistemiyle ilgili bir problem olabilir."],
            recommendations: ["Aracınızı bir arıza tespit cihazına (diagnostik) bağlatarak hata kodunu öğrenmeniz önemlidir.", "Servis kontrolü gereklidir."]
        };
    } else if (lowerCaseDesc.includes('marş') && (lowerCaseDesc.includes('basmıyor') || lowerCaseDesc.includes('çalışmıyor'))) {
         return {
            possibleCauses: ["Akü zayıflamış veya bitmiş olabilir.", "Marş motorunda arıza olabilir.", "Kontak veya immobilizer sisteminde sorun olabilir."],
            recommendations: ["Akü voltajını kontrol edin veya ettirin.", "Marş motoru bağlantılarını kontrol edin.", "Eğer sorun devam ederse servise başvurun."]
        };
    } else {
        // Genel cevap
        return {
            possibleCauses: ["Sorunun kaynağını belirlemek için daha fazla bilgiye ihtiyaç var.", "Mekanik veya elektriksel bir sorun olabilir."],
            recommendations: ["Sorun devam ederse veya güvenlik riski oluşturuyorsa, aracınızı bir servise göstermeniz en doğrusudur."]
        };
    }
};


export default function DiagnosticsPage() {
  const router = useRouter();

  // --- State'ler ---
  const [problemDescription, setProblemDescription] = useState(''); // Kullanıcının girdiği metin
  const [analysisResult, setAnalysisResult] = useState(null); // Analiz sonucu
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // (Simülasyonda pek kullanılmayacak)

  // --- Rota Koruma ---
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); }
    // Sayfa yüklendiğinde başka bir işlem yapmaya gerek yok şimdilik
  }, [router]);

  // --- Form Gönderim (SİMÜLASYON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAnalysisResult(null); // Önceki sonucu temizle

    if (!problemDescription.trim()) { // Boşlukları temizleyip kontrol et
      setError('Lütfen araçta yaşadığınız sorunu açıklayın.');
      return;
    }

    setIsLoading(true);

    // --- SİMÜLASYON ---
    console.log(`--- SİMÜLASYON: Arıza Analizi İsteği ---`);
    console.log("Sorun:", problemDescription);

    await new Promise(resolve => setTimeout(resolve, 1500)); // Sahte AI düşünme süresi

    // Sahte analiz sonucunu al
    const result = simulateAIAnalysis(problemDescription);
    setAnalysisResult(result);

    console.log('--- SİMÜLASYON: Analiz tamamlandı! ---');
    setIsLoading(false);
  };

  return (
    <div className={`${styles.diagnosticsContainer} pageContainer`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Yapay Zekâ Destekli Arıza Analizi</h1>
         <Link href="/dashboard" className={styles.backButton}>
             <i className="fas fa-arrow-left"></i> Geri Dön
         </Link>
      </div>

      <p className={styles.description}>
        Aracınızda yaşadığınız sorunu aşağıdaki kutucuğa detaylı bir şekilde yazın.
        Yapay zekâ, belirtilere dayanarak muhtemel arıza nedenlerini ve önerileri listeleyecektir.
        <br /><strong>Not:</strong> Bu analiz sadece ön bilgilendirme amaçlıdır, kesin teşhis için servis kontrolü gereklidir.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="problem">Sorun Açıklaması *</label>
          <textarea
            id="problem"
            rows={5} // Metin alanı yüksekliği
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            required
            placeholder="Örn: Araç ilk çalıştırmada zorlanıyor ve beyaz duman atıyor. Fren yapınca direksiyonda titreme oluyor..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Analiz Ediliyor...' : 'Analiz Et'}
          </button>
        </div>
      </form>

      {/* Analiz Sonucu */}
      {analysisResult && (
        <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Analiz Sonucu</h2>
            <div className={styles.resultSection}>
                <h3><i className="fas fa-exclamation-circle"></i> Muhtemel Nedenler:</h3>
                <ul>
                    {analysisResult.possibleCauses.map((cause, index) => (
                        <li key={index}>{cause}</li>
                    ))}
                </ul>
            </div>
             <div className={styles.resultSection}>
                <h3><i className="fas fa-wrench"></i> Öneriler:</h3>
                 <ul>
                    {analysisResult.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </div>
             <p className={styles.disclaimer}>
                Unutmayın, bu sadece yapay zekâ tahminidir. Kesin arıza tespiti için lütfen yetkili bir servise danışın.
             </p>
        </div>
      )}

    </div>
  );
}
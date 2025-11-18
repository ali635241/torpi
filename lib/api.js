import axios from 'axios';

// 1. API'nin temel URL'i artık bizim kendi proxy adresimiz
const API_URL = '/api/proxy'; 

const api = axios.create({
  baseURL: API_URL, // YÖNLENDİRİLECEK ADRES
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Token Ekleme (Request Interceptor)
// (Bu kısım aynı kalıyor, token'ı her /api/proxy isteğine ekleyecek)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Hata Yönetimi (Response Interceptor)
// (Bu kısım da aynı kalıyor)
api.interceptors.response.use(
  (response) => response.data, // Sadece 'data' kısmını döndür
  (error) => {
    // API'den (proxy üzerinden) gelen gerçek hatalar
    const errorMessage = error.response?.data?.message || error.message || 'Bilinmeyen bir hata oluştu';

    if (error.response?.status === 401) { // Token geçersiz/süresi dolmuş
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // Müşteriyi login'e at
      }
    }
    // Hata mesajını component'in yakalayabilmesi için reject et
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
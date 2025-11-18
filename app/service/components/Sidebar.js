'use client';

import Link from 'next/link';
// Image importunu kaldırabiliriz, artık kullanılmıyor
// import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navLinks = [
    { href: '/service/dashboard', label: 'Kontrol Paneli', icon: 'fa-tachometer-alt' },
    { href: '/service/appointments', label: 'Randevular', icon: 'fa-calendar-alt' },
    { href: '/service/jobs', label: 'İş Emirleri', icon: 'fa-clipboard-list' },
    { href: '/service/customers', label: 'Müşteriler', icon: 'fa-users' },
    { href: '/service/employees', label: 'Çalışanlar', icon: 'fa-users-cog' },
    { href: '/service/inventory', label: 'Stok Yönetimi', icon: 'fa-boxes' }, // <-- YENİ EKLENDİ
    { href: '/service/analytics', label: 'Raporlar', icon: 'fa-chart-line' },
    { href: '/service/settings', label: 'Ayarlar', icon: 'fa-cog' },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
    const pathname = usePathname();

    return (
        <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>

            <div className={styles.logoArea}>
                 <Link href="/service/dashboard" className={styles.logoLink}>
                    {/* === İKON GERİ GELDİ === */}
                    <i className="fas fa-tools"></i>
                    {/* === İKON SONU === */}
                    {isOpen && <span>Servis Paneli</span>}
                 </Link>
                 <button onClick={toggleSidebar} className={styles.toggleButton} title={isOpen ? "Menüyü Daralt" : "Menüyü Genişlet"}>
                     <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                 </button>
            </div>

            {/* Navigasyon Linkleri */}
            <nav className={styles.nav}>
                <ul>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                    title={isOpen ? undefined : link.label}
                                >
                                    <i className={`fas ${link.icon}`}></i>
                                    {isOpen && <span>{link.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

        </aside>
    );
}
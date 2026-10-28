import type { Metadata } from 'next';
import './globals.css';
import JsonLd from '@/components/seo/JsonLd';
import { AuthProvider } from '@/context/AuthContext';
import MobileBottomBar from '@/components/layout/MobileBottomBar';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://autotiennghich.vercel.app'),
  title: {
    default: 'Tiên Nghịch Auto Mobile - Tool Cày Tự Động Game Tiên Nghịch Mobile Uy Tín #1',
    template: '%s | Tiên Nghịch Auto Mobile',
  },
  description:
    'Phần mềm Tool Auto Tiên Nghịch Mobile mới nhất v3.1.0 cho Android APK & Extension PC. Tự động rèn tiên khí & tăng cấp khí đỉnh, leo Thông Thiên Tháp, vượt Vực U Minh, đánh chiếm Cực Âm Địa, tự đi Ải Chính Tuyến 24/7 nhẹ máy an toàn 100%.',
  keywords: [
    'auto tiên nghịch mobile',
    'tool auto tiên nghịch mobile',
    'tiên nghịch mobile auto',
    'tool cày tự động tiên nghịch mobile',
    'auto tien nghich mobile',
    'tool auto tien nghich mobile',
    'tien nghich mobile auto',
    'tool cay tu dong tien nghich mobile',
    'auto tiên nghịch',
    'tool tiên nghịch',
    'auto rèn tiên khí',
    'auto cực âm địa',
    'auto leo tháp tiên nghịch',
    'tiên nghịch joyplay auto',
    'bản quyền tiên nghịch auto',
  ],
  authors: [{ name: 'Tiên Nghịch Auto Team', url: 'https://autotiennghich.vercel.app' }],
  creator: 'Tiên Nghịch Auto Team',
  publisher: 'Tiên Nghịch Auto Team',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://autotiennghich.vercel.app',
    siteName: 'Tiên Nghịch Auto Mobile',
    title: 'Tiên Nghịch Auto Mobile - Tool Cày Tự Động Game Tiên Nghịch Mobile Uy Tín #1',
    description:
      'Tải ngay Tool Auto Tiên Nghịch Mobile v3.1.0: Tự động rèn đồ, chiếm cực âm địa, leo tháp, ải chính tuyến. Nhận ngay 20 phút miễn phí mỗi ngày!',
    images: [
      {
        url: 'https://tiennghich-payos.onrender.com/download/preview.png',
        width: 1200,
        height: 630,
        alt: 'Tool Auto Tiên Nghịch Mobile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiên Nghịch Auto Mobile - Tool Cày Tự Động Game Tiên Nghịch Mobile',
    description:
      'Tool cày tự động game Tiên Nghịch Mobile tốt nhất 2026. Tự động rèn tiên khí & gom đá nâng khí đỉnh.',
    images: ['https://tiennghich-payos.onrender.com/download/preview.png'],
  },
  alternates: {
    canonical: 'https://autotiennghich.vercel.app',
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'Kko7eXvKx8n0qRXCitSV3bI5a_8-eBPE943p3jdjbDw',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="Kko7eXvKx8n0qRXCitSV3bI5a_8-eBPE943p3jdjbDw" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('tn_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body className="antialiased min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <AuthProvider>
          <div className="pb-16 md:pb-0 flex flex-col min-h-screen">
            {children}
          </div>
          <MobileBottomBar />
        </AuthProvider>
      </body>
    </html>
  );
}

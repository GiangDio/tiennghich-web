import React from 'react';

export default function JsonLd() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://tiennghichauto.vn/#software',
        name: 'Tiên Nghịch Auto - Tool Auto Tiên Nghịch Mobile',
        alternateName: [
          'Tool auto tiên nghịch mobile',
          'Tiên nghịch mobile auto',
          'Tool cày tự động tiên nghịch mobile',
          'Auto Tiên Nghịch Joyplay',
          'Tien Nghich Auto Pro',
        ],
        operatingSystem: 'Android, Windows PC, Web Extension',
        applicationCategory: 'GameApplication',
        description:
          'Phần mềm tool cày tự động game Tiên Nghịch Mobile tốt nhất. Tự động rèn tiên khí, nâng cấp khí đỉnh, leo thông thiên tháp, đánh chiếm cực âm địa, vượt ải chính tuyến 24/7 an toàn 100%.',
        softwareVersion: '3.1.0',
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '20000',
          highPrice: '290000',
          priceCurrency: 'VND',
          offerCount: '5',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.95',
          reviewCount: '1580',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://tiennghichauto.vn/#website',
        url: 'https://tiennghichauto.vn',
        name: 'Tiên Nghịch Auto Mobile - Trang Chủ Chính Thức',
        description:
          'Trang tải và mua bản quyền tool auto game Tiên Nghịch Mobile chính hãng. Hỗ trợ Android APK và Extension PC Chrome.',
        publisher: {
          '@type': 'Organization',
          name: 'Tiên Nghịch Auto Team',
          logo: {
            '@type': 'ImageObject',
            url: 'https://tiennghich-payos.onrender.com/favicon.ico',
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Tool Auto Tiên Nghịch Mobile có những tính năng gì?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tiên Nghịch Auto sở hữu 5 phân hệ: Đạo Thành (tự động rèn tiên khí, lọc trang bị thuộc tính tăng, gom đá sao trời nâng khí đỉnh, đấu tiên đài), Lịch Luyện (leo Thông Thiên Tháp, vượt Vực U Minh, đánh chiếm Cực Âm Địa còn chỗ trống), Ma Đạo (tự động đi ải chính tuyến, nhận quà treo máy, rút X1000 tiên duyên), Tu Sĩ & Trợ Chiến.',
            },
          },
          {
            '@type': 'Question',
            name: 'Tool cày tự động Tiên Nghịch Mobile có an toàn cho tài khoản game không?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Hoàn toàn an toàn 100%. Tool hoạt động bằng cơ chế mô phỏng thao tác chuẩn người dùng kết hợp công nghệ mã hóa chống phát hiện Anti-Cheat, giúp tài khoản tu tiên của bạn tuyệt đối bảo mật.',
            },
          },
          {
            '@type': 'Question',
            name: 'Tôi có thể dùng thử Auto Tiên Nghịch Mobile miễn phí không?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Có! Hệ thống tự động tặng 20 phút dùng thử miễn phí mỗi ngày cho tất cả đạo hữu để trải nghiệm đầy đủ mọi tính năng trước khi mua gói.',
            },
          },
          {
            '@type': 'Question',
            name: 'Cách cài đặt tool Auto Tiên Nghịch Mobile trên điện thoại Android và máy tính PC?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Trên Android: Tải file TienNghichAuto.apk và cài đặt trực tiếp. Trên PC: Tải file TienNghichAuto_Extension_PC.zip, giải nén và tải lên trình duyệt Chrome/Edge trong Developer Mode.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

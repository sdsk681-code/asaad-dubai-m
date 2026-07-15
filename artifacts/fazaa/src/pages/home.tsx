import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import useEmblaCarousel from 'embla-carousel-react';
import { CheckCircle2 } from 'lucide-react';

import heroBanner from '@assets/fazaa/hero-banner.png';
import zeroDirhams from '@assets/fazaa/zero-dirhams.png';

import { BRANDS, BRAND_KEYS, type BrandData } from '@/data/brands';

function BrandCard({ brand }: { brand: BrandData }) {
  return (
    <Link href={`/cards?brand=${brand.key}`}>
      <div
        data-testid={`brand-card-${brand.key}`}
        className="bg-white border border-[#e8e8e8] rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
      >
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: `linear-gradient(135deg, ${brand.darkColor}, ${brand.color})` }}
          >
            {brand.nameEn.slice(0, 2)}
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
            <p className="text-xs text-gray-400 font-sans">{brand.nameEn}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-right mb-3">{brand.description}</p>

        <div className="flex flex-wrap gap-1.5 justify-end mb-4">
          {brand.eligibility.map((item, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full border text-gray-600"
              style={{ borderColor: brand.color + '55', background: brand.color + '11' }}
            >
              {item}
            </span>
          ))}
        </div>

        <div
          className="w-full text-center text-white text-sm font-bold py-2.5 rounded-lg transition-opacity group-hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${brand.darkColor}, ${brand.color})` }}
        >
          اختر بطاقتك
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: 'rtl' });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* Hero Slider */}
      <div className="w-full bg-black overflow-hidden h-[200px] md:h-[260px] relative" dir="rtl">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            <div className="flex-[0_0_100%] min-w-0 h-full">
              <img src={heroBanner} alt="عروض فزعة" className="w-full h-full object-cover object-center" />
            </div>
            <div className="flex-[0_0_100%] min-w-0 h-full">
              <img src={zeroDirhams} alt="صفر درهم" className="w-full h-full object-cover object-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Brands Section */}
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-right">أشهر بطاقات الخصومات</h2>
        <p className="text-gray-500 text-right mb-8">اختر البطاقة المناسبة لك وابدأ الاستفادة من آلاف العروض والخصومات</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRAND_KEYS.map(key => (
            <BrandCard key={key} brand={BRANDS[key]} />
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🏷️', title: 'خصومات حصرية', desc: 'على مئات الخدمات' },
            { icon: '✅', title: 'سهولة الاستخدام', desc: 'في كل مكان' },
            { icon: '⭐', title: 'معتمدة وموثوقة', desc: 'من الجهات الرسمية' },
            { icon: '🤝', title: 'مزايا متعددة', desc: 'تناسب احتياجاتك' },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-[#e8e8e8] rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="font-bold text-sm text-gray-900">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

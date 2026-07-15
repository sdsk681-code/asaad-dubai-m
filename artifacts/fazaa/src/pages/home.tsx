import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import heroBanner from '@assets/fazaa/hero-banner.png';
import zeroDirhams from '@assets/fazaa/zero-dirhams.png';
import cardPlatinum from '@assets/fazaa/card-platinum.png';
import cardGold from '@assets/fazaa/card-gold.png';
import cardSilver from '@assets/fazaa/card-silver.png';
import cardDiscount from '@assets/fazaa/card-discount.png';

const CARDS = [
  {
    id: 'platinum',
    name: 'البلاتينية',
    badge: 'الأكثر طلباً',
    description: 'أوسع مزايا وعروض حصرية.',
    image: cardPlatinum,
    link: '/order?tier=platinum',
    benefits: ['عروض البلاتينية الحصرية', 'العروض والخصومات', 'فنادق و باقات للسفر', 'متاجر فزعه', 'فزعه أماكن', 'خدمة إيجار السيارات اليومي', 'فزعه هيلث', 'إيجار السيارات طويل الامد', 'فزعه للسيارات المستعملة', 'التعويض عن الحوادث الشخصية'],
    nameColor: 'text-gray-900',
  },
  {
    id: 'gold',
    name: 'الذهبية',
    description: 'عروض وخصومات مميزة.',
    image: cardGold,
    link: '/order?tier=gold',
    benefits: ['العروض والخصومات', 'متاجر فزعه', 'فزعه أماكن', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي', 'فزعه هيلث', 'إيجار السيارات طويل الامد', 'فزعه للسيارات المستعملة', 'التعويض عن الحوادث الشخصية'],
    nameColor: 'text-[#c9a227]',
  },
  {
    id: 'silver',
    name: 'الفضية',
    description: 'خصومات وخدمات أساسية.',
    image: cardSilver,
    link: '/order?tier=silver',
    benefits: ['فزعه أماكن', 'متاجر فزعه', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي', 'فزعه هيلث', 'إيجار السيارات طويل الامد'],
    nameColor: 'text-gray-600',
  },
  {
    id: 'fazaa',
    name: 'خصومات فزعه',
    description: 'خصومات مختارة يومياً.',
    image: cardDiscount,
    link: '/order?tier=fazaa',
    benefits: ['فزعه هيلث', 'متاجر فزعه', 'فزعه أماكن', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي'],
    nameColor: 'text-gray-800',
  }
];

function ExpandableCard({ card }: { card: typeof CARDS[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#e8e8e8] rounded-xl p-4 shadow-sm relative transition-all duration-300">
      {card.badge && (
        <div className="absolute top-0 right-0 bg-[#e63946] text-white text-xs font-bold px-4 py-1.5 rounded-tr-xl rounded-bl-lg z-10 shadow-sm">
          {card.badge}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 sm:mt-0">
        {/* Right side: Image and Text */}
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="w-[130px] h-[90px] shrink-0 rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-bold mb-1 ${card.nameColor}`}>{card.name}</h3>
            <p className="text-gray-600 text-sm md:text-base">{card.description}</p>
          </div>
        </div>
        
        {/* Left side: Buttons */}
        <div className="flex flex-row sm:flex-col items-center justify-end w-full sm:w-auto gap-3 sm:gap-2 mt-2 sm:mt-0 shrink-0">
          <Link href={card.link} className="bg-[#c9a227] hover:bg-[#b8943f] text-white font-medium py-2 px-6 rounded-lg transition-colors whitespace-nowrap shadow-sm text-center flex-1 sm:flex-none cursor-pointer">
            أطلب الان
          </Link>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-[#c9a227] hover:text-[#b8943f] text-sm font-medium flex items-center justify-center gap-1 transition-colors underline-offset-4 hover:underline py-2 sm:py-0 flex-1 sm:flex-none cursor-pointer"
          >
            <span>عرض المزيد</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Benefits List */}
      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-3">المزايا المشمولة:</h4>
            <div className="flex flex-wrap gap-2">
              {card.benefits.map((benefit, i) => (
                <span key={i} className="bg-[#f5f5f5] text-gray-700 text-xs px-3 py-1.5 rounded-full border border-gray-200">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: 'rtl' });

  // Auto scroll
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* Hero Slider */}
      <div className="w-full bg-black overflow-hidden h-[200px] md:h-[260px] relative" dir="rtl">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            <div className="flex-[0_0_100%] min-w-0 h-full relative">
              <img src={heroBanner} alt="عروض فزعة" className="w-full h-full object-cover object-center" />
            </div>
            <div className="flex-[0_0_100%] min-w-0 h-full relative">
              <img src={zeroDirhams} alt="صفر درهم" className="w-full h-full object-cover object-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-[750px] mx-auto px-4 md:px-6 py-10 md:py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-right">مزايا العضوية</h2>
        
        <div className="flex flex-col gap-4">
          {CARDS.map(card => (
            <ExpandableCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useSearch, useLocation } from 'wouter';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

import { BRANDS, type BrandKey, type CardData } from '@/data/brands';

function CardPlaceholder({ brand, card }: { brand: ReturnType<typeof import('@/data/brands')['BRANDS'][BrandKey]>; card: CardData }) {
  return (
    <div
      className="w-[130px] h-[90px] rounded-lg flex flex-col items-center justify-center text-white shadow-sm shrink-0"
      style={{ background: `linear-gradient(135deg, ${brand.darkColor}, ${brand.color})` }}
    >
      <p className="text-xs font-bold font-sans opacity-80">{brand.nameEn}</p>
      <p className="text-sm font-bold mt-0.5">{card.name}</p>
    </div>
  );
}

function ExpandableCard({ brand, card }: { brand: ReturnType<typeof import('@/data/brands')['BRANDS'][BrandKey]>; card: CardData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#e8e8e8] rounded-xl p-4 shadow-sm relative transition-all duration-300">
      {card.badge && (
        <div className="absolute top-0 right-0 bg-[#e63946] text-white text-xs font-bold px-4 py-1.5 rounded-tr-xl rounded-bl-lg z-10 shadow-sm">
          {card.badge}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2 sm:mt-0">
        {/* Right side: Image + Text */}
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="w-[130px] h-[90px] shrink-0 rounded-lg overflow-hidden shadow-sm border border-gray-100">
            {card.image ? (
              <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
            ) : (
              <CardPlaceholder brand={brand} card={card} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-bold mb-1 ${card.nameColor}`}>{card.name}</h3>
            <p className="text-gray-600 text-sm md:text-base">{card.description}</p>
            <p className="text-[#c9a227] font-bold text-sm mt-1">{card.price}</p>
          </div>
        </div>

        {/* Left side: Buttons */}
        <div className="flex flex-row sm:flex-col items-center justify-end w-full sm:w-auto gap-3 sm:gap-2 mt-2 sm:mt-0 shrink-0">
          <Link
            href={`/order?brand=${brand.key}&type=${card.id}`}
            data-testid={`btn-order-${card.id}`}
            className="bg-[#c9a227] hover:bg-[#b8943f] text-white font-medium py-2 px-6 rounded-lg transition-colors whitespace-nowrap shadow-sm text-center flex-1 sm:flex-none cursor-pointer"
          >
            أطلب الان
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            data-testid={`btn-expand-${card.id}`}
            className="text-[#c9a227] hover:text-[#b8943f] text-sm font-medium flex items-center justify-center gap-1 transition-colors underline-offset-4 hover:underline py-2 sm:py-0 flex-1 sm:flex-none cursor-pointer"
          >
            <span>عرض المزيد</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Benefits */}
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

export default function Cards() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const brandKey = (params.get('brand') || 'fazaa') as BrandKey;

  const brand = BRANDS[brandKey] || BRANDS.fazaa;

  return (
    <div className="w-full">
      {/* Brand Hero Banner */}
      <div
        className="w-full py-8 px-4"
        style={{ background: `linear-gradient(135deg, ${brand.darkColor} 0%, ${brand.color} 100%)` }}
      >
        <div className="max-w-[750px] mx-auto flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            data-testid="btn-back-home"
            className="text-white/80 hover:text-white flex items-center gap-1 text-sm transition-colors cursor-pointer"
          >
            <ChevronRight size={18} className="rotate-180" />
            العودة
          </button>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{brand.name}</h1>
            <p className="text-white/80 text-sm font-sans mt-0.5">{brand.nameEn}</p>
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg border-2 border-white/30"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {brand.nameEn.slice(0, 2)}
          </div>
        </div>

        <div className="max-w-[750px] mx-auto mt-4">
          <p className="text-white/80 text-sm text-right">{brand.description}</p>
          <div className="flex flex-wrap gap-2 justify-end mt-2">
            {brand.eligibility.map((item, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-[750px] mx-auto px-4 md:px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-right">مزايا العضوية</h2>
        <p className="text-gray-500 text-right text-sm mb-6">اختر النوع الذي يناسبك وابدأ الاستمتاع بالمزايا</p>

        <div className="flex flex-col gap-4">
          {brand.cards.map(card => (
            <ExpandableCard key={card.id} brand={brand} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

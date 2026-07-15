import React, { useState } from 'react';
import { Link, useSearch, useLocation } from 'wouter';
import { ChevronDown, ChevronUp, ChevronRight, Info } from 'lucide-react';

import { BRANDS, type BrandKey, type CardData, type BrandData } from '@/data/brands';

/* ─── CSS card visual for brands without a real image ─── */
function CardVisual({ brand, card }: { brand: BrandData; card: CardData }) {
  if (card.image) {
    return (
      <img
        src={card.image}
        alt={`بطاقة ${card.name} - مثال توضيحي`}
        className="w-full h-44 object-cover rounded-xl"
      />
    );
  }
  return (
    <div
      className="w-full h-44 rounded-xl flex flex-col justify-between p-5 select-none overflow-hidden relative"
      style={{ background: `linear-gradient(135deg, ${brand.darkColor} 0%, ${brand.color} 100%)` }}
    >
      {/* decorative circle */}
      <div className="absolute -left-8 -top-8 w-36 h-36 rounded-full opacity-10 bg-white" />
      <div className="absolute -right-4 -bottom-6 w-28 h-28 rounded-full opacity-10 bg-white" />

      <div className="flex justify-between items-start relative z-10">
        {/* chip */}
        <div className="w-9 h-7 rounded-sm bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90 grid grid-cols-2 gap-[2px] p-[3px]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-yellow-700/40 rounded-[1px]" />
          ))}
        </div>
        <span className="text-xs font-bold text-white/60 font-sans tracking-wider">{brand.nameEn}</span>
      </div>

      <div className="relative z-10">
        <p className="text-white/50 text-xs font-sans tracking-widest mb-1.5">•••• •••• •••• ••••</p>
        <p className="text-white font-bold text-lg leading-none">{card.name}</p>
      </div>
    </div>
  );
}

/* ─── Individual membership card ─── */
function MemberCard({ brand, card }: { brand: BrandData; card: CardData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#e8e8e8] rounded-2xl shadow-sm overflow-hidden flex flex-col relative hover:shadow-md transition-shadow duration-200">
      {card.badge && (
        <div className="absolute top-3 left-3 z-10 bg-[#e63946] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {card.badge}
        </div>
      )}

      {/* Card visual */}
      <div className="p-4 pb-0">
        <CardVisual brand={brand} card={card} />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className={`text-xl font-bold mb-1 ${card.nameColor}`}>{card.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{card.description}</p>
        <p className="text-[#c9a227] font-bold text-base mb-4">{card.price}</p>

        {/* Expand benefits */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[#c9a227] hover:text-[#b8943f] text-sm font-medium flex items-center gap-1 mb-4 transition-colors cursor-pointer self-start"
        >
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          <span>عرض المزيد</span>
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            expanded ? 'grid-rows-[1fr] mb-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-1.5 pb-1">
              {card.benefits.map((b, i) => (
                <span
                  key={i}
                  className="bg-[#f5f5f5] text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-200"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            href={`/register?brand=${brand.key}&type=${card.id}`}
            className="block w-full text-center bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
          >
            اطلب الآن
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function Cards() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const brandKey = (params.get('brand') || 'fazaa') as BrandKey;
  const brand = BRANDS[brandKey] || BRANDS.fazaa;

  return (
    <div className="w-full">
      {/* Brand header */}
      <div
        className="w-full py-8 px-4"
        style={{ background: `linear-gradient(135deg, ${brand.darkColor} 0%, ${brand.color} 100%)` }}
      >
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            className="text-white/80 hover:text-white flex items-center gap-1 text-sm transition-colors cursor-pointer"
          >
            <ChevronRight size={18} className="rotate-180" />
            العودة
          </button>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{brand.name}</h1>
            <p className="text-white/70 text-sm font-sans mt-0.5">{brand.nameEn}</p>
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg border-2 border-white/30"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            {brand.nameEn.slice(0, 2)}
          </div>
        </div>
        <div className="max-w-[900px] mx-auto mt-3 flex flex-wrap gap-2 justify-end">
          {brand.eligibility.map((item, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-[900px] mx-auto px-4 pt-6">
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-right">
          <p className="text-amber-800 text-xs leading-relaxed flex-1">
            هذا الموقع <strong>ليس الموقع الرسمي</strong> لأي من الجهات المذكورة. الصور المعروضة هي أمثلة توضيحية فقط ولا تمثل بطاقات رسمية صادرة عن أي جهة حكومية أو خاصة.
          </p>
          <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 text-right">اختر نوع بطاقتك</h2>
        <p className="text-gray-500 text-sm text-right mb-7">اضغط على «اطلب الآن» للمتابعة</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brand.cards.map(card => (
            <MemberCard key={card.id} brand={brand} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

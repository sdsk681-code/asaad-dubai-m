import React, { useState } from 'react';
import { Link, useSearch, useLocation } from 'wouter';
import { ChevronDown, ChevronUp, ChevronRight, Star, Award, Tag, Gem, Users, Building2, Shield, IdCard, Briefcase } from 'lucide-react';

import { BRANDS, type BrandKey, type CardData, type BrandData } from '@/data/brands';

/* ─── Icon per card type ─── */
const CARD_ICONS: Record<string, React.ReactNode> = {
  platinum: <Gem size={28} strokeWidth={1.5} />,
  gold:     <Star size={28} strokeWidth={1.5} />,
  silver:   <Award size={28} strokeWidth={1.5} />,
  discount: <Tag size={28} strokeWidth={1.5} />,
};

/* ─── Credit-card style placeholder for brands without real images ─── */
function CssCard({ brand, card }: { brand: BrandData; card: CardData }) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden relative select-none"
      style={{
        aspectRatio: '85/54',
        background: `linear-gradient(135deg, ${brand.darkColor} 0%, ${brand.color} 100%)`,
      }}
    >
      {/* decorative circles */}
      <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -right-6 -bottom-10 w-36 h-36 rounded-full bg-white/10" />

      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        {/* top row */}
        <div className="flex justify-between items-start">
          {/* SIM chip */}
          <div className="w-8 h-6 rounded-sm bg-gradient-to-br from-yellow-300 to-yellow-500 grid grid-cols-2 gap-[2px] p-[3px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-yellow-700/40 rounded-[1px]" />
            ))}
          </div>
          <span className="text-white/60 text-[10px] font-bold font-sans tracking-widest">{brand.nameEn}</span>
        </div>

        {/* bottom row */}
        <div>
          <p className="text-white/40 text-[9px] font-sans tracking-[.18em] mb-1">•••• •••• •••• ••••</p>
          <div className="flex justify-between items-end">
            <p className="text-white font-bold text-base leading-none">{card.name}</p>
            {/* contactless icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/50">
              <path d="M5 12.5C5 8.91 7.91 6 11.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12.5C2 7.25 6.25 3 11.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12.5C8 10.57 9.57 9 11.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11.5" cy="12.5" r="1.5" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Card image (real or CSS) ─── */
function CardImage({ brand, card }: { brand: BrandData; card: CardData }) {
  if (card.image) {
    return (
      <img
        src={card.image}
        alt={`${card.name} - مثال توضيحي`}
        className="w-full rounded-xl object-cover"
        style={{ aspectRatio: '85/54' }}
      />
    );
  }
  return <CssCard brand={brand} card={card} />;
}

/* ─── Single membership card — matches reference image layout ─── */
function MemberCard({ brand, card }: { brand: BrandData; card: CardData }) {
  const [expanded, setExpanded] = useState(false);
  // show first 3 benefits as checkmarks by default
  const visibleBenefits = card.benefits.slice(0, 3);
  const extraBenefits = card.benefits.slice(3);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-200 relative">
      {/* "Most popular" badge */}
      {card.badge && (
        <div className="absolute top-3 left-3 z-10 bg-[#e63946] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
          {card.badge}
        </div>
      )}

      <div className="p-4 flex flex-col h-full">
        {/* ── Title row (top) ── */}
        <div className="text-right mb-3">
          <h3 className="text-[17px] font-bold text-gray-900 leading-snug">
            بطاقة {card.name}
          </h3>
          <p className="text-gray-400 text-[12px] font-sans mt-0.5">
            ({card.id === 'gold' ? 'Gold' : card.id === 'silver' ? 'Silver' : card.id === 'platinum' ? 'Platinum' : 'Discount'})
          </p>
        </div>

        {/* ── Card Image (middle) ── */}
        <div className="mb-4">
          <CardImage brand={brand} card={card} />
        </div>

        {/* ── Checklist ── */}
        <div className="flex-1 mb-3">
          <ul className="space-y-1.5 text-right">
            <li className="text-gray-600 text-sm font-medium">{card.description}</li>
            {visibleBenefits.map((b, i) => (
              <li key={i} className="flex items-center justify-end gap-2 text-[13px] text-gray-700">
                <span>{b}</span>
                <span className="text-green-500 font-bold text-base leading-none shrink-0">✓</span>
              </li>
            ))}
            {/* extra benefits revealed on expand */}
            {expanded && extraBenefits.map((b, i) => (
              <li key={i} className="flex items-center justify-end gap-2 text-[13px] text-gray-700">
                <span>{b}</span>
                <span className="text-green-500 font-bold text-base leading-none shrink-0">✓</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Bottom row: icon + price ── */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#c9a227] font-bold text-sm">{card.price}</span>
          <div className="text-gray-300">
            {CARD_ICONS[card.id]}
          </div>
        </div>

        {/* ── Actions ── */}
        <Link
          href={`/register?brand=${brand.key}&type=${card.id}`}
          className="block w-full text-center bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm text-[15px] mb-2"
        >
          اطلب الآن
        </Link>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-[#c9a227] hover:text-[#b8943f] text-sm font-medium transition-colors cursor-pointer py-1"
        >
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          <span>عرض المزيد</span>
        </button>
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
      {/* ── Brand header banner ── */}
      <div
        className="w-full py-6 px-4"
        style={{ background: `linear-gradient(135deg, ${brand.darkColor} 0%, ${brand.color} 100%)` }}
      >
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            className="text-white/80 hover:text-white flex items-center gap-1 text-sm transition-colors cursor-pointer"
          >
            <ChevronRight size={18} className="rotate-180" />
            العودة
          </button>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white">بطاقات {brand.name}</h1>
            <p className="text-white/70 text-xs font-sans mt-0.5">({brand.nameEn})</p>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base border-2 border-white/30 bg-white/15">
            {brand.nameEn.slice(0, 2)}
          </div>
        </div>

        {/* eligibility tags */}
        <div className="max-w-[960px] mx-auto mt-3 flex flex-wrap gap-2 justify-center">
          <span className="text-white/70 text-xs ml-1">{brand.description} •</span>
          {brand.eligibility.map((item, i) => (
            <span key={i} className="text-xs px-3 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="max-w-[960px] mx-auto px-4 pt-5">
        <p className="text-[11px] text-gray-400 text-center border border-gray-200 rounded-lg px-4 py-2 bg-gray-50">
          ⚠️ هذا الموقع <strong>ليس الموقع الرسمي</strong> لأي جهة. الصور أمثلة توضيحية فقط ولا تمثل بطاقات رسمية.
        </p>
      </div>

      {/* ── Cards grid ── */}
      <div className="max-w-[960px] mx-auto px-4 py-7">
        <div
          className={`grid gap-5 ${
            brand.cards.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : brand.cards.length === 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {brand.cards.map(card => (
            <MemberCard key={card.id} brand={brand} card={card} />
          ))}
        </div>
      </div>

      {/* ── Bottom features bar (matches reference image) ── */}
      <div className="bg-white border-t border-gray-100 py-6 px-4">
        <div className="max-w-[960px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {[
            { icon: '🏷️', title: 'خصومات حصرية', sub: 'على مئات الخدمات' },
            { icon: '✅', title: 'سهولة الاستخدام', sub: 'في كل مكان' },
            { icon: '⭐', title: 'معتمدة وموثوقة', sub: 'من الجهات الرسمية' },
            { icon: '🤝', title: 'مزايا متعددة', sub: 'تناسب احتياجاتك' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{f.icon}</span>
              <p className="font-bold text-gray-800 text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA footer bar (matches reference image) ── */}
      <div
        className="py-4 px-4 text-center"
        style={{ background: `linear-gradient(90deg, ${brand.darkColor}, ${brand.color})` }}
      >
        <p className="text-white font-bold text-base">
          احصل على بطاقتك الآن وابدأ الاستفادة!
        </p>
      </div>
    </div>
  );
}

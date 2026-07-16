import { useState } from 'react';
import { Link, useSearch, useLocation } from 'wouter';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

import { BRANDS, type BrandKey, type CardData, type BrandData } from '@/data/brands';

/* ─── Single card — anatomy: image → name → description → order button → more link ─── */
function MemberCard({ brand, card }: { brand: BrandData; card: CardData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-200 relative">
      {/* badge */}
      {card.badge && (
        <div className="absolute top-3 left-3 z-10 bg-[#e63946] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
          {card.badge}
        </div>
      )}

      <div className="p-4 flex flex-col h-full">
        {/* 1 ── card image (top) */}
        <img
          src={card.image}
          alt={`${card.displayName} - مثال توضيحي`}
          className="w-full rounded-xl object-cover mb-4"
          style={{ aspectRatio: '85/54' }}
          loading="lazy"
        />

        {/* 2 ── category name (middle) */}
        <div className="text-center mb-1">
          <h3 className="text-lg font-bold text-gray-900">{card.displayName}</h3>
          <p className="text-gray-400 text-xs font-sans">({card.nameEn})</p>
        </div>

        {/* 3 ── short description */}
        <p className="text-gray-600 text-sm text-center mb-2">{card.description}</p>

        {/* price */}
        <p className="text-center text-[#c9a227] font-bold text-sm mb-4">{card.price}</p>

        {/* expandable benefits (عرض المزيد) */}
        {expanded && (
          <ul className="space-y-1.5 text-right mb-4 border-t border-gray-100 pt-3">
            {card.benefits.map((b, i) => (
              <li key={i} className="flex items-center justify-end gap-2 text-[13px] text-gray-700">
                <span>{b}</span>
                <span className="text-green-500 font-bold text-base leading-none shrink-0">✓</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto">
          {/* 4 ── order button */}
          <Link
            href={`/payment?brand=${brand.key}&type=${card.id}`}
            className="block w-full text-center bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm text-[15px] mb-2"
          >
            اطلب الآن
          </Link>

          {/* 5 ── more link */}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="w-full flex items-center justify-center gap-1 text-[#c9a227] hover:text-[#b8943f] text-sm font-medium transition-colors cursor-pointer py-1"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            <span>{expanded ? 'عرض أقل' : 'عرض المزيد'}</span>
          </button>
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
      {/* ── brand header ── */}
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

      {/* ── disclaimer ── */}
      <div className="max-w-[960px] mx-auto px-4 pt-5">
        <p className="text-[11px] text-gray-400 text-center border border-gray-200 rounded-lg px-4 py-2 bg-gray-50">
          ⚠️ هذا الموقع <strong>ليس الموقع الرسمي</strong> لأي جهة. الصور أمثلة توضيحية فقط ولا تمثل بطاقات رسمية.
        </p>
      </div>

      {/* ── cards grid (3 columns like the reference) ── */}
      <div className="max-w-[960px] mx-auto px-4 py-7">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          {brand.cards.map(card => (
            <MemberCard key={card.id} brand={brand} card={card} />
          ))}
        </div>
      </div>

      {/* ── features bar ── */}
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

      {/* ── CTA bar ── */}
      <div
        className="py-4 px-4 text-center"
        style={{ background: `linear-gradient(90deg, ${brand.darkColor}, ${brand.color})` }}
      >
        <p className="text-white font-bold text-base">احصل على بطاقتك الآن وابدأ الاستفادة!</p>
      </div>
    </div>
  );
}

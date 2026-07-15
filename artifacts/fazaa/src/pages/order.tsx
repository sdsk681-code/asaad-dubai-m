import React, { useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useCreateRegistration } from '@workspace/api-client-react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import mastercard from '@assets/fazaa/mastercard.svg';

const TIERS: Record<string, { name: string, price: string }> = {
  platinum: { name: 'البلاتينية', price: '500 درهم' },
  gold: { name: 'الذهبية', price: '300 درهم' },
  silver: { name: 'الفضية', price: '150 درهم' },
  fazaa: { name: 'خصومات فزعه', price: 'مجاناً' },
};

const personalSchema = z.object({
  fullName: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(8, 'رقم الهاتف مطلوب'),
  emiratesId: z.string().min(15, 'رقم الهوية مطلوب'),
});

const paymentSchema = z.object({
  region: z.string().min(2, 'المنطقة مطلوبة'),
  streetAddress: z.string().min(2, 'العنوان مطلوب'),
  neighborhood: z.string().min(2, 'الحي مطلوب'),
  deliveryDate: z.string().min(2, 'موعد الاستلام مطلوب'),
  paymentMethod: z.enum(['card', 'apple_pay']),
});

const fullSchema = personalSchema.merge(paymentSchema);

export default function Order() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tierKey = params.get('tier') || 'silver';
  
  const tierInfo = TIERS[tierKey] || TIERS.silver;

  const [step, setStep] = useState(1);
  const createRegistration = useCreateRegistration();

  const methods = useForm({
    resolver: zodResolver(step === 1 ? personalSchema : fullSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      emiratesId: '',
      region: '',
      streetAddress: '',
      neighborhood: '',
      deliveryDate: '',
      paymentMethod: 'card' as const,
    },
    mode: 'onTouched',
  });

  const onSubmit = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    
    if (step === 2) {
      setStep(3);
    }
  };

  const handleFinalSubmit = () => {
    const data = methods.getValues();
    createRegistration.mutate({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        emiratesId: data.emiratesId,
        tier: tierKey as any,
        region: data.region,
        streetAddress: data.streetAddress,
        neighborhood: data.neighborhood,
        deliveryDate: data.deliveryDate,
        paymentMethod: data.paymentMethod,
      }
    }, {
      onSuccess: () => {
        setStep(4);
      }
    });
  };

  return (
    <div className="max-w-[500px] mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">كن عضواً</h1>
        <p className="text-gray-500">عضوية فزعة {tierInfo.name}</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative px-4">
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-8 h-0.5 bg-[#c9a227] -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%', left: 'auto' }}></div>
        
        {[
          { id: 1, label: 'معلومات شخصية' },
          { id: 2, label: 'معلومات العنوان' },
          { id: 3, label: 'اشترك' },
        ].map((s) => {
          const isActive = step === s.id || (step === 4 && s.id === 3);
          const isCompleted = step > s.id;
          return (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-[#f5f5f5] px-2 relative z-0">
              {isCompleted ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 bg-[#1a1a1a] border-[#1a1a1a] text-white">
                  <CheckCircle2 size={16} />
                </div>
              ) : isActive ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 bg-[#c9a227] border-[#c9a227] text-white shadow-[0_0_0_4px_rgba(201,162,39,0.2)]">
                  {s.id}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 bg-white border-gray-300 text-gray-400">
                  {s.id}
                </div>
              )}
              <span className={`text-xs font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-right mb-4">
                  <p className="text-sm text-gray-500">يرجى إدخال معلوماتك بشكل صحيح</p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 block">الاسم</label>
                  <input 
                    {...methods.register('fullName')}
                    placeholder="يرجى إدخال اسمك" 
                    className={`w-full bg-white border ${methods.formState.errors.fullName ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]'} rounded-lg px-4 py-2.5 text-right outline-none transition-shadow`}
                  />
                  {methods.formState.errors.fullName && <p className="text-xs text-red-500 mt-1">{methods.formState.errors.fullName.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 block">رقم الهاتف</label>
                  <div className="flex gap-2">
                    <input 
                      {...methods.register('phone')}
                      placeholder="يرجى إدخال رقم هاتفك" 
                      className={`flex-1 bg-white border ${methods.formState.errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]'} rounded-lg px-4 py-2.5 text-right outline-none transition-shadow`}
                    />
                    <div className="w-[80px] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 shrink-0" dir="ltr">
                      +971
                    </div>
                  </div>
                  {methods.formState.errors.phone && <p className="text-xs text-red-500 mt-1">{methods.formState.errors.phone.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 block">رقم الهوية</label>
                  <input 
                    {...methods.register('emiratesId')}
                    placeholder="يرجى إدخال رقم الهوية" 
                    className={`w-full bg-white border ${methods.formState.errors.emiratesId ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]'} rounded-lg px-4 py-2.5 text-right outline-none transition-shadow`}
                  />
                  {methods.formState.errors.emiratesId && <p className="text-xs text-red-500 mt-1">{methods.formState.errors.emiratesId.message as string}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">معلومات التوصيل</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">المنطقة</label>
                    <select 
                      {...methods.register('region')}
                      className={`w-full bg-white border ${methods.formState.errors.region ? 'border-red-500' : 'border-gray-200 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]'} rounded-lg px-4 py-2.5 text-right outline-none appearance-none`}
                    >
                      <option value="">اختر المنطقة</option>
                      <option value="abu-dhabi">أبوظبي</option>
                      <option value="dubai">دبي</option>
                      <option value="sharjah">الشارقة</option>
                      <option value="ajman">عجمان</option>
                      <option value="umm-al-quwain">أم القيوين</option>
                      <option value="ras-al-khaimah">رأس الخيمة</option>
                      <option value="fujairah">الفجيرة</option>
                    </select>
                    {methods.formState.errors.region && <p className="text-xs text-red-500 mt-1">{methods.formState.errors.region.message as string}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">عنوان الشارع</label>
                    <input 
                      {...methods.register('streetAddress')}
                      placeholder="اسم الشارع أو الرقم" 
                      className={`w-full bg-white border ${methods.formState.errors.streetAddress ? 'border-red-500' : 'border-gray-200 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]'} rounded-lg px-4 py-2.5 text-right outline-none`}
                    />
                    {methods.formState.errors.streetAddress && <p className="text-xs text-red-500 mt-1">{methods.formState.errors.streetAddress.message as string}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 block">الحي</label>
                      <input 
                        {...methods.register('neighborhood')}
                        placeholder="اسم الحي" 
                        className={`w-full bg-white border ${methods.formState.errors.neighborhood ? 'border-red-500' : 'border-gray-200 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]'} rounded-lg px-4 py-2.5 text-right outline-none`}
                      />
                      {methods.formState.errors.neighborhood && <p className="text-xs text-red-500 mt-1">{methods.formState.errors.neighborhood.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 block">موعد الاستلام</label>
                      <input 
                        type="date"
                        {...methods.register('deliveryDate')}
                        className={`w-full bg-white border ${methods.formState.errors.deliveryDate ? 'border-red-500' : 'border-gray-200 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]'} rounded-lg px-4 py-2.5 text-right outline-none font-sans`}
                      />
                      {methods.formState.errors.deliveryDate && <p className="text-xs text-red-500 mt-1">{methods.formState.errors.deliveryDate.message as string}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">الفاتورة وطريقة الدفع</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <span className="font-bold text-gray-800">المبلغ الإجمالي</span>
                    <span className="font-bold text-[#c9a227] text-lg">{tierInfo.price}</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 block">اختر طريقة الدفع</label>
                    
                    <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${methods.watch('paymentMethod') === 'card' ? 'border-[#c9a227] bg-[#c9a227]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" value="card" {...methods.register('paymentMethod')} className="w-4 h-4 text-[#c9a227] border-gray-300 focus:ring-[#c9a227]" />
                        <span className="font-medium text-gray-800">فيزا / ماستركارد</span>
                      </div>
                      <img src={mastercard} alt="Mastercard" className="h-6" />
                    </label>

                    <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${methods.watch('paymentMethod') === 'apple_pay' ? 'border-[#c9a227] bg-[#c9a227]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" value="apple_pay" {...methods.register('paymentMethod')} className="w-4 h-4 text-[#c9a227] border-gray-300 focus:ring-[#c9a227]" />
                        <span className="font-medium text-gray-800 font-sans">Apple Pay</span>
                      </div>
                      <div className="h-6 flex items-center justify-center bg-black text-white px-2 rounded text-xs font-sans">
                        Pay
                      </div>
                    </label>
                    {methods.watch('paymentMethod') === 'apple_pay' && (
                      <p className="text-sm text-red-500 text-right pr-1">هذه طريقة الدفع غير متاحة في الوقت الحالي</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">ملخص الطلب</h3>
                
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">نوع العضوية</span>
                    <span className="font-bold text-gray-900">{tierInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">المبلغ الإجمالي</span>
                    <span className="font-bold text-[#c9a227] text-lg">{tierInfo.price}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-gray-600">الاسم</span>
                    <span className="font-bold text-gray-900">{methods.getValues('fullName')}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 mt-6 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={handleFinalSubmit}
                    disabled={createRegistration.isPending}
                    className="flex-1 bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {createRegistration.isPending ? 'جاري التنفيذ...' : 'اشترك الآن'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    رجوع
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-8 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">تم استلام طلبك بنجاح</h2>
                <p className="text-gray-500">شكراً لاختيارك عضوية فزعة. سيتم التواصل معك قريباً لتأكيد موعد التسليم.</p>
                <div className="pt-6">
                  <button 
                    type="button" 
                    onClick={() => setLocation('/')}
                    className="bg-[#c9a227] hover:bg-[#b8943f] text-white font-medium py-3 px-8 rounded-lg transition-colors w-full sm:w-auto shadow-sm cursor-pointer"
                  >
                    العودة للرئيسية
                  </button>
                </div>
              </div>
            )}

            {/* Form Actions for Step 1 and 2 */}
            {step < 3 && (
              <div className="flex gap-4 pt-4 mt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  className="flex-1 bg-[#c9a227] hover:bg-[#b8943f] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  المتابعة
                  <ChevronRight size={18} className="rotate-180" />
                </button>
                
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setStep(step - 1)}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    رجوع
                  </button>
                )}
                {step === 1 && (
                  <button 
                    type="button" 
                    onClick={() => setLocation('/')}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

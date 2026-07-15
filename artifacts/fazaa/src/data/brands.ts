import cardPlatinum from '@assets/fazaa/card-platinum.png';
import cardGold from '@assets/fazaa/card-gold.png';
import cardSilver from '@assets/fazaa/card-silver.png';
import cardDiscount from '@assets/fazaa/card-discount.png';

export type CardTypeKey = 'platinum' | 'gold' | 'silver' | 'discount';
export type BrandKey = 'fazaa' | 'esaad' | 'homat' | 'alsaada' | 'absher';

export interface CardData {
  id: CardTypeKey;
  name: string;
  description: string;
  image: string | null;
  nameColor: string;
  badge?: string;
  price: string;
  benefits: string[];
}

export interface BrandData {
  key: BrandKey;
  name: string;
  nameEn: string;
  color: string;
  darkColor: string;
  description: string;
  eligibility: string[];
  cards: CardData[];
}

export const BRANDS: Record<BrandKey, BrandData> = {
  fazaa: {
    key: 'fazaa',
    name: 'فزعة',
    nameEn: 'FAZAA',
    color: '#c9a227',
    darkColor: '#7a6318',
    description: 'تابعة لوزارة الداخلية',
    eligibility: ['الموظفون الحكوميون', 'القطاع الخاص', 'الأسر'],
    cards: [
      {
        id: 'platinum',
        name: 'البلاتينية',
        description: 'أوسع مزايا وعروض حصرية.',
        image: cardPlatinum,
        nameColor: 'text-gray-900',
        badge: 'الأكثر طلباً',
        price: '500 درهم',
        benefits: ['عروض البلاتينية الحصرية', 'العروض والخصومات', 'فنادق و باقات للسفر', 'متاجر فزعه', 'فزعه أماكن', 'خدمة إيجار السيارات اليومي', 'فزعه هيلث', 'إيجار السيارات طويل الامد', 'فزعه للسيارات المستعملة', 'التعويض عن الحوادث الشخصية'],
      },
      {
        id: 'gold',
        name: 'الذهبية',
        description: 'عروض وخصومات مميزة.',
        image: cardGold,
        nameColor: 'text-[#c9a227]',
        price: '300 درهم',
        benefits: ['العروض والخصومات', 'متاجر فزعه', 'فزعه أماكن', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي', 'فزعه هيلث', 'إيجار السيارات طويل الامد', 'فزعه للسيارات المستعملة', 'التعويض عن الحوادث الشخصية'],
      },
      {
        id: 'silver',
        name: 'الفضية',
        description: 'خصومات وخدمات أساسية.',
        image: cardSilver,
        nameColor: 'text-gray-600',
        price: '150 درهم',
        benefits: ['فزعه أماكن', 'متاجر فزعه', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي', 'فزعه هيلث', 'إيجار السيارات طويل الامد'],
      },
      {
        id: 'discount',
        name: 'خصومات فزعه',
        description: 'خصومات مختارة يومياً.',
        image: cardDiscount,
        nameColor: 'text-gray-800',
        price: 'مجاناً',
        benefits: ['فزعه هيلث', 'متاجر فزعه', 'فزعه أماكن', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي'],
      },
    ],
  },
  esaad: {
    key: 'esaad',
    name: 'إسعاد',
    nameEn: 'ESAAD',
    color: '#1e7a4a',
    darkColor: '#145233',
    description: 'تابعة لشرطة دبي',
    eligibility: ['موظفو حكومة دبي', 'المتقاعدون', 'حاملو الإقامة الذهبية'],
    cards: [
      {
        id: 'gold',
        name: 'الذهبية',
        description: 'عروض وخصومات مميزة.',
        image: null,
        nameColor: 'text-[#c9a227]',
        badge: 'الأكثر طلباً',
        price: '300 درهم',
        benefits: ['العروض والخصومات', 'متاجر إسعاد', 'إسعاد أماكن', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي', 'إسعاد هيلث', 'إيجار السيارات طويل الامد'],
      },
      {
        id: 'silver',
        name: 'الفضية',
        description: 'خصومات وخدمات أساسية.',
        image: null,
        nameColor: 'text-gray-600',
        price: '150 درهم',
        benefits: ['إسعاد أماكن', 'متاجر إسعاد', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات اليومي', 'إسعاد هيلث'],
      },
      {
        id: 'discount',
        name: 'خصومات إسعاد',
        description: 'خصومات مختارة يومياً.',
        image: null,
        nameColor: 'text-gray-800',
        price: 'مجاناً',
        benefits: ['إسعاد هيلث', 'متاجر إسعاد', 'إسعاد أماكن', 'فنادق و باقات للسفر'],
      },
    ],
  },
  homat: {
    key: 'homat',
    name: 'حماة الوطن',
    nameEn: 'HOMAT AL WATAN',
    color: '#3a5a2a',
    darkColor: '#253d1a',
    description: 'تابعة للقوات المسلحة',
    eligibility: ['العسكريون', 'المتقاعدون من الجيش'],
    cards: [
      {
        id: 'gold',
        name: 'الذهبية',
        description: 'عروض وخصومات مميزة.',
        image: null,
        nameColor: 'text-[#c9a227]',
        badge: 'الأكثر طلباً',
        price: '300 درهم',
        benefits: ['العروض والخصومات', 'متاجر حماة الوطن', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات', 'الرعاية الصحية'],
      },
      {
        id: 'silver',
        name: 'الفضية',
        description: 'خصومات وخدمات أساسية.',
        image: null,
        nameColor: 'text-gray-600',
        price: '150 درهم',
        benefits: ['متاجر حماة الوطن', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات', 'الرعاية الصحية'],
      },
      {
        id: 'discount',
        name: 'خصومات حماة الوطن',
        description: 'خصومات مختارة يومياً.',
        image: null,
        nameColor: 'text-gray-800',
        price: 'مجاناً',
        benefits: ['الرعاية الصحية', 'متاجر حماة الوطن', 'فنادق و باقات للسفر'],
      },
    ],
  },
  alsaada: {
    key: 'alsaada',
    name: 'السعادة',
    nameEn: 'AL SAADA',
    color: '#1a6b9a',
    darkColor: '#0f4a6b',
    description: 'تابعة لإدارة الإقامة وشؤون الأجانب بدبي',
    eligibility: ['السياح', 'الزوار', 'الأجانب المقيمون'],
    cards: [
      {
        id: 'gold',
        name: 'الذهبية',
        description: 'عروض وخصومات مميزة.',
        image: null,
        nameColor: 'text-[#c9a227]',
        badge: 'الأكثر طلباً',
        price: '300 درهم',
        benefits: ['العروض والخصومات', 'متاجر السعادة', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات', 'السعادة هيلث'],
      },
      {
        id: 'silver',
        name: 'الفضية',
        description: 'خصومات وخدمات أساسية.',
        image: null,
        nameColor: 'text-gray-600',
        price: '150 درهم',
        benefits: ['متاجر السعادة', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات', 'السعادة هيلث'],
      },
      {
        id: 'discount',
        name: 'خصومات السعادة',
        description: 'خصومات مختارة يومياً.',
        image: null,
        nameColor: 'text-gray-800',
        price: 'مجاناً',
        benefits: ['السعادة هيلث', 'متاجر السعادة', 'فنادق و باقات للسفر'],
      },
    ],
  },
  absher: {
    key: 'absher',
    name: 'أبشر',
    nameEn: 'ABSHER',
    color: '#1a5a3a',
    darkColor: '#0f3d27',
    description: 'للمواطنين والمقيمين',
    eligibility: ['المواطنون', 'العاملون في القطاع الخاص'],
    cards: [
      {
        id: 'gold',
        name: 'الذهبية',
        description: 'عروض وخصومات مميزة.',
        image: null,
        nameColor: 'text-[#c9a227]',
        badge: 'الأكثر طلباً',
        price: '300 درهم',
        benefits: ['العروض والخصومات', 'متاجر أبشر', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات', 'أبشر هيلث'],
      },
      {
        id: 'silver',
        name: 'الفضية',
        description: 'خصومات وخدمات أساسية.',
        image: null,
        nameColor: 'text-gray-600',
        price: '150 درهم',
        benefits: ['متاجر أبشر', 'فنادق و باقات للسفر', 'خدمة إيجار السيارات', 'أبشر هيلث'],
      },
      {
        id: 'discount',
        name: 'خصومات أبشر',
        description: 'خصومات مختارة يومياً.',
        image: null,
        nameColor: 'text-gray-800',
        price: 'مجاناً',
        benefits: ['أبشر هيلث', 'متاجر أبشر', 'فنادق و باقات للسفر'],
      },
    ],
  },
};

export const BRAND_KEYS: BrandKey[] = ['fazaa', 'esaad', 'homat', 'alsaada', 'absher'];

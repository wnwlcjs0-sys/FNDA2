/**
 * 센트럴점 냉장 간편식 20% 프로모션 설정 및 상품 마스터
 * Single Source of Truth (SSOT)
 */

export const CAMPAIGN_CONFIG = {
  id: 'central-meals-20261021',
  storeName: '센트럴점',
  campaignTitle: '골라 담는 한 끼, 내 취향대로 2개 이상 20% 할인',
  subTitle: '매일 12:00 선착순 20세트 한정(2개 기준 총 40개)! 전 조합 8~9천 원대',
  startDate: '2026-10-21',
  endDate: '2026-11-03',
  dailyStartTime: '12:00', // KST 정오
  discountRate: 0.20,      // 20%
  dailySetLimit: 20,       // 일 선착순 20세트
  dailyItemLimit: 40,      // 2개 기준 총 40개
  minItemForDiscount: 2,   // 할인 적용 최소 수량: 2개
  calculatorItemLimit: 40, // 계산기 최대 선택 한도
  totalBudgetCap: 730000,  // 재산정된 총예산 상한 (원)
  timeZone: 'Asia/Seoul'
};

export const PRODUCT_MASTER = [
  {
    id: 'RM-101',
    name: '한끼 소불고기덮밥',
    price: 5900,
    category: 'rice',
    badge: '든든한 고기',
    description: '달콤 짭조름한 정통 양념 불고기와 촉촉한 쌀밥의 든든한 조화',
    image: 'assets/product-beef.svg',
    altText: '한끼 소불고기덮밥'
  },
  {
    id: 'RM-102',
    name: '매콤 닭갈비볶음밥',
    price: 5500,
    category: 'rice',
    badge: '매콤 칼칼',
    description: '불맛 가득 매콤달콤 닭갈비와 고소한 김가루의 철판 볶음밥',
    image: 'assets/product-chicken.svg',
    altText: '매콤 닭갈비볶음밥'
  },
  {
    id: 'RM-103',
    name: '훈제오리 샐러드랩',
    price: 6200,
    category: 'salad',
    badge: '산뜻 밸런스',
    description: '기름기를 쏙 뺀 훈제오리와 아삭한 채소를 또띠아로 감싼 랩',
    image: 'assets/product-wrap.svg',
    altText: '훈제오리 샐러드랩'
  }
];

export const PRESET_COMBOS = [
  {
    id: 'combo-balance',
    title: '영양 균형 세트',
    tag: '인기 1위',
    subtitle: '점심 든든 고기 + 저녁 산뜻 채소',
    items: { 'RM-101': 1, 'RM-103': 1 }
  },
  {
    id: 'combo-flavor',
    title: '매콤 밸런스 세트',
    tag: '추천',
    subtitle: '매콤한 점심 + 가벼운 저녁',
    items: { 'RM-102': 1, 'RM-103': 1 }
  },
  {
    id: 'combo-hearty',
    title: '든든 탄수화물 세트',
    tag: '가성비',
    subtitle: '점심 덮밥 + 저녁 볶음밥',
    items: { 'RM-101': 1, 'RM-102': 1 }
  },
  {
    id: 'combo-light',
    title: '가벼운 건강 세트',
    tag: '식단관리',
    subtitle: '샐러드랩 2개로 종일 산뜻하게',
    items: { 'RM-103': 2 }
  }
];

export const ALL_COMBINATIONS = [
  {
    name: '닭갈비볶음밥 + 닭갈비볶음밥',
    subtotal: 11000,
    discount: 2200,
    payable: 8800,
    perMeal: 4400
  },
  {
    name: '소불고기덮밥 + 닭갈비볶음밥',
    subtotal: 11400,
    discount: 2280,
    payable: 9120,
    perMeal: 4560
  },
  {
    name: '닭갈비볶음밥 + 샐러드랩',
    subtotal: 11700,
    discount: 2340,
    payable: 9360,
    perMeal: 4680
  },
  {
    name: '소불고기덮밥 + 소불고기덮밥',
    subtotal: 11800,
    discount: 2360,
    payable: 9440,
    perMeal: 4720
  },
  {
    name: '소불고기덮밥 + 샐러드랩',
    subtotal: 12100,
    discount: 2420,
    payable: 9680,
    perMeal: 4840
  },
  {
    name: '샐러드랩 + 샐러드랩',
    subtotal: 12400,
    discount: 2480,
    payable: 9920,
    perMeal: 4960
  }
];

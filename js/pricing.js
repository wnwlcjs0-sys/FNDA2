/**
 * 가격 계산 순수 비즈니스 로직 모듈 (pricing.js)
 * DOM 의존성이 전혀 없는 독립적 테스트 가능 순수 함수
 */

import { CAMPAIGN_CONFIG } from './config.js';

const krwFormatter = new Intl.NumberFormat('ko-KR');

/**
 * 숫자를 한국 원화 형식(예: 9,680)으로 포맷팅
 * @param {number} value
 * @returns {string}
 */
export function formatKRW(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return krwFormatter.format(Math.round(value));
}

/**
 * 장바구니/선택 수량 기반 가격 계산
 * @param {Record<string, number>} selection - { 'RM-101': 1, 'RM-103': 1 }
 * @param {Array<{ id: string, name: string, price: number }>} productMaster
 * @param {typeof CAMPAIGN_CONFIG} [config=CAMPAIGN_CONFIG]
 */
export function calculateOrder(selection = {}, productMaster = [], config = CAMPAIGN_CONFIG) {
  let totalCount = 0;
  let subtotal = 0;
  const selectedItems = [];

  const maxLimit = config.calculatorItemLimit || 40;
  const minRequired = config.minItemForDiscount || 2;
  const discountRate = config.discountRate || 0.20;

  // 1. 유효성 검사 및 기본 집계
  for (const product of productMaster) {
    const rawCount = selection[product.id];
    const count = Number.isInteger(rawCount) && rawCount > 0 ? rawCount : 0;

    if (count > 0) {
      const itemSubtotal = product.price * count;
      totalCount += count;
      subtotal += itemSubtotal;
      selectedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        count,
        itemSubtotal
      });
    }
  }

  // 한도 초과 검사
  const isOverLimit = totalCount > maxLimit;
  const safeTotalCount = Math.min(totalCount, maxLimit);

  // 2. 할인 조건 판정
  const isEligible = totalCount >= minRequired && !isOverLimit;
  let discountAmount = 0;
  let finalPayable = subtotal;
  let perMealPrice = null;
  let statusMessage = '';

  if (totalCount === 0) {
    statusMessage = '상품을 2개 이상 담아 20% 할인 가격을 확인해보세요.';
  } else if (totalCount === 1) {
    statusMessage = '1개를 더 담으시면 전 조합 20% 즉시 할인이 적용됩니다!';
    discountAmount = 0;
    finalPayable = subtotal;
  } else if (isOverLimit) {
    statusMessage = `선택 수량은 일일 할인 한도(총 ${maxLimit}개)를 초과할 수 없습니다.`;
  } else {
    // 2개 이상 선택: 20% 즉시 할인 적용
    discountAmount = Math.round(subtotal * discountRate);
    finalPayable = subtotal - discountAmount;
    statusMessage = `축하합니다! 20% 즉시 할인 혜택이 적용되었습니다.`;

    // 2개 선택 시에는 1끼 환산가(2끼 기준) 제공
    if (totalCount === 2) {
      perMealPrice = Math.round(finalPayable / 2);
    }
  }

  return {
    isValid: !isOverLimit,
    totalCount: safeTotalCount,
    rawTotalCount: totalCount,
    subtotal,
    isEligible,
    discountAmount,
    finalPayable,
    perMealPrice,
    statusMessage,
    selectedItems,
    maxLimitReached: totalCount >= maxLimit
  };
}

/**
 * 프로모션 타임라인 및 KST 시간 판정 모듈 (schedule.js)
 * 브라우저 현지 시간대와 무관하게 Asia/Seoul 기준 평가
 */

import { CAMPAIGN_CONFIG } from './config.js';

/**
 * 주어진 시각(기본: 현재 시각)의 서울 기준 연, 월, 일, 시, 분 추출
 * @param {Date} [date=new Date()]
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number, dateStr: string }}
 */
export function getSeoulTimeParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CAMPAIGN_CONFIG.timeZone || 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const map = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }

  const year = parseInt(map.year, 10);
  const month = parseInt(map.month, 10);
  const day = parseInt(map.day, 10);
  const hour = parseInt(map.hour, 10);
  const minute = parseInt(map.minute, 10);

  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${year}-${pad(month)}-${pad(day)}`;

  return { year, month, day, hour, minute, dateStr };
}

/**
 * 프로모션 운영 상태 판정
 * @param {Date} [nowDate=new Date()]
 * @param {typeof CAMPAIGN_CONFIG} [config=CAMPAIGN_CONFIG]
 */
export function getScheduleStatus(nowDate = new Date(), config = CAMPAIGN_CONFIG) {
  const kst = getSeoulTimeParts(nowDate);

  const startDate = config.startDate; // '2026-10-21'
  const endDate = config.endDate;     // '2026-11-03'

  // 시작 시간 분할 (예: "12:00" -> 12시 0분)
  const [startHourStr, startMinStr] = (config.dailyStartTime || '12:00').split(':');
  const startHour = parseInt(startHourStr, 10);
  const startMin = parseInt(startMinStr, 10);

  let status = 'UPCOMING';
  let badgeText = '';
  let description = '';
  let badgeClass = '';

  if (kst.dateStr < startDate) {
    status = 'UPCOMING';
    badgeText = '10월 21일 수요일 시작 예정';
    description = '프로모션 오픈 준비 중입니다. 매일 12시 선착순 20세트 한정 진행됩니다.';
    badgeClass = 'badge-upcoming';
  } else if (kst.dateStr > endDate) {
    status = 'ENDED';
    badgeText = '프로모션 종료';
    description = '14일간의 프로모션이 종료되었습니다. 성원에 감사드립니다.';
    badgeClass = 'badge-ended';
  } else {
    // 행사 기간 내
    const currentMinutes = kst.hour * 60 + kst.minute;
    const targetMinutes = startHour * 60 + startMin;

    if (currentMinutes < targetMinutes) {
      status = 'TODAY_WAITING';
      badgeText = '오늘 낮 12:00 선착순 오픈 대기';
      description = `정오 12:00부터 센트럴점 매장에서 20% 즉시 할인이 적용됩니다.`;
      badgeClass = 'badge-waiting';
    } else {
      status = 'ACTIVE';
      badgeText = '오늘의 선착순 20세트 진행 중';
      description = `센트럴점 냉장 간편식 매대에서 진행 중입니다. (일 40개 한정, 소진 시 조기 마감)`;
      badgeClass = 'badge-active';
    }
  }

  const pad = (n) => String(n).padStart(2, '0');
  const kstTimeStr = `${kst.dateStr} ${pad(kst.hour)}:${pad(kst.minute)} (KST)`;

  return {
    status,
    badgeText,
    description,
    badgeClass,
    kstTimeStr,
    kst
  };
}

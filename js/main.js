/**
 * 애플리케이션 엔트리 포인트 (main.js)
 */

import { initUI, resetSelection, showNoticeToast } from './ui.js';
import { CAMPAIGN_CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. UI 및 데이터 초기화
  initUI();

  // 2. 초기화 버튼 이벤트 바인딩
  const resetBtn = document.getElementById('btnResetCalc');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetSelection);
  }

  // 3. 링크 공유하기 버튼 (Web Share API & Clipboard Fallback)
  const shareBtn = document.getElementById('btnSharePage');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: `${CAMPAIGN_CONFIG.storeName} 냉장 간편식 20% 프로모션`,
        text: '골라 담는 한 끼! 2개 이상 선택 시 20% 즉시 할인 (매일 12:00 선착순 20세트)',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // 사용자가 취소한 경우 조용히 처리
          if (err.name !== 'AbortError') {
            copyToClipboard(window.location.href);
          }
        }
      } else {
        copyToClipboard(window.location.href);
      }
    });
  }

  // 4. 부드러운 스크롤 네비게이션
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });

  console.info(`[Central Promotion] ${CAMPAIGN_CONFIG.campaignTitle} loaded successfully.`);
});

/**
 * 클립보드 복사 헬퍼
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showNoticeToast('프로모션 링크가 클립보드에 복사되었습니다!');
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNoticeToast('프로모션 링크가 복사되었습니다!');
    }
  } catch (err) {
    showNoticeToast('링크를 복사할 수 없습니다. URL을 직접 복사해주세요.');
  }
}

import { useEffect } from 'react';

const CARD_SELECTOR = '.stat-card, .card';

function resetCard(card) {
  card.classList.remove('is-popped');
}

export function useCardPop(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleOver = (e) => {
      const card = e.target.closest(CARD_SELECTOR);
      container.querySelectorAll(`${CARD_SELECTOR}.is-popped`).forEach((el) => {
        if (el !== card) resetCard(el);
      });
      if (card) card.classList.add('is-popped');
    };

    const handleLeave = () => {
      container.querySelectorAll(`${CARD_SELECTOR}.is-popped`).forEach(resetCard);
    };

    container.addEventListener('mouseover', handleOver);
    container.addEventListener('mouseleave', handleLeave);

    return () => {
      container.removeEventListener('mouseover', handleOver);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, [containerRef]);
}

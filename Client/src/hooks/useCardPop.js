import { useEffect } from 'react';

const CARD_SELECTOR = '.stat-card, .card';

function resetCard(card) {
  card.classList.remove('is-popped');
  card.style.removeProperty('--tilt-x');
  card.style.removeProperty('--tilt-y');
}

export function useCardPop(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e) => {
      const card = e.target.closest(CARD_SELECTOR);

      container.querySelectorAll(`${CARD_SELECTOR}.is-popped`).forEach((el) => {
        if (el !== card) resetCard(el);
      });

      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty('--tilt-x', `${(y * -5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
      card.classList.add('is-popped');
    };

    const handleLeave = () => {
      container.querySelectorAll(`${CARD_SELECTOR}.is-popped`).forEach(resetCard);
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, [containerRef]);
}

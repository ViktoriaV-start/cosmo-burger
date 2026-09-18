import { type RefObject, useRef, useState } from 'react';

import type { IngredientType } from '@utils/types.ts';

export const useBurgerIngredients = () => {
  const [activeTab, setActiveTab] = useState<IngredientType>('bun');

  const containerRef = useRef<HTMLDivElement>(null);
  const bunsTitleRef = useRef<HTMLHeadingElement>(null);
  const saucesTitleRef = useRef<HTMLHeadingElement>(null);
  const mainsTitleRef = useRef<HTMLHeadingElement>(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const titleRefs: {
      type: IngredientType;
      ref: RefObject<HTMLHeadingElement | null>;
    }[] = [
      { type: 'bun', ref: bunsTitleRef },
      { type: 'sauce', ref: saucesTitleRef },
      { type: 'main', ref: mainsTitleRef },
    ];

    let closestType = activeTab;
    let minDistance = Infinity;

    titleRefs.forEach(({ type, ref }) => {
      const title = ref.current;
      if (!title) return;

      const titleRect = title.getBoundingClientRect();
      const distance =
        Math.abs(titleRect.top - containerRect.top) +
        Math.abs(titleRect.left - containerRect.left);

      if (distance < minDistance) {
        minDistance = distance;
        closestType = type;
      }
    });

    setActiveTab(closestType);
  };

  return {
    activeTab,
    containerRef,
    bunsTitleRef,
    saucesTitleRef,
    mainsTitleRef,
    handleScroll,
  };
};

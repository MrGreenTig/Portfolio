(function (globalScope, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    globalScope.sliderUtils = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const BREAKPOINTS = [
    { limit: 600, cards: 1 },
    { limit: 900, cards: 2 },
    { limit: 1200, cards: 3 }
  ];

  function resolveViewportWidth(width) {
    if (typeof width === 'number' && Number.isFinite(width)) {
      return Math.max(0, width);
    }

    if (typeof window !== 'undefined' && typeof window.innerWidth === 'number') {
      return Math.max(0, window.innerWidth);
    }

    return 0;
  }

  function getVisibleCards(width) {
    const viewportWidth = resolveViewportWidth(width);

    for (const breakpoint of BREAKPOINTS) {
      if (viewportWidth < breakpoint.limit) {
        return breakpoint.cards;
      }
    }

    return 4;
  }

  return {
    getVisibleCards
  };
});

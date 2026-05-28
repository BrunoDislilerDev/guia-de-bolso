/** Motion — cinematográfico, discreto (Linear / Apple). */
export const easePremium = [0.16, 1, 0.3, 1];
export const easeOutSoft = [0.22, 1, 0.36, 1];

const transitionPremium = { duration: 0.75, ease: easePremium };
const transitionHero = { duration: 0.9, ease: easePremium };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPremium,
  },
};

export const fadeUpHero = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionHero,
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.65, ease: easePremium },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

export const staggerHero = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.12 },
  },
};

export const staggerSlow = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easePremium },
  },
};

/** Flutuação do device — amplitude mínima. */
export const floatDevice = {
  animate: {
    y: [0, -7, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Cards flutuantes no hero — fase deslocada por índice.
 * @param {number} index
 * @returns {object}
 */
export function floatCard(index = 0) {
  const delay = index * 0.8;
  return {
    animate: {
      y: [0, index % 2 === 0 ? -6 : 6, 0],
      rotate: [0, index % 2 === 0 ? 1.5 : -1.5, 0],
      transition: {
        duration: 8 + index,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
  };
}

/** Hover sutil para cards e tiles. */
export const hoverLift = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.4, ease: easeOutSoft },
  },
};

/** @type {import('framer-motion').ViewportOptions} */
export const defaultViewport = {
  once: true,
  margin: "-48px 0px -48px 0px",
  amount: 0.14,
};

/** @type {import('framer-motion').Transition} */
export const navbarTransition = {
  duration: 0.45,
  ease: easePremium,
};

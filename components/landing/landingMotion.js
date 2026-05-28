/** Motion — cinematográfico, discreto (Apple / Linear / Stripe). */
export const easePremium = [0.16, 1, 0.3, 1];
export const easeOutSoft = [0.22, 1, 0.36, 1];
export const easeAmbient = [0.25, 0.1, 0.25, 1];
export const easeCinematic = [0.19, 1, 0.22, 1];

const transitionPremium = { duration: 0.95, ease: easePremium };
const transitionHero = { duration: 1.15, ease: easeCinematic };
const transitionReveal = { duration: 1.05, ease: easeCinematic };
const transitionLite = { duration: 0.38, ease: easeOutSoft };

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPremium,
  },
};

/** Reveal mais lento — seções editoriais. */
export const fadeUpCinematic = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transitionReveal,
  },
};

/** Mobile — só opacity/translate, sem blur (GPU-friendly). */
export const fadeUpLite = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionLite,
  },
};

export const fadeInstant = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpHero = {
  hidden: { opacity: 0, y: 28 },
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
    transition: { duration: 0.8, ease: easeAmbient },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.08 },
  },
};

export const staggerCinematic = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.12 },
  },
};

export const staggerLite = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.03 },
  },
};

export const staggerHero = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.14 },
  },
};

export const staggerSlow = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.975 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.95, ease: easePremium },
  },
};

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1, ease: easeCinematic },
  },
};

export const scaleRevealLite = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionLite,
  },
};

/** Flutuação do device — amplitude mínima. */
export const floatDevice = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 9,
      repeat: Infinity,
      ease: easeAmbient,
    },
  },
};

/** Ainda mais sutil — showcase secundário. */
export const floatDeviceSoft = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 11,
      repeat: Infinity,
      ease: easeAmbient,
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
      y: [0, index % 2 === 0 ? -4 : 4, 0],
      rotate: [0, index % 2 === 0 ? 1 : -1, 0],
      transition: {
        duration: 10 + index,
        repeat: Infinity,
        ease: easeAmbient,
        delay,
      },
    },
  };
}

/** Hover sutil para cards e tiles. */
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.008,
    transition: { duration: 0.55, ease: easeOutSoft },
  },
};

/** @type {import('framer-motion').ViewportOptions} */
export const defaultViewport = {
  once: true,
  margin: "-64px 0px -64px 0px",
  amount: 0.12,
};

/** Viewport mais cedo no mobile — menos trabalho durante scroll rápido. */
export const liteViewport = {
  once: true,
  margin: "0px 0px -8% 0px",
  amount: 0.06,
};

/** @type {import('framer-motion').Transition} */
export const navbarTransition = {
  duration: 0.65,
  ease: easePremium,
};

/** Motion — discreto, estilo produto premium. */
export const easePremium = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easePremium },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: easePremium },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easePremium },
  },
};

/** @type {import('framer-motion').ViewportOptions} */
export const defaultViewport = {
  once: true,
  margin: "-80px 0px -80px 0px",
  amount: 0.15,
};

// Reusable Framer Motion Variants for Premium Animations

export const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -15,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      delay: custom * 0.1, 
      ease: [0.16, 1, 0.3, 1] 
    }
  })
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: (custom: number = 0) => ({
    opacity: 1,
    transition: { 
      duration: 0.6, 
      delay: custom * 0.1, 
      ease: 'easeOut' 
    }
  })
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const scaleOnHover = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  whileTap: { scale: 0.98 }
};

export const cardHover = {
  initial: { y: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  whileHover: { 
    y: -8, 
    boxShadow: '0 20px 25px -5px rgba(255, 122, 0, 0.08), 0 10px 10px -5px rgba(255, 122, 0, 0.03)',
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInRight = {
  initial: { x: 50, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

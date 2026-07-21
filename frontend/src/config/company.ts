export const company = {
  brand: '',
  tagline: '',
  logos: {
    primary: '/images/logo/jiyoni-logo.png',
    secondary: '/images/logo/jlogo.png',
  },
  contact: {
    phone1: '+91 7572962523',
    phone2: '+91 9265564170',
    email: 'parmardarshitp@gmail.com',
    instagram: 'https://www.instagram.com/jiyoni_sanitary_pads',
  },
  availableSizes: [
    {
      key: 'XL',
      label: 'XL',
      dimensions: '280 mm',
      piecesPerBox: 34,
    },
    {
      key: 'XXL',
      label: 'XXL',
      dimensions: '320 mm',
      piecesPerBox: 20,
    },
    {
      key: 'XXXL',
      label: 'XXXL',
      dimensions: '380 mm',
      piecesPerBox: 16,
    },
  ],
} as const;


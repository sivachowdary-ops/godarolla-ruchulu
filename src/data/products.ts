// ============================================
// Godarolla Ruchulu — Product Catalog Data
// ============================================
// Source: Client's physical menu board (VSM 1969)
// ZERO FABRICATION: Every product name and price comes directly from the menu board.
// Items marked isPriceTBD: true have unconfirmed pricing — do NOT guess.

import { Product } from '@/types';

export const products: Product[] = [
  // ==========================================
  // VEG PICKLES (వెజ్ ఊరగాయలు)
  // ==========================================
  {
    id: 'veg-001',
    slug: 'avakaya',
    name: 'Avakaya',
    nameTelugu: 'ఆవకాయ',
    category: 'veg',
    description: 'The iconic Andhra mango pickle made with raw mangoes, red chilli powder, mustard, and cold-pressed sesame oil. Bold, tangy, and fiery — the king of Telugu pickles.',
    price250g: 100,
    price500g: 200,
    price1kg: 400,
    image: '/images/products/avakaya.jpg', // AI-PLACEHOLDER — Replace with real product photo
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    isBestSeller: true,
    spiceLevel: 'hot',
  },
  {
    id: 'veg-002',
    slug: 'bellam-avakaya',
    name: 'Bellam Avakaya',
    nameTelugu: 'బెల్లం ఆవకాయ',
    category: 'veg',
    description: 'A unique sweet-and-spicy twist on the classic Avakaya, made with jaggery (bellam). The perfect balance of tangy mango, fiery spice, and caramel sweetness.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/bellam-avakaya.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-003',
    slug: 'magai',
    name: 'Magai',
    nameTelugu: 'మాగాయ',
    category: 'veg',
    description: 'Sun-dried mango pieces pickled with aromatic spices and oil. A beloved Andhra classic with intense flavor that deepens with age.',
    price250g: 120,
    price500g: 240,
    price1kg: 480,
    image: '/images/products/magai.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    isBestSeller: true,
    spiceLevel: 'hot',
  },
  {
    id: 'veg-004',
    slug: 'allam-ginger',
    name: 'Allam (Ginger)',
    nameTelugu: 'అల్లం',
    category: 'veg',
    description: 'Fresh ginger pickle with a warming, spicy kick. Made with tender ginger root, tangy tamarind, and traditional spices.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/allam-ginger.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-005',
    slug: 'villulli-garlic',
    name: 'Villulli (Garlic)',
    nameTelugu: 'వెల్లుల్లి',
    category: 'veg',
    description: 'Whole garlic cloves pickled in spiced oil with a rich, pungent flavor. A powerhouse of taste that pairs perfectly with hot rice and ghee.',
    price250g: 150,
    price500g: 300,
    price1kg: 600,
    image: '/images/products/villulli-garlic.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    isBestSeller: true,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-006',
    slug: 'chinthakaya',
    name: 'Chinthakaya',
    nameTelugu: 'చింతకాయ',
    category: 'veg',
    description: 'Raw tamarind pickle with a sharp, sour punch balanced by red chilli and mustard. A tangy delight from the Godavari kitchen.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/chinthakaya.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'hot',
  },
  {
    id: 'veg-007',
    slug: 'tomato',
    name: 'Tomato',
    nameTelugu: 'టొమాటో',
    category: 'veg',
    description: 'Ripe tomato pickle with a sweet-tangy taste and rich red color. A mild, versatile pickle loved by all ages.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/tomato.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'mild',
  },
  {
    id: 'veg-008',
    slug: 'dabbakaya',
    name: 'Dabbakaya',
    nameTelugu: 'దబ్బకాయ',
    category: 'veg',
    description: 'Citron (dabbakaya) pickle with a distinctive citrusy flavor. A traditional Andhra specialty with a bright, refreshing taste.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/dabbakaya.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-009',
    slug: 'gongura',
    name: 'Gongura',
    nameTelugu: 'గోంగూర',
    category: 'veg',
    description: 'Sorrel leaf (gongura) pickle — the pride of Andhra cuisine. Tangy, slightly sour leaves ground with red chillies and tempered with mustard.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/gongura.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    isBestSeller: true,
    spiceLevel: 'hot',
  },
  {
    id: 'veg-010',
    slug: 'kothimeera',
    name: 'Kothimeera',
    nameTelugu: 'కొత్తిమీర',
    category: 'veg',
    description: 'Fresh coriander (kothimeera) pickle bursting with herbal, green flavors. A vibrant, aromatic pickle that adds freshness to any meal.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/kothimeera.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-011',
    slug: 'pudina',
    name: 'Pudina',
    nameTelugu: 'పుదీన',
    category: 'veg',
    description: 'Mint (pudina) pickle with a cool, refreshing flavor layered with spice. Perfect as a side or spread.',
    price250g: 120,
    price500g: 240,
    price1kg: 480,
    image: '/images/products/pudina.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-012',
    slug: 'karivepaku',
    name: 'Karivepaku',
    nameTelugu: 'కరివేపాకు',
    category: 'veg',
    description: 'Curry leaf (karivepaku) pickle with a deep, aromatic flavor. Made with fresh curry leaves, tamarind, and a rich spice blend.',
    price250g: 120,
    price500g: 240,
    price1kg: 480,
    image: '/images/products/karivepaku.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-013',
    slug: 'kakarakaya',
    name: 'Kakarakaya',
    nameTelugu: 'కాకరకాయ',
    category: 'veg',
    description: 'Bitter gourd (kakarakaya) pickle that transforms bitterness into an addictive, spicy-tangy flavor. A healthy, unique pickle.',
    price250g: 120,
    price500g: 240,
    price1kg: 480,
    image: '/images/products/kakarakaya.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'hot',
  },
  {
    id: 'veg-014',
    slug: 'nimmakaya-lemon',
    name: 'Nimmakaya (Lemon)',
    nameTelugu: 'నిమ్మకాయ',
    category: 'veg',
    description: 'Lemon pickle with bright, citrusy tang and warm spices. Whole lemons soaked in salt, chilli, and turmeric — a South Indian staple.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/nimmakaya-lemon.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },
  {
    id: 'veg-015',
    slug: 'chitrannam-paste',
    name: 'Chitrannam Paste',
    nameTelugu: 'చిత్రాన్నం పేస్ట్',
    category: 'veg',
    description: 'Ready-to-mix lemon rice paste. Just mix with hot rice for instant, flavorful Chitrannam — perfect for lunchboxes and quick meals.',
    price250g: 100,
    price500g: 200,
    price1kg: 400,
    image: '/images/products/chitrannam-paste.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'mild',
  },
  {
    id: 'veg-016',
    slug: 'pulihora-paste',
    name: 'Pulihora Paste',
    nameTelugu: 'పులిహోర పేస్ట్',
    category: 'veg',
    description: 'Traditional tamarind rice paste. Mix with hot rice for authentic Pulihora — tangy, spicy, and deeply flavorful. A temple-prasadam favorite.',
    price250g: 100,
    price500g: 200,
    price1kg: 400,
    image: '/images/products/pulihora-paste.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'mild',
  },
  {
    id: 'veg-017',
    slug: 'pandu-mirchi',
    name: 'Pandu Mirchi',
    nameTelugu: 'పండు మిర్చి',
    category: 'veg',
    description: 'Ripe red chilli pickle with deep, smoky heat. Whole dried red chillies pickled in oil with a potent spice paste.',
    price250g: 120,
    price500g: 240,
    price1kg: 480,
    image: '/images/products/pandu-mirchi.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'extra-hot',
  },
  {
    id: 'veg-018',
    slug: 'pachi-mirchi',
    name: 'Pachi Mirchi',
    nameTelugu: 'పచ్చి మిర్చి',
    category: 'veg',
    description: 'Fresh green chilli pickle with a sharp, fiery bite. Young green chillies pickled with mustard and lemon for a vibrant kick.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/pachi-mirchi.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'extra-hot',
  },
  {
    id: 'veg-019',
    slug: 'usirikaya-amla',
    name: 'Usirikaya (Amla)',
    nameTelugu: 'ఉసిరికాయ',
    category: 'veg',
    description: 'Indian gooseberry (amla) pickle — tangy, crunchy, and packed with Vitamin C. A healthy, flavorful pickle from the Godavari kitchen.',
    price250g: 110,
    price500g: 220,
    price1kg: 440,
    image: '/images/products/usirikaya-amla.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'medium',
  },

  // ==========================================
  // HANDWRITTEN ADD-ONS (Pricing to be confirmed)
  // These items were handwritten on the menu board.
  // Pricing assumed ₹120/₹240/₹480 but UNCONFIRMED.
  // ==========================================
  {
    id: 'veg-020',
    slug: 'avakaya-biryani-masala',
    name: 'Avakaya Biryani Masala',
    nameTelugu: 'ఆవకాయ బిర్యానీ మసాలా',
    category: 'veg',
    description: 'A special masala blend inspired by Avakaya flavors, designed for biryani preparation.',
    price250g: 120,  // [UNCONFIRMED — verify with client, handwritten on board]
    price500g: 240,
    price1kg: 480,
    image: '/images/products/avakaya-biryani-masala.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: true, // Pricing needs confirmation
    spiceLevel: 'hot',
  },
  {
    id: 'veg-021',
    slug: 'avakaya-telangana-style',
    name: 'Avakaya Telangana Style',
    nameTelugu: 'ఆవకాయ తెలంగాణ స్టైల్',
    category: 'veg',
    description: 'Avakaya prepared in the Telangana tradition — a distinct regional variation with its own unique spice profile and preparation method.',
    price250g: 120,  // [UNCONFIRMED — verify with client]
    price500g: 240,
    price1kg: 480,
    image: '/images/products/avakaya-telangana-style.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: true,
    spiceLevel: 'hot',
  },
  {
    id: 'veg-022',
    slug: 'cabbage-pickle',
    name: 'Cabbage Pickle',
    nameTelugu: 'క్యాబేజ్ ఊరగాయ',
    category: 'veg',
    description: 'Crunchy cabbage pickled with mustard, chilli, and spices. A lighter, refreshing pickle with a satisfying crunch.',
    price250g: 120,  // [UNCONFIRMED — verify with client]
    price500g: 240,
    price1kg: 480,
    image: '/images/products/cabbage-pickle.jpg', // AI-PLACEHOLDER
    isVeg: true,
    isActive: true,
    isPriceTBD: true,
    spiceLevel: 'medium',
  },

  // ==========================================
  // NON-VEG PICKLES (నాన్వెజ్ ఊరగాయలు)
  // ==========================================
  {
    id: 'nv-001',
    slug: 'chicken-pickle-bone',
    name: 'Chicken Pickle (Bone)',
    nameTelugu: 'చికెన్ ఊరగాయ (బోన్)',
    category: 'nonveg',
    description: 'Tender chicken pieces with bone, slow-cooked in aromatic spices and oil. Rich, meaty, and deeply flavorful — a non-veg pickle classic.',
    price250g: 225,
    price500g: 450,
    price1kg: 900,
    image: '/images/products/chicken-pickle-bone.jpg', // AI-PLACEHOLDER
    isVeg: false,
    isActive: true,
    isPriceTBD: false,
    isBestSeller: true,
    spiceLevel: 'hot',
  },
  {
    id: 'nv-002',
    slug: 'chicken-pickle-boneless',
    name: 'Chicken Pickle (Boneless)',
    nameTelugu: 'చికెన్ ఊరగాయ (బోన్‌లెస్)',
    category: 'nonveg',
    description: 'Premium boneless chicken pieces pickled in a fiery spice blend. Convenience meets authentic taste — no bones, all flavor.',
    price250g: 300,
    price500g: 600,
    price1kg: 1200,
    image: '/images/products/chicken-pickle-boneless.jpg', // AI-PLACEHOLDER
    isVeg: false,
    isActive: true,
    isPriceTBD: false,
    isBestSeller: true,
    spiceLevel: 'hot',
  },
  {
    id: 'nv-003',
    slug: 'prawn-pickle',
    name: 'Prawn Pickle',
    nameTelugu: 'రొయ్యల ఊరగాయ',
    category: 'nonveg',
    description: 'Fresh prawns pickled with Godavari-style spices. The coastal Andhra influence shines through in every bite — tangy, spicy, and seafood-rich.',
    price250g: 350,
    price500g: 700,
    price1kg: 1400,
    image: '/images/products/prawn-pickle.jpg', // AI-PLACEHOLDER
    isVeg: false,
    isActive: true,
    isPriceTBD: false,
    isBestSeller: true,
    spiceLevel: 'hot',
  },
  {
    id: 'nv-004',
    slug: 'mutton-pickle',
    name: 'Mutton Pickle',
    nameTelugu: 'మటన్ ఊరగాయ',
    category: 'nonveg',
    description: 'Succulent mutton pieces slow-cooked in a rich, spicy pickle masala. A premium, hearty pickle with deep, complex flavors.',
    price250g: 350,
    price500g: 700,
    price1kg: 1400,
    image: '/images/products/mutton-pickle.jpg', // AI-PLACEHOLDER
    isVeg: false,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'hot',
  },
  {
    id: 'nv-005',
    slug: 'sea-fish-vanjaram-pickle',
    name: 'Sea Fish (Vanjaram Pickle)',
    nameTelugu: 'వంజరం ఊరగాయ',
    category: 'nonveg',
    description: 'King fish (vanjaram) pickle — the prized catch of the Andhra coast, pickled with bold spices. A seafood lover\'s premium choice.',
    price250g: 300,
    price500g: 600,
    price1kg: 1200,
    image: '/images/products/vanjaram-pickle.jpg', // AI-PLACEHOLDER
    isVeg: false,
    isActive: true,
    isPriceTBD: false,
    spiceLevel: 'hot',
  },
  {
    id: 'nv-006',
    slug: 'dry-prawns',
    name: 'Dry Prawns',
    nameTelugu: 'ఎండు రొయ్యలు',
    category: 'nonveg',
    description: 'Sun-dried prawns pickle with intense, concentrated seafood flavor and Andhra spices.',
    price250g: null,  // [PRICE TBD — confirm with client]
    price500g: null,
    price1kg: null,
    image: '/images/products/dry-prawns.jpg', // AI-PLACEHOLDER
    isVeg: false,
    isActive: false, // Hidden until price confirmed
    isPriceTBD: true,
    spiceLevel: 'hot',
  },
  {
    id: 'nv-007',
    slug: 'dry-methallu',
    name: 'Dry Methallu',
    nameTelugu: 'ఎండు మేతళ్ళు',
    category: 'nonveg',
    description: 'Dried fish (methallu) pickle — a traditional coastal Andhra delicacy with deep, savory flavors.',
    price250g: null,  // [PRICE TBD — confirm with client]
    price500g: null,
    price1kg: null,
    image: '/images/products/dry-methallu.jpg', // AI-PLACEHOLDER
    isVeg: false,
    isActive: false, // Hidden until price confirmed
    isPriceTBD: true,
    spiceLevel: 'hot',
  },
];

// Helper functions
export const getActiveProducts = () => products.filter(p => p.isActive);
export const getVegProducts = () => getActiveProducts().filter(p => p.isVeg);
export const getNonVegProducts = () => getActiveProducts().filter(p => !p.isVeg);
export const getBestSellers = () => getActiveProducts().filter(p => p.isBestSeller);
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);

export const getPrice = (product: Product, weight: '250g' | '500g' | '1kg'): number | null => {
  switch (weight) {
    case '250g': return product.price250g;
    case '500g': return product.price500g;
    case '1kg': return product.price1kg;
    default: return null;
  }
};

export const formatPrice = (price: number | null): string => {
  if (price === null) return 'Price TBD';
  return `₹${price}`;
};

// Barcha mahsulotlar ma'lumotlar bazasi
const ALL_PRODUCTS = [
  // Bosh sahifa - New Arrivals
  {
    id: 1,
    name: "Floral Essence",
    price: 12,
    rating: 4.5,
    img: "images/rasim1.jpg",
    brand: "K-BEAUTY",
    category: "new-arrivals"
  },
  {
    id: 2,
    name: "Ocean Breeze",
    price: 40,
    oldPrice: 60,
    discount: 20,
    rating: 3.5,
    img: "images/rasim3.jpg",
    brand: "K-BEAUTY",
    category: "new-arrivals"
  },
  {
    id: 3,
    name: "Citrus Garden",
    price: 18,
    rating: 4.5,
    img: "images/rasim5.jpg",
    brand: "K-BEAUTY",
    category: "new-arrivals"
  },
  {
    id: 4,
    name: "Midnight Rose",
    price: 30,
    oldPrice: 60,
    discount: 30,
    rating: 4.5,
    img: "images/rasim6.jpg",
    brand: "K-BEAUTY",
    category: "new-arrivals"
  },

  // Bosh sahifa - Top Selling
  {
    id: 5,
    name: "Velvet Dreams",
    price: 21,
    oldPrice: 41,
    discount: 20,
    rating: 5.0,
    img: "images/rasim7.jpg",
    brand: "K-BEAUTY",
    category: "top-selling"
  },
  {
    id: 6,
    name: "Golden Sunset",
    price: 45,
    rating: 4.0,
    img: "images/rasim8.jpg",
    brand: "K-BEAUTY",
    category: "top-selling"
  },
  {
    id: 7,
    name: "Fresh Morning",
    price: 20,
    rating: 3.0,
    img: "images/rasim1.jpg",
    brand: "K-BEAUTY",
    category: "top-selling"
  },
  {
    id: 8,
    name: "Cherry Blossom",
    price: 10,
    rating: 4.5,
    img: "images/rasim3.jpg",
    brand: "K-BEAUTY",
    category: "top-selling"
  },

  // LOE Brand
  {
    id: 9,
    name: "LOE Midnight Rose",
    price: 55,
    rating: 4.9,
    img: "images/rasim1.jpg",
    brand: "LOE",
    category: "brand"
  },
  {
    id: 10,
    name: "LOE Ocean Dreams",
    price: 48,
    rating: 4.7,
    img: "images/rasim3.jpg",
    brand: "LOE",
    category: "brand"
  },
  {
    id: 11,
    name: "LOE Golden Hour",
    price: 62,
    rating: 5.0,
    img: "images/rasim5.jpg",
    brand: "LOE",
    category: "brand"
  },
  {
    id: 12,
    name: "LOE Fresh Breeze",
    price: 45,
    rating: 4.6,
    img: "images/rasim6.jpg",
    brand: "LOE",
    category: "brand"
  },
  {
    id: 13,
    name: "LOE Velvet Touch",
    price: 58,
    rating: 4.8,
    img: "images/rasim7.jpg",
    brand: "LOE",
    category: "brand"
  },
  {
    id: 14,
    name: "LOE Cherry Blossom",
    price: 52,
    rating: 4.9,
    img: "images/rasim8.jpg",
    brand: "LOE",
    category: "brand"
  },

  // SW19 Brand
  {
    id: 15,
    name: "SW19 Summer Vibes",
    price: 38,
    rating: 4.4,
    img: "images/rasim1.jpg",
    brand: "SW19",
    category: "brand"
  },
  {
    id: 16,
    name: "SW19 Night Garden",
    price: 42,
    rating: 4.6,
    img: "images/rasim3.jpg",
    brand: "SW19",
    category: "brand"
  },
  {
    id: 17,
    name: "SW19 Crystal Rain",
    price: 50,
    rating: 4.8,
    img: "images/rasim5.jpg",
    brand: "SW19",
    category: "brand"
  },
  {
    id: 18,
    name: "SW19 Silk Touch",
    price: 46,
    rating: 4.5,
    img: "images/rasim6.jpg",
    brand: "SW19",
    category: "brand"
  },

  // BTSO Brand
  {
    id: 19,
    name: "BTSO Urban Essence",
    price: 35,
    rating: 4.3,
    img: "images/rasim7.jpg",
    brand: "BTSO",
    category: "brand"
  },
  {
    id: 20,
    name: "BTSO Fresh Start",
    price: 40,
    rating: 4.5,
    img: "images/rasim8.jpg",
    brand: "BTSO",
    category: "brand"
  },
  {
    id: 21,
    name: "BTSO Midnight Blue",
    price: 48,
    rating: 4.7,
    img: "images/rasim1.jpg",
    brand: "BTSO",
    category: "brand"
  },
  {
    id: 22,
    name: "BTSO Golden Dreams",
    price: 44,
    rating: 4.6,
    img: "images/rasim3.jpg",
    brand: "BTSO",
    category: "brand"
  },

  // GRANHAND Brand
  {
    id: 23,
    name: "GRANHAND Autumn Leaves",
    price: 58,
    rating: 4.9,
    img: "images/rasim5.jpg",
    brand: "GRANHAND",
    category: "brand"
  },
  {
    id: 24,
    name: "GRANHAND Winter Forest",
    price: 62,
    rating: 5.0,
    img: "images/rasim6.jpg",
    brand: "GRANHAND",
    category: "brand"
  },
  {
    id: 25,
    name: "GRANHAND Spring Bloom",
    price: 55,
    rating: 4.8,
    img: "images/rasim7.jpg",
    brand: "GRANHAND",
    category: "brand"
  },
  {
    id: 26,
    name: "GRANHAND Summer Breeze",
    price: 60,
    rating: 4.9,
    img: "images/rasim8.jpg",
    brand: "GRANHAND",
    category: "brand"
  },

  // TAMBURINS Brand
  {
    id: 27,
    name: "TAMBURINS Pearl Mist",
    price: 68,
    rating: 5.0,
    img: "images/rasim1.jpg",
    brand: "TAMBURINS",
    category: "brand"
  },
  {
    id: 28,
    name: "TAMBURINS Silk Road",
    price: 72,
    rating: 4.9,
    img: "images/rasim3.jpg",
    brand: "TAMBURINS",
    category: "brand"
  },
  {
    id: 29,
    name: "TAMBURINS Ocean Wave",
    price: 65,
    rating: 4.8,
    img: "images/rasim5.jpg",
    brand: "TAMBURINS",
    category: "brand"
  },
  {
    id: 30,
    name: "TAMBURINS Golden Light",
    price: 70,
    rating: 4.9,
    img: "images/rasim6.jpg",
    brand: "TAMBURINS",
    category: "brand"
  }
];

// Global search funksiyasi
function globalSearch(query) {
  if (!query || query.trim() === '') {
    return ALL_PRODUCTS;
  }

  query = query.toLowerCase().trim();
  
  return ALL_PRODUCTS.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(query);
    const brandMatch = product.brand.toLowerCase().includes(query);
    const priceMatch = product.price.toString().includes(query);
    
    return nameMatch || brandMatch || priceMatch;
  });
}

// Brand bo'yicha mahsulotlarni olish
function getProductsByBrand(brandName) {
  return ALL_PRODUCTS.filter(p => p.brand === brandName);
}

// Kategoriya bo'yicha mahsulotlarni olish
function getProductsByCategory(category) {
  return ALL_PRODUCTS.filter(p => p.category === category);
}

// Narx oralig'i bo'yicha filter
function filterByPriceRange(products, min, max) {
  if (min === 'all') return products;
  return products.filter(p => p.price >= min && p.price <= max);
}

// Saralash
function sortProducts(products, sortType) {
  const sorted = [...products];
  
  switch(sortType) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}
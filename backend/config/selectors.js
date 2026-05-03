module.exports = {
  supervin: {
    name: 'Supervin',
    url: 'https://www.supervin.dk/search?q=',
    selectors: {
      container: 'article',
      wineName: 'h4 a, .product-info h4 a',
      price: '.base-price, .price',
      discountPrice: '.volume-discounted-price',
      productLink: 'h4 a, .product-image a'
    },
    productPage: {
      name: 'h1',
      price: '.base-price',
      discountPrice: '.volume-discounted-price'
    },
    domain: 'supervin.dk'
  },

  andrupvin: {
    name: 'Andrupvin',
    url: 'https://www.andrupvin.dk/search?q=',
    selectors: {
      container: '.product-item',
      wineName: '.product-title',
      price: '.product-price, .price',
      discountPrice: '.discount-price, .sale-price',
      productLink: 'a'
    },
    domain: 'andrupvin.dk'
  },

  laudrupvin: {
    name: 'Laudrupvin',
    url: 'https://laudrup.dk/catalogsearch/result/?q=',
    selectors: {
      container: '.product-item-info',
      wineName: 'strong.product-item-name a, .product-item-name a',
      price: '.price-final_price .price, .price',
      discountPrice: '.minimal-price-link .price',
      productLink: '.product-item-link, a.product-photo'
    },
    productPage: {
      name: 'h1.page-title, h1',
      price: '.price-final_price .price',
      discountPrice: '.price-tier_price .price'
    },
    domain: 'laudrup.dk',
    notes: 'Note: Search shows bulk discount price (204 for 12), single bottle is 266'
  },

  justvin: {
    name: 'Justvin',
    url: 'https://www.justvin.dk/search?q=',
    selectors: {
      container: '.product-item',
      wineName: '.product-title',
      price: '.product-price, .price',
      discountPrice: '.discount-price, .sale-price',
      productLink: 'a'
    },
    domain: 'justvin.dk'
  },

  havnensvin: {
    name: 'Havnens Vin',
    url: 'https://havnens-vin.dk/catalogsearch/result/?q=',
    selectors: {
      container: 'li.product-item, li.item, div.product-item, div.product',
      wineName: 'strong.product-item-name a, .product-item-name a, h2.product-name, .product-title',
      price: 'span.price, .price, [data-price], .product-price, .price-final_price',
      discountPrice: '.old-price, .sale-price, .discount-price',
      productLink: 'a.product-item-link, a.product-link, a[href*=".html"]'
    },
    domain: 'havnens-vin.dk',
    notes: 'Multiple selector fallbacks for robustness'
  },

  skagenfood: {
    name: 'Skagen Food',
    url: 'https://skagenfood.dk/da-dk/soeg/?q=',
    selectors: {
      container: '.product-tile',
      wineName: 'h3.product-tile__headline',
      price: '.btn__inner-text',
      discountPrice: null,
      productLink: '.tile-description, a.product-tile__container'
    },
    productPage: {
      name: 'h1.store-product__headline, h1',
      price: '.product-prices__price',
      discountPrice: null
    },
    domain: 'skagenfood.dk'
  }
};

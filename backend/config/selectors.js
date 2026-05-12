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
      wineName: '.product-item-link',
      price: '.price-container.price-final_price .price',
      discountPrice: null,
      productLink: '.product-item-link'
    },
    productPage: {
      name: '.page-title',
      price: '.price-including-tax .price',
      discountPrice: null
    },
    domain: 'laudrup.dk'
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

  kjaersommerfeldt: {
    name: 'Kjær & Sommerfeldt',
    url: 'https://www.kjaersommerfeldt.dk/sog/?q=',
    selectors: {
      container: '.product-card__inner',
      wineName: '.product-link__name',
      price: '.product-price__price',
      discountPrice: null,
      productLink: 'a.product-link'
    },
    productPage: {
      name: 'h1.product-header__product-name',
      price: '.product-price__price',
      discountPrice: null
    },
    domain: 'kjaersommerfeldt.dk'
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

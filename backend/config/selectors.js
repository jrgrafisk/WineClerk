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
    url: 'https://www.laudrupvin.dk/search?q=',
    selectors: {
      container: '.product-item',
      wineName: '.product-title',
      price: '.product-price, .price',
      discountPrice: '.discount-price, .sale-price',
      productLink: 'a'
    },
    domain: 'laudrupvin.dk'
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
  }
};

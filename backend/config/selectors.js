module.exports = {
  supervin: {
    searchUrl: 'https://www.supervin.dk/search?q=',
    searchPage: {
      container: '.product-item',
      name: '.product-title',
      price: '.product-price',
      discountPrice: '.discount-price',
      url: 'a'
    },
    productPage: {
      url: 'window.location.href',
      name: 'h1.product-name',
      price: '[data-price]',
      discountPrice: '[data-sale-price]',
      description: '.product-description',
      vintage: '[data-vintage]',
      country: '[data-country]'
    }
  },
  andrupvin: {
    searchUrl: 'https://www.andrupvin.dk/search?q=',
    searchPage: {
      container: '.product-item',
      name: '.product-title',
      price: '.product-price',
      discountPrice: '.discount-price',
      url: 'a'
    },
    productPage: {
      url: 'window.location.href',
      name: 'h1.product-name',
      price: '[data-price]',
      discountPrice: '[data-sale-price]',
      description: '.product-description',
      vintage: '[data-vintage]',
      country: '[data-country]'
    }
  },
  laudrupvin: {
    searchUrl: 'https://www.laudrupvin.dk/search?q=',
    searchPage: {
      container: '.product-item',
      name: '.product-title',
      price: '.product-price',
      discountPrice: '.discount-price',
      url: 'a'
    },
    productPage: {
      url: 'window.location.href',
      name: 'h1.product-name',
      price: '[data-price]',
      discountPrice: '[data-sale-price]',
      description: '.product-description',
      vintage: '[data-vintage]',
      country: '[data-country]'
    }
  },
  justvin: {
    searchUrl: 'https://www.justvin.dk/search?q=',
    searchPage: {
      container: '.product-item',
      name: '.product-title',
      price: '.product-price',
      discountPrice: '.discount-price',
      url: 'a'
    },
    productPage: {
      url: 'window.location.href',
      name: 'h1.product-name',
      price: '[data-price]',
      discountPrice: '[data-sale-price]',
      description: '.product-description',
      vintage: '[data-vintage]',
      country: '[data-country]'
    }
  }
};

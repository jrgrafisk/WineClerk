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
    havnens vin: {
    searchUrl: 'https://havnens-vin.dk/catalogsearch/result/?q=',
    searchPage: {
      container: 'item product product-item scroll-reveal reveal-slide-in reveal-ready',
      name: 'product name product-item-name',
      price: 'price-container price-final_price tax weee',
      discountPrice: '.discount-price',
      url: 'a'
    },
    productPage: {
      url: 'window.location.href',
      name: 'page-title-wrapper product scroll-reveal reveal-slide-in reveal-ready',
      price: 'price-container price-final_price tax weee',
      discountPrice: '[data-sale-price]',
      description: 'description',
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
  },
  'havnens-vin': {
    searchUrl: 'https://havnens-vin.dk/catalogsearch/result/?q=',
    searchPage: {
      container: '.product.product-item',
      name: '.product-item-name',
      price: '.price-final_price',
      discountPrice: '.old-price',
      url: 'a'
    },
    productPage: {
      url: 'window.location.href',
      name: '.page-title-wrapper h1',
      price: '.price-final_price',
      discountPrice: '.old-price',
      description: '[itemprop="description"]',
      vintage: '[data-vintage]',
      country: '[data-country]'
    }
  }
};

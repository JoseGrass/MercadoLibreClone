import { supabase } from './supabase.js'

const app = document.getElementById('app')

// Función para obtener productos desde Supabase
async function fetchProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error al obtener productos:', error)
    renderFallbackProducts()
    return
  }

  if (products && products.length > 0) {
    renderProducts(products)
  } else {
    renderFallbackProducts()
  }
}

// Función para renderizar productos de Supabase en el nuevo diseño
function renderProducts(products) {
  if (!products.length) {
    renderFallbackProducts()
    return
  }

  const productHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250&h=180&fit=crop'}" alt="${p.nombre}" class="product-image" />
      <div class="product-price">$${p.precio?.toLocaleString('es-CO') || '0'} COP</div>
      <div class="product-discount">¡Oferta especial!</div>
      <div class="product-title">${p.nombre}</div>
      <div class="product-shipping">Envío gratis</div>
    </div>
  `).join('')

  app.innerHTML = productHTML
  
  // Add animation to new products
  setTimeout(() => {
    const productCards = app.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 100);
}

// Productos de fallback con diseño de MercadoLibre
function renderFallbackProducts() {
  const fallbackProducts = [
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=250&h=180&fit=crop",
      price: "$ 899.999",
      discount: "18% OFF",
      title: "Celular Samsung Galaxy A54 5G 128gb + 6gb Ram",
      shipping: "Envío gratis"
    },
    {
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=250&h=180&fit=crop",
      price: "$ 1.299.999",
      discount: "25% OFF",
      title: "Laptop Hp 15-ef2126wm Amd Ryzen 5 16gb 256gb Ssd",
      shipping: "Envío gratis"
    },
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=250&h=180&fit=crop",
      price: "$ 249.999",
      discount: "35% OFF",
      title: "Audífonos Bluetooth Sony Wh-ch720n Con Noise Cancelling",
      shipping: "Envío gratis"
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250&h=180&fit=crop",
      price: "$ 49.999",
      discount: "20% OFF",
      title: "Reloj Inteligente Smartwatch T500 44mm Bluetooth",
      shipping: "Envío gratis"
    },
    {
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=250&h=180&fit=crop",
      price: "$ 199.999",
      discount: "40% OFF",
      title: "Zapatillas Nike Air Max 270 Hombre Original",
      shipping: "Envío gratis"
    },
    {
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=250&h=180&fit=crop",
      price: "$ 1.899.999",
      discount: "15% OFF",
      title: "Smart Tv Samsung 55 4k Uhd Un55au7000",
      shipping: "Envío gratis"
    },
    {
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=250&h=180&fit=crop",
      price: "$ 89.999",
      discount: "30% OFF",
      title: "Cafetera Express Oster Prima Latte 15 Bares",
      shipping: "Envío gratis"
    },
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=250&h=180&fit=crop",
      price: "$ 159.999",
      discount: "22% OFF",
      title: "Nike Revolution 6 Next Nature Zapatillas De Running",
      shipping: "Envío gratis"
    }
  ]

  const productHTML = fallbackProducts.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}" class="product-image">
      <div class="product-price">${p.price}</div>
      <div class="product-discount">${p.discount}</div>
      <div class="product-title">${p.title}</div>
      <div class="product-shipping">${p.shipping}</div>
    </div>
  `).join('')

  app.innerHTML = productHTML
  
  // Add staggered animation
  setTimeout(() => {
    const productCards = app.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 100);
}

// Mostrar loading inicialmente
function showLoading() {
  if (!app) return;
  
  const loadingHTML = Array(8).fill(0).map(() => `
    <div class="product-card" style="background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite;">
      <div style="height: 180px; background: #e0e0e0; border-radius: 4px; margin-bottom: 10px;"></div>
      <div style="height: 24px; background: #e0e0e0; border-radius: 4px; margin-bottom: 5px; width: 70%;"></div>
      <div style="height: 14px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px; width: 40%;"></div>
      <div style="height: 14px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px;"></div>
      <div style="height: 12px; background: #e0e0e0; border-radius: 4px; width: 60%;"></div>
    </div>
  `).join('');

  app.innerHTML = loadingHTML;
}

// Ejecuta al cargar
document.addEventListener('DOMContentLoaded', () => {
  showLoading();
  
  // Fetch products after a short delay to show loading animation
  setTimeout(() => {
    fetchProducts();
  }, 1500);
});

// También exportar la función para que pueda ser llamada desde otros archivos
window.fetchProducts = fetchProducts;
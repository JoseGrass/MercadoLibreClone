import { supabase } from './supabase.js'
import { mostrarCRUDProductos } from './adminProducto.js' // Función CRUD del main
import { mostrarLogin } from './routes/login.js' // Función login del main4

const app = document.getElementById('app')
const adminBtn = document.getElementById('admin-btn') // Botón admin del main3
const adminModal = document.getElementById('adminModal') // Modal admin

// Productos de fallback con diseño de MercadoLibre (del main3)
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

/**
 * Función para validar sesión actual (del main4)
 */
async function validarSesion() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

/**
 * Aplica una animación escalonada a los elementos .product-card (del main3)
 * @param {NodeList} productCards - Colección de elementos .product-card.
 */
function applyStaggeredAnimation(productCards) {
  productCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100); // Retraso escalonado
  });
}

/**
 * Renderiza los productos obtenidos de Supabase en el DOM (unificado)
 * Combina el diseño mejorado del main3 con la funcionalidad del main4
 * @param {Array} products - Array de objetos producto desde Supabase.
 */
function renderProducts(products) {
  if (!app) return; // Asegurarse de que el contenedor existe

  if (!products || products.length === 0) {
    renderFallbackProducts(); // Si no hay productos de Supabase, muestra los de fallback
    return;
  }

  // Usar el formato mejorado del main3 con la funcionalidad del main4
  const productHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=250&h=180&fit=crop'}" alt="${p.nombre}" class="product-image" />
      <strong class="product-price">$${p.precio?.toLocaleString('es-CO') || '0'} COP</strong>
      <p class="product-discount">¡Oferta especial!</p>
      <h2 class="product-title">${p.nombre}</h2>
      ${p.descripcion ? `<p>${p.descripcion}</p>` : ''}
      <p class="product-shipping">Envío gratis</p>
    </div>
  `).join('')

  app.innerHTML = `<div class="products-grid">${productHTML}</div>` // Envuelve en products-grid
  
  // Aplica la animación a los productos renderizados
  setTimeout(() => {
    const productCards = app.querySelectorAll('.product-card');
    applyStaggeredAnimation(productCards);
  }, 100);
}

/**
 * Renderiza productos de fallback si no se pueden obtener de Supabase (del main3)
 */
function renderFallbackProducts() {
  if (!app) return;

  const productHTML = fallbackProducts.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}" class="product-image">
      <strong class="product-price">${p.price}</strong>
      <p class="product-discount">${p.discount}</p>
      <h2 class="product-title">${p.title}</h2>
      <p class="product-shipping">${p.shipping}</p>
    </div>
  `).join('')

  app.innerHTML = `<div class="products-grid">${productHTML}</div>`

  setTimeout(() => {
    const productCards = app.querySelectorAll('.product-card');
    applyStaggeredAnimation(productCards);
  }, 100);
}

/**
 * Muestra una animación de carga en el contenedor de productos (del main3)
 */
function showLoading() {
  if (!app) return;

  const tempDiv = document.createElement('div');
  tempDiv.className = 'products-grid';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.position = 'absolute';
  document.body.appendChild(tempDiv);
  
  const numColumns = parseInt(getComputedStyle(tempDiv).gridTemplateColumns.split(' ').length) || 4; 
  document.body.removeChild(tempDiv);

  const loadingHTML = Array(numColumns * 2).fill(0).map(() => `
    <div class="product-card" style="background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite;">
      <div style="height: 180px; background: #e0e0e0; border-radius: 4px; margin-bottom: 10px;"></div>
      <div style="height: 24px; background: #e0e0e0; border-radius: 4px; margin-bottom: 5px; width: 70%;"></div>
      <div style="height: 14px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px; width: 40%;"></div>
      <div style="height: 14px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px;"></div>
      <div style="height: 12px; background: #e0e0e0; border-radius: 4px; width: 60%;"></div>
    </div>
  `).join('');

  app.innerHTML = `<div class="products-grid">${loadingHTML}</div>`;
}

/**
 * Función principal para obtener productos desde Supabase (unificado)
 * Exportada para ser accesible desde otros módulos
 */
export async function fetchProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error al obtener productos:', error)
    if (app) {
      app.innerHTML = '<p>Error al cargar productos desde la base de datos. Mostrando productos de ejemplo.</p>';
      setTimeout(renderFallbackProducts, 1000);
    } else {
      renderFallbackProducts();
    }
    return
  }

  if (products && products.length > 0) {
    renderProducts(products)
  } else {
    renderFallbackProducts()
  }
}

/**
 * Función principal para mostrar contenido general (del main4, mejorado)
 */
window.General = function() {
  if (app) {
    showLoading(); // Agregar animación de carga del main3
    setTimeout(() => {
      fetchProducts();
    }, 800);
  }
}

/**
 * Función para mostrar datos de usuario (del main4)
 */
window.mostrarDatos = function() {
  if (app) {
    app.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h2>Datos del usuario</h2>
        <p>Contenido de usuario aquí...</p>
      </div>
    `;
  }
}

/**
 * Configurar navegación de usuario autenticado (del main4, mejorado)
 */
function setupAuthenticatedUserNav(user) {
  const existingNav = document.querySelector(".c-nav");
  if (existingNav) {
    existingNav.innerHTML = `
      <button class="c-nav-item" onclick="General()">Home</button>
      <button class="c-nav-item" onclick="mostrarDatos()">Usuario</button>
      <button class="c-nav-item" id="logoutBtn">Cerrar sesión</button>
    `;

    // Agregar listener para cerrar sesión
    logoutBtn.addEventListener('click', async () => {
  console.log("Clic en cerrar sesión");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error.message);
      } else {
        console.log("Sesión cerrada correctamente");
        location.reload(); // O redirige a login si quieres
      }
    });

    }
  }


/**
 * Configurar funcionalidad del botón admin (del main3, mejorado)
 */
async function setupAdminButton() {
  if (!adminBtn) return;

  const user = await validarSesion();
  
  // Verificar si es admin por email o por rol en user_metadata
  const isAdmin = user && (
    user.email === "jose.grassm@unigustiniana.edu.co" || 
    user.user_metadata?.role === 'admin'
  );

  if (isAdmin) {
    adminBtn.style.display = "inline-block";
  } else {
    adminBtn.style.display = "none";
  }

  // Event listener para abrir modal admin
  adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (adminModal) {
      adminModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    
    // Si existe la función mostrarCRUDProductos, llamarla también
    if (typeof mostrarCRUDProductos === 'function') {
      mostrarCRUDProductos();
    }
  });
}

/**
 * Configurar eventos de cierre para modal admin
 */
function setupAdminModalEvents() {
  if (!adminModal) return;

  const closeAdminBtn = document.getElementById('closeAdminModal');
  const adminOverlay = adminModal.querySelector('.login-modal-overlay');

  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', () => {
      adminModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  if (adminOverlay) {
    adminOverlay.addEventListener('click', () => {
      adminModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModal.style.display === 'flex') {
      adminModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

/**
 * Inicialización principal al cargar el DOM (unificado)
 * Combina la lógica de validación de sesión del main4 con las funcionalidades del main3
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Verificar que elementos principales existan
  if (!app) {
    console.error('No se encontró el contenedor #app. Asegúrate de que el HTML esté cargado correctamente.');
    return;
  }

  try {
    // 1. Validar sesión del usuario (del main4)
    const user = await validarSesion();
    
    if (!user) {
      // Usuario no autenticado - mostrar login (del main4)
      console.log('Usuario no autenticado, mostrando login...');
      if (typeof mostrarLogin === 'function') {
        mostrarLogin();
      } else {
        console.warn('Función mostrarLogin no disponible');
      }
    } else {
      // Usuario autenticado (combinado)
      console.log('Usuario logueado:', user.email);
      
      // 2. Configurar navegación para usuario autenticado (del main4)
      setupAuthenticatedUserNav(user);
      
      // 3. Configurar funcionalidad admin (del main3, mejorado con validación de sesión)
      await setupAdminButton();
      
      // 4. Configurar eventos del modal admin
      setupAdminModalEvents();
      
      // 5. Mostrar loading y cargar productos (del main3)
      showLoading();
      
      // 6. Cargar productos después de un retraso (del main3)
      setTimeout(() => {
        fetchProducts();
      }, 1500);
    }
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    
    // En caso de error, mostrar productos de fallback
    if (app) {
      app.innerHTML = '<p>Error durante la inicialización. Cargando contenido de ejemplo...</p>';
      setTimeout(renderFallbackProducts, 1000);
    }
  }
});

// Escuchar cambios en el estado de autenticación (agregado para mejor UX)
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, session?.user?.email);
  
  if (event === 'SIGNED_IN' && session?.user) {
    // Usuario acaba de iniciar sesión
    setupAuthenticatedUserNav(session.user);
    await setupAdminButton();
    General(); // Cargar contenido principal
  } else if (event === 'SIGNED_OUT') {
    // Usuario acaba de cerrar sesión
    if (typeof mostrarLogin === 'function') {
      mostrarLogin();
    } else {
      location.reload(); // Fallback si no hay función de login
    }
  }
});

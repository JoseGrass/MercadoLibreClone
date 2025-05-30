// Carousel functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.nav-dot');
const track = document.getElementById('carouselTrack');

function showSlide(index) {
    currentSlideIndex = index;
    if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
    showSlide(prevIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

// Make functions global so they can be called from HTML
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.currentSlide = currentSlide;

// Sample products data for demo
const sampleProducts = [
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
    }
];

// Auto-play carousel
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start auto-play
    if (slides.length > 0) {
        startAutoPlay();
        
        // Pause auto-play on hover
        const heroCarousel = document.querySelector('.hero-carousel');
        if (heroCarousel) {
            heroCarousel.addEventListener('mouseenter', stopAutoPlay);
            heroCarousel.addEventListener('mouseleave', startAutoPlay);
        }
    }

    // Setup search functionality
    setupSearch();
    
    // Setup offers scroll
    setupOffersScroll();
    
    // Setup category clicks
    setupCategoryClicks();
    
    // Setup sticky header
    setupStickyHeader();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add click effects to buttons and cards
    document.addEventListener('click', (e) => {
        if (e.target.closest('.slide-btn, .category-card, .product-card, .offer-card')) {
            const element = e.target.closest('.slide-btn, .category-card, .product-card, .offer-card');
            element.style.transform = 'scale(0.98)';
            setTimeout(() => {
                element.style.transform = '';
            }, 150);
        }
    });
});

// Search functionality
function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    const searchBtn = document.querySelector('.search-btn');

    function performSearch() {
        const query = searchBox.value.trim();
        if (query) {
            // Update section title
            const sectionTitle = document.querySelector('.products-section .section-title');
            if (sectionTitle) {
                sectionTitle.textContent = `Resultados para "${query}"`;
            }
            
            // Scroll to products section
            document.querySelector('.products-section')?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchBox) {
        searchBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Horizontal scroll for offers
function setupOffersScroll() {
    const offersTrack = document.getElementById('offersTrack');
    if (!offersTrack) return;
    
    let isScrolling = false;
    let startX;
    let scrollLeft;

    offersTrack.addEventListener('mousedown', (e) => {
        isScrolling = true;
        startX = e.pageX - offersTrack.offsetLeft;
        scrollLeft = offersTrack.scrollLeft;
        offersTrack.style.cursor = 'grabbing';
    });

    offersTrack.addEventListener('mouseleave', () => {
        isScrolling = false;
        offersTrack.style.cursor = 'grab';
    });

    offersTrack.addEventListener('mouseup', () => {
        isScrolling = false;
        offersTrack.style.cursor = 'grab';
    });

    offersTrack.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - offersTrack.offsetLeft;
        const walk = (x - startX) * 2;
        offersTrack.scrollLeft = scrollLeft - walk;
    });
}

// Category clicks
function setupCategoryClicks() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('.category-name')?.textContent;
            if (categoryName) {
                const sectionTitle = document.querySelector('.products-section .section-title');
                if (sectionTitle) {
                    sectionTitle.textContent = `Productos en ${categoryName}`;
                }
                
                // Scroll to products section
                document.querySelector('.products-section')?.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Sticky header effect
function setupStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.position = 'fixed';
            header.style.top = '0';
            header.style.left = '0';
            header.style.right = '0';
            header.style.zIndex = '1000';
            header.style.transition = 'transform 0.3s ease';
            
            if (currentScrollY > lastScrollY) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.position = 'relative';
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Loading animation for products
function showLoadingAnimation() {
    const container = document.getElementById('app');
    if (!container) return;
    
    const loadingHTML = Array(8).fill(0).map(() => `
        <div class="product-card" style="background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite;">
            <div style="height: 180px; background: #e0e0e0; border-radius: 4px; margin-bottom: 10px;"></div>
            <div style="height: 24px; background: #e0e0e0; border-radius: 4px; margin-bottom: 5px; width: 70%;"></div>
            <div style="height: 14px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px; width: 40%;"></div>
            <div style="height: 14px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px;"></div>
            <div style="height: 12px; background: #e0e0e0; border-radius: 4px; width: 60%;"></div>
        </div>
    `).join('');

    container.innerHTML = loadingHTML;
}

// Add some sample products if no products are loaded from Supabase
function addSampleProductsIfEmpty() {
    setTimeout(() => {
        const container = document.getElementById('app');
        if (container && container.children.length === 0) {
            container.innerHTML = sampleProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <div class="product-price">${product.price}</div>
                    <div class="product-discount">${product.discount}</div>
                    <div class="product-title">${product.title}</div>
                    <div class="product-shipping">${product.shipping}</div>
                </div>
            `).join('');
        }
    }, 3000); // Wait 3 seconds for Supabase to load
}

// Easter egg - click logo 5 times
let clickCount = 0;
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;
            if (clickCount === 5) {
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
                document.body.style.background = `linear-gradient(45deg, ${colors[Math.floor(Math.random() * colors.length)]}, ${colors[Math.floor(Math.random() * colors.length)]})`;
                setTimeout(() => {
                    document.body.style.background = '#ededed';
                    clickCount = 0;
                }, 3000);
            }
        });
    }
});

// Initialize sample products fallback
document.addEventListener('DOMContentLoaded', () => {
    addSampleProductsIfEmpty();
});
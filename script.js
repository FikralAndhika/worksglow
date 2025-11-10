// Auto Image Slider dengan perbaikan
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;
let slideInterval;

// Pastikan elemen slider ada sebelum menjalankan
if (slides.length > 0 && indicators.length > 0) {
    const totalSlides = slides.length;

    function showSlide(index) {
        console.log('Switching to slide:', index); // Debug log
        
        // Remove active class dari semua slides dan indicators
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (indicators[i]) {
                indicators[i].classList.remove('active');
            }
        });
        
        // Add active class ke slide dan indicator yang dipilih
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Mulai auto slide setelah halaman dimuat
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 4000); // 4 detik per slide
        console.log('Auto slide started'); // Debug log
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            console.log('Auto slide stopped'); // Debug log
        }
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Event listeners untuk indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            console.log('Indicator clicked:', index); // Debug log
            currentSlide = index;
            showSlide(currentSlide);
            restartAutoSlide(); // Restart timer setelah manual click
        });
    });

    // Event listeners untuk navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('Previous button clicked'); // Debug log
            prevSlide();
            restartAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('Next button clicked'); // Debug log
            nextSlide();
            restartAutoSlide();
        });
    }

    // Pause/resume pada hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            stopAutoSlide();
        });

        heroSection.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }

    // Start auto slide setelah DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, starting auto slide'); // Debug log
        startAutoSlide();
    });

    // Fallback jika DOMContentLoaded sudah terlewat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAutoSlide);
    } else {
        startAutoSlide();
    }
} else {
    console.log('Slider elements not found'); // Debug log
}

// Loading screen
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
            console.log('Loading screen hidden'); // Debug log
        }, 500);
    }
});

// Smooth scrolling untuk navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background pada scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const logo = document.querySelector('.logo');
    
    if (navbar && logo) {
        if (window.scrollY > 50) {
            // Scroll ke bawah - navbar jadi semi-transparan
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.borderBottom = '1px solid #333';
            
            // Ubah warna teks jadi putih
            logo.style.color = '#fff';
            navLinks.forEach(link => {
                if (!link.classList.contains('active')) {
                    link.style.color = '#fff';
                }
            });
        } else {
            // Scroll ke atas - navbar kembali transparan
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.borderBottom = 'none';
            navbar.style.boxShadow = 'none';
            
            // Ubah warna teks sesuai slide aktif
            const activeSlide = document.querySelector('.slide.active');
            const isDarkSlide = activeSlide && (
                activeSlide.querySelector('.slide2-bg') || 
                activeSlide.querySelector('.slide3-bg')
            );
            
            if (isDarkSlide) {
                logo.style.color = '#fff';
                navLinks.forEach(link => {
                    link.style.color = '#fff';
                });
                navbar.classList.add('dark-slide');
            } else {
                logo.style.color = '#000';
                navLinks.forEach(link => {
                    link.style.color = '#000';
                });
                navbar.classList.remove('dark-slide');
            }
        }
    }
});

// Update navbar berdasarkan slide aktif
function updateNavbarForSlide() {
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const activeSlide = document.querySelector('.slide.active');
    
    if (window.scrollY <= 50 && navbar && logo && activeSlide) {
        const isDarkSlide = activeSlide.querySelector('.slide2-bg') || activeSlide.querySelector('.slide3-bg');
        
        if (isDarkSlide) {
            navbar.classList.add('dark-slide');
            logo.style.color = '#fff';
            navLinks.forEach(link => {
                link.style.color = '#fff';
            });
        } else {
            navbar.classList.remove('dark-slide');
            logo.style.color = '#000';
            navLinks.forEach(link => {
                link.style.color = '#000';
            });
        }
    }
}

// Panggil updateNavbarForSlide setiap kali slide berubah
const observer = new MutationObserver(updateNavbarForSlide);
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    observer.observe(heroSlider, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['class'] 
    });
}

// Form submission ke WhatsApp
function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validasi form
    if (!data.name || !data.email || !data.phone || !data.service || !data.message) {
        alert('Mohon lengkapi semua field!');
        return;
    }
    
    // Format pesan untuk WhatsApp
    const message = `*INQUIRY WORKS GLOW*\n\n` +
                   `*Nama:* ${data.name}\n` +
                   `*Email:* ${data.email}\n` +
                   `*Telepon:* ${data.phone}\n` +
                   `*Layanan:* ${data.service}\n` +
                   `*Pesan:* ${data.message}\n\n` +
                   `Terima kasih!`;
    
    // Nomor WhatsApp tujuan
    const phoneNumber = '6285606296686';
    
    // URL WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Reset form
    event.target.reset();
    
    // Konfirmasi
    alert('Form telah direset. Anda akan diarahkan ke WhatsApp.');
}

// Gallery item click effect - DIPERBAIKI untuk mengarah ke halaman gallery
function goToGallery() {
    // Show loading before navigate
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
    }
    
    setTimeout(() => {
        // Ganti 'gallery.html' dengan nama file halaman gallery Anda
        window.location.href = 'gallery.html';
    }, 500);
}

// Gallery item click effect dengan feedback visual
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
        }, 100);
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Panggil fungsi navigate ke gallery
        goToGallery();
    });
});

// Service card hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderLeft = '4px solid #ff6b35';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderLeft = 'none';
    });
});

// Scroll animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards dan gallery items
document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(el);
});

// Handle navigation untuk about page
document.addEventListener('DOMContentLoaded', function() {
    // Check jika ada about page
    if (window.location.pathname.includes('about.html')) {
        const aboutLink = document.querySelector('a[href="about.html"]');
        if (aboutLink) {
            aboutLink.classList.add('active');
        }
    }
    
    // Force hide loading screen jika terlalu lama
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.display = 'none';
        }, 2000);
    }
});

// Debug info
console.log('Script loaded successfully');
console.log('Slides found:', slides.length);
console.log('Indicators found:', indicators.length);
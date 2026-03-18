document.addEventListener('DOMContentLoaded', () => {
    // 1. Mise en surbrillance du menu au défilement
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });

    // 2. Animations d'apparition au défilement (Scroll Reveal)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, revealOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });

    // 3. Effet d'inclinaison 3D (Tilt) sur les projets
    const cards = document.querySelectorAll('.projects-list li');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Coordonnée X dans la carte
            const y = e.clientY - rect.top; // Coordonnée Y dans la carte
            
            // Calcul du multiplicateur pour limiter l'angle
            const multiplier = 20; 
            
            const xRotation = multiplier * ((y - rect.height / 2) / rect.height);
            const yRotation = -multiplier * ((x - rect.width / 2) / rect.width);
            
            const string = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transform = string;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease'; // Transition douce pour le retour
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Désactiver la transition pour que ça suive la souris instantanément
        });
    });

    // 4. Fond interactif (Canvas Particules)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            // Créer quelques particules autour de la souris en mouvement
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(mouse.x, mouse.y));
            }
        });

        class Particle {
            constructor(x, y) {
                this.x = x + (Math.random() * 40 - 20);
                this.y = y + (Math.random() * 40 - 20);
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                // Particules de couleur beige/rose (accent-light / accent)
                this.color = `rgba(196, 121, 108, ${Math.random() * 0.5})`; 
                this.life = 100; // Durée de vie de la particule
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.05;
                this.life--;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const animate = () => {
            // Effacer le canvas avec une légère opacité pour un effet de traînée
            ctx.clearRect(0, 0, width, height);
            
            // Mettre à jour et dessiner les particules
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Supprimer les particules mortes ou trop petites
                if (particles[i].life <= 0 || particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
});

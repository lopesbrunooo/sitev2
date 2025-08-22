document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    emailjs.init("YOUR_USER_ID"); // Você precisa substituir pelo seu User ID

    // Carrossel Hero - Slides com imagens e textos
    const heroSlides = [
        {
            background: 'assets/img/imagemdefundo.jpg',
            title: `<strong>Transformando</strong><br><strong>vidas</strong> por meio de<br>uma educação pública<br>integral, inclusiva<br>e de excelência`,
            overlay: 'linear-gradient(90deg, rgba(106, 17, 203, 0.85) 0%, rgba(37, 117, 252, 0.45) 100%)'
        },

        {
            background: 'assets/img/criancas.jpg',
            title: `<div style="text-align: left; font-size: 1.3em; position: relative; top: -50px;"><strong style="position: relative; left: -30px;">Imersão</strong><br><span style="color: #1e3a8a; border-bottom: 2px solid white; position: relative; left: 30px;">Inovação</span><br><strong style="position: relative; left: 80px;">Interação</strong></div><span style="font-size: 0.8em; font-weight: normal; position: relative; top: -10px;">Reascendendo o Sentido de<br>Ensinar e Aprender</span>`,
            overlay: 'linear-gradient(90deg, rgba(128, 128, 128, 0.8) 0%, rgba(0, 150, 255, 0.6) 100%)'
        },
        {
            background: 'assets/img/slide13.jpg',
            title: `<div style="text-align: left; font-size: 1.6em; position: relative; top: -150px;"><strong style="color: #1e3a8a; margin-left: -50px; margin-top: 200px;">Pedagogia</strong><br><span style="color: #3b82f6; margin-left: 130px;">Conteúdo</span><br><strong style="color: #06b6d4; margin-left: 300px;">Tecnologia</strong></div>`,
            overlay: 'linear-gradient(90deg, rgba(128, 128, 128, 0.8) 0%, rgba(0, 200, 255, 0.6) 100%)'
        },
        {
            background: 'assets/img/slide14.jpg',
            title: `<div style="text-align: center; font-size: 0.9em; position: relative; top: -180px; left: -100px;"><p style="color: #000000; margin: 0 0 10px 0;"><strong>Não basta</strong> ensinar, <strong>é preciso</strong></p><p style="color: #000000; font-size: 1.1em; text-transform: uppercase; font-weight: bold; margin: 0;">TRANSFORMAR</p></div><div style="position: absolute; bottom: -300px; right: -900px; text-align: center; font-size: 0.9em; color: #000000;"><p style="margin: 0 0 5px 0;"><strong>Não basta</strong> informar, <strong>é preciso</strong></p><p style="font-size: 1.1em; text-transform: uppercase; font-weight: bold; margin: 0;">CONECTAR</p></div>`,
            overlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 200, 0.9) 15%, rgba(173, 216, 230, 0.85) 30%, rgba(221, 160, 221, 0.8) 50%, rgba(255, 182, 193, 0.75) 70%, rgba(138, 43, 226, 0.7) 85%, rgba(0, 0, 139, 0.6) 100%)'
        }
    ];

    let currentHeroSlide = 0;
    let heroAutoPlay = true;
    let heroInterval = null;
    let isTransitioning = false;

    // Função para verificar se é dispositivo móvel
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    // Função para verificar se é dispositivo com tela sensível ao toque
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.getElementById('heroTitle');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    const heroIndicators = document.getElementById('heroIndicators');

    // Adicionar event listeners para swipe em mobile
    if (heroSection) {
        // Event listeners para swipe
        heroSection.addEventListener('touchstart', handleTouchStart, { passive: false });
        heroSection.addEventListener('touchmove', handleTouchMove, { passive: false });
        heroSection.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Adicionar suporte para tap para pausar/retomar autoplay
        let tapCount = 0;
        let tapTimer = null;
        
        heroSection.addEventListener('touchstart', (e) => {
            tapCount++;
            
            if (tapCount === 1) {
                tapTimer = setTimeout(() => {
                    tapCount = 0;
                }, 300);
            } else if (tapCount === 2) {
                clearTimeout(tapTimer);
                tapCount = 0;
                
                // Duplo tap pausa/retoma autoplay
                if (heroAutoPlay) {
                    pauseAutoPlay();
                    heroAutoPlay = false;
                } else {
                    heroAutoPlay = true;
                    startAutoPlay();
                }
            }
        }, { passive: true });
        
        // Adicionar suporte para gestos de pinch (zoom) se necessário
        let initialDistance = 0;
        
        heroSection.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        }, { passive: true });
        
        heroSection.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                
                // Se for um gesto de pinch, não processar como swipe
                if (Math.abs(currentDistance - initialDistance) > 20) {
                    isSwiping = false;
                }
            }
        }, { passive: true });
    }

    // Criar indicadores
    function createIndicators() {
        heroIndicators.innerHTML = '';
        heroSlides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `hero-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToSlide(index));
            heroIndicators.appendChild(indicator);
        });
    }

    // Atualizar indicadores
    function updateIndicators() {
        const indicators = heroIndicators.querySelectorAll('.hero-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentHeroSlide);
        });
    }

    // Trocar slide COM efeitos de transição aprimorados
    function changeSlide(index) {
        if (isTransitioning) return; // Evitar múltiplas transições simultâneas
        
        // Garantir que o índice esteja dentro dos limites válidos
        if (index < 0) index = heroSlides.length - 1;
        if (index >= heroSlides.length) index = 0;
        
        // Se já estiver no slide solicitado, não fazer nada
        if (index === currentHeroSlide) return;

        isTransitioning = true;

        const slide = heroSlides[index];
        const defaultContent = document.querySelector('.hero-content');
        const eImage = document.querySelector('img[src="assets/img/eimagem.png"]');
        const currentTitle = heroTitle;
        const currentSubtitle = document.querySelector('.hero-title-sub');
        const currentButton = document.querySelector('.cta-button');

        // Determinar direção da transição (simplificado)
        const isNext = index > currentHeroSlide || (currentHeroSlide === 3 && index === 0);
        const isPrev = index < currentHeroSlide || (currentHeroSlide === 0 && index === 3);
        


        // Aplicar efeito de saída ao slide atual com fade-out para todos os elementos
        if (defaultContent) {
            // Slide padrão saindo
            defaultContent.classList.add('fade-out');
            defaultContent.classList.remove('fade-in');
        }

        // Fade-out para título, subtítulo e botão
        if (currentTitle) currentTitle.classList.add('fade-out');
        if (currentSubtitle) currentSubtitle.classList.add('fade-out');
        if (currentButton) currentButton.classList.add('fade-out');

        // Aguardar um pouco para o efeito de saída completo
        setTimeout(() => {
            // Atualizar background com transição suave
            if (slide.background === 'none') {
                heroSection.style.backgroundImage = slide.overlay;
            } else {
                heroSection.style.backgroundImage = `${slide.overlay}, url('${slide.background}')`;
            }

            // Adicionar atributo data-slide para CSS específico
            heroSection.setAttribute('data-slide', index);

            // Mostrar conteúdo padrão
            if (defaultContent) {
                defaultContent.style.display = 'block';
                defaultContent.classList.remove('fade-out');
                defaultContent.classList.add('fade-in');
            }
            
            // Atualizar texto padrão
            heroTitle.innerHTML = slide.title;
            
            // DESKTOP: Mover palavra "Inovação" mais para a direita no slide 2
            if (index === 1 && window.innerWidth > 1220) { // Slide 2 em desktop
                console.log('Slide 2 ativado em desktop, aplicando ajustes...');
                setTimeout(() => {
                    adjustInovacaoPosition(); // Usar a função principal
                }, 100);
            }
            
            // RESOLUÇÃO 1366x768: Ajustar texto do slide 4
            if (index === 3 && window.innerWidth >= 1350 && window.innerWidth <= 1380 && 
                window.innerHeight >= 750 && window.innerHeight <= 800) {
                console.log('Slide 4 ativado em resolução 1366x768, aplicando ajustes...');
                setTimeout(() => {
                    adjustSlide4Text(); // Usar a função específica
                }, 200);
            }

            // Fade-in para título, subtítulo e botão
            if (currentTitle) {
                currentTitle.classList.remove('fade-out');
                currentTitle.classList.add('fade-in');
            }
            if (currentSubtitle) {
                currentSubtitle.classList.remove('fade-out');
                currentSubtitle.classList.add('fade-in');
            }
            if (currentButton) {
                currentButton.classList.remove('fade-out');
                currentButton.classList.add('fade-in');
            }

            // Mover "E" estilizado SEM transição (movimento instantâneo)
            if (eImage) {
                if (index === 2) { // Slide 3 (capabio.jpg)
                    eImage.style.transition = 'none';
                    eImage.style.left = '-450px';
                    eImage.style.right = 'auto';
                    eImage.style.top = '80px';
                    eImage.style.transform = 'scaleX(1)';
                    eImage.style.width = '900px';
                } else if (index === 3) { // Slide 4 - ajustar tamanho da imagem eimagem.png para 600px, posicionar um pouco à esquerda e para cima
                    eImage.style.transition = 'none';
                    eImage.style.left = 'auto';
                    eImage.style.right = '-250px';
                    eImage.style.top = '-300px';
                    eImage.style.transform = 'scaleX(1)';
                    eImage.style.width = '600px'; // Ajustado para 600px
                } else { // Outros slides
                    eImage.style.transition = 'none';
                    eImage.style.left = 'auto';
                    eImage.style.right = '-400px';
                    eImage.style.top = '-180px';
                    eImage.style.transform = 'scaleX(1)';
                    eImage.style.width = '520px';
                }
            }



                



                // A logo ava.png mantém sua posição padrão em todos os slides

            // Permitir nova transição após completar
            setTimeout(() => {
                isTransitioning = false;
            }, 100);

        }, 400); // Aguardar 400ms para o efeito de saída completo

        currentHeroSlide = index;
        updateIndicators();
    }

    // Ir para slide específico
    function goToSlide(index) {
        if (index === currentHeroSlide) return; // Não fazer nada se já estiver no slide
        changeSlide(index);
        resetAutoPlay();
    }

    // Funcionalidade de swipe para mobile - VERSÃO OTIMIZADA
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;
    let swipeThreshold = 50; // Distância mínima para considerar como swipe
    let verticalThreshold = 100; // Distância máxima vertical para considerar como swipe horizontal
    let lastSwipeTime = 0;
    let swipeCooldown = 500; // Tempo mínimo entre swipes (ms)

    function handleTouchStart(e) {
        // Verificar se é um dispositivo móvel
        if (!isMobileDevice() && !isTouchDevice()) return;
        
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
        
        // Pausar autoplay durante o swipe
        pauseAutoPlay();
        
        // Adicionar classe visual para feedback
        heroSection.classList.add('swiping');
    }

    function handleTouchMove(e) {
        if (!isSwiping) return;
        
        // Permitir scroll vertical normal, mas prevenir scroll horizontal durante swipe
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const deltaX = Math.abs(currentX - touchStartX);
        const deltaY = Math.abs(currentY - touchStartY);
        
        // Se o movimento for mais horizontal que vertical, prevenir scroll
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);
        const currentTime = Date.now();
        
        // Verificar cooldown para evitar swipes muito rápidos
        if (currentTime - lastSwipeTime < swipeCooldown) {
            isSwiping = false;
            heroSection.classList.remove('swiping');
            return;
        }
        
        // Verificar se é um swipe horizontal válido
        if (deltaX > swipeThreshold && deltaX > deltaY && deltaY < verticalThreshold) {
            lastSwipeTime = currentTime;
            
            if (touchEndX > touchStartX) {
                // Swipe para direita - slide anterior
                goToSlide(currentHeroSlide - 1);
            } else {
                // Swipe para esquerda - próximo slide
                goToSlide(currentHeroSlide + 1);
            }
        }
        
        isSwiping = false;
        heroSection.classList.remove('swiping');
        
        // Retomar autoplay após um breve delay
        setTimeout(() => {
            if (heroAutoPlay) {
                startAutoPlay();
            }
        }, 1000);
    }

    // Próximo slide
    function nextSlide() {
        let nextIndex = currentHeroSlide + 1;
        if (nextIndex >= heroSlides.length) {
            nextIndex = 0; // Volta para o primeiro slide
        }
        changeSlide(nextIndex);
    }

    // Slide anterior
    function prevSlide() {
        let prevIndex = currentHeroSlide - 1;
        if (prevIndex < 0) {
            prevIndex = heroSlides.length - 1; // Vai para o último slide
        }
        changeSlide(prevIndex);
    }

    // Resetar autoplay
    function resetAutoPlay() {
        if (heroAutoPlay) {
            clearInterval(heroInterval);
            heroInterval = null;
            // Aguardar um pouco antes de reiniciar para evitar conflitos
            setTimeout(() => {
                startAutoPlay();
            }, 200);
        }
    }

    // Iniciar autoplay
    function startAutoPlay() {
        if (heroAutoPlay && !heroInterval) {
            heroInterval = setInterval(() => {
                if (!isTransitioning) {
                    nextSlide();
                }
            }, 4000); // Exatamente 4 segundos
        }
    }

    // Pausar autoplay
    function pauseAutoPlay() {
        if (heroInterval) {
            clearInterval(heroInterval);
            heroInterval = null;
        }
    }

    // Pausar autoplay no hover
    if (heroSection) {
        heroSection.addEventListener('mouseenter', pauseAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    // Inicializar carrossel
    if (heroSection && heroTitle && heroIndicators) {
        // Sempre criar indicadores (CSS esconde no desktop)
        createIndicators();
        
        // Definir atributo data-slide inicial para o primeiro slide
        heroSection.setAttribute('data-slide', '0');
        
        // Adicionar classes iniciais para o primeiro slide
        const defaultContent = document.querySelector('.hero-content:not(.slide2-content)');
        const currentTitle = heroTitle;
        const currentSubtitle = document.querySelector('.hero-title-sub');
        const currentButton = document.querySelector('.cta-button');
        
        if (defaultContent) {
            defaultContent.classList.add('fade-in');
        }
        if (currentTitle) {
            currentTitle.classList.add('fade-in');
        }
        if (currentSubtitle) {
            currentSubtitle.classList.add('fade-in');
        }
        if (currentButton) {
            currentButton.classList.add('fade-in');
        }
        
        // Adicionar atributos para melhor suporte mobile
        if (isMobileDevice()) {
            heroSection.setAttribute('data-mobile', 'true');
        }
        
        if (isTouchDevice()) {
            heroSection.setAttribute('data-touch', 'true');
        }
        
        // Aguardar um pouco antes de iniciar o autoplay para garantir que tudo está carregado
        setTimeout(() => {
            startAutoPlay();
        }, 1000);
        

        
        // Event listeners para as setinhas (apenas em desktop)
        if (heroPrev && heroNext) {
            console.log('Setas encontradas, adicionando event listeners...');
            console.log('heroPrev:', heroPrev);
            console.log('heroNext:', heroNext);
            
            heroPrev.addEventListener('click', () => {
                console.log('Seta anterior clicada');
                if (!isTransitioning) {
                    prevSlide();
                    resetAutoPlay();
                }
            });

            heroNext.addEventListener('click', () => {
                console.log('Seta próxima clicada');
                if (!isTransitioning) {
                    nextSlide();
                    resetAutoPlay();
                }
            });
        } else {
            console.log('Setas não encontradas:', { heroPrev, heroNext });
            console.log('Verificando se os elementos existem no DOM...');
            console.log('heroPrev element:', document.getElementById('heroPrev'));
            console.log('heroNext element:', document.getElementById('heroNext'));
        }
    }



    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('main section');

    function changeLinkState() {
        let index = sections.length;

        while (--index && window.scrollY + 50 < sections[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove('active'));

        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }

    changeLinkState();
    window.addEventListener('scroll', changeLinkState);

    const prevBookArrow = document.querySelector('.prev-book');
    const nextBookArrow = document.querySelector('.next-book');
    const bookItems = document.querySelectorAll('.book-item');

    // URLs dos livros (substitua pelos caminhos reais das suas imagens)
    const livros = [
        { url: 'assets/img/livro1.jpg', alt: 'Capa do livro 1' },
        { url: 'assets/img/livro2.jpg', alt: 'Capa do livro 2' },
        { url: 'assets/img/livro3.jpg', alt: 'Capa do livro 3' },
        { url: 'assets/img/livro4.jpg', alt: 'Capa do livro 4' },
        { url: 'assets/img/livro5.jpg', alt: 'Capa do livro 5' },
        { url: 'assets/img/livro6.jpg', alt: 'Capa do livro 6' },
        { url: 'assets/img/livro7.jpg', alt: 'Capa do livro 7' },
        { url: 'assets/img/livro8.jpg', alt: 'Capa do livro 8' },
        { url: 'assets/img/livro9.jpg', alt: 'Capa do livro 9' },
        { url: 'assets/img/livro10.jpg', alt: 'Capa do livro 10' }
    ];
    let livroAtual = 0;

    function atualizarLivros() {
        if (!bookItems.length) return; // Evita erros se não houver itens de livro
        for (let i = 0; i < bookItems.length; i++) {
            const idx = (livroAtual + i) % livros.length;
            const img = bookItems[i].querySelector('img');
            if (img) {
                img.src = livros[idx].url;
                img.alt = livros[idx].alt;
            }
        }
    }

    if (prevBookArrow && nextBookArrow && bookItems.length === 3) {
        atualizarLivros();

        prevBookArrow.addEventListener('click', () => {
            livroAtual = (livroAtual - 1 + livros.length) % livros.length;
            atualizarLivros();
        });

        nextBookArrow.addEventListener('click', () => {
            livroAtual = (livroAtual + 1) % livros.length;
            atualizarLivros();
        });
    }

    // Controle das sub-bolhas para bubble-1, bubble-2, bubble-3, bubble-4 e bubble-5
    const bubbles = [
        {
            main: document.querySelector('.bubble-1'),
            subBubbles: document.querySelectorAll('.bubble-1 .sub-bubble'),
            transforms: [
                'translate(-50%, -50%) rotate(0deg) translateY(-150px) rotate(0deg)',
                'translate(-50%, -50%) rotate(-36deg) translateY(-150px) translateX(-100px) rotate(36deg)',
                'translate(-50%, -50%) rotate(36deg) translateY(-150px) translateX(100px) rotate(-36deg)'
            ],
            mobileTransforms: [
                'translate(-50%, -50%) rotate(0deg) translateY(-75px) rotate(0deg)',
                'translate(-50%, -50%) rotate(-36deg) translateY(-85px) translateX(-45px) rotate(36deg)',
                'translate(-50%, -50%) rotate(36deg) translateY(-85px) translateX(45px) rotate(-36deg)'
            ]
        },
        {
            main: document.querySelector('.bubble-2'),
            subBubbles: document.querySelectorAll('.bubble-2 .sub-bubble'),
            transforms: [
                'translate(-50%, -50%) rotate(72deg) translateY(-160px) rotate(-72deg)',
                'translate(-50%, -50%) rotate(36deg) translateY(-150px) translateX(-100px) rotate(-36deg)',
                'translate(-50%, -50%) rotate(108deg) translateY(-150px) translateX(100px) rotate(-108deg)'
            ],
            mobileTransforms: [
                'translate(-50%, -50%) rotate(72deg) translateY(-65px) translateX(20px) rotate(-72deg)',
                'translate(-50%, -50%) rotate(36deg) translateY(-60px) translateX(-35px) rotate(-36deg)',
                'translate(-50%, -50%) rotate(108deg) translateY(-85px) translateX(65px) rotate(-108deg)'
            ]
        },
        {
            main: document.querySelector('.bubble-3'),
            subBubbles: document.querySelectorAll('.bubble-3 .sub-bubble'),
            transforms: [
                'translate(-50%, -50%) rotate(144deg) translateY(-180px) translateX(-20px) rotate(-144deg)',
                'translate(-50%, -50%) rotate(108deg) translateY(-150px) translateX(-100px) rotate(-108deg)',
                'translate(-50%, -50%) rotate(180deg) translateY(-150px) translateX(50px) rotate(-180deg)'
            ],
            mobileTransforms: [
                'translate(-50%, -50%) rotate(144deg) translateY(-85px) translateX(-50px) rotate(-144deg)',
                'translate(-50%, -50%) rotate(108deg) translateY(-62px) translateX(-70px) rotate(-108deg)',
                'translate(-50%, -50%) rotate(180deg) translateY(-85px) translateX(-10px) rotate(-180deg)'
            ]
        },
        {
            main: document.querySelector('.bubble-4'),
            subBubbles: document.querySelectorAll('.bubble-4 .sub-bubble'),
            transforms: [
                'translate(-50%, -50%) rotate(216deg) translateY(-175px) translateX(25px) rotate(-216deg)',
                'translate(-50%, -50%) rotate(180deg) translateY(-150px) translateX(-50px) rotate(-180deg)',
                'translate(-50%, -50%) rotate(252deg) translateY(-160px) translateX(100px) rotate(-252deg)'
            ],
            mobileTransforms: [
                'translate(-50%, -50%) rotate(216deg) translateY(-105px) translateX(5px) rotate(-216deg)',
                'translate(-50%, -50%) rotate(180deg) translateY(-105px) translateX(-30px) rotate(-180deg)',
                'translate(-50%, -50%) rotate(252deg) translateY(-90px) translateX(38px) rotate(-252deg)'
            ]
        },
        {
            main: document.querySelector('.bubble-5'),
            subBubbles: document.querySelectorAll('.bubble-5 .sub-bubble'),
            transforms: [
                'translate(-50%, -50%) rotate(288deg) translateY(-175px) translateX(25px) rotate(-288deg)',
                'translate(-50%, -50%) rotate(252deg) translateY(-150px) translateX(-50px) rotate(-252deg)',
                'translate(-50%, -50%) rotate(324deg) translateY(-150px) translateX(100px) rotate(-324deg)'
            ],
            mobileTransforms: [
                'translate(-50%, -50%) rotate(288deg) translateY(-65px) translateX(-20px) rotate(-288deg)',
                'translate(-50%, -50%) rotate(252deg) translateY(-60px) translateX(-75px) rotate(-252deg)',
                'translate(-50%, -50%) rotate(324deg) translateY(-75px) translateX(40px) rotate(-324deg)'
            ]
        }
    ];

    // Modal das bolhas para mobile
    const bubbleModal = document.getElementById('bubbleModal');
    const bubbleModalTitle = document.getElementById('bubbleModalTitle');
    const closeBubbleModal = document.getElementById('closeBubbleModal');
    const subBubble1 = document.getElementById('subBubble1');
    const subBubble2 = document.getElementById('subBubble2');
    const subBubble3 = document.getElementById('subBubble3');

    // Função para abrir o modal das bolhas
    function openBubbleModal(title, subBubbleContents) {
        bubbleModalTitle.textContent = title;
        
        // Preencher o conteúdo das sub-bolhas
        subBubble1.querySelector('.sub-bubble-content').textContent = subBubbleContents[0];
        subBubble2.querySelector('.sub-bubble-content').textContent = subBubbleContents[1];
        subBubble3.querySelector('.sub-bubble-content').textContent = subBubbleContents[2];
        
        // Resetar animações das sub-bolhas
        const subBubbleItems = [subBubble1, subBubble2, subBubble3];
        subBubbleItems.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = `slideInUp 0.4s ease ${0.1 + index * 0.1}s forwards`;
        });
        
        bubbleModal.style.display = 'flex';
        // Pequeno delay para garantir que o display flex seja aplicado antes da animação
        requestAnimationFrame(() => {
            bubbleModal.classList.add('show');
        });
    }

    // Função para fechar o modal das bolhas
    function closeBubbleModalFunc() {
        // Adicionar classe de saída para animação
        bubbleModal.classList.remove('show');
        
        // Aguardar a transição CSS terminar antes de esconder
        setTimeout(() => {
            bubbleModal.style.display = 'none';
            // Resetar animações para próxima abertura
            const subBubbleItems = [subBubble1, subBubble2, subBubble3];
            subBubbleItems.forEach(item => {
                item.style.animation = 'none';
            });
        }, 400);
    }

    // Event listeners para o modal das bolhas
    if (closeBubbleModal) {
        closeBubbleModal.addEventListener('click', closeBubbleModalFunc);
    }

    // Fechar modal ao clicar fora dele
    if (bubbleModal) {
        bubbleModal.addEventListener('click', (e) => {
            if (e.target === bubbleModal) {
                closeBubbleModalFunc();
            }
        });
    }

    bubbles.forEach(({ main, subBubbles, transforms, mobileTransforms }) => {
        if (main && subBubbles.length) {
            // Função para verificar se é dispositivo móvel
            const isMobile = () => window.innerWidth <= 768;
            
            // Função para obter as transformações corretas
            const getTransforms = () => {
                console.log('isMobile:', isMobile(), 'window.innerWidth:', window.innerWidth);
                return isMobile() ? mobileTransforms : transforms;
            };
            
            // Função para obter o título da bolha
            const getBubbleTitle = (bubble) => {
                return bubble.textContent.trim().split('\n')[0];
            };
            
            // Função para obter o conteúdo das sub-bolhas
            const getSubBubbleContents = (subBubbles) => {
                return Array.from(subBubbles).map(bubble => bubble.textContent.trim());
            };
            
            main.addEventListener('mouseenter', () => {
                if (!isMobile()) {
                    const currentTransforms = getTransforms();
                    subBubbles.forEach((bubble, index) => {
                        bubble.style.display = 'flex';
                        bubble.style.opacity = '1';
                        bubble.style.transform = currentTransforms[index] + ' scale(1)';
                    });
                }
            });

            main.addEventListener('mouseleave', () => {
                if (!isMobile()) {
                    const currentTransforms = getTransforms();
                    subBubbles.forEach((bubble, index) => {
                        bubble.style.display = 'none';
                        bubble.style.opacity = '0';
                        bubble.style.transform = currentTransforms[index] + ' scale(0.8)';
                    });
                }
            });
            
            // Adicionar click event para mobile
            main.addEventListener('click', () => {
                if (isMobile()) {
                    const title = getBubbleTitle(main);
                    const contents = getSubBubbleContents(subBubbles);
                    openBubbleModal(title, contents);
                }
            });
            
            // Adicionar listener para redimensionamento da janela
            window.addEventListener('resize', () => {
                if (!isMobile()) {
                    const currentTransforms = getTransforms();
                    subBubbles.forEach((bubble, index) => {
                        if (bubble.style.display === 'flex') {
                            bubble.style.transform = currentTransforms[index] + ' scale(1)';
                        }
                    });
                }
            });
        }
    });

    // Navegação dos Feature Circles
    const featureCircles = document.querySelectorAll('.feature-circle');

    featureCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            const text = this.textContent.trim();

            if (text === 'Materiais que acolhem, inspiram e desafiam') {
                const materiaisSection = document.getElementById('materiais');
                if (materiaisSection) {
                    materiaisSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            } else if (text === 'Projetos interdisciplinares que despertam o pensar e o sentir') {
                const interdisciplinaresSection = document.getElementById('interdisciplinares');
                if (interdisciplinaresSection) {
                    interdisciplinaresSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            } else if (text === 'Itinerários Formativos com propósito.') {
                const itinerariosSection = document.getElementById('itinerarios');
                if (itinerariosSection) {
                    itinerariosSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            } else if (text === 'Ecossistema pedagógico vivo e em movimento.') {
                const ecossistemaSection = document.getElementById('ecossistema');
                if (ecossistemaSection) {
                    ecossistemaSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    });

    // Modal de Contato
    const contactModal = document.getElementById('contactModal');
    const openContactModal = document.getElementById('openContactModal');
    const closeContactModal = document.getElementById('closeContactModal');
    const cancelContact = document.getElementById('cancelContact');
    const contactForm = document.getElementById('contactForm');
    const loadingSpinner = document.getElementById('loadingSpinner');



    // Função para abrir o modal
    function openModal() {
        contactModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Função para fechar o modal
    function closeModal() {
        contactModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        contactForm.reset();
    }

    // Event listeners para abrir/fechar modal
    openContactModal.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    closeContactModal.addEventListener('click', closeModal);
    cancelContact.addEventListener('click', closeModal);

    // Fechar modal clicando fora dele
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });





    // Envio do formulário usando EmailJS
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const nome = formData.get('nome');
        const assunto = formData.get('assunto');
        const email = formData.get('email');
        const mensagem = formData.get('mensagem') || 'Nenhuma mensagem adicional fornecida.';

        // Validação básica
        if (!nome || !assunto || !email) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Mostrar loading
        loadingSpinner.classList.add('show');

        try {
            // Configuração do EmailJS
            const templateParams = {
                to_email: 'bulopessita29@gmail.com',
                from_name: nome,
                from_email: email,
                subject: assunto,
                message: mensagem
            };

            // Enviar email usando EmailJS
            const response = await emailjs.send(
                'YOUR_SERVICE_ID', // Substitua pelo seu Service ID
                'YOUR_TEMPLATE_ID', // Substitua pelo seu Template ID
                templateParams
            );

            if (response.status === 200) {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                closeModal();
            } else {
                throw new Error('Erro ao enviar email');
            }

        } catch (error) {
            console.error('Erro ao enviar email:', error);
            alert('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.');
        } finally {
            // Esconder loading
            loadingSpinner.classList.remove('show');
        }
    });

    // Navegação com setas entre seções
    const prevSectionBtn = document.getElementById('prevSection');
    const nextSectionBtn = document.getElementById('nextSection');
    
    // Array com todas as seções navegáveis
    const navigableSections = [
        'inicio',
        'quem-somos', 
        'solucoes',
        'materiais',
        'interdisciplinares',
        'itinerarios',
        'ecossistema',
        'ava',
        'parcerias'
    ];
    
    let currentSectionIndex = 0;
    
    function navigateToSection(direction) {
        if (direction === 'next') {
            currentSectionIndex = (currentSectionIndex + 1) % navigableSections.length;
        } else {
            currentSectionIndex = currentSectionIndex === 0 ? navigableSections.length - 1 : currentSectionIndex - 1;
        }
        
        const targetSection = document.getElementById(navigableSections[currentSectionIndex]);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Event listeners para as setas
    if (prevSectionBtn && nextSectionBtn) {
        prevSectionBtn.addEventListener('click', () => navigateToSection('prev'));
        nextSectionBtn.addEventListener('click', () => navigateToSection('next'));
    }
    
    // Navegação com teclado (setas esquerda/direita) - CONSOLIDADO
    document.addEventListener('keydown', (e) => {
        // Verificar se o modal está aberto
        if (contactModal && contactModal.classList.contains('show')) {
            if (e.key === 'Escape') {
                closeModal();
            }
            return; // Não processar outras teclas quando o modal está aberto
        }

        // Navegação do carrossel hero (prioridade quando na seção hero)
        const heroSection = document.getElementById('inicio');
        const isInHeroSection = heroSection && window.scrollY < heroSection.offsetTop + heroSection.offsetHeight;

        if (isInHeroSection) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                resetAutoPlay();
            }
        } else {
            // Navegação entre seções quando não estiver no hero
            if (e.key === 'ArrowLeft') {
                navigateToSection('prev');
            } else if (e.key === 'ArrowRight') {
                navigateToSection('next');
            }
        }
    });

    // Funcionalidade dos education bubbles (apenas desktop)
    function isDesktop() {
        return window.innerWidth > 1024;
    }

    const bubble1 = document.querySelector('.bubble-1');
    const bubble2 = document.querySelector('.bubble-2');
    const bubble3 = document.querySelector('.bubble-3');
    const bubble4 = document.querySelector('.bubble-4');
    const bubble5 = document.querySelector('.bubble-5');

    if (bubble1 && bubble2 && bubble3 && bubble4 && bubble5) {
        // Função para esconder todos os bubbles exceto o especificado
        function hideOtherBubbles(activeBubble) {
            const allBubbles = [bubble1, bubble2, bubble3, bubble4, bubble5];
            const allSubBubbles = [];
            
            allBubbles.forEach(bubble => {
                if (bubble !== activeBubble) {
                    bubble.style.color = 'transparent';
                    const subBubbles = bubble.querySelectorAll('.sub-bubble');
                    subBubbles.forEach(sub => {
                        sub.style.color = 'transparent';
                        allSubBubbles.push(sub);
                    });
                }
            });
        }

        // Função para restaurar todos os bubbles
        function restoreAllBubbles() {
            const allBubbles = [bubble1, bubble2, bubble3, bubble4, bubble5];
            
            allBubbles.forEach(bubble => {
                bubble.style.color = '';
                const subBubbles = bubble.querySelectorAll('.sub-bubble');
                subBubbles.forEach(sub => {
                    sub.style.color = '';
                });
            });
        }

        // Event listeners para todos os bubbles
        bubble1.addEventListener('mouseenter', function() {
            if (isDesktop()) {
                hideOtherBubbles(bubble1);
            }
        });

        bubble1.addEventListener('mouseleave', function() {
            if (isDesktop()) {
                restoreAllBubbles();
            }
        });

        bubble2.addEventListener('mouseenter', function() {
            if (isDesktop()) {
                hideOtherBubbles(bubble2);
            }
        });

        bubble2.addEventListener('mouseleave', function() {
            if (isDesktop()) {
                restoreAllBubbles();
            }
        });

        bubble3.addEventListener('mouseenter', function() {
            if (isDesktop()) {
                hideOtherBubbles(bubble3);
            }
        });

        bubble3.addEventListener('mouseleave', function() {
            if (isDesktop()) {
                restoreAllBubbles();
            }
        });

        bubble4.addEventListener('mouseenter', function() {
            if (isDesktop()) {
                hideOtherBubbles(bubble4);
            }
        });

        bubble4.addEventListener('mouseleave', function() {
            if (isDesktop()) {
                restoreAllBubbles();
            }
        });

        bubble5.addEventListener('mouseenter', function() {
            if (isDesktop()) {
                hideOtherBubbles(bubble5);
            }
        });

        bubble5.addEventListener('mouseleave', function() {
            if (isDesktop()) {
                restoreAllBubbles();
            }
        });
    }

    // ===== SCRIPT PARA MOVER TEXTO "REASCENDENDO..." NO SLIDE 2 =====
    
    // Função para mover o texto "Reascendendo..." para a direita em resoluções baixas
    function adjustSlide2Text() {
        const slide2 = document.querySelector('.hero-section[data-slide="1"]');
        if (!slide2) return;
        
        const reascendendoText = slide2.querySelector('.hero-content span');
        if (!reascendendoText) return;
        
        // Verificar se é desktop com resolução baixa
        const isLowResDesktop = window.innerWidth >= 1025 && window.innerWidth <= 1439;
        
        if (isLowResDesktop) {
            // Mover o texto para a direita
            reascendendoText.style.marginLeft = '60px';
            reascendendoText.style.position = 'relative';
            console.log('Texto "Reascendendo..." movido para direita em resolução baixa');
        } else {
            // Restaurar posição original
            reascendendoText.style.marginLeft = '';
            reascendendoText.style.position = '';
        }
    }
    
    // Executar quando a página carrega
    adjustSlide2Text();
    
    // Executar quando a janela é redimensionada
    window.addEventListener('resize', adjustSlide2Text);
    
    // Executar quando o slide 2 é ativado
    function checkAndAdjustSlide2() {
        const currentSlide = document.querySelector('.hero-section').getAttribute('data-slide');
        if (currentSlide === '1') {
            // Aguardar um pouco para o DOM ser atualizado
            setTimeout(adjustSlide2Text, 100);
        }
    }
    
    // Observar mudanças no atributo data-slide
    const heroSectionObserver = document.querySelector('.hero-section');
    if (heroSectionObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-slide') {
                    checkAndAdjustSlide2();
                    // DESKTOP: Ajustar posição da palavra "Inovação" no slide 2
                    if (mutation.target.getAttribute('data-slide') === '1' && window.innerWidth > 1220) {
                        setTimeout(adjustInovacaoPosition, 100);
                    }
                }
            });
        });
        
        observer.observe(heroSectionObserver, {
            attributes: true,
            attributeFilter: ['data-slide']
        });
    }
    
    // DESKTOP: Função para mover palavra "Inovação" mais para a direita no slide 2
    function adjustInovacaoPosition() {
        if (window.innerWidth <= 1220) return; // Só aplicar em desktop
        
        // FORÇAR posicionamento das palavras no slide 2
        const slide2Content = document.getElementById('slide2Content');
        if (slide2Content) {
            // Mover "Inovação" para direita
            const inovacaoSpan = slide2Content.querySelector('span[style*="color: #1e3a8a"]');
            if (inovacaoSpan) {
                inovacaoSpan.style.marginLeft = '50px';
                inovacaoSpan.style.transform = 'translateX(30px)';
                inovacaoSpan.style.position = 'relative';
                console.log('Palavra "Inovação" movida para direita em desktop');
            }
            
            // Mover "Interação" para esquerda
            const interacaoStrong = slide2Content.querySelector('strong:last-child');
            if (interacaoStrong && interacaoStrong.textContent.includes('Interação')) {
                interacaoStrong.style.marginLeft = '-30px';
                interacaoStrong.style.transform = 'translateX(-20px)';
                interacaoStrong.style.position = 'relative';
                console.log('Palavra "Interação" movida para esquerda em desktop');
            }
        }
        
        // Fallback para o hero-content padrão
        const inovacaoSpan = document.querySelector('.hero-content span[style*="color: #1e3a8a"]');
        if (inovacaoSpan) {
            inovacaoSpan.style.marginLeft = '50px';
            inovacaoSpan.style.transform = 'translateX(30px)';
            inovacaoSpan.style.position = 'relative';
        }
        
        const interacaoStrong = document.querySelector('.hero-content strong:last-child');
        if (interacaoStrong && interacaoStrong.textContent.includes('Interação')) {
            interacaoStrong.style.marginLeft = '-30px';
            interacaoStrong.style.transform = 'translateX(-20px)';
            interacaoStrong.style.position = 'relative';
        }
    }
    
    // Executar quando a página carrega
    if (window.innerWidth > 1220) {
        setTimeout(adjustInovacaoPosition, 500);
    }
    
    // FORÇAR execução quando o slide 2 estiver ativo
    function forceSlide2Adjustment() {
        if (window.innerWidth > 1220) {
            const currentSlide = document.querySelector('.hero-section').getAttribute('data-slide');
            if (currentSlide === '1') { // Slide 2
                console.log('Slide 2 detectado, forçando ajustes...');
                adjustInovacaoPosition();
            }
        }
    }
    
    // Executar a cada 2 segundos para garantir que funcione
    setInterval(forceSlide2Adjustment, 2000);
    
    // Executar quando a janela é redimensionada
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1220) {
            setTimeout(adjustInovacaoPosition, 100);
        }
        
        // AJUSTE ESPECÍFICO PARA RESOLUÇÃO 1366x768 - SLIDE 4
        if (window.innerWidth >= 1350 && window.innerWidth <= 1380 && 
            window.innerHeight >= 750 && window.innerHeight <= 800) {
            setTimeout(adjustSlide4Text, 100);
        }
    });
    
    // Função para ajustar texto do slide 4 na resolução 1366x768
    function adjustSlide4Text() {
        const slide4 = document.querySelector('.hero-section[data-slide="3"]');
        if (!slide4) return;
        
        // PROCURAR POR TODOS OS DIVS DO SLIDE 4
        const slide4Texts = slide4.querySelectorAll('.hero-content div');
        console.log('Encontrados', slide4Texts.length, 'divs no slide 4');
        
        slide4Texts.forEach((div, index) => {
            console.log('Div', index, ':', div.textContent.substring(0, 50));
            
            // PROCURAR PELO TEXTO "CONECTAR" ESPECIFICAMENTE
            if (div.textContent.includes('CONECTAR')) {
                console.log('TEXTO "CONECTAR" ENCONTRADO! Aplicando estilos...');
                
                // FORÇAR os estilos com !important via JavaScript
                div.style.setProperty('right', '-600px', 'important');
                div.style.setProperty('bottom', '-100px', 'important');
                div.style.setProperty('position', 'absolute', 'important');
                
                console.log('Estilos aplicados: right=-600px, bottom=-100px');
            }
        });
        
        // TENTAR TAMBÉM PELO ATRIBUTO STYLE
        const absoluteDivs = slide4.querySelectorAll('div[style*="position: absolute"]');
        console.log('Divs com position absolute:', absoluteDivs.length);
        
        absoluteDivs.forEach((div, index) => {
            if (div.textContent.includes('CONECTAR')) {
                console.log('CONECTAR encontrado em div absolute!');
                div.style.setProperty('right', '-600px', 'important');
                div.style.setProperty('bottom', '-100px', 'important');
            }
        });
    }
    
    // Executar quando a página carrega
    if (window.innerWidth >= 1350 && window.innerWidth <= 1380 && 
        window.innerHeight >= 750 && window.innerHeight <= 800) {
        setTimeout(adjustSlide4Text, 500);
    }

});

document.addEventListener("DOMContentLoaded", function () {

    /* ===== 1. MENÚ HAMBURGUESA ===== */
    var botonHamburguesa = document.querySelector(".hamburguesa");
    var menuNavegacion = document.querySelector(".menu");

    if (botonHamburguesa && menuNavegacion) {
            botonHamburguesa.addEventListener("click", function () {
                botonHamburguesa.classList.toggle("abierta");
                menuNavegacion.classList.toggle("abierto");

                // Para accesibilidad: indica si el menú está abierto
                var estaAbierto = menuNavegacion.classList.contains("abierto");
                botonHamburguesa.setAttribute("aria-expanded", estaAbierto);
            });
        }

        /* ===== 1.1 CERRAR EL MENÚ AL TOCAR UN ENLACE (móvil) ===== */
        if (menuNavegacion && botonHamburguesa) {
            var enlacesMenu = menuNavegacion.querySelectorAll("a");
            enlacesMenu.forEach(function (enlace) {
                enlace.addEventListener("click", function () {
                    menuNavegacion.classList.remove("abierto");
                    botonHamburguesa.classList.remove("abierta");
                    botonHamburguesa.setAttribute("aria-expanded", "false");
                });
            });
        }

    /* ===== 2. DESPLEGABLE FORMACIÓ (con clic en móvil) ===== */
    var botonDesplegable = document.querySelector(".menu__desplegable__boton");
    var itemDesplegable = document.querySelector(".menu__desplegable");

    if (botonDesplegable && itemDesplegable) {
        botonDesplegable.addEventListener("click", function () {
            itemDesplegable.classList.toggle("abierto");
        });
    }

    /* ===== 2.1 DESPLEGABLE DE IDIOMAS (clic; móvil y escritorio) ===== */
    var desplegableIdioma = document.querySelector(".cabecera__idioma");
    var botonIdioma = desplegableIdioma ? desplegableIdioma.querySelector(".cabecera__idioma-boton") : null;

    if (desplegableIdioma && botonIdioma) {
        botonIdioma.addEventListener("click", function () {
            var abierto = desplegableIdioma.classList.toggle("cabecera__idioma-abierto");
            botonIdioma.setAttribute("aria-expanded", String(abierto));
        });
    }

    /* ===== 3. CABECERA SÓLIDA AL HACER SCROLL ===== */
    var cabecera = document.querySelector(".cabecera");

    if (cabecera) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 40) {
                cabecera.classList.add("cabecera--solidaria");
            } else {
                cabecera.classList.remove("cabecera--solidaria");
            }
        });
    }

    /* ===== 4. AÑO AUTOMÁTICO DEL FOOTER ===== */
    var anyoFooter = document.getElementById("any");

    if (anyoFooter) {
        anyoFooter.textContent = new Date().getFullYear();
    }

    /* ===== 5. CONTADORES DE CIFRAS (sección xifres) =====
        Los números suben de 0 hasta data-objectiu cuando
        la sección aparece en pantalla. */
    var contadores = document.querySelectorAll(".xifres__numero");

    if (contadores.length > 0 && "IntersectionObserver" in window) {
        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    animarContador(entrada.target);
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.4 });

        contadores.forEach(function (contador) {
            observador.observe(contador);
        });
    }

    function animarContador(elemento) {
        var objetivo = parseInt(elemento.dataset.objectiu, 10) || 0;
        var prefijo = elemento.dataset.prefixe || "";
        var duracion = 1500;
        var inicio = null;

        function paso(momento) {
            if (!inicio) { inicio = momento; }
            var avance = Math.min((momento - inicio) / duracion, 1);
            // Frena suavemente al acercarse al número final
            var suave = 1 - Math.pow(1 - avance, 3);
            elemento.textContent = prefijo + Math.round(objetivo * suave);
            if (avance < 1) { requestAnimationFrame(paso); }
        }

        requestAnimationFrame(paso);
    }

    /* ===== 6. TELÈFON OCULT (anti-bots)
        El número NO existe al complet al HTML ni com a
        cadena sencera en aquest fitxer. Es munta per parts
        en l'execució i s'aplica als enllaços de WhatsApp. */
    var telefonPref = ["+3", "4 "];
    var telefonCos = ["675", "25 "];
    var telefonFi = ["20 ", "11"];

    var numeroWhatsApp = "3" + "467" + "5252" + "011";       // 34675252011
    var textWhatsApp = telefonPref[0] + telefonPref[1] +
                       telefonCos[0] + telefonCos[1] +
                       telefonFi[0] + telefonFi[1];          // +34 675 25 20 11

    var enllacosCta = document.querySelectorAll(".telefon-cta");
    enllacosCta.forEach(function (enllac) {
        enllac.href = "https://wa.me/" + numeroWhatsApp;
    });

    var telefonNumeros = document.querySelectorAll(".telefon-numero");
    telefonNumeros.forEach(function (span) {
        span.textContent = textWhatsApp;
    });

    var enllacosTelefon = document.querySelectorAll(".telefon-link");
    enllacosTelefon.forEach(function (enllac) {
        enllac.href = "https://wa.me/" + numeroWhatsApp;
    });

    /* ===== 7. CARRUSEL DE PILARES (slider) =====
        Desliza las tarjetas de pilares. Si la página no
        tiene slider, este código simplemente no hace nada. */
    var sliders = document.querySelectorAll("[data-slider]");

    sliders.forEach(function (slider) {
        var pista = slider.querySelector("[data-slider-pista]");
        var slides = slider.querySelectorAll("[data-slide]");
        var botones = slider.querySelectorAll("[data-slider-moviment]");
        var contenedorPuntos = slider.querySelector("[data-slider-punts]");

        if (!pista || slides.length === 0) { return; }

        var indice = 0;
        var total = slides.length;
        var intervalo = null;

        // Crea un punto de navegación por cada slide
        var puntos = [];
        slides.forEach(function (_, i) {
            var punto = document.createElement("button");
            punto.type = "button";
            punto.setAttribute("aria-label", "Mostrar pilar " + (i + 1));
            punto.addEventListener("click", function () {
                irA(i);
                reiniciarAutoplay();
            });
            contenedorPuntos.appendChild(punto);
            puntos.push(punto);
        });

        function irA(nuevo) {
            indice = (nuevo + total) % total;
            pista.style.transform = "translateX(-" + indice * 100 + "%)";
            puntos.forEach(function (punto, i) {
                punto.classList.toggle("pilars__punt--actiu", i === indice);
                punto.setAttribute("aria-current", i === indice ? "true" : "false");
            });
        }

        botones.forEach(function (boton) {
            boton.addEventListener("click", function () {
                var direccion = boton.dataset.sliderMoviment === "seguent" ? 1 : -1;
                irA(indice + direccion);
                reiniciarAutoplay();
            });
        });

        // Navegación con las flechas del teclado
        slider.addEventListener("keydown", function (evento) {
            if (evento.key === "ArrowLeft") {
                irA(indice - 1);
                reiniciarAutoplay();
            }
            if (evento.key === "ArrowRight") {
                irA(indice + 1);
                reiniciarAutoplay();
            }
        });

        // Deslizamiento táctil (móvil)
        var puntoInicio = null;
        pista.addEventListener("touchstart", function (evento) {
            puntoInicio = evento.touches[0].clientX;
        }, { passive: true });

        pista.addEventListener("touchend", function (evento) {
            if (puntoInicio === null) { return; }
            var deslizamiento = evento.changedTouches[0].clientX - puntoInicio;
            if (deslizamiento > 45) { irA(indice - 1); }
            if (deslizamiento < -45) { irA(indice + 1); }
            puntoInicio = null;
            reiniciarAutoplay();
        }, { passive: true });

        // Reproducción automática con pausa al pasar el ratón
        function iniciarAutoplay() {
            pararAutoplay();
            intervalo = setInterval(function () {
                irA(indice + 1);
            }, 6000);
        }

        function pararAutoplay() {
            if (intervalo) {
                clearInterval(intervalo);
                intervalo = null;
            }
        }

        function reiniciarAutoplay() {
            if (document.visibilityState !== "hidden") { iniciarAutoplay(); }
        }

        slider.addEventListener("mouseenter", pararAutoplay);
        slider.addEventListener("mouseleave", iniciarAutoplay);

        irA(0);
        iniciarAutoplay();
    });

    /* ===== 7.1 METODOLOGÍA: CARRUSEL DE ASPECTES (només mòbil) =====
        Els cinc aspectes de treball es mostren un a un en mòbil,
        amb fletxes i punts a la barra inferior. El transform només
        s'aplica en pantalles estretes; a l'escriptori el <ul> es
        manté com a llista apilada (el JS no el toca). */
    var sliderAspectes = document.querySelector("[data-metodologia-slider]");

    if (sliderAspectes) {
        var pistaAspectes = sliderAspectes.querySelector("[data-metodologia-pista]");
        var slidesAspectes = sliderAspectes.querySelectorAll("[data-metodologia-slide]");
        var botonsAspectes = sliderAspectes.querySelectorAll("[data-metodologia-moviment]");
        var puntsContainer = sliderAspectes.querySelector("[data-metodologia-punts]");

        if (pistaAspectes && slidesAspectes.length > 0) {
            var indexAspecte = 0;
            var totalAspectes = slidesAspectes.length;
            var puntsAspectes = [];

            function esMobil() {
                return window.innerWidth <= 900;
            }

            slidesAspectes.forEach(function (_, i) {
                var punt = document.createElement("button");
                punt.type = "button";
                punt.setAttribute("aria-label", "Mostrar aspecte " + (i + 1));
                punt.addEventListener("click", function () {
                    anarAspecte(i);
                });
                puntsContainer.appendChild(punt);
                puntsAspectes.push(punt);
            });

            function anarAspecte(nou) {
                indexAspecte = (nou + totalAspectes) % totalAspectes;
                if (esMobil()) {
                    pistaAspectes.style.transform = "translateX(-" + indexAspecte * 100 + "%)";
                }
                puntsAspectes.forEach(function (punt, i) {
                    punt.classList.toggle("metodologia__punt--actiu", i === indexAspecte);
                    punt.setAttribute("aria-current", i === indexAspecte ? "true" : "false");
                });
            }

            botonsAspectes.forEach(function (boton) {
                boton.addEventListener("click", function () {
                    var direccio = boton.getAttribute("data-metodologia-moviment") === "seguent" ? 1 : -1;
                    anarAspecte(indexAspecte + direccio);
                });
            });

            sliderAspectes.addEventListener("keydown", function (evento) {
                if (evento.key === "ArrowLeft") { anarAspecte(indexAspecte - 1); }
                if (evento.key === "ArrowRight") { anarAspecte(indexAspecte + 1); }
            });

            // Deslizamiento táctil (mòbil)
            var tocaIniciAspecte = null;
            pistaAspectes.addEventListener("touchstart", function (evento) {
                tocaIniciAspecte = evento.touches[0].clientX;
            }, { passive: true });

            pistaAspectes.addEventListener("touchend", function (evento) {
                if (tocaIniciAspecte === null) { return; }
                var recorregut = evento.changedTouches[0].clientX - tocaIniciAspecte;
                if (recorregut > 45) { anarAspecte(indexAspecte - 1); }
                if (recorregut < -45) { anarAspecte(indexAspecte + 1); }
                tocaIniciAspecte = null;
            }, { passive: true });

            anarAspecte(0);
        }
    }

    /* ===== 8. TARJETAS DE VALORES (giro al clicar) =====
        En escritorio ya giran con el hover (CSS);
        este código permite girarlas también en móvil
        con un clic y con el teclado (Enter / Espacio). */
    var tarjetasValor = document.querySelectorAll(".valor");

    tarjetasValor.forEach(function (tarjeta) {
        function girar() {
            tarjeta.classList.toggle("valor--voltat");
        }

        tarjeta.addEventListener("click", girar);
        tarjeta.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                girar();
            }
        });
    });

    /* ===== TARJETAS TEC (giro al clicar) =====
        Mismo funcionamiento que las tarjetas de valores:
        ya giran con hover en escritorio (CSS) y con un clic
        / teclado (Enter / Espacio) también en móvil. */
    var tarjetasTEC = document.querySelectorAll(".tec-treball");

    tarjetasTEC.forEach(function (tarjeta) {
        function girarTEC() {
            tarjeta.classList.toggle("tec-treball--voltat");
        }

        tarjeta.addEventListener("click", girarTEC);
        tarjeta.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                girarTEC();
            }
        });
    });

    /* ===== CARRUSEL 3D "COM TREBALLEM" (Campus) =====
        La diapositiva activa queda al frente (más grande) y
        las demás se ven detrás, escaladas y giradas (efecto 3D).
        Navegación con flechas, puntos y deslizando el dedo. */
    var carrusel = document.querySelector('[data-carrusel]');

    if (carrusel) {
        var pista = carrusel.querySelector("[data-btn-group]");
        var punts = carrusel.querySelectorAll("[data-punt]");
        var botoPrev = carrusel.querySelector("[data-prev]");
        var botoNext = carrusel.querySelector("[data-next]");
        var diapositives = pista.querySelectorAll(".campus-treball__bloc");
        var indexActual = 0;
        var tocaInici = null;

        var CLASSES = [
            "campus-treball__bloc--centre",
            "campus-treball__bloc--seg1",
            "campus-treball__bloc--seg-1",
            "campus-treball__bloc--seg2",
            "campus-treball__bloc--seg-2",
            "campus-treball__bloc--amagat",
            "campus-treball__bloc--amagat-"
        ];

        function pintar() {
            diapositives.forEach(function (diapositiva, i) {
                var offset = i - indexActual;
                var classe = "";

                if (offset === 0)            { classe = CLASSES[0]; }
                else if (offset === 1)       { classe = CLASSES[1]; }
                else if (offset === -1)      { classe = CLASSES[2]; }
                else if (offset === 2)       { classe = CLASSES[3]; }
                else if (offset === -2)      { classe = CLASSES[4]; }
                else if (offset > 0)         { classe = CLASSES[5]; }
                else                         { classe = CLASSES[6]; }

                CLASSES.forEach(function (c) {
                    diapositiva.classList.remove(c);
                });
                diapositiva.classList.add(classe);
            });

            punts.forEach(function (punt, i) {
                punt.classList.toggle("campus-treball__punt--actiu", i === indexActual);
            });
        }

        function anarA(index) {
            indexActual = Math.max(0, Math.min(index, diapositives.length - 1));
            pintar();
        }

        botoPrev.addEventListener("click", function () { anarA(indexActual - 1); });
        botoNext.addEventListener("click", function () { anarA(indexActual + 1); });

        punts.forEach(function (punt) {
            punt.addEventListener("click", function () {
                anarA(parseInt(punt.getAttribute("data-punt"), 10));
            });
        });

        var radi = window.matchMedia("(hover: none)");
        if (radi.matches) {
            pista.addEventListener("touchstart", function (evento) {
                tocaInici = evento.touches[0].clientX;
            }, { passive: true });

            pista.addEventListener("touchend", function (evento) {
                if (tocaInici === null) return;
                var distancia = tocaInici - evento.changedTouches[0].clientX;
                if (Math.abs(distancia) > 40) {
                    if (distancia > 0) { botoNext.click(); }
                    else { botoPrev.click(); }
                }
                tocaInici = null;
            }, { passive: true });
        }

        pintar();
    }

    /* ===== 9. FAQ ACORDEÓ (solo una pregunta abierta) ===== */
    var faqItems = document.querySelectorAll(".tec-faq__item");

    faqItems.forEach(function (item) {
        item.addEventListener("toggle", function () {
            if (item.open) {
                faqItems.forEach(function (otro) {
                    if (otro !== item) { otro.removeAttribute("open"); }
                });
            }
        });
    });

    /* ===== 10. ANIMACIÓN AL HACER SCROLL (ikusi) =====
        Los elementos con data-reveal entran suavemente cuando
        aparecen en pantalla. Si el navegador no soporta
        IntersectionObserver, se muestran directamente. */
    var elementsARevelar = document.querySelectorAll("[data-reveal]");

    if (elementsARevelar.length > 0) {
        if ("IntersectionObserver" in window) {
            var observadorRevelar = new IntersectionObserver(
                function (entrades) {
                    entrades.forEach(function (entrada) {
                        if (entrada.isIntersecting) {
                            entrada.target.classList.add("revelat");
                            observadorRevelar.unobserve(entrada.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
            );

            elementsARevelar.forEach(function (element) {
                observadorRevelar.observe(element);
            });
        } else {
            elementsARevelar.forEach(function (element) {
                element.classList.add("revelat");
            });
        }
    }
});

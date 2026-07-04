/* LÓGICA Y FUNCIONES */

const rutaPersonalizada = [];

function agregarDestino() {
    const selectLugar = document.getElementById('lugarRuta');
    const lugarSeleccionado = selectLugar.value;
    const listaVisual = document.getElementById('listaRutaVisual');

    if (lugarSeleccionado !== "") {
        if (rutaPersonalizada.includes(lugarSeleccionado)) {
            alert("Este restaurante ya ha sido añadido a tu itinerario.");
            return;
        }

        rutaPersonalizada.push(lugarSeleccionado);
        
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center fw-bold text-dark';
        li.textContent = `📍 Parada #${rutaPersonalizada.length}: ${lugarSeleccionado}`;
        listaVisual.appendChild(li);
        
        selectLugar.value = ""; 
    } else {
        alert("Por favor, selecciona un restaurante válido de la lista.");
    }
}

function guardarRutaFinal() {
    if (rutaPersonalizada.length > 0) {
        sessionStorage.setItem('rutaPersonalizada', JSON.stringify(rutaPersonalizada));
        alert("¡Itinerario guardado con éxito! Redirigiendo a la sección de mapas...");
        window.location.href = 'mapa.html';
    } else {
        alert("No has añadido ningún destino a tu ruta todavía.");
    }
}

function mostrarRestaurantes(idMunicipio) {
    const caja = document.getElementById("info-municipio");
    const datos = baseDatosMunicipios[idMunicipio];

    if (datos) {
        let contenidoHTML = `
            <h3>${datos.nombre}</h3>
            <p style="color: #666; margin-bottom: 15px; font-style: italic;">${datos.descripcion}</p>
            <ul>
        `;
        if (datos.restaurantes.length > 0) {
            datos.restaurantes.forEach(lugar => { contenidoHTML += `<li>${lugar}</li>`; });
        } else {
            contenidoHTML += `<li>Próximamente más restaurantes recomendados en esta zona.</li>`;
        }
        contenidoHTML += `</ul>`;
        caja.innerHTML = contenidoHTML;
        caja.style.display = "block";
    }
}

function buscarRestaurantesCercanos() {
    const inputVal = document.getElementById('input-ubicacion').value.toLowerCase().trim();
    const cajaResultados = document.getElementById('resultados-ubicacion');
    if (inputVal === "") {
        alert("Por favor, ingresa tu ubicación para mostrarte las opciones.");
        return;
    }
    const localesEncontrados = inventarioRestaurantes.filter(local => local.zonas.some(zona => inputVal.includes(zona) || zona.includes(inputVal)));

    if (localesEncontrados.length > 0) {
        let contenido = `<h4 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.2em;">🍽️ Ruta sugerida cerca de "${inputVal}":</h4><ul class="lista-menu-local" style="margin: 0; padding: 0;">`;
        localesEncontrados.forEach(local => {
            contenido += `<li style="background: white; margin-bottom: 10px; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); list-style: none;">
                    <strong style="color: #6E473B; font-size: 1.1em;">${local.nombre}</strong><br>
                    <span style="color: #555; font-size: 0.9em;">${local.descripcion}</span>
                </li>`;
        });
        contenido += `</ul>`;
        cajaResultados.innerHTML = contenido;
        cajaResultados.style.display = "block";
    } else {
        cajaResultados.innerHTML = `<h4 style="color: #6E473B; margin-bottom: 10px;">¡Explora un poco más!</h4><p style="color: #555;">No tenemos registros exactos en "${inputVal}", pero te sugerimos Barrio Obrero.</p>`;
        cajaResultados.style.display = "block";
    }
}

function generarRutaGoogleMaps() {
    const origen = document.getElementById('ubicacion-mapa').value.trim();
    const panelResultado = document.getElementById('itinerario-resultado');
    const iframeMapa = document.getElementById('gmaps-iframe');
    
    if (origen === "") {
        alert("Por favor, ingresa tu ubicación actual para calcular los puntos más cercanos.");
        return;
    }
    sessionStorage.setItem('rutaGuardada', origen);
    const origenMinuscula = origen.toLowerCase();
    const destinosCercanos = inventarioRestaurantes.filter(local => local.zonas.some(zona => origenMinuscula.includes(zona) || zona.includes(origenMinuscula)));

    if (destinosCercanos.length > 0) {
        const origenCodificado = encodeURIComponent(origen + ", Táchira, Venezuela");
        const rutaParadas = destinosCercanos.map(d => encodeURIComponent(d.direccionMaps)).join('+to:');
        const urlEmbedMaps = `https://maps.google.com/maps?saddr=${origenCodificado}&daddr=${rutaParadas}&output=embed`;

        let htmlContenido = `
            <div style="text-align: center; margin-bottom: 30px; width: 100%;">
                <h3 style="color: #2c3e50; font-size: 1.8em;">🗺️ Ruta Gastronómica Recomendada</h3>
                <p style="color: #555;">Resultados basados en: <strong>"${origen}"</strong></p>
                <button onclick="document.getElementById('gmaps-iframe').src='${urlEmbedMaps}'" style="display: inline-block; margin-top: 15px; padding: 12px 25px; background-color: #2c3e50; color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer;">
                    🔄 Recargar Itinerario
                </button>
            </div>
            <div class="row g-4 justify-content-center w-100 m-0">
        `;
        
        destinosCercanos.forEach(local => {
            let tagsHTML = "";
            local.tags.forEach(tag => { 
                tagsHTML += `<span class="badge" style="background-color: var(--color-acento); margin-right: 5px;">${tag}</span>`; 
            });
            
            htmlContenido += `
                <div class="col-12 col-md-6 d-flex">
                    <article class="tarjeta w-100 d-flex flex-column border-0 shadow-sm">
                        <a href="${local.enlaceDetalle}" class="d-block w-100" style="height: 220px; overflow: hidden;">
                            <img src="${local.imagen}" alt="Fachada de ${local.nombre}" class="w-100 h-100" style="object-fit: cover;">
                        </a>
                        <div class="tarjeta-cuerpo d-flex flex-column flex-grow-1 p-4 bg-white">
                            <h3 style="color: var(--color-secundario); font-size: 1.3em; margin-bottom: 10px;">${local.nombre}</h3>
                            <p style="color: var(--color-acento); font-size: 0.9em; font-weight: bold; margin-bottom: 10px;">
                                <i class="bi bi-geo-alt-fill"></i> ${local.referencia}
                            </p>
                            <p class="flex-grow-1" style="color: #555; font-size: 0.95em;">${local.descripcion}</p>
                            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; margin-bottom: 15px;">${tagsHTML}</div>
                            <a href="${local.enlaceDetalle}" class="boton-enlace mt-auto" style="text-align: center;">Ver Información</a>
                        </div>
                    </article>
                </div>`;
        });
        htmlContenido += `</div>`;
        panelResultado.innerHTML = htmlContenido;
        panelResultado.style.display = "block";
        iframeMapa.src = urlEmbedMaps;
    } else {
        const urlAlternativa = `https://maps.google.com/maps?saddr=${encodeURIComponent(origen + ", Táchira")}&daddr=${encodeURIComponent("Barrio Obrero, San Cristóbal, Táchira")}&output=embed`;
        panelResultado.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4 style="color: #c0392b; margin-bottom: 10px; font-size: 1.4em;">Zona fuera del radar</h4>
                <p style="color: #555;">No disponemos de registros comerciales exactos en <em>"${origen}"</em>.</p>
                <button onclick="document.getElementById('gmaps-iframe').src='${urlAlternativa}'" style="display: inline-block; padding: 12px 25px; background-color: #6E473B; color: white; border: none; border-radius: 25px; cursor: pointer;">
                    Mostrar ruta sugerida en el mapa
                </button>
            </div>
        `;
        panelResultado.style.display = "block";
    }
}

function renderizarRutaModalEnMapa(nombresLocales) {
    const panelResultado = document.getElementById('itinerario-resultado');
    const iframeMapa = document.getElementById('gmaps-iframe');
    if (!panelResultado || !iframeMapa) return;

    const localesSeleccionados = [];
    nombresLocales.forEach(nombre => {
        const localObj = inventarioRestaurantes.find(r => r.nombre === nombre);
        if (localObj) localesSeleccionados.push(localObj);
    });

    if (localesSeleccionados.length > 0) {
        const origenCodificado = encodeURIComponent(localesSeleccionados[0].direccionMaps);
        const paradasRestantes = localesSeleccionados.slice(1).map(d => encodeURIComponent(d.direccionMaps)).join('+to:');
        let urlEmbedMaps = `https://maps.google.com/maps?saddr=${origenCodificado}`;
        if (paradasRestantes) { urlEmbedMaps += `&daddr=${paradasRestantes}`; }
        urlEmbedMaps += `&output=embed`;

        let htmlContenido = `
            <div style="text-align: center; margin-bottom: 30px; width: 100%;">
                <h3 style="color: #6E473B; font-size: 1.8em; font-family: 'Playfair Display', serif;">🗺️ Tu Ruta Personalizada</h3>
                <p style="color: #555;">Has diseñado un recorrido con <strong>${localesSeleccionados.length} paradas</strong>.</p>
                <button onclick="sessionStorage.removeItem('rutaPersonalizada'); window.location.reload();" class="btn btn-sm btn-outline-danger rounded-pill px-3 mt-2">
                    🗑️ Restablecer Ruta
                </button>
            </div>
            <div class="row g-4 justify-content-center w-100 m-0">
        `;
        
        localesSeleccionados.forEach((local, index) => {
            let tagsHTML = local.tags.map(tag => `<span class="badge" style="background-color: var(--color-acento); margin-right: 5px;">${tag}</span>`).join('');
            
            htmlContenido += `
                <div class="col-12 col-md-6 d-flex">
                    <article class="tarjeta w-100 d-flex flex-column border-0 shadow-sm">
                        <a href="${local.enlaceDetalle}" class="d-block w-100" style="height: 220px; overflow: hidden;">
                            <img src="${local.imagen}" alt="Fachada de ${local.nombre}" class="w-100 h-100" style="object-fit: cover;" loading="lazy">
                        </a>
                        <div class="tarjeta-cuerpo d-flex flex-column flex-grow-1 p-4 bg-white">
                            <span class="badge bg-dark mb-3 align-self-start" style="font-size: 0.9em;">Parada #${index + 1}</span>
                            <h3 style="color: var(--color-secundario); font-size: 1.3em; margin-bottom: 10px;">${local.nombre}</h3>
                            <p style="color: var(--color-acento); font-size: 0.9em; font-weight: bold; margin-bottom: 10px;">
                                <i class="bi bi-geo-alt-fill"></i> ${local.referencia}
                            </p>
                            <p class="flex-grow-1" style="color: #555; font-size: 0.95em;">${local.descripcion}</p>
                            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; margin-bottom: 15px;">${tagsHTML}</div>
                            <a href="${local.enlaceDetalle}" class="boton-enlace mt-auto" style="text-align: center;">Ver Información</a>
                        </div>
                    </article>
                </div>
            `;
        });
        htmlContenido += `</div>`;
        panelResultado.innerHTML = htmlContenido;
        panelResultado.style.display = "block";
        iframeMapa.src = urlEmbedMaps;
    }
}

function mostrarMenuEnPantalla(menuArray) {
    const cajaResultado = document.getElementById('resultado-menu');
    if (!cajaResultado) return; 

    if (menuArray.length > 0) {
        // Cabecera del menú seleccionado con diseño premium
        let contenidoHTML = `
            <div style="text-align: center; margin-bottom: 30px; width: 100%;">
                <h3 style="color: var(--color-secundario); font-size: 1.8em; font-family: 'Playfair Display', serif;">🍽️ Tu Menú de Degustación</h3>
                <p style="color: #555;">Has seleccionado <strong>${menuArray.length}</strong> opciones deliciosas.</p>
                <button onclick="limpiarMenu()" class="btn btn-sm btn-outline-danger rounded-pill px-3 mt-2 mb-4">
                    🗑️ Limpiar Menú
                </button>
            </div>
            <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">
        `;
        
        // Renderizar los platos seleccionados como badges/etiquetas elegantes
        menuArray.forEach(item => {
            let enlace = (typeof enlacesPlatos !== 'undefined' && enlacesPlatos[item.toLowerCase()]) ? enlacesPlatos[item.toLowerCase()] : '#';
            let botonDetalle = enlace !== '#' ? `<a href="${enlace}" class="ms-2 text-decoration-none" style="color: var(--color-primario);"><i class="bi bi-box-arrow-up-right"></i></a>` : '';
            contenidoHTML += `<span class="badge bg-white text-dark border p-2" style="font-size: 0.95em; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-color: var(--color-acento) !important;">✅ ${item} ${botonDetalle}</span>`;
        });
        contenidoHTML += `</div>`;

        // Buscar restaurantes sugeridos
        let restaurantesSugeridos = [];
        if (typeof inventarioRestaurantes !== 'undefined') {
            inventarioRestaurantes.forEach(restaurante => {
                let tieneElPlato = false;
                menuArray.forEach(itemPedido => {
                    restaurante.tags.forEach(tag => {
                        if (tag.toLowerCase().includes(itemPedido.toLowerCase()) || itemPedido.toLowerCase().includes(tag.toLowerCase())) { tieneElPlato = true; }
                    });
                });
                if (tieneElPlato) restaurantesSugeridos.push(restaurante);
            });
        }

        // Renderizar restaurantes usando las tarjetas premium 
        if (restaurantesSugeridos.length > 0) {
            contenidoHTML += `
                <h4 style="color: var(--color-primario); margin-bottom: 20px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">📍 Lugares recomendados para probar tu menú:</h4>
                <div class="row g-4 justify-content-center w-100 m-0">
            `;
            
            restaurantesSugeridos.forEach(rest => {
                let tagsHTML = rest.tags.map(tag => `<span class="badge" style="background-color: var(--color-acento); margin-right: 5px;">${tag}</span>`).join('');
                
                contenidoHTML += `
                    <div class="col-12 col-md-6 d-flex">
                        <article class="tarjeta w-100 d-flex flex-column border-0 shadow-sm">
                            <a href="${rest.enlaceDetalle}" class="d-block w-100" style="height: 220px; overflow: hidden;">
                                <img src="${rest.imagen}" alt="Fachada de ${rest.nombre}" class="w-100 h-100" style="object-fit: cover;" loading="lazy">
                            </a>
                            <div class="tarjeta-cuerpo d-flex flex-column flex-grow-1 p-4 bg-white">
                                <h3 style="color: var(--color-secundario); font-size: 1.3em; margin-bottom: 10px;">${rest.nombre}</h3>
                                <p style="color: var(--color-acento); font-size: 0.9em; font-weight: bold; margin-bottom: 10px;">
                                    <i class="bi bi-geo-alt-fill"></i> ${rest.referencia}
                                </p>
                                <p class="flex-grow-1" style="color: #555; font-size: 0.95em;">${rest.descripcion}</p>
                                <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; margin-bottom: 15px;">${tagsHTML}</div>
                                <a href="${rest.enlaceDetalle}" class="boton-enlace mt-auto" style="text-align: center;">Ver Restaurante</a>
                            </div>
                        </article>
                    </div>
                `;
            });
            contenidoHTML += `</div>`;
        } else {
            contenidoHTML += `<p class="text-center text-muted mt-4" style="font-style: italic;">No encontramos un restaurante específico en el catálogo con estas opciones exactas, ¡pero te invitamos a explorar!</p>`;
        }
        
        cajaResultado.innerHTML = contenidoHTML;
        cajaResultado.style.display = "block";
    }
}

function armarMenuDegustacion() {
    const cajaResultado = document.getElementById('resultado-menu');
    if (!cajaResultado) return;

    
    cajaResultado.innerHTML = `
        <div class="p-2 animate__animated animate__fadeIn">
            <h3 style="color: var(--color-secundario); font-size: 1.6em; font-family: 'Playfair Display', serif; text-align: center; margin-bottom: 25px;">
                🍽️ Diseña tu Menú de Degustación
            </h3>
            <p class="text-center text-muted small mb-4">Marca las opciones tradicionales que deseas incluir en tu recorrido gastronómico:</p>
            
            <div class="row g-4 text-start">
                <div class="col-12 col-md-4">
                    <h5 class="fw-bold pb-2 border-bottom" style="color: var(--color-primario);">🍲 Platos Fuertes</h5>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Pizca Andina" id="p1"><label class="form-check-label ps-2" for="p1">Pizca Andina</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Pastelitos" id="p2"><label class="form-check-label ps-2" for="p2">Pastelitos</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Mute" id="p3"><label class="form-check-label ps-2" for="p3">Mute</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Arepas de Trigo" id="p4"><label class="form-check-label ps-2" for="p4">Arepas de Trigo</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Hallaca Tachirense" id="p5"><label class="form-check-label ps-2" for="p5">Hallaca Tachirense</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Turmada Tachirense" id="p6"><label class="form-check-label ps-2" for="p6">Turmada Tachirense</label></div>
                </div>

                <div class="col-12 col-md-4">
                    <h5 class="fw-bold pb-2 border-bottom" style="color: var(--color-primario);">☕ Bebidas</h5>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Chicha Andina" id="b1"><label class="form-check-label ps-2" for="b1">Chicha Andina</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Calentadito" id="b2"><label class="form-check-label ps-2" for="b2">Calentadito</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Masato" id="b3"><label class="form-check-label ps-2" for="b3">Masato</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Vino de Mora" id="b4"><label class="form-check-label ps-2" for="b4">Vino de Mora</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Mistela" id="b5"><label class="form-check-label ps-2" for="b5">Mistela</label></div>
                </div>

                <div class="col-12 col-md-4">
                    <h5 class="fw-bold pb-2 border-bottom" style="color: var(--color-primario);">🍰 Dulces Tradicionales</h5>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Abrillantados" id="d1"><label class="form-check-label ps-2" for="d1">Abrillantados</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Higos" id="d2"><label class="form-check-label ps-2" for="d2">Higos</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Aliados" id="d3"><label class="form-check-label ps-2" for="d3">Aliados</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Besitos de Coco" id="d4"><label class="form-check-label ps-2" for="d4">Besitos de Coco</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Quesadillas Andinas" id="d5"><label class="form-check-label ps-2" for="d5">Quesadillas Andinas</label></div>
                    <div class="form-check my-2"><input class="form-check-input chk-menu" type="checkbox" value="Melcocha" id="d6"><label class="form-check-label ps-2" for="d6">Melcocha</label></div>
                </div>
            </div>

            <div class="text-center mt-4 pt-3 border-top" style="border-color: rgba(110,71,59,0.1) !important;">
                <button onclick="procesarMenuSeleccionado()" class="btn text-white rounded-pill px-4 py-2 shadow-sm" style="background-color: var(--color-primario); font-weight: bold; transition: 0.3s;">
                    ✨ Generar Mi Menú
                </button>
                <button onclick="limpiarMenu()" class="btn btn-outline-secondary rounded-pill px-4 py-2 ms-2 shadow-sm" style="font-weight: bold;">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    cajaResultado.style.display = "block";
    
    // Hace un desplazamiento suave (scroll) automático para que el usuario vea el panel de inmediato
    cajaResultado.scrollIntoView({ behavior: 'smooth' });
}

function procesarMenuSeleccionado() {
    const checkboxes = document.querySelectorAll('.chk-menu:checked');
    let menuDegustacion = [];
    
    // Recorremos los elementos que el usuario marcó con un clic
    checkboxes.forEach(cb => {
        menuDegustacion.push(cb.value);
    });

    if (menuDegustacion.length === 0) {
        alert("Por favor, selecciona al menos una opción para poder estructurar tu menú.");
        return;
    }

    // Guardamos usando el ID único de la página para mantener el aislamiento que ya reparamos
    const pageId = window.location.pathname.split('/').pop() || 'index.html';
    sessionStorage.setItem('menuGuardado_' + pageId, JSON.stringify(menuDegustacion));
    
    // Mostramos el resultado final estilizado en Bento Grid
    mostrarMenuEnPantalla(menuDegustacion);
}

function limpiarMenu() {
    const pageId = window.location.pathname.split('/').pop() || 'index.html';
    sessionStorage.removeItem('menuGuardado_' + pageId);
    const cajaResultado = document.getElementById('resultado-menu');
    if (cajaResultado) {
        cajaResultado.style.display = 'none';
        cajaResultado.innerHTML = '';
    }
}

function cargarDestacadoDelDia() {
    const contenedor = document.getElementById('plato-del-dia-container');
    if (!contenedor) return;

    const indiceAleatorio = Math.floor(Math.random() * destacadosEditorial.length);
    const destacado = destacadosEditorial[indiceAleatorio];

    contenedor.innerHTML = `
        <div class="col-md-6 p-0" style="height: 400px; overflow: hidden;">
            <img src="${destacado.imagen}" alt="${destacado.titulo}" class="img-fluid w-100 h-100 object-fit-cover animacion-imagen-editorial">
        </div>
        <div class="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center h-100">
            <div class="mb-3">
                <span class="badge text-white fw-bold px-3 py-2 rounded-pill" style="background-color: var(--color-acento); letter-spacing: 1px;">
                    🔥 ${destacado.tipo}
                </span>
            </div>
            <h3 class="display-6 fw-bold mb-3" style="color: var(--color-secundario); font-family: 'Playfair Display', serif; line-height: 1.1;">
                ${destacado.titulo}
            </h3>
            <p class="lead text-muted mb-4" style="font-size: 1.1em; line-height: 1.6;">
                ${destacado.descripcion}
            </p>
            <div class="d-flex align-items-center justify-content-between mt-auto pt-3 border-top" style="border-color: rgba(110,71,59,0.1) !important;">
                <a href="${destacado.enlace}" class="btn text-white rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 boton-editorial">
                    Leer el artículo <span>→</span>
                </a>
                <span class="text-muted small fw-semibold">
                    🏷️ ${destacado.etiqueta}
                </span>
            </div>
        </div>
    `;
}

/* ARRANQUE GLOBAL */

window.onload = function() {
    // Cargar el artículo dinámico de la portada
    cargarDestacadoDelDia();

    // Recuperar menú de degustación SOLO para la página actual
    const pageId = window.location.pathname.split('/').pop() || 'index.html';
    let menuEnMemoria = sessionStorage.getItem('menuGuardado_' + pageId);
    
    if (menuEnMemoria) {
        let menuArray = JSON.parse(menuEnMemoria);
        mostrarMenuEnPantalla(menuArray);
    }

    // Recuperar la ubicación en el mapa si el usuario buscó una
    let rutaEnMemoria = sessionStorage.getItem('rutaGuardada');
    let inputMapa = document.getElementById('ubicacion-mapa');
    if (rutaEnMemoria && inputMapa) {
        inputMapa.value = rutaEnMemoria; 
        generarRutaGoogleMaps();         
    }

    // Recuperar la ruta armada en el Modal 
    let rutaPersonalizadaMemoria = sessionStorage.getItem('rutaPersonalizada');
    if (rutaPersonalizadaMemoria) {
        const nombresLocales = JSON.parse(rutaPersonalizadaMemoria);
        renderizarRutaModalEnMapa(nombresLocales);
    }
};

// LÓGICA PARA TARJETAS GIRATORIAS EN TELEFONO

document.addEventListener('DOMContentLoaded', () => {
    
    // CONTROL DE EVENTOS PARA EL MENÚ Y LAS TARJETAS (NUEVO)
    
    
    // Escuchador para limpiar sessionStorage en el botón de Inicio
    const btnInicio = document.getElementById('btn-inicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', () => {
            sessionStorage.clear();
        });
    }

    // Escuchador dinámico para las tarjetas de tendencias basadas en su atributo data-url
    const tarjetasTendencia = document.querySelectorAll('.tarjeta-tendencia');
    tarjetasTendencia.forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            const urlDestino = this.getAttribute('data-url');
            if (urlDestino) {
                window.location.href = urlDestino;
            }
        });
    });

    
    // LÓGICA PARA TARJETAS GIRATORIAS EN TELEFONO
    
    
    // Detectamos si el dispositivo tiene pantalla táctil
    const esTactil = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (esTactil) {
        const flipCards = document.querySelectorAll('.flip-card');
        
        flipCards.forEach(card => {
            // Inyectar el indicador visual en la parte frontal de cada tarjeta
            const front = card.querySelector('.flip-card-front');
            if (front && !front.querySelector('.indicador-movil')) {
                const indicador = document.createElement('div');
                indicador.className = 'indicador-movil';
                indicador.innerHTML = '<i class="bi bi-arrow-repeat" style="font-size: 1.2em;"></i> Tocar';
                front.appendChild(indicador);
            }

            // Controlar la lógica de los toques (taps)
            const enlace = card.closest('a');
            if (enlace) {
                enlace.addEventListener('click', function(e) {
                    // Si la tarjeta NO está girada aún
                    if (!card.classList.contains('girada')) {
                        e.preventDefault(); // Evitamos que abra la página de detalles
                        
                        // Volteamos a su posición original cualquier otra tarjeta que estuviera abierta
                        document.querySelectorAll('.flip-card.girada').forEach(c => {
                            if (c !== card) c.classList.remove('girada');
                        });
                        
                        // Giramos la tarjeta actual
                        card.classList.add('girada');
                    }
                    // Si ya tiene la clase 'girada', el click pasa naturalmente y abre la página
                });
            }
        });
    }
});
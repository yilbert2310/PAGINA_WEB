/* =======================================================
   LÓGICA Y FUNCIONES DE LA APLICACIÓN (logica.js)
   ======================================================= */

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
    const localesEncontrados = directorioLocales.filter(local => local.zonas.some(zona => inputVal.includes(zona) || zona.includes(inputVal)));

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
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 1.8em;">🗺️ Ruta Gastronómica Recomendada</h3>
                <p style="color: #555;">Resultados basados en: <strong>"${origen}"</strong></p>
                <button onclick="document.getElementById('gmaps-iframe').src='${urlEmbedMaps}'" style="display: inline-block; margin-top: 15px; padding: 12px 25px; background-color: #2c3e50; color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer;">
                    🔄 Recargar Itinerario
                </button>
            </div>
            <div class="galeria-cuadricula">
        `;
        destinosCercanos.forEach(local => {
            let tagsHTML = "";
            local.tags.forEach(tag => { tagsHTML += `<span style="background: #C27E5A; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.8em; margin-right: 5px;">${tag}</span>`; });
            htmlContenido += `
                <article class="tarjeta">
                    <a href="${local.enlaceDetalle}"><img src="${local.imagen}" alt="Fachada de ${local.nombre}"></a>
                    <div class="tarjeta-cuerpo">
                        <h3>${local.nombre}</h3>
                        <p style="color: #777; font-size: 0.9em; margin-bottom: 10px;">${local.referencia}</p>
                        <p>${local.descripcion}</p>
                        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">${tagsHTML}</div>
                        <a href="${local.enlaceDetalle}" class="boton-enlace">Ver Información</a>
                    </div>
                </article>`;
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
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: #6E473B; font-size: 1.8em; font-family: 'Playfair Display', serif;">🗺️ Tu Ruta Personalizada</h3>
                <p style="color: #555;">Has diseñado un recorrido con <strong>${localesSeleccionados.length} paradas</strong>.</p>
                <button onclick="sessionStorage.removeItem('rutaPersonalizada'); window.location.reload();" class="btn btn-sm btn-outline-danger rounded-pill px-3">
                    🗑️ Restablecer Ruta
                </button>
            </div>
            <div class="galeria-cuadricula">
        `;
        localesSeleccionados.forEach((local, index) => {
            let tagsHTML = local.tags.map(tag => `<span style="background: #C27E5A; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.8em; margin-right: 5px;">${tag}</span>`).join('');
            htmlContenido += `
                <article class="tarjeta">
                    <a href="${local.enlaceDetalle}"><img src="${local.imagen}" alt="Fachada de ${local.nombre}" loading="lazy"></a>
                    <div class="tarjeta-cuerpo">
                        <span class="badge bg-dark mb-2 align-self-start">Parada #${index + 1}</span>
                        <h3>${local.nombre}</h3>
                        <p style="color: #777; font-size: 0.9em; margin-bottom: 10px;">${local.referencia}</p>
                        <p>${local.descripcion}</p>
                        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">${tagsHTML}</div>
                        <a href="${local.enlaceDetalle}" class="boton-enlace">Ver Información</a>
                    </div>
                </article>
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
        let contenidoHTML = `<h3 style="color: #6E473B; margin-bottom: 15px;">Tu Menú Seleccionado:</h3><ul style="list-style: none; padding: 0; margin-bottom: 25px;">`;
        menuArray.forEach(item => {
            let enlace = enlacesPlatos[item.toLowerCase()];
            let botonDetalle = enlace ? `<a href="${enlace}" style="margin-left: 15px; padding: 4px 10px; background: #fffaf6; border: 1px solid #6E473B; color: #6E473B; border-radius: 12px; font-size: 0.8em; text-decoration: none;">Ver detalles 🍲</a>` : '';
            contenidoHTML += `<li style="padding: 12px; background: white; border: 1px solid #eee; margin-bottom: 8px; border-radius: 8px; font-weight: bold; color: #2c3e50; display: flex; align-items: center; justify-content: space-between;"><span>✅ ${item}</span> ${botonDetalle}</li>`;
        });
        contenidoHTML += `</ul>`;

        let restaurantesSugeridos = [];
        inventarioRestaurantes.forEach(restaurante => {
            let tieneElPlato = false;
            menuArray.forEach(itemPedido => {
                restaurante.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(itemPedido.toLowerCase()) || itemPedido.toLowerCase().includes(tag.toLowerCase())) { tieneElPlato = true; }
                });
            });
            if (tieneElPlato) restaurantesSugeridos.push(restaurante);
        });

        if (restaurantesSugeridos.length > 0) {
            contenidoHTML += `<h4 style="color: #2c3e50; margin-bottom: 15px; border-top: 1px solid #eee; padding-top: 15px;">📍 Puedes probar este menú en:</h4><div style="display: flex; flex-direction: column; gap: 15px;">`;
            restaurantesSugeridos.forEach(rest => {
                contenidoHTML += `<div style="background: white; padding: 15px; border-radius: 12px; border: 1px solid #e0e0e0;">
                        <strong style="color: #6E473B; font-size: 1.1em;">${rest.nombre}</strong><br>
                        <span style="font-size: 0.9em; color: #666;">${rest.descripcion}</span><br>
                        <a href="${rest.enlaceDetalle}" style="display: inline-block; margin-top: 10px; padding: 8px 15px; background: #2c3e50; color: white; text-decoration: none; border-radius: 20px; font-size: 0.85em;">Ver restaurante</a>
                    </div>`;
            });
            contenidoHTML += `</div>`;
        }
        cajaResultado.innerHTML = contenidoHTML;
        cajaResultado.style.display = "block";
    }
}

function armarMenuDegustacion() {
    let menuDegustacion = [];
    const opciones = "🍽️ MENÚ TRADICIONAL DISPONIBLE:\n\nPLATOS: Pizca Andina, Pastelitos, Mute, Arepas de Trigo, Hallaca Tachirense, Turmada Tachirense\nBEBIDAS: Chicha Andina, Calentadito, Masato, Vino de Mora, Mistela\nDULCES: Abrillantados, Higos, Aliados, Besitos de Coco, Quesadillas Andinas, Melcocha\n\nEscribe la opción que deseas agregar:";
    let plato = prompt(opciones);
    if (plato !== null && plato.trim() !== "") { menuDegustacion.push(plato.trim()); }
    while (confirm('¿Desea agregar otro elemento a su menú?')) {
        let otroPlato = prompt("¿Qué otro elemento deseas agregar?\n\n" + opciones);
        if (otroPlato !== null && otroPlato.trim() !== "") { menuDegustacion.push(otroPlato.trim()); }
    }
    if (menuDegustacion.length > 0) {
        sessionStorage.setItem('menuGuardado', JSON.stringify(menuDegustacion));
        mostrarMenuEnPantalla(menuDegustacion);
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

/* =======================================================
   ARRANQUE GLOBAL DE LA PÁGINA (Unificado)
   ======================================================= */
window.onload = function() {
    // 1. Cargar el artículo dinámico de la portada (solo si existe el contenedor en la página)
    cargarDestacadoDelDia();

    // 2. Recuperar menú de degustación si el usuario ya armó uno
    let menuEnMemoria = sessionStorage.getItem('menuGuardado');
    if (menuEnMemoria) {
        let menuArray = JSON.parse(menuEnMemoria);
        mostrarMenuEnPantalla(menuArray);
    }

    // 3. Recuperar la ubicación en el mapa si el usuario buscó una
    let rutaEnMemoria = sessionStorage.getItem('rutaGuardada');
    let inputMapa = document.getElementById('ubicacion-mapa');
    if (rutaEnMemoria && inputMapa) {
        inputMapa.value = rutaEnMemoria; 
        generarRutaGoogleMaps();         
    }

    // 4. Recuperar la ruta armanda en el Modal 
    let rutaPersonalizadaMemoria = sessionStorage.getItem('rutaPersonalizada');
    if (rutaPersonalizadaMemoria) {
        const nombresLocales = JSON.parse(rutaPersonalizadaMemoria);
        renderizarRutaModalEnMapa(nombresLocales);
    }
};
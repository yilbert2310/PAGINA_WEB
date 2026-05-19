/* --- FUNCIONALIDAD DEL MAPA INTERACTIVO --- */

const rutaPersonalizada = [];

function armarRuta() {
    alert("¡Bienvenido a la herramienta para armar tu Ruta Gastronómica!");
    
    let primerLugar = prompt("¿Cuál es el primer restaurante o parada en San Cristóbal o el Páramo que deseas visitar?");
    if (primerLugar !== null && primerLugar.trim() !== "") {
        rutaPersonalizada.push(primerLugar);
    }

    let agregarMas = confirm("¿Deseas agregar otro destino a tu ruta?");
    
    while (agregarMas) {
        let otroLugar = prompt("Ingresa el nombre del siguiente lugar (Ej: Dulcería La Andina):");
        if (otroLugar !== null && otroLugar.trim() !== "") {
            rutaPersonalizada.push(otroLugar);
        }
        agregarMas = confirm("¿Deseas agregar otro destino a tu ruta?");
    }

    if (rutaPersonalizada.length > 0) {
        console.log("🥘 TU RUTA GASTRONÓMICA TACHIRENSE 🥘");
        rutaPersonalizada.forEach((lugar, index) => {
            console.log((index + 1) + ". " + lugar);
        });
        alert("¡Ruta guardada exitosamente! Presiona F12 o clic derecho -> Inspeccionar -> Consola para ver tu itinerario.");
    } else {
        alert("No agregaste ningún destino a tu ruta.");
    }
}

const baseDatosMunicipios = {
    "san-cristobal": {
        nombre: "Municipio San Cristóbal",
        descripcion: "La capital gocha, epicentro de caldos matutinos y dulcería tradicional.",
        restaurantes: [
            "El Fogón Andino - Especialidad: Pizca Andina",
            "Dulcería La Andina - Especialidad: Abrillantados e Higos",
            "La Tradición Andina - Especialidad: Arepas de Trigo"
        ]
    },
    "cardenas": {
        nombre: "Municipio Cárdenas (Táriba)",
        descripcion: "Tierra de peregrinación y rica gastronomía.",
        restaurantes: []
    },
    "jauregui": {
        nombre: "Municipio Jáuregui (La Grita)",
        descripcion: "La Atenas del Táchira. Cuna de tradiciones andinas arraigadas y excelente gastronomía de alta montaña.",
        restaurantes: [
            "El Páramo del Zumbador - Especialidad: Calentadito y Chicha",
            "Cafetín La Atenas - Especialidad: Pastelitos andinos"
        ]
    }
};

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
            datos.restaurantes.forEach(lugar => {
                contenidoHTML += `<li>${lugar}</li>`;
            });
        } else {
            contenidoHTML += `<li>Próximamente más restaurantes recomendados en esta zona.</li>`;
        }
        
        contenidoHTML += `</ul>`;
        caja.innerHTML = contenidoHTML;
        caja.style.display = "block";
    }
}

/* --- BÚSQUEDA POR UBICACIÓN --- */

const directorioLocales = [
    { 
        nombre: "El Fogón Andino", 
        zonas: ["barrio obrero", "avenida carabobo", "carabobo"], 
        descripcion: "Perfecto para desayunar Pizca Andina." 
    },
    { 
        nombre: "La Tradición Andina", 
        zonas: ["barrio obrero", "avenida carabobo", "carabobo"], 
        descripcion: "Disfruta de auténticas Arepas de Trigo hechas a leña." 
    },
    { 
        nombre: "Dulcería La Andina", 
        zonas: ["centro", "quinta avenida", "séptima avenida"], 
        descripcion: "Ideal para un postre. Especialistas en abrillantados." 
    },
    { 
        nombre: "El Páramo del Zumbador", 
        zonas: ["paramo", "cordero", "via cordero", "zumbador"], 
        descripcion: "La mejor parada para un Calentadito o Chicha Andina." 
    },
    { 
        nombre: "Comedores del Mercado Los Pequeños Comerciantes", 
        zonas: ["la concordia", "san cristobal", "mercado"], 
        descripcion: "El epicentro popular para un buen Mute los domingos." 
    },
    { 
        nombre: "Los Kioscos de Capacho", 
        zonas: ["capacho", "independencia", "libertad", "mercado municipal"], 
        descripcion: "Parada tradicional para comer los mejores pastelitos y masato." 
    }
];

function buscarRestaurantesCercanos() {
    const inputVal = document.getElementById('input-ubicacion').value.toLowerCase().trim();
    const cajaResultados = document.getElementById('resultados-ubicacion');
    
    if (inputVal === "") {
        alert("Por favor, ingresa tu ubicación para mostrarte las opciones.");
        return;
    }

    const localesEncontrados = directorioLocales.filter(local => 
        local.zonas.some(zona => inputVal.includes(zona) || zona.includes(inputVal))
    );

    if (localesEncontrados.length > 0) {
        let contenido = `<h4 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.2em;">🍽️ Ruta sugerida cerca de "${inputVal}":</h4>`;
        contenido += `<ul class="lista-menu-local" style="margin: 0; padding: 0;">`;
        
        localesEncontrados.forEach(local => {
            contenido += `
                <li style="background: white; margin-bottom: 10px; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); list-style: none;">
                    <strong style="color: #d35400; font-size: 1.1em;">${local.nombre}</strong><br>
                    <span style="color: #555; font-size: 0.9em;">${local.descripcion}</span>
                </li>`;
        });
        
        contenido += `</ul>`;
        cajaResultados.innerHTML = contenido;
        cajaResultados.style.display = "block";
    } else {
        cajaResultados.innerHTML = `
            <h4 style="color: #d35400; margin-bottom: 10px;">¡Explora un poco más!</h4>
            <p style="color: #555;">No tenemos registros exactos en "${inputVal}", pero a pocos minutos te sugerimos acercarte a <strong>Barrio Obrero</strong> para probar las arepas de <em>La Tradición Andina</em>.</p>
        `;
        cajaResultados.style.display = "block";
    }
}

/* --- ENRUTAMIENTO Y RENDERIZADO COMPLETO --- */

const inventarioRestaurantes = [
    { 
        nombre: "El Fogón Andino", 
        zonas: ["barrio obrero", "avenida carabobo", "carabobo"], 
        direccionMaps: "El Fogón Andino, Barrio Obrero, San Cristóbal, Táchira",
        imagen: "img/restaurante1.jpg",
        referencia: "📍 Barrio Obrero, San Cristóbal",
        descripcion: "Un rincón clásico para desayunar. Especialistas en caldos y desayunos tradicionales.",
        tags: ["Pizca Andina", "Pastelitos"],
        enlaceDetalle: "detalles/detalle_restaurante1.html"
    },
    { 
        nombre: "La Tradición Andina", 
        zonas: ["barrio obrero", "avenida carabobo", "carabobo"], 
        direccionMaps: "La Tradición Andina, Barrio Obrero, San Cristóbal, Táchira",
        imagen: "img/restaurante4.jpg",
        referencia: "📍 Barrio Obrero, San Cristóbal",
        descripcion: "Un rincón clásico en San Cristóbal donde el sabor de las auténticas arepas de trigo hechas a leña se mantiene vivo.",
        tags: ["Arepas de Trigo", "Comida Típica"],
        enlaceDetalle: "detalles/detalle_restaurante4.html"
    },
    { 
        nombre: "Dulcería La Andina", 
        zonas: ["centro", "quinta avenida", "séptima avenida"], 
        direccionMaps: "Dulcería La Andina, Centro, San Cristóbal, Táchira",
        imagen: "img/restaurante2.jpg",
        referencia: "📍 Centro de San Cristóbal",
        descripcion: "Patrimonio de la ciudad. Más de 30 años elaborando los postres más representativos de la región de forma artesanal.",
        tags: ["Abrillantados", "Higos"],
        enlaceDetalle: "detalles/detalle_restaurante2.html"
    },
    { 
        nombre: "El Páramo del Zumbador", 
        zonas: ["paramo", "cordero", "via cordero", "zumbador"], 
        direccionMaps: "Páramo del Zumbador, Táchira",
        imagen: "img/restaurante3.jpg",
        referencia: "📍 Vía Cordero - Páramo",
        descripcion: "La parada obligatoria de los viajeros. Ofrecen las mejores bebidas calientes y fermentadas para combatir el frío.",
        tags: ["Calentadito", "Chicha Andina"],
        enlaceDetalle: "detalles/detalle_restaurante3.html"
    },
    { 
        nombre: "Comedores del Mercado Los Pequeños Comerciantes", 
        zonas: ["la concordia", "san cristobal", "mercado"], 
        direccionMaps: "Mercado de Los Pequeños Comerciantes, La Concordia, San Cristóbal, Táchira",
        imagen: "img/restaurante5.jpg",
        referencia: "📍 La Concordia, San Cristóbal",
        descripcion: "El epicentro popular donde los tachirenses van a comer el mejor Mute y Pizca andina los domingos.",
        tags: ["Mute Tachirense", "Pizca Andina", "Comida Típica"],
        enlaceDetalle: "detalles/detalle_restaurante5.html"
    },
    { 
        nombre: "Los Kioscos de Capacho", 
        zonas: ["capacho", "independencia", "libertad", "mercado municipal"], 
        direccionMaps: "Mercado Municipal de Capacho, Táchira",
        imagen: "img/restaurante6.jpg",
        referencia: "📍 Mercado Municipal de Capacho",
        descripcion: "Parada tradicional famosa por ofrecer las mejores empanadas, pastelitos y masato en la vía a la frontera.",
        tags: ["Pastelitos", "Masato", "Empanadas"],
        enlaceDetalle: "detalles/detalle_restaurante6.html"
    }
];

function generarRutaGoogleMaps() {
    const origen = document.getElementById('ubicacion-mapa').value.trim();
    const panelResultado = document.getElementById('itinerario-resultado');
    const iframeMapa = document.getElementById('gmaps-iframe');
    
    if (origen === "") {
        alert("Por favor, ingresa tu ubicación actual para calcular los puntos más cercanos.");
        return;
    }

    // CORRECCIÓN: Se cambia localStorage por sessionStorage
    sessionStorage.setItem('rutaGuardada', origen);

    const origenMinuscula = origen.toLowerCase();
    const destinosCercanos = inventarioRestaurantes.filter(local => 
        local.zonas.some(zona => origenMinuscula.includes(zona) || zona.includes(origenMinuscula))
    );

    if (destinosCercanos.length > 0) {
        const origenCodificado = encodeURIComponent(origen + ", Táchira, Venezuela");
        const rutaParadas = destinosCercanos.map(d => encodeURIComponent(d.direccionMaps)).join('+to:');
        const urlEmbedMaps = `https://maps.google.com/maps?saddr=${origenCodificado}&daddr=${rutaParadas}&output=embed`;

        let htmlContenido = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: #2c3e50; font-size: 1.8em;">🗺️ Ruta Gastronómica Recomendada</h3>
                <p style="color: #555;">Resultados optimizados basados en tu ubicación: <strong>"${origen}"</strong></p>
                <button onclick="document.getElementById('gmaps-iframe').src='${urlEmbedMaps}'" style="display: inline-block; margin-top: 15px; padding: 12px 25px; background-color: #2c3e50; color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(44, 62, 80, 0.2); transition: 0.3s;">
                    🔄 Recargar Itinerario en el Mapa
                </button>
            </div>
            <div class="galeria-cuadricula">
        `;

        destinosCercanos.forEach(local => {
            let tagsHTML = "";
            local.tags.forEach(tag => {
                tagsHTML += `<span style="background: #e67e22; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.8em; margin-right: 5px;">${tag}</span>`;
            });

            htmlContenido += `
                <article class="tarjeta">
                    <a href="${local.enlaceDetalle}">
                        <img src="${local.imagen}" alt="Fachada de ${local.nombre}">
                    </a>
                    <div class="tarjeta-cuerpo">
                        <h3>${local.nombre}</h3>
                        <p style="color: #777; font-size: 0.9em; margin-bottom: 10px;">${local.referencia}</p>
                        <p>${local.descripcion}</p>
                        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                            ${tagsHTML}
                        </div>
                        <a href="${local.enlaceDetalle}" class="boton-enlace">Ver Información y Mapa</a>
                    </div>
                </article>
            `;
        });

        htmlContenido += `</div>`;
        panelResultado.innerHTML = htmlContenido;
        panelResultado.style.display = "block";
        iframeMapa.src = urlEmbedMaps;

    } else {
        const urlAlternativa = `https://maps.google.com/maps?saddr=${encodeURIComponent(origen + ", Táchira")}&daddr=${encodeURIComponent("Barrio Obrero, San Cristóbal, Táchira")}&output=embed`;
        
        panelResultado.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h4 style="color: #c0392b; margin-bottom: 10px; font-size: 1.4em;">Zona fuera del radar inmediato</h4>
                <p style="color: #555; max-width: 600px; margin: 0 auto 15px auto;">No disponemos de registros comerciales exactos en <em>"${origen}"</em>. Te recomendamos iniciar un recorrido tradicional partiendo del sector con mayor densidad de restaurantes.</p>
                <p style="font-weight: bold; color: #2c3e50; margin-bottom: 15px;">📌 Punto sugerido de inicio: Barrio Obrero (San Cristóbal)</p>
                <button onclick="document.getElementById('gmaps-iframe').src='${urlAlternativa}'" style="display: inline-block; padding: 12px 25px; background-color: #d35400; color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer;">
                    Mostrar ruta sugerida en el mapa
                </button>
            </div>
        `;
        panelResultado.style.display = "block";
    }
}

/* --- MODULARIZACIÓN Y PERSISTENCIA DE DATOS --- */

const enlacesPlatos = {
    "pizca andina": "detalles/detalle_pizca.html",
    "pastelitos": "detalles/detalle_pastelitos.html",
    "mute": "detalles/detalle_mute.html",
    "arepas de trigo": "detalles/detalle_arepa.html",
    "chicha andina": "detalles/detalle_chicha.html",
    "calentadito": "detalles/detalle_calentadito.html",
    "masato": "detalles/detalle_masato.html",
    "abrillantados": "detalles/detalle_abrillantados.html",
    "higos": "detalles/detalle_higos.html",
    "hallaca tachirense": "detalles/detalle_hallaca.html",
    "turmada tachirense": "detalles/detalle_turmada.html",
    "vino de mora": "detalles/detalle_vino_mora.html",
    "mistela": "detalles/detalle_mistela.html",
    "quesadillas andinas": "detalles/detalle_quesadillas.html",
    "melcocha": "detalles/detalle_melcocha.html"
};

function mostrarMenuEnPantalla(menuArray) {
    const cajaResultado = document.getElementById('resultado-menu');
    if (!cajaResultado) return; 

    if (menuArray.length > 0) {
        let contenidoHTML = `<h3 style="color: #d35400; margin-bottom: 15px;">Tu Menú Seleccionado:</h3>`;
        contenidoHTML += `<ul style="list-style: none; padding: 0; margin-bottom: 25px;">`;
        
        menuArray.forEach(item => {
            let enlace = enlacesPlatos[item.toLowerCase()];
            let botonDetalle = enlace ? `<a href="${enlace}" style="margin-left: 15px; padding: 4px 10px; background: #fffaf6; border: 1px solid #d35400; color: #d35400; border-radius: 12px; font-size: 0.8em; text-decoration: none; transition: 0.3s;">Ver detalles 🍲</a>` : '';
            
            contenidoHTML += `<li style="padding: 12px; background: white; border: 1px solid #eee; margin-bottom: 8px; border-radius: 8px; font-weight: bold; color: #2c3e50; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                <span>✅ ${item}</span> 
                ${botonDetalle}
            </li>`;
        });
        contenidoHTML += `</ul>`;

        let restaurantesSugeridos = [];
        inventarioRestaurantes.forEach(restaurante => {
            let tieneElPlato = false;
            menuArray.forEach(itemPedido => {
                restaurante.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(itemPedido.toLowerCase()) || itemPedido.toLowerCase().includes(tag.toLowerCase())) {
                        tieneElPlato = true;
                    }
                });
            });
            if (tieneElPlato) restaurantesSugeridos.push(restaurante);
        });

        if (restaurantesSugeridos.length > 0) {
            contenidoHTML += `<h4 style="color: #2c3e50; margin-bottom: 15px; border-top: 1px solid #eee; padding-top: 15px;">📍 Puedes probar este menú en:</h4>`;
            contenidoHTML += `<div style="display: flex; flex-direction: column; gap: 15px;">`;
            restaurantesSugeridos.forEach(rest => {
                contenidoHTML += `
                    <div style="background: white; padding: 15px; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
                        <strong style="color: #d35400; font-size: 1.1em;">${rest.nombre}</strong><br>
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
    if (plato !== null && plato.trim() !== "") {
        menuDegustacion.push(plato.trim());
    }

    while (confirm('¿Desea agregar otro elemento a su menú?')) {
        let otroPlato = prompt("¿Qué otro elemento deseas agregar?\n\n" + opciones);
        if (otroPlato !== null && otroPlato.trim() !== "") {
            menuDegustacion.push(otroPlato.trim());
        }
    }

    if (menuDegustacion.length > 0) {
        // CORRECCIÓN: Se cambia localStorage por sessionStorage
        sessionStorage.setItem('menuGuardado', JSON.stringify(menuDegustacion));
        mostrarMenuEnPantalla(menuDegustacion);
    }
}

/* --- RECUPERACIÓN AUTOMÁTICA AL NAVEGAR --- */
window.onload = function() {
    // CORRECCIÓN: Se recupera desde sessionStorage
    let menuEnMemoria = sessionStorage.getItem('menuGuardado');
    if (menuEnMemoria) {
        let menuArray = JSON.parse(menuEnMemoria);
        mostrarMenuEnPantalla(menuArray);
    }

    let rutaEnMemoria = sessionStorage.getItem('rutaGuardada');
    let inputMapa = document.getElementById('ubicacion-mapa');
    if (rutaEnMemoria && inputMapa) {
        inputMapa.value = rutaEnMemoria; 
        generarRutaGoogleMaps();         
    }
}
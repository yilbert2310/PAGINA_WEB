/* BASE DE DATOS */

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


const inventarioRestaurantes = [
    { 
        nombre: "El Fogón Andino",
        // Aquí agregamos las zonas altas que quedan cerca de Barrio Obrero
        zonas: ["barrio obrero", "avenida carabobo", "carabobo", "pueblo nuevo", "avenida españa", "pirineos 1", "pirineos 2", "pirineos"],
        direccionMaps: "El Fogón Andino, Barrio Obrero, San Cristóbal, Táchira",
        imagen: "img/restaurante1.jpg",
        referencia: "📍 Barrio Obrero, San Cristóbal",
        descripcion: "Un rincón clásico para desayunar. Especialistas en caldos y desayunos tradicionales.",
        tags: ["Pizca Andina", "Pastelitos"],
        enlaceDetalle: "detalles/detalle_restaurante1.html"
    },
    { 
        nombre: "La Tradición Andina",
        // Aquí agregamos la zona comercial cercana
        zonas: ["barrio obrero", "avenida carabobo", "carabobo", "sambil", "el sambil", "barrio sucre"],
        direccionMaps: "La Tradición Andina, Barrio Obrero, San Cristóbal, Táchira",
        imagen: "img/restaurante4.jpg",
        referencia: "📍 Barrio Obrero, San Cristóbal",
        descripcion: "Un rincón clásico en San Cristóbal donde el sabor de las auténticas arepas de trigo hechas a leña se mantiene vivo.",
        tags: ["Arepas de Trigo", "Comida Típica"],
        enlaceDetalle: "detalles/detalle_restaurante4.html"
    },
    { 
        nombre: "Dulcería La Andina",
        // Esta ya abarca el centro y sus avenidas principales
        zonas: ["centro", "el centro", "quinta avenida", "séptima avenida", "septima avenida"],
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
        // Esta abarca La Concordia
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

const destacadosEditorial = [
    {
        tipo: "Plato Estrella",
        titulo: "Auténtica Pizca Andina",
        descripcion: "El caldo tradicional por excelencia para despertar en la montaña. Preparado con papas, leche, queso ahumado, cilantro y el toque secreto de las abuelas andinas.",
        imagen: "img/pizca.jpg",
        enlace: "detalles/detalle_pizca.html",
        etiqueta: "Desayuno Tradicional"
    },

    {
        tipo: "Local Destacado",
        titulo: "Dulcería La Andina",
        descripcion: "Un rincón patrimonial en el centro de la ciudad. Más de 30 años endulzando paladares con los mejores abrillantados, higos y dulces de leche de la región.",
        imagen: "img/restaurante2.jpg", 
        enlace: "detalles/detalle_restaurante2.html",
        etiqueta: "Patrimonio Cultural"
    },
    
    {
        tipo: "Parada Obligatoria",
        titulo: "El Páramo del Zumbador",
        descripcion: "A más de 2500 metros de altura, el frío se combate con un buen calentadito andino y la mejor compañía. La esencia pura de nuestra cordillera.",
        imagen: "img/restaurante3.jpg",
        enlace: "detalles/detalle_restaurante3.html",
        etiqueta: "Alta Montaña"
    }
];
const translations = {
    en: {
        bannerHeading: "Explore Vlora",
        bannerSub: "Boat trips, bus tickets, and travel info—all in one place.",
        getStarted: "Get Started",
        home: "HOME",
        services: "SERVICES",
        boatTrips: "BOAT TRIPS",
        busLines: "BUS LINES",
        inclusivity: "INCLUSIVITY",
        contact: "CONTACT",
        cart:"Cart",
        clearCart: "Clear Cart",
        checkout: "Checkout",
    },

    al: {
        bannerHeading: "Eksploro Vlorën",
        bannerSub: "Udhëtime me varkë, bileta autobusi dhe informacione udhëtimi—të gjitha në një vend.",
        getStarted: "Fillo Tani",
        home: "BALLINA",
        services: "SHËRBIMET",
        boatTrips: "UDHËTIME ME VARKË",
        busLines: "LINJAT E AUTOBUSËVE",
        inclusivity: "PËRFSHIRJA",
        contact: "KONTAKTI",
        cart: "Shporta",
        clearCart: "Pastro Shportën",
        checkout: "Paguaj"
    },

    it: {
        bannerHeading: "Esplora Valona",
        bannerSub: "Gite in barca, biglietti dell'autobus e informazioni di viaggio—tutto in un unico posto.",
        getStarted: "Inizia Ora",
        home: "HOME",
        services: "SERVIZI",
        boatTrips: "GITE IN BARCA",
        busLines: "LINEE AUTOBUS",
        inclusivity: "INCLUSIVITÀ",
        contact: "CONTATTO",
        cart: "Carrello",
        clearCart:"Svuota carrello"
    },

    es: {
        bannerHeading: "Explora Vlorë",
        bannerSub: "Viajes en barco, boletos de autobús e información de viaje—todo en un solo lugar.",
        getStarted: "Comenzar",
        home: "INICIO",
        services: "SERVICIOS",
        boatTrips: "VIAJES EN BARCO",
        busLines: "LÍNEAS DE AUTOBÚS",
        inclusivity: "INCLUSIVIDAD",
        contact: "CONTACTO",
        cart: "Carrito",
        clearCart: "Vaciar Carrito",
        checkout: "Pagar"
    },
    ru: {
        bannerHeading: "Исследуйте Влёру",
        bannerSub: "Прогулки на лодке, билеты на автобус и туристическая информация — всё в одном месте.",
        getStarted: "Начать",
        home: "ГЛАВНАЯ",
        services: "УСЛУГИ",
        boatTrips: "ПОЕЗДКИ НА ЛОДКЕ",
        busLines: "АВТОБУСНЫЕ МАРШРУТЫ",
        inclusivity: "ИНКЛЮЗИВНОСТЬ",
        contact: "КОНТАКТЫ",
        cart: "Kорзина",
        clearCart: "Oчистить Kорзину",
        checkout:"Проверить"
    },

    fr: {
        bannerHeading: "Explorez Vlora",
        bannerSub: "Excursions en bateau, billets de bus et informations de voyage—tout en un seul endroit.",
        getStarted: "Commencer",
        home: "ACCUEIL",
        services: "SERVICES",
        boatTrips: "EXCURSIONS EN BATEAU",
        busLines: "LIGNES DE BUS",
        inclusivity: "INCLUSIVITÉ",
        contact: "CONTACT",
        cart: "Panier",
        clearCart: "Vider le Panier",
        checkout: "Paiement"
    }
};

// Function to Change Language and Store it in Local Storage
function changeLanguage(lang) {
    localStorage.setItem("selectedLanguage", lang); // Store language selection

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.innerText = translations[lang][key];
    });

    // Update the dropdown text
    document.getElementById("languageDropdown").innerText = lang.toUpperCase();
}

// Function to Load Language on Page Load
function loadLanguage() {
    const storedLang = localStorage.getItem("selectedLanguage") || "en"; // Default to English if no selection
    changeLanguage(storedLang);

    // Set the dropdown value
    document.getElementById("languageDropdown").innerText = storedLang.toUpperCase();
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadLanguage);

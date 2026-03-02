// Initialize an object to hold the text for different languages
const texts = {
    en: {
        welcome: "Welcome",
        description: "This is our awesome website!",
    },
    es: {
        welcome: "Bienvenido",
        description: "¡Este es nuestro increíble sitio web!",
    },
    tr: {
        welcome: "Hoş geldiniz",
        description: "Bu bizim harika sitemiz!",
    },
    pt: {
        welcome: "Bem-vindo",
        description: "Este é o nosso site incrível!",
    },
    de: {
        welcome: "Willkommen",
        description: "Dies ist unsere großartige Website!",
    },
    it: {
        welcome: "Benvenuto",
        description: "Questo è il nostro fantastico sito web!",
    },
    fr: {
        welcome: "Bienvenue",
        description: "Ceci est notre site web génial!",
    }
};

// Get elements from the DOM
const welcomeText = document.getElementById('welcome');
const descriptionText = document.getElementById('description');
const languageSelector = document.getElementById('language-selector');

// Function to change language
function changeLanguage(language) {
    welcomeText.innerText = texts[language].welcome;
    descriptionText.innerText = texts[language].description;
}

// Event listener for language selection
languageSelector.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    changeLanguage(selectedLanguage);
});

// Initial setup: set default language to English
changeLanguage('en');
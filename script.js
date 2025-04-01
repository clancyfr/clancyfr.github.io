// Color data
const colors = {
    "bleu": "#347aeb",
    "blanc": "#ffffff",
    "rouge": "#cc232e",
    "jaune": "#d9cb0f"
};
const concerts = [
    {
        Name: "Lyon (24 Avril)",
        Sections: {
            "101": "blanc",
            "201": "rouge",
            "202": "rouge",
            "203": "rouge",
            "204": "rouge",
            "205": "rouge",
            "206": "blanc",
            "207": "blanc",
            "208": "bleu",
            "209": "bleu",
            "210": "bleu",
            "211": "bleu",
            "212": "bleu",
            "310": "rouge",
            "311": "blanc",
            "312": "blanc",
            "313": "blanc",
            "314": "bleu",
            "Fosse": ["bleu", "blanc", "rouge"]
        }
    },
    {
        Name: "Paris (2 Mai)",
        Sections: {
            "A": "blanc",
            "B": "blanc",
            "C": "blanc",
            "D": "bleu",
            "E": "bleu",
            "F": "bleu",
            "G": "bleu",
            "H": "bleu",
            "M": "rouge",
            "N": "rouge",
            "O": "rouge",
            "P": "rouge",
            "R": "rouge",
            "S": "blanc",
            "T": "blanc",
            "U": "blanc",
            "Fosse": ["bleu", "blanc", "rouge"]
        }
    }
];

// Localization
const translations = {
    "en": {
        "concertSel": "Choose your concert",
        "concertDateSel": "Select a date",
        "blocSel": "Select your section",
        "blocColorPretext": "The color of your section is",
        "blocColorPretext2": "The colors of your section are",
        "blocColorSL": "The color you have been assigned is",
        "displayOverlay": "Show fullscreen color",
        "Fosse": "Pit",
        "bleu": "blue",
        "blanc": "white",
        "rouge": "red",
        "bleu,blanc,rouge": "blue,white,red",
        "Lyon (24 Avril)": "Lyon (April 24th)",
        "Paris (2 Mai)": "Paris (May 2nd)",
        "explanation1": "Select your show and location to be assigned a color.",
        "explanation2": "When <b>Mulberry Street</b> starts, put your phone on max brightness, show your color, and point your screen towards the stage.",
        "explanation3": "<b>Note :</b> Don't hesitate to screenshot the color for easier access later."
    },
    "fr": {
        "concertSel": "Choisissez votre concert",
        "concertDateSel": "Sélectionnez une date",
        "blocSel": "Choisissez votre bloc",
        "blocColorPretext": "La couleur de votre bloc est le",
        "blocColorPretext2": "Les couleurs de votre bloc sont le",
        "blocColorSL": "La couleur qui vous a été attribuée est le",
        "displayOverlay": "Afficher la couleur en plein écran",
        "explanation1": "Selectionnez votre concert et votre emplacement pour recevoir votre couleur.",
        "explanation2": "Quand <b>Mulberry Street</b> commence, mettez votre luminosité au maximum, affichez votre couleur et pointez votre écran vers la scène.",
        "explanation3": "<b>Note :</b> N'hésitez pas à faire une capture d'écran de votre couleur pour y accéder plus facilement après."
    }
};

// Page elements
const dateSelect = document.querySelector('#dateSelect');
const sectionSelect = document.querySelector('#sectionSelect');
const sectionDiv = document.querySelector('#sectionDiv');
const colorText = document.querySelector('#colorText');
const overlayDiv = document.querySelector('#overlayDiv');
const displayDiv = document.querySelector('#displayDiv');
const colorPretext = document.querySelector('#colorPretext');
const colorSecondLine = document.querySelector('#colorSecondLine');
const colorText2 = document.querySelector('#colorText2');
const translateFR = document.querySelector('#translateFR');
const translateEN = document.querySelector('#translateEN');
let colorName;
let color;

function addOptionToSelect(select, optionValue, optionText) {
    const option = document.createElement('option');

    option.value = optionValue;
    option.text = tr(optionText);
    option.className = "tr";
    option.dataset.key = optionText;

    select.add(option);
}

function displayOverlay() {
    window.location.hash = "#overlay";
    overlayDiv.style.backgroundColor = color;
    overlayDiv.style.display = "block";

    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
}
function hideOverlay() {
    window.location.hash = "";
    overlayDiv.style.display = "none";
    document.exitFullscreen().then(() => {}).catch((err) => {});
}

function getLanguage() {
    const storedLanguage = localStorage.getItem("lang");
    if (storedLanguage && storedLanguage in translations)
        return storedLanguage;

    const language = navigator.language.split('-')[0];
    if (!(language in translations))
        language = "fr";

    localStorage.setItem("lang", language);
    return language;
}
function tr(key) {
    const language = getLanguage();

    if (language in translations && key in translations[language])
        return translations[language][key];

    return key;
}
function trArray(keyArray) {
    return keyArray.map((key) => tr(key));
}
function translateAll() {
    document.querySelectorAll(".tr").forEach((span) => {
        span.innerHTML = tr(span.dataset.key);
    });
}

translateFR.onclick = () => {
    localStorage.setItem("lang", "fr");
    translateEN.classList.add("selectable");
    translateFR.classList.remove("selectable");
    translateAll();
};
translateEN.onclick = () => {
    localStorage.setItem("lang", "en");
    translateFR.classList.add("selectable");
    translateEN.classList.remove("selectable");
    translateAll();
};

window.onload = () => {
    concerts.forEach((concert, index) => {
        addOptionToSelect(dateSelect, index, concert.Name);
    });
    
    translateAll();
    if (getLanguage() == "fr") {
        translateEN.classList.add("selectable");
    } else {
        translateFR.classList.add("selectable");
    }
}

dateSelect.onchange = () => {
    sectionDiv.style.display = "block";

    sectionSelect.length = 1;
    sectionSelect.value = "";
    Object.keys(concerts[dateSelect.value].Sections).forEach((section) => {
        addOptionToSelect(sectionSelect, section, section);
    });

    document.documentElement.scrollTo({left: 0, top: document.documentElement.scrollHeight, behavior: "smooth"});
};

sectionSelect.onchange = () => {
    const colorNames = concerts[dateSelect.value].Sections[sectionSelect.value];
    colorName = (typeof colorNames === "string") ? colorNames : colorNames[Math.floor(Math.random() * colorNames.length)];
    color = colors[colorName];

    displayDiv.style.display = "block";
    if (typeof colorNames === "string") {
        colorPretext.innerHTML = tr("blocColorPretext")
        colorPretext.dataset.key = "blocColorPretext";
        colorText.style.color = color;
        colorText.innerHTML = tr(colorName);
        colorText.dataset.key = colorName;
        colorSecondLine.style.display = "none";
    } else {
        colorPretext.innerHTML = tr("blocColorPretext2")
        colorPretext.dataset.key = "blocColorPretext2";
        colorText.style.color = "black";
        colorText.innerHTML = trArray(colorNames);
        colorText.dataset.key = colorNames;
        colorSecondLine.style.display = "block";
        colorText2.style.color = color;
        colorText2.innerHTML = tr(colorName);
        colorText2.dataset.key = colorName;
    }

    document.documentElement.scrollTo({left: 0, top: document.documentElement.scrollHeight, behavior: "smooth"});
};

overlayButton.onclick = displayOverlay;
closeOverlayDiv.onclick = hideOverlay;

// Handle back button
window.addEventListener("hashchange", function(){
    if (location.hash == "")
        hideOverlay();
});

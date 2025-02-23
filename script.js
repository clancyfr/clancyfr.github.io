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
let colorName;
let color;

function addOptionToSelect(select, optionValue, optionText) {
    const option = document.createElement('option');

    option.value = optionValue;
    option.text = optionText;

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

window.onload = () => {
    concerts.forEach((concert, index) => {
        addOptionToSelect(dateSelect, index, concert.Name);
    });
}

dateSelect.onchange = () => {
    sectionDiv.style.display = "block";

    sectionSelect.length = 1;
    sectionSelect.value = "";
    Object.keys(concerts[dateSelect.value].Sections).forEach((section) => {
        addOptionToSelect(sectionSelect, section, section);
    });
};

sectionSelect.onchange = () => {
    const colorNames = concerts[dateSelect.value].Sections[sectionSelect.value];
    colorName = (typeof colorNames === "string") ? colorNames : colorNames[Math.floor(Math.random() * colorNames.length)];
    color = colors[colorName];

    displayDiv.style.display = "block";
    if (typeof colorNames === "string") {
        colorPretext.innerHTML = "La couleur de votre bloc est le"
        colorText.style.color = color;
        colorText.innerHTML = colorName;
        colorSecondLine.style.display = "none";
    } else {
        colorPretext.innerHTML = "Les couleurs de votre bloc sont le"
        colorText.style.color = "black";
        colorText.innerHTML = colorNames;
        colorSecondLine.style.display = "block";
        colorText2.style.color = color;
        colorText2.innerHTML = colorName;
    }
};

overlayButton.onclick = displayOverlay;
closeOverlayDiv.onclick = hideOverlay;

// Handle back button
window.addEventListener("hashchange", function(){
    if (location.hash == "")
        hideOverlay();
});

// === VARIABLES
let oCanvasHTML = document.querySelector("canvas");
let oContexte = oCanvasHTML.getContext("2d");

let nHauteurCanvas = oCanvasHTML.height;
let nLargeurCanvas = oCanvasHTML.width;

let sEtat = "intro";

let listeCartes = [
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "red", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "red", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "blue", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "blue", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "green", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "green", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "yellow", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "yellow", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "purple", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "purple", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "orange", estVisible: false },
    { x: 0, y: 0, hauteur: 140, largeur: 100, couleur: "orange", estVisible: false },
];

let nbPairesTrouvees = 0;

// Cartes choisies par le joueur, si c'est null, aucune carte n'a été choisie
let choixCarte1 = null;
let choixCarte2 = null;

// Bouton pour démarrer sur l'écran d'intro
let oBoutonDemarrer = { x: nLargeurCanvas / 2 - 100, y: nHauteurCanvas - 100, largeur: 200, hauteur: 50, texte: "DÉMARRER", teinte: 0 };

// sons du jeu
let sons = {
    paireTrouvee: new Audio("assets/audio/sonPaire.wav"),
    finPartie: new Audio("assets/audio/sonFinPartie.wav"),
    erreur: new Audio("assets/audio/sonErreur.wav"),
};

sons.paireTrouvee.volume = 0.2;
sons.finPartie.volume = 0.2;
sons.erreur.volume = 0.8;
// === FONCTION D'INITIALISATION DU JEU ===

function initialiser() {
    setInterval(boucleJeu, 1000 / 60);
    window.addEventListener("click", onClicCanvas);
}

function redemarrerJeu() {
    nbPairesTrouvees = 0;

    choixCarte1 = null;
    choixCarte2 = null;

    for (let i = 0; i < listeCartes.length; i++) {
        listeCartes[i].estVisible = false;
    }

    melangerCartes();
}

// === Boucle de jeu ===
function boucleJeu() {
    oContexte.clearRect(0, 0, nLargeurCanvas, nHauteurCanvas);

    if (sEtat == "intro") {
        dessinerMenu();
        redemarrerJeu();
    } else if (sEtat == "jeu") {
        dessinerCartes();
        dessinerUI();
    }
}

//=== FONCTIONS D'ÉCOUTEURs D'ÉVÉNEMENTS ===
function onClicCanvas(evenement) {
    let curseurX = evenement.offsetX;
    let curseurY = evenement.offsetY;

    if (sEtat == "intro" && detecterClicObjet(curseurX, curseurY, oBoutonDemarrer) == true) {
        sEtat = "jeu";
    } else if (sEtat == "jeu") {
        let carte = trouverCarte(curseurX, curseurY);

        if (carte != null) {
            if (choixCarte1 == null) {
                carte.estVisible = true;
                choixCarte1 = carte;
            } else if (choixCarte2 == null && carte != choixCarte1) {
                carte.estVisible = true;
                choixCarte2 = carte;
                validerFin();
            }
        }
    }
}

// === FONCTIONS D'AFFICHAGE DES ÉLÉMENTS DE JEU ===
function dessinerMenu() {
    oBoutonDemarrer.teinte++;

    if (oBoutonDemarrer.teinte >= 360) {
        oBoutonDemarrer.teinte = 0;
    }

    // Titre
    oContexte.fillStyle = "#333";
    oContexte.font = "bold 40px Arial";
    oContexte.textAlign = "center";
    oContexte.fillText("JEU DES PAIRES", nLargeurCanvas / 2, 100);

    // Instructions
    oContexte.font = "20px Arial";
    oContexte.fillText("Trouvez toutes les paires", nLargeurCanvas / 2, 150);

    // Bouton démarrer
    oContexte.fillStyle = `hsl(${oBoutonDemarrer.teinte}, 50%, 50%)`;
    oContexte.fillRect(oBoutonDemarrer.x, oBoutonDemarrer.y, oBoutonDemarrer.largeur, oBoutonDemarrer.hauteur);

    // Texte
    oContexte.fillStyle = "#fff";
    oContexte.font = "bold 24px Arial";
    oContexte.textAlign = "center";
    oContexte.fillText(oBoutonDemarrer.texte, oBoutonDemarrer.x + oBoutonDemarrer.largeur / 2, oBoutonDemarrer.y + oBoutonDemarrer.hauteur / 2 + 8);
}

function dessinerCartes() {
    for (let i = 0; i < listeCartes.length; i++) {
        let carte = listeCartes[i];

        if (carte != null) {
            // Pour afficher les cartes en grille, on calcule la colonne et la ligne
            // Ex: si i = 3, colonne = 3, ligne = 0
            // Ex: si i = 5, colonne = 1, ligne = 1
            // On utilise le modulo (%) pour la colonne et la division entière (Math.floor) pour la ligne
            //En ce moment, on affiche 4 cartes par ligne et on espace les cartes de 10 pixels
            let positionColonne = i % 4;
            let positionLigne = Math.floor(i / 4);

            let margeGauche = 35;
            let margeHaut = 35;

            let decalageX = positionColonne * 10;
            let decalageY = positionLigne * 10;

            // Calculer la position de la carte
            // On place la carte en fonction de sa colonne et de sa ligne
            // On ajoute les marges et les décalages
            carte.x = positionColonne * carte.largeur + decalageX + margeGauche;
            carte.y = positionLigne * carte.hauteur + decalageY + margeHaut;

            // Dessiner la carte
            if (carte.estVisible == true) {
                oContexte.fillStyle = carte.couleur;
            } else {
                oContexte.fillStyle = "gray";
            }

            oContexte.fillRect(carte.x, carte.y, carte.largeur, carte.hauteur);
        }
    }
}

function dessinerUI() {
    oContexte.fillStyle = "#333";
    oContexte.font = "bold 10px Arial";
    oContexte.textAlign = "left";
    oContexte.fillText("Paires trouvées : " + nbPairesTrouvees, 35, 20);
}

// === FONCTIONS DE LOGIQUE DES CARTES ===
function melangerCartes() {
    //Retourne un nombre aléatoire entre -0.5 et 0.5
    //Si le nombre est négatif, l'élément A sera avant l'élément B
    //Si le nombre est positif, l'élément B sera avant l'élément A
    listeCartes.sort(function () {
        return Math.random() - 0.5;
    });
}

function trouverCarte(curseurX, curseurY) {
    for (let i = 0; i < listeCartes.length; i++) {
        let carte = listeCartes[i];
        if (carte != null && detecterClicObjet(curseurX, curseurY, carte)) {
            return carte;
        }
    }
    return null;
}

function validerFin() {
    if (choixCarte1.couleur == choixCarte2.couleur) {
        choixCarte1 = null;
        choixCarte2 = null;

        nbPairesTrouvees++;

        sons.paireTrouvee.currentTime = 0;
        sons.paireTrouvee.play();

        setTimeout(function () {
            if (nbPairesTrouvees >= listeCartes.length / 2) {
                sEtat = "intro";
                redemarrerJeu();
                sons.finPartie.play();
            }
        }, 1000);
    } else {
        sons.erreur.play();
        setTimeout(function () {
            choixCarte1.estVisible = false;
            choixCarte2.estVisible = false;

            choixCarte1 = null;
            choixCarte2 = null;
        }, 1000);
    }
}

// === FONCTIONS UTILITAIRES ===
function detecterClicObjet(curseurX, curseurY, objet) {
    if (curseurX >= objet.x && curseurX <= objet.x + objet.largeur && curseurY >= objet.y && curseurY <= objet.y + objet.hauteur) {
        return true;
    }
    return false;
}

window.addEventListener("load", initialiser);

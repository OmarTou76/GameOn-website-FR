// Variables
const ANIMATION_DURATION = 300

// DOM Elements
const iconNav = document.querySelector(".icon");
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const closeBtn = document.querySelectorAll('.closeModal')
const closeAnimation = document.querySelector('.content')
const myForm = document.querySelector('form')
const validModal = document.querySelector('.modal-valid')

// Ecouteur d'evenement au clic
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
closeBtn.forEach((btn) => btn.addEventListener('click', closeModal))
iconNav.addEventListener('click', editNav)

/**
 * Permet au header de la page d'etre responsive
 */
function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

/**
 * Affiche la modal lorsque l'on clique sur le bouton "Je m'inscris"
 */
function launchModal() {
  modalbg.style.display = "block";
}

/**
 * Ferme la modal et reset le formulaire 
 */
function closeModal() {
  // Animation qui fait remonter la modal vers le haut et disparait
  animationHandler(closeAnimation, "closeModal", ANIMATION_DURATION)

  // Timeout pour laisser le temps a l'animation de s'effectuer
  setTimeout(() => {
    modalbg.style.display = "none";
    myForm.reset()

    //remet le style de l'element a l'etat initial
    animationHandler(closeAnimation)

    // Reset le formulaire lorsque l'utilisateur ferme la modal
    myForm.style.display = "block"
    validModal.style.display = "none"
  }, ANIMATION_DURATION)
}

/**
 * Fonction qui ajoute une animation ou reset l'animation si le champ animationName et duration ne sont pas remplit.
 * 
 * @param {HTMLElement} element : Element sur lequel ajouté le l'animation
 * @param {string} animationName : Le nom de l'animation crée en CSS au préalable.
 * @param {number} duration : La durée de l'animation
 */
function animationHandler(element, animationName = '', duration = null) {
  element.style.animationName = animationName;
  element.style.animationDuration = duration === 0 ? `${duration}ms` : '';
}

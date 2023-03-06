function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// Variables
const ANIMATION_DURATION = 300

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const closeBtn = document.querySelectorAll('.closeModal')
const closeAnimation = document.querySelector('.content')


// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
closeBtn.forEach((btn) => btn.addEventListener('click', closeModal))

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// Close modal form
function closeModal() {
  animationHandler(closeAnimation, "closeModal", ANIMATION_DURATION)
  setTimeout(() => {
    modalbg.style.display = "none";
    animationHandler(closeAnimation)

    // Reset le formulaire lorsque l'utilisateur ferme la modal
    form.reset()
    form.style.display = "block"
    modalValid.style.display = "none"
  }, ANIMATION_DURATION)
}

// Animation close modal 
// Fonction qui ajoute une animation ou reset l'animation si le champ animationName et duration ne sont pas remplit
function animationHandler(element, animationName = '', duration = '') {
  element.style.animationName = animationName;
  element.style.animationDuration = duration ? `${duration}ms` : '';
}

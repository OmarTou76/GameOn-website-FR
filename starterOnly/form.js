class HandleForm {
    // Tout les champs du formulaire
    fields = {
      first: null,
      last: null,
      email: null,
      birthdate: null,
      quantity: null,
      location: null,
      checkbox1: document.getElementById('checkbox1').checked,
      checkbox2: document.getElementById('checkbox2').checked,
    }

    // Message d'erreur
    errorMessage = {
      first: "Veuillez entrer 2 caractères ou plus pour le champ du prenom.",
      last: "Veuillez entrer 2 caractères ou plus pour le champ du nom.",
      email: "Veuillez entrer une adresse email valide.",
      birthdate: "Veuillez ajouter une date de naissance.",
      quantity: "Veuillez indiquer le nombre de participation au tournoi.",
      checkbox1: "Vous devez vérifier que vous acceptez les termes et conditions.",
      checkbox2: "",
      location: "Veuillez indiquer la ville de votre choix."
    }

    // Regex pour chaque champs du formulaire
    regEx = {
      first: /^[a-zA-Z]{2,}$/,
      last: /^[a-zA-Z]{2,}$/,
      email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      birthdate: /^\d{4}-\d{2}-\d{2}$/,
      quantity: /^\d+$/,
      location: null,
      checkbox1: null,
      checkbox2: null,
    }
  
    constructor(form) {
      this.form = form
      /* Boucle sur l'objet qui contient tout les id/name du formulaire pour pouvoir ensuite les manipuler a chaque changement */
      for (let key in this.fields){ 
        const element = document.querySelector(`input[name="${key}"]`).parentNode
        switch(key){
          case 'checkbox1': 
          case 'checkbox2': 
            new FormField(element, this.regEx[key], this.handleCheckbox.bind(this))
            break
          case 'location':
            new FormField(element, this.regEx[key], this.handleRadio.bind(this))
            break
          default:
            new FormField(element, this.regEx[key], this.checkRegex.bind(this))
            break
        }
      }
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        let canSubmit = true
        for (let key in this.fields){
          if (this.fields[key] === null || (key === 'checkbox1' && !this.fields[key])){
            canSubmit = false
            let target = `input[id="${key}"]`
            if (key === 'location'){ //L'id de "location" a un chiffre après alors que le "name" non et inverse pour le checkbox
              target = `input[name="${key}"]` 
            }
            const element = document.querySelector(target).parentNode
            this.addError(key, element)
          }
        }
        if (canSubmit){
          e.target.style.display = 'none'
          const modalValid = document.querySelector('.modal-valid')
          modalValid.style.display = "flex"
          console.log(this.fields)
        }
  
      })
    }


  handleRadio(e){
    this.fields.location = e.target.value
    this.removeAttribute(e.target.parentNode)
  }
    
  handleCheckbox(e){
    const {checked, id, parentNode: parent} = e.target
    if (id === 'checkbox1'){
      if (!checked){
        this.addError(id, parent)
      }else {
        this.removeAttribute(parent)
      }
    }
    this.fields[id] = checked
  }

  checkRegex(e, reg) {
    const { value, id, parentNode: parent} = e.target
    this.removeAttribute(parent)
    if (reg.test(value)) {
      this.fields[id] = value
    } else {
      this.addError(id, e.target.parentNode)
    }
  }
  
  removeAttribute(element){
      element.removeAttribute('data-error-visible')
      element.removeAttribute('data-error')
  }
  
  addError(id, element){
    this.fields[id] = null
    element.setAttribute('data-error-visible', true)
    element.setAttribute('data-error', this.errorMessage[id])
  }

}

class FormField{
  constructor(element, regex, handleField){
    element.addEventListener('change', (e) => handleField(e, regex))
  }
}

const form = document.querySelector('form');
new HandleForm(form)
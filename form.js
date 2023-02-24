class HandleForm {
    // Tout les champs du formulaire
    fields = {
      first: {
        value: null,
        regex: /^[a-zA-Z]{2,}$/,
        errorText: "Veuillez entrer 2 caractères ou plus pour le champ du prenom."
      },
      last: {
        value: null,
        regex: /^[a-zA-Z]{2,}$/,
        errorText: "Veuillez entrer 2 caractères ou plus pour le champ du nom."
      },
      email: {
        value: null,
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        errorText: "Veuillez entrer une adresse email valide.",
      },
      birthdate: {
        value: null,
        regex: /^\d{4}-\d{2}-\d{2}$/,
        errorText: "Veuillez ajouter une date de naissance valide."
      },
      quantity: {
        value: null,
        regex: /^\d+$/,
        errorText: "Veuillez indiquer le nombre de participation au tournoi.",
      },
      location: {
        value: null,
        regex: null,
        errorText: "Veuillez indiquer la ville de votre choix."
      },
      checkbox1: {
        value: document.getElementById('checkbox1').checked,
        regex: null,
        errorText: "Vous devez vérifier que vous acceptez les termes et conditions.",
      },
      checkbox2: {
        value: document.getElementById('checkbox2').checked,
        regex: null,
        errorText: "",
      }
    }
    constructor(form) {
      this.form = form
      /* Boucle sur l'objet qui contient tout les id/name du formulaire pour pouvoir ensuite les manipuler a chaque changement */
      for (let key in this.fields){ 
        const element = document.querySelector(`input[name="${key}"]`).parentNode
        switch(key){
          case 'checkbox1': 
          case 'checkbox2': 
            new FormField(element, this.fields[key].regex, this.handleCheckbox.bind(this))
            break
          case 'location':
            new FormField(element, this.fields[key].regex, this.handleRadio.bind(this))
            break
          default:
            new FormField(element, this.fields[key].regex, this.checkRegex.bind(this))
            break
        }
      }
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        let canSubmit = true
        for (let key in this.fields){
          if (this.fields[key].value === null || (key === 'checkbox1' && !this.fields[key].value)){
            console.log(this.fields[key])
            canSubmit = false
            const element = document.querySelector(`input[name="${key}"]`).parentNode
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
    this.fields.location.value = e.target.value
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
    this.fields[id].value = checked
  }

  checkRegex(e, reg) {
    const { value, id, parentNode: parent} = e.target
    this.removeAttribute(parent)
    if (reg.test(value)) {
      if (id === "birthdate"){
        const time = new Date(value).getTime()
        if (time > Date.now()) {
          this.addError(id, e.target.parentNode)
          return
        }
      }
      this.fields[id].value = value
    } else {
      this.addError(id, e.target.parentNode)
    }
  }
  
  removeAttribute(element){
      element.removeAttribute('data-error-visible')
      element.removeAttribute('data-error')
  }
  
  addError(id, element){
    this.fields[id].value = null
    element.setAttribute('data-error-visible', true)
    element.setAttribute('data-error', this.fields[id].errorText)
  }

}

class FormField{
  constructor(element, regex, handleField){
    element.addEventListener('change', (e) => handleField(e, regex))
  }
}

const form = document.querySelector('form');
new HandleForm(form)
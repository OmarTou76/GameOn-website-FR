const form = document.querySelector('form')
const modalValid = document.querySelector('.modal-valid')
class HandleForm {
    // Tout les champs du formulaire
    fields = {
      first: {
        value: null,
        regex: /^[a-zA-Z]{2,}$/,
        errorText: "Veuillez entrer 2 caractères ou plus pour le champ du prenom.",
        handler: this.checkRegex
      },
      last: {
        value: null,
        regex: /^[a-zA-Z]{2,}$/,
        errorText: "Veuillez entrer 2 caractères ou plus pour le champ du nom.",
        handler: this.checkRegex
      },
      email: {
        value: null,
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        errorText: "Veuillez entrer une adresse email valide.",
        handler: this.checkRegex
      },
      birthdate: {
        value: null,
        regex: /^\d{4}-\d{2}-\d{2}$/,
        errorText: "Veuillez ajouter une date de naissance valide.",
        handler: this.handleDate
      },
      quantity: {
        value: null,
        regex: /^\d+$/,
        errorText: "Veuillez indiquer le nombre de participation au tournoi.",
        handler: this.checkRegex
      },
      location: {
        value: null,
        regex: null,
        errorText: "Veuillez indiquer la ville de votre choix.",
        handler: this.handleRadio
      },
      checkbox1: {
        value: document.getElementById('checkbox1').checked,
        regex: null,
        errorText: "Vous devez vérifier que vous acceptez les termes et conditions.",
        handler: this.handleCheckbox
      },
      checkbox2: {
        value: document.getElementById('checkbox2').checked,
        regex: null,
        errorText: "",
        handler: this.handleCheckbox
      }
    }
    constructor(form) {
      for (let key in this.fields){ 
        const element = document.querySelector(`input[name="${key}"]`).parentNode
        this.onChange(element, this.fields[key].regex, this.fields[key].handler.bind(this))
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault()
        let canSubmit = true
        for (let key in this.fields){
          if (this.fields[key].value === null || (key === 'checkbox1' && !this.fields[key].value)){
            canSubmit = false
            const element = document.querySelector(`input[name="${key}"]`).parentNode
            this.addError(key, element)
          }
        }
        if (canSubmit){
          e.target.style.display = 'none'
          const modalValid = document.querySelector('.modal-valid')
          modalValid.style.display = "flex"
          Object.keys(this.fields).forEach((key) => console.log({[key]: this.fields[key].value}))
        }
      })
    }

  onChange(element, regex, handleField){
    element.addEventListener('change', (e) => handleField(e, regex))
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
      this.fields[id].value = value
    } else {
      this.addError(id, e.target.parentNode)
    }
  }

  handleDate(e, reg){
    const {value, id, parentNode: parent} = e.target
    this.removeAttribute(parent)
    if (reg.test(value)){
      const birth = new Date(value).getTime()
      const now = Date.now()
      if (birth >= now){
        this.addError(id, parent)
      } else {
        this.fields[id].value = new Date(value)
      }
    } else {
      this.addError(id, parent)
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

new HandleForm(form)
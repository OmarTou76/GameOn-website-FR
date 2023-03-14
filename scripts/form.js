// DOM elements
const form = document.querySelector('form')
const modalValid = document.querySelector('.modal-valid')


// Classe qui gère / vérifie tout les champs du formulaire

class HandleForm {
  /* 
      Objet avec les clés qui correspondent au tagName du champ de formulaire.
        - Valeur par default null sauf pour les checkbox ou l'on recupère sa valeur dès le début.
        - Regex pour verifier les champs de texte
        - Un message d'erreur en cas de saisie incorrect
        - Une fonction qui met a jour la clé value du champ, si la saisie de l'utilisateur est correct elle met a jour la valeur sinon elle ajoute le message d'erreur au champ en question. 
   */
  fields = {
    first: {
      value: null,
      regex: /^[a-zA-Z]{2,}$/,
      errorText: "Veuillez entrer 2 caractères ou plus pour le champ du prenom.",
      handler: this.handleTextByRegex
    },
    last: {
      value: null,
      regex: /^[a-zA-Z]{2,}$/,
      errorText: "Veuillez entrer 2 caractères ou plus pour le champ du nom.",
      handler: this.handleTextByRegex
    },
    email: {
      value: null,
      regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      errorText: "Veuillez entrer une adresse email valide.",
      handler: this.handleTextByRegex
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
      handler: this.handleTextByRegex
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

    // Boucle sur toutes les clés de l'objet fields, execute la fonction "onChange" qui attend un changement dans le champ concerné, avec comme arguments l'element du DOM concerné, le regex du champ et la fonction qui gère le champ.

    Object.keys(this.fields).forEach((key) => {
      const element = document.querySelector(`input[name="${key}"]`).parentNode
      this.onChange(element, this.fields[key].regex, this.fields[key].handler.bind(this))
    })

    // Ecoute lorsque l'utilisateur valide le formulaire

    form.addEventListener('submit', (e) => {

      // Me permet de ne pas valider le formulaire avant d'avoir vérifier les valeurs
      e.preventDefault()

      let canSubmit = true

      // Boucle sur notre objet fields pour vérifier si la valeur est bien enregistrée et que les conditions sont acceptées, en cas d'erreur on ajoute au champs du texte et du css.
      Object.keys(this.fields).forEach((key) => {
        if (this.fields[key].value === null || (key === 'checkbox1' && !this.fields[key].value)) {
          canSubmit = false
          const element = document.querySelector(`input[name="${key}"]`).parentNode
          this.addError(key, element)
        }
      })

      // Si tout les champs sont ok, le formulaire disparait pour faire apparaitre le texte de validation
      // Ecris dans la console le resultat du formulaire
      if (canSubmit) {
        e.target.style.display = 'none'
        modalValid.style.display = "flex"

        let result = {}
        Object.keys(this.fields).forEach((key) => {
          result[key] = this.fields[key].value
          //console.log({ [key]: this.fields[key].value })
          this.fields[key].value = null
        })
        console.log(result)
      }
    })
  }

  // Ecoute le changement du champ pour verifier si la valeur est correcte
  onChange(element, regex, handleField) {
    element.addEventListener('change', (e) => handleField(e, regex))
  }

  // Gere les Radios, met a jour la localisation.
  handleRadio(e) {
    this.fields.location.value = e.target.value
    this.removeAttribute(e.target.parentNode)
  }

  // Gère le checkbox, ajoute une erreur lorsque les conditions d'utilisation ne sont pas coché.
  handleCheckbox(e) {
    const { checked, id, parentNode: parent } = e.target
    if (id === 'checkbox1') {
      if (!checked) {
        this.addError(id, parent)
      } else {
        this.removeAttribute(parent)
      }
    }
    this.fields[id].value = checked
  }

  // Gere les saisies de texte, teste la saisie de l'utilisateur grace au regex. Si elle est incorrect, ajoute du CSS et le message d'erreur en dessous sinon enregistre la valeur dans l'objet 
  handleTextByRegex(e, reg) {
    const { value, id, parentNode: parent } = e.target
    this.removeAttribute(parent)
    if (reg.test(value)) {
      this.fields[id].value = value
    } else {
      this.addError(id, parent)
    }
  }

  // Gere le champ date, test d'abord le regex founit, verifie si la date fournit n'est pas supérieur a celle du jour.
  handleDate(e, reg) {
    const { value, id, parentNode: parent } = e.target
    this.removeAttribute(parent)
    if (reg.test(value)) {
      const birth = new Date(value).getTime()
      const now = Date.now()
      if (birth >= now) {
        this.addError(id, parent)
      } else {
        this.fields[id].value = new Date(value)
      }
    } else {
      this.addError(id, parent)
    }
  }

  // Retire le CSS et le texte au champ lorsque la saisie est correcte.
  removeAttribute(element) {
    element.removeAttribute('data-error-visible')
    element.removeAttribute('data-error')
  }

  // Ajoute le CSS au champ et le texte en dessous grace au message d'erreur fournit dans l'objet de départ

  addError(id, element) {
    this.fields[id].value = null
    element.setAttribute('data-error-visible', true)
    element.setAttribute('data-error', this.fields[id].errorText)
  }

}

new HandleForm(form)
// DOM elements
const form = document.querySelector('form')
const modalValid = document.querySelector('.modal-valid')


/**
 * Classe qui gère l'ensemble du formulaire
 */

class HandleForm {
  /**
   * Objet avec les clés qui correspondent au tagName du champ de formulaire.
   *  - valeur par default null ou booleen pour les checkbox.
   *  - regex 
   *  - Un message d'erreur
  */
  fields = {
    first: {
      value: null,
      regex: /^[\sa-zA-Z]{2,}$/,
      errorText: "Le champ prénom doit contenir au moins 2 lettres et aucun chiffre.",
    },
    last: {
      value: null,
      regex: /^[\sa-zA-Z]{2,}$/,
      errorText: "Le champ nom doit contenir au moins 2 lettres et aucun chiffre.",
    },
    email: {
      value: null,
      regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      errorText: "Veuillez entrer une adresse email valide.",
    },
    birthdate: {
      value: null,
      regex: /^\d{4}-\d{2}-\d{2}$/,
      errorText: "Veuillez ajouter une date de naissance valide.",
    },
    quantity: {
      value: null,
      regex: /^\d+$/,
      errorText: "Veuillez indiquer le nombre de participation au tournoi.",
    },
    location: {
      value: null,
      regex: null,
      errorText: "Veuillez indiquer la ville de votre choix.",
    },
    checkbox1: {
      value: true,
      regex: null,
      errorText: "Vous devez vérifier que vous acceptez les termes et conditions.",
    },
    checkbox2: {
      value: false,
      regex: null,
      errorText: "",
    }
  }

  /**
   * 
   * @param {HTMLElement} form : Le formulaire 
   * @param {HTMLElement} modalValid : La modal a afficher lorsque le formulaire a été validé.
   */
  constructor(form, modalValid) {

    /**
     * Boucle sur toutes les clés de l'objet fields, execute la fonction onChange qui elle executera la fonction que l'on lui donne en parametre
    */
    Object.keys(this.fields).forEach((key) => {

      const element = document.querySelector(`input[name="${key}"]`).parentNode

      switch (key) {
        case "checkbox1":
        case "checkbox2":
          this.onChange(element, this.fields[key].regex, this.handleCheckbox.bind(this))
          break;

        case 'location':
          this.onChange(element, this.fields[key].regex, this.handleRadio.bind(this))
          break;

        case 'birthdate':
          this.onChange(element, this.fields[key].regex, this.handleDate.bind(this))
          break;

        default:
          this.onChange(element, this.fields[key].regex, this.handleTextByRegex.bind(this))
          break;
      }
    })

    // Ecoute lorsque l'utilisateur valide le formulaire

    form.addEventListener('submit', (e) => {

      // Permet de ne pas valider le formulaire avant d'avoir vérifier les valeurs
      e.preventDefault()

      let canSubmit = true

      /* Boucle sur notre objet fields pour vérifier si la valeur est bien enregistrée et que les conditions sont acceptées, en cas d'erreur on ajoute au champs le message d'erreur. */

      Object.keys(this.fields).forEach((key) => {
        if (this.fields[key].value === null || (key === 'checkbox1' && !this.fields[key].value)) {
          canSubmit = false
          const element = document.querySelector(`input[name="${key}"]`).parentNode
          this.addError(key, element)
        }
      })

      /* Si tout les champs sont ok, le formulaire disparait pour afficher la modal de succès.
      Affiche dans la console le resultat du formulaire et remet a l'etat initial les valeurs du formulaire */
      if (canSubmit) {
        e.target.style.display = 'none'
        modalValid.style.display = "flex"

        Object.keys(this.fields).forEach((key) => {
          console.log(key, ": ", this.fields[key].value)

          // Reset des valeurs de l'objet Fields
          if (key === "checkbox1") {
            this.fields[key].value = true

          } else if (key === "checkbox2") {
            this.fields[key].value = false

          } else {
            this.fields[key].value = null
          }
        })
      }

    })

  }

  /**
   * Ecoute le changement du champ pour verifier si la valeur est correcte a l'aide du regex et de la fonction donnés en paramètre.
   * Ecoute 
   * @param {HTMLElement} element : Le champ indiqué
   * @param {Regex} regex : Le regex a vérfier si besoin
   * @param {Function} handleField : La fonction qui definiera si la saisie est correcte.
   */

  onChange(element, regex, handleField) {
    element.addEventListener('change', (e) => handleField(e, regex))
  }

  /**
   * Ajoute la valeur la clé "location" de l'objet "Fields".
   * Retire le message d'erreur si il a été ajouté.
   * @param {HTMLElement} e : Element dans lequel on recupère le choix de l'utilisateur
   */

  handleRadio(e) {
    this.fields.location.value = e.target.value
    this.removeAttribute(e.target.parentNode)
  }


  /**
   * Gère le checkbox, avec obligation de cocher le checkbox1 qui correspond au termes et conditions d'utilisations.
   * Si les conditions ne sont pas cocher on ajoute du le message d'erreur et le css a l'element.
   * @param {HTMLElement} e : Element dans lequel on recupère le choix de l'utilisateur
   */

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

  /**
   * Gère la saisie de l'utilisateur, si la saisie est ok : l'enregistre dans l'objet sinon ajoute le message d'erreur et le CSS a l'element
   * @param {HTMLElement} e : Element dans lequel on recupère la saisie de l'utilisateur.
   * @param {Regex} reg : Regex a tester sur la saisie de l'utilisateur.
   */

  handleTextByRegex(e, reg) {

    const { value, id, parentNode: parent } = e.target

    this.removeAttribute(parent)

    if (reg.test(value)) {
      if (id === "quantity") {
        this.fields[id].value = parseInt(value)
      } else {
        this.fields[id].value = value
      }
    } else {
      this.addError(id, parent)
    }
  }


  /**
   * Gère la saisie de l'utilisateur, si la date est mauvaise ou superieure a la date du jour, le message d'erreur s'affiche sinon on l'enregiste en format Date grace a l'Object Date.
   * @param {HTMLElement} e : Element dans lequel on recupère la saisie de l'utilisateur.
   * @param {Regex} reg : Regex a tester sur la saisie de l'utilisateur.
   */

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

  /**
   * Retire le CSS et le message d'erreur au champ lorsque la saisie est correcte après avoir été incorrect.
   * @param {HTMLElement} element : Element sur lequel on agir
   */

  removeAttribute(element) {
    element.removeAttribute('data-error-visible')
    element.removeAttribute('data-error')
  }

  // Ajoute le CSS au champ et le texte en dessous grace au message d'erreur fournit dans l'objet de départ
  /**
   * Remet la valeur du champ en question a null.
   * Ajoute le message d'erreur et les attributs CSS pour afficher a l'utilisateur qu'il s'est trompé.
   * @param {string} id : id de l'element qui correspond au champ dans l'objet Field avec lequel on met a jour sa valeur et on recupère le message d'erreur.
   * @param {HTMLElement} element : element sur lequel agir
   */

  addError(id, element) {
    this.fields[id].value = null
    element.setAttribute('data-error-visible', true)
    element.setAttribute('data-error', this.fields[id].errorText)
  }

}

new HandleForm(form, modalValid)
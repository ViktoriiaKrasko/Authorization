import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

class SignupForm extends Form {
  FIELD_NAME = {
    EMAIL: 'email',
    PASSWORD: 'password',
    PASSWORD_REPEAT: 'passwordRepeat',
    ROLE: 'role',
    IS_CONFIRM: 'isConfirm',
  }

  FIELD_ERROR = {
    IS_EMPTY: "This field shouldn't be empty",
    IS_BIG: 'Too many characters, remove extra',
    EMAIL: 'Use valid email',
    PASSWORD:
      'Password should consist of at least 8 characters including at least 1 digit, small and capital letters',
    PASSWORD_REPEAT: 'Passwords do not match',
    NOT_CONFIRM:
      'You have to agree to terms and conditions',
    ROLE: 'You have to choose role',
  }

  validate = (name, value) => {
    //validation of empty field
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }
    //validation of excess characters
    if (String(value).length > 20) {
      return this.FIELD_ERROR.IS_BIG
    }
    //validation of email to regex
    if (name === this.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value)))
        return this.FIELD_ERROR.EMAIL
    }
    //validation of password to regex
    if (name === this.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value)))
        return this.FIELD_ERROR.PASSWORD
    }
    //validation of second password to match first
    if (name === this.FIELD_NAME.PASSWORD_REPEAT) {
      if (
        String(value) !==
        this.value[this.FIELD_NAME.PASSWORD]
      ) {
        return this.FIELD_ERROR.PASSWORD_REPEAT
      }
    }
    //validation to accept tick for terms and conditions
    if (name === this.FIELD_NAME.IS_CONFIRM) {
      if (Boolean(value) !== true)
        return this.FIELD_ERROR.NOT_CONFIRM
    }
    //validation of role (to accept only number)
    if (name === this.FIELD_NAME.ROLE) {
      if (isNaN(value)) return this.FIELD_ERROR.ROLE
    }
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('progress', 'In progress')

      try {
        const res = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
        } else {
          this.setAlert('error', data.message)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
      [this.FIELD_NAME.ROLE]:
        this.value[this.FIELD_NAME.ROLE],
    })
  }
}

window.signupForm = new SignupForm()

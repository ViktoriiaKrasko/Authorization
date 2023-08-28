import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

class RecoveryConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
    PASSWORD: 'password',
    PASSWORD_REPEAT: 'passwordRepeat',
  }

  FIELD_ERROR = {
    IS_EMPTY: "This field shouldn't be empty",
    IS_BIG: 'Too many characters, remove extra',
    PASSWORD:
      'Password should consist of at least 8 characters including at least 1 digit, small and capital letters',
    PASSWORD_REPEAT: 'Passwords do not match',
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
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('progress', 'In progress')

      try {
        const res = await fetch('/recovery-confirm', {
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
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
    })
  }
}

window.recoveryConfirmForm = new RecoveryConfirmForm()

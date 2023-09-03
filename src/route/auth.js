// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'user@mail.com',
  password: 123,
  role: 1,
})

User.create({
  email: 'admin@mail.com',
  password: 123,
  role: 2,
})

User.create({
  email: 'developer@mail.com',
  password: 123,
  role: 3,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Sign Up Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'User' },
        { value: User.USER_ROLE.ADMIN, text: 'Admin' },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Developer',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Error. Required fields are empty',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'User with such email already exists',
      })
    }
    const newUser = User.create({ email, password, role })
    const session = Session.create(newUser)
    Confirm.create(newUser.email)
    return res.status(200).json({
      message: 'Successfully signed up!',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Registration failed',
    })
  }
})

router.get('/recovery', function (req, res) {
  return res.render('recovery', {
    name: 'recovery',
    component: ['back-button', 'field'],
    title: 'Recovery page',

    data: {},
  })
})

router.post('/recovery', function (req, res) {
  const { email } = req.body
  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: 'Error. Required fields are empty.',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'No user exists with such email',
      })
    }

    Confirm.create(email)
    return res.status(200).json({
      message: 'Check your email for reset code',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.get('/recovery-confirm', function (req, res) {
  return res.render('recovery-confirm', {
    name: 'recovery-confirm',
    component: ['back-button', 'field', 'field-password'],
    title: 'Recovery Confirm page',
    data: {},
  })
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body
  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Error. Required fields are empty.',
    })
  }

  try {
    const email = Confirm.getdata(Number(code))

    if (!email) {
      return res.status(400).json({
        message: "Such code doesn't exist",
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'No user exists with such email',
      })
    }

    user.password = password

    console.log(user)
    const session = Session.create(user)

    return res.status(200).json({
      message: 'Password is changed successfully',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }
  return res.render('signup-confirm', {
    name: 'signup-confirm',
    component: ['back-button', 'field'],
    title: 'Signup-confirm page',
    data: {},
  })
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Error. Required fields are empty.',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message:
          'Error. You need to login to your account.',
      })
    }

    const email = Confirm.getdata(code)

    if (!email) {
      return res.status(400).json({
        message: 'Code doesn`t exist.',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Code is not valid',
      })
    }

    // const user = User.getByEmail(session.user.email)
    // user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Email is confirmed.',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }

  console.log(code, token)
})

router.get('/login', function (req, res) {
  return res.render('login', {
    name: 'login',
    component: ['back-button', 'field', 'field-password'],
    title: 'Login page',
    data: {},
  })
})

router.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error. Required fields are empty.',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Error. No user with such email exists.',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Error. Wrong password.',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Logged in',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.get('/user-item', function (req, res) {
  return res.render('user-item', {
    name: 'user-item',
    component: ['back-button'],
    title: 'User item page',
    data: {},
  })
})

router.get('/user-item-data', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      message: 'No user id',
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: 'No user with this id',
    })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router

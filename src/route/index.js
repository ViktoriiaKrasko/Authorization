// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('index', {
    name: 'index',
    component: [],
    title: 'Index Page',

    data: {},
  })
})

router.get('/home', function (req, res) {
  res.render('home', {
    name: 'home',
    component: [],
    title: 'Home Page',

    data: {},
  })
})

router.get('/logout', function (req, res) {
  res.render('logout', {
    name: 'logout',
    component: [],
    title: 'Logout Page',

    data: {},
  })
})

const auth = require('./auth')

router.use('/', auth)

// Експортуємо глобальний роутер
module.exports = router

// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('index', {
    name: 'index',
    component: [],
    title: 'Home Page',

    data: {},
  })
})

const auth = require('./auth')

router.use('/', auth)

// Експортуємо глобальний роутер
module.exports = router

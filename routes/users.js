const { response } = require('express');
const express = require('express');
const router = express.Router();
const gameHelp = require('../helpers/game-helpers');
const userHelp = require('../helpers/user-helpers');

let userExist = false

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  gameHelp.allGames().then((data) => {
    console.log(user);
    res.render('users/home', { data, user });
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('users/login',{err:req.session.loginErr})
    req.session.loginErr = null
  }
})

router.post('/login', (req, res) => {
  userHelp.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.user.login = true
      res.redirect('/')
    } else {
      req.session.loginErr = response.err
      res.redirect('/login')
    }
  }).catch((response) => {
    req.session.loginErr = response.err
    res.redirect('/login')
  })
})

router.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('users/signup',{userExist})
  }
  userExist = false
})

router.post('/signup', (req, res) => {
  userHelp.doSignup(req.body).then((state) => {
    if(state.userExist){
      userExist = true
      res.redirect('/signup')
    }else{
      req.session.user = state.user
      req.session.user.login = true
      res.redirect('/')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/')
})


module.exports = router;

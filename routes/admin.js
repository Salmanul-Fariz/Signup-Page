const { response } = require('express');
const express = require('express');
const { Logger } = require('mongodb');
const router = express.Router();
const gameHelp = require('../helpers/game-helpers');
const objectId = require('mongodb').ObjectId

/* GET users listing. */

let adminErr = null

const adminSession = (req,res,next) => {
  if (req.session.adminlogin){
    next()
  }else{
    res.redirect('/admin')
  }
}

router.get('/', function(req, res, next) {
  if(req.session.adminlogin){
    let adminSession = req.session.adminlogin
    gameHelp.allGames().then((data) => {
      res.render('admin/view-games',{data,adminSession,admin:true,logout:true})
    }).catch((err) => {
      console.log(err);
    })    
  }else{
    res.render('admin/login',{admin:true,adminErr})
    req.session.admin = null
  }
  adminErr = null
  
});

router.post('/adLogin', (req, res) => {
  gameHelp.doLogin(req.body).then((response) => {
    if(response.status){
      req.session.admin = response.admin
      req.session.adminlogin = true
      gameHelp.allGames().then((data) => {
        res.redirect('/admin')
      })
    }else{
      adminErr = response.err
      res.redirect('/admin')
    }
  }).catch((response) => {
    adminErr = response.err
    res.redirect('/admin')
  })
})

router.get('/add-game',adminSession,(req,res) => {
  res.render('admin/add-game',({admin:true}))
})

router.post('/add-game',(req,res) => {
  gameHelp.addGames(req.body,(id) => {
    let image = req.files.gameImage
    image.mv('./public/images/game-img/'+id+'.jpg',(err,done) => {
      if(!err){
        res.redirect('/admin')
      }
    })
  })
})

router.get('/delete-game',adminSession,(req,res) => {
  let gameId = req.query.id
  gameHelp.deleteGame(gameId).then(() => {
    res.redirect('/admin')
  })
})

router.get('/edit-game/:id',adminSession,async(req,res) => {
  let details = await gameHelp.getGameDetails(req.params.id)
  res.render('admin/edit-game',{admin:true,details})
})

router.post('/edit-game/:id',(req,res) => {
  let id = req.params.id
  gameHelp.updateGame(id,req.body).then(() => {
    res.redirect('/admin')
    if(req?.files?.gameImage){
      let image = req.files.gameImage
      image.mv('./public/images/game-img/'+id+'.jpg')
    }
  })
})

router.get('/view-users',adminSession,(req,res) => {
  console.log(req.session);
    let adminSession = req.session.admin
      gameHelp.allUsers().then((user) => {
        res.render('admin/view-users',{user,adminSession,admin:true})
      }).catch((err) => {
        console.log(err);
      })
})

router.get('/delete-user',(req,res) => {
  let userId = req.query.id
  gameHelp.deleteUser(userId).then(() => {
    res.redirect('/admin')
    req.session.user = null
  
  })
})



router.get('/edit-user/:id',async(req,res) => {
  let details = await gameHelp.getUserDetails(req.params.id)
  res.render('admin/edit-user',{admin:true,details})
})

router.post('/edit-user/:id',(req,res) => {
  let id = req.params.id
  gameHelp.updateUser(id,req.body).then(() => {
    res.redirect('/admin')
  })
})

router.get('/adLogout', (req, res) => {
  req.session.adminlogin = false
  res.redirect('/admin')
  console.log(req.session);
})

module.exports = router;

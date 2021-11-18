const express = require('express')
const mainController = require('../controller/mainController')
const router = require("express").Router();


router.all('/', mainController.getHomepage)
// router.all('/*' ,mainController.errorPage)




module.exports = router
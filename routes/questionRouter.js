const router = require('express').Router()
const questionController = require('../controller/questionController')
const { isLogin } = require('../middleware/authMiddleware')


router.all('/addQuestion', isLogin, questionController.addQuestion)
router.get('/question/:id', questionController.showQuestion)
router.post('/question/:id',isLogin , questionController.addAnswer)
router.post('/question/:id/deleteQuestion',isLogin, questionController.deleteQuestion)
router.post('/question/:questionID/:id/deleteAnswer',isLogin, questionController.deleteAnswer)
router.all('/question/:id/editAnswer', isLogin,questionController.editAnswer)
router.all('/question/:id/editQuestion',isLogin, questionController.editQuestion)




module.exports = router;

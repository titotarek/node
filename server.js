
/**
 * Required External Modules
 */
    const express = require('express');
    require('./config/mongoose')
    const cookieParser = require('cookie-parser');

/**
 * App Variables
 */
   const {checkUser} = require('./middleware/authMiddleware')
 //routes
    const mainRoute = require('./routes/mainRouter')
    const authRoute = require('./routes/authRouter');
    const questionRoute = require('./routes/questionRouter');


/**
 *  App Configuration
 */
    const app = express();

    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(express.urlencoded({extended: true}))
    app.use(cookieParser())


/**
 * Routes Definitions
 */

 // app.all('*')
    app.all('*' , checkUser);
    app.use(mainRoute) ;
    app.use(authRoute) ;
    app.use(questionRoute) ;




/**
 * Server Activation
 */
    app.listen(2020, () => console.log('port 2020 is ready'))

    app.use((req , res) => {
      res.status(404).render('404')
  })


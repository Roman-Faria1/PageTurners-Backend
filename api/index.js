const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {getUserById} = require("../db/users")

router.get('/health', async (req, res, next)=>{
    try {
        console.log("API is healthy.")
        res.send('healthy')
        
    } catch (error) {
        next(error)
    }
})

// //set req.user
router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  console.log(auth, "**")
  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    
    try {
        console.log(process.env.JWT_SECRET)
      const parsedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(parsedToken, "PARSED TOKEN!!!!")
      if(parsedToken.user){
        const id = parsedToken && parsedToken.user.id;
        req.user = await getUserById(id);
        next();
      } else {
        const id = parsedToken && parsedToken.id;
        req.user = await getUserById(id);
        next();
      }

    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

router.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});


// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

//ROUTER: /api/reviews
const reviewsRouter = require('./reviews');
router.use('/reviews', reviewsRouter);

//ROUTER: /api/nonfiction-books
const nfBooksRouter = require('./nfBooks');
router.use('/nonfiction-books', nfBooksRouter);

//ROUTER: /api/fiction-books
const fictionBooksRouter = require('./fictionBooks');
router.use('/fiction-books', fictionBooksRouter);

//ROUTER: /api/graphic-books
const graphicBooksRouter = require('./graphicBooks');
router.use('/graphic-books', graphicBooksRouter);

//ROUTER: /api/book-club-picks
const bookClubBooksRouter = require('./bookClubBooks');
router.use('/book-club-picks', bookClubBooksRouter);

//ROUTER: /api/childrens-books
const childrensBooksRouter = require('./childrensBooks');
router.use('/childrens-books', childrensBooksRouter);

//ROUTER: /api/allbooks
const allBooksRouter = require('./allbooks');
router.use('/allbooks', allBooksRouter);

//ROUTER: /api/comments
const commentsRouter = require('./comments');
router.use('/comments', commentsRouter);

module.exports = router;
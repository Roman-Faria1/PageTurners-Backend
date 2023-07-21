const express = require("express");
const reviewsRouter = express.Router();
const { createReview, getAllReviews, getReviewsById, updateReview, destroyReview, updateReviewFlags } = require("../db/reviews.js");

reviewsRouter.get("/:id", async (req, res, next) => {
    try {
      
      const singleReview = await getReviewsById(Number(req.params.id))
      res.send(singleReview)
    } catch (error) {
      next (error)
    }
    });

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const allReviews = await getAllReviews()
    res.send(allReviews);
  } catch (error) {
    next(error);
  }  
});  

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const {
      content,
      score,
      userId,
      nfBookISBN,
      fictionBookISBN,
      graphicBookISBN,
      bookClubBookISBN,
      childrensBookISBN,
      isInappropriate,
      isNotAccurate,
      comment,
    } = req.body;

    const newReview = await createReview(
      content,
      score,
      userId,
      nfBookISBN,
      fictionBookISBN,
      graphicBookISBN,
      bookClubBookISBN,
      childrensBookISBN,
      isInappropriate,
      isNotAccurate,
      comment
    );

    res.send(newReview);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    
    const deletedReview = await destroyReview(Number(req.params.id))
    res.send(deletedReview)
  } catch (error) {
    next (error)
  }
});

reviewsRouter.put("/:id", async (req, res) => {
  try {
    
    const reviewId = Number(req.params.id)
    const updatedData = req.body
    const NewlyUpdatedReview = await updateReview(reviewId, updatedData)
    res.send(NewlyUpdatedReview)
  } catch (error) {
    throw (error)
  }
});

// reviewsRouter.use("/:id", async (req, res)=> {
//   try {
//     const reviewId = Number(req.params.id)
//     const updatedData = req.body
//     const newComment = await patchReview(reviewId, updatedData)
//     res.send(newComment)
//   } catch (error) {
//     throw(error)
//   }
// })

//Report Review
reviewsRouter.put('/:id/report', async (req, res) => {
  const { id } = req.params;
  const { isInappropriate, isNotAccurate } = req.body;

  try {
    await updateReviewFlags(id, isInappropriate, isNotAccurate);

    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = reviewsRouter;
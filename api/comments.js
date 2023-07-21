const express = require("express");
const commentsRouter = express.Router();
const {createComments, getAllComments, getAllCommentsById, updateComments, destroyComments} = require("../db/comments.js");

commentsRouter.get("/:id", async (req, res, next) => {
    try {
      
      const singleComment = await getAllCommentsById(Number(req.params.id))
      res.send(singleComment)
    } catch (error) {
      next (error)
    }
    });

commentsRouter.get("/", async (req, res, next) => {
  try {
    const allComments = await getAllComments()
    res.send(allComments);
  } catch (error) {
    next(error);
  }  
});  

commentsRouter.post("/", async (req, res, next) => {
  try {
    const {
      userid,
      content,
      username,
      reviewid
    } = req.body;

    const newComment = await createComments(
      userid,
      content,
      username,
      reviewid
    );

    res.send(newComment);
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete("/:id", async (req, res, next) => {
  try {
    
    const deletedComment = await destroyComments(Number(req.params.id))
    res.send(deletedComment)
  } catch (error) {
    next (error)
  }
});

commentsRouter.put("/:id", async (req, res) => {
  try {
    
    const commentId = Number(req.params.id)
    const updatedData = req.body
    const NewlyUpdatedComment = await updateComments(commentId, updatedData)
    res.send(NewlyUpdatedComment)
  } catch (error) {
    throw (error)
  }
});

commentsRouter.patch("/:id", async (req, res)=> {
  try {
    const commentId = Number(req.params.id)
    const updatedData = req.body
    const newComment = await updateComments(commentId, updatedData)
    res.send(newComment)
  } catch (error) {
    throw(error)
  }
})

module.exports = commentsRouter;
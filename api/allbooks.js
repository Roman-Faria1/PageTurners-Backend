const express = require("express");
const allBooksRouter = express.Router();
const { createAllBooks, getAllBooks, getAllBooksByISBN, updateAllBooks, destroyBook } = require("../db/allBooks.js");

allBooksRouter.get("/:isbn", async (req, res, next) => {
    try {
      console.log(req.params.isbn)
      const singleAllBooks = await getAllBooksByISBN(Number(req.params.isbn))
      res.send(singleAllBooks)
    } catch (error) {
      next (error)
    }
    });

allBooksRouter.get("/", async (req, res, next) => {
  try {
    const allBooks = await getAllBooks()
    res.send(allBooks);
  } catch (error) {
    next(error);
  }  
});  


allBooksRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const newAllBooks = await createAllBooks(req.body);
    res.send(newAllBooks);
  } catch (error) {
    next(error);
  }
});

allBooksRouter.delete("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const deletedAllBooks = await destroyBook(Number(req.params.isbn))
    res.send(deletedAllBooks)
  } catch (error) {
    throw (error)
  }
});

allBooksRouter.put("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const bookISBN = Number(req.params.isbn)
    const updatedData = req.body
    const NewlyUpdateAllBooks = await updateAllBooks(bookISBN, updatedData)
    res.send(NewlyUpdateAllBooks)
  } catch (error) {
    throw (error)
  }
})

module.exports = allBooksRouter;
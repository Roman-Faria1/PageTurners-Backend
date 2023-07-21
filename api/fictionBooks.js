const express = require("express");
const fictionBooksRouter = express.Router();
const {createFictionBook, getAllFictionBooks, getAllFictionBooksByISBN, updateFictionBook, destroyFictionBook } = require("../db/fictionBooks.js");

fictionBooksRouter.get("/:isbn", async (req, res, next) => {
    try {
      console.log(req.params.isbn)
      const singleFictionBook = await getAllFictionBooksByISBN(Number(req.params.isbn))
      res.send(singleFictionBook)
    } catch (error) {
      next (error)
    }
    });

fictionBooksRouter.get("/", async (req, res, next) => {
  try {
    const allFictionBooks = await getAllFictionBooks()
    res.send(allFictionBooks);
  } catch (error) {
    next(error);
  }  
});  


fictionBooksRouter.post("/", async (req, res, next) => {
  try {
    const {isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription} = req.body
    
    const newFictionBook = await createFictionBook(isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription);

    if (newFictionBook) {
      res.send(newFictionBook);

    } else {res.send({message: "There was an error in adding this book."})}
  } catch (error) {
    next(error);
  }
});

fictionBooksRouter.delete("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const deletedFictionBook = await destroyFictionBook(Number(req.params.isbn))
    res.send(deletedFictionBook)
  } catch (error) {
    throw (error)
  }
});

fictionBooksRouter.put("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const bookISBN = Number(req.params.isbn)
    const updatedData = req.body
    const NewlyUpdatedFictionBook = await updateFictionBook(bookISBN, updatedData)
    res.send(NewlyUpdatedFictionBook)
  } catch (error) {
    throw (error)
  }
})

module.exports = fictionBooksRouter;
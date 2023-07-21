const express = require("express");
const bookClubBooksRouter = express.Router();
const { createBookClubPicksBook, getAllBookClubPicksBooks, getAllBookClubPicksBooksByISBN, updateBookClubPicksBook, destroyBookClubPicksBook } = require("../db/bookClubBooks.js");

bookClubBooksRouter.get("/:isbn", async (req, res, next) => {
    try {
      console.log(req.params.isbn)
      const singleBookClubPick = await getAllBookClubPicksBooksByISBN(Number(req.params.isbn))
      res.send(singleBookClubPick)
    } catch (error) {
      next (error)
    }
    });

bookClubBooksRouter.get("/", async (req, res, next) => {
  try {
    const allBookClubPicks = await getAllBookClubPicksBooks()
    res.send(allBookClubPicks);
  } catch (error) {
    next(error);
  }
});

bookClubBooksRouter.post("/", async (req, res, next) => {
  try {
    const {isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription} = req.body
    
    const newBookClubPick = await createBookClubPicksBook(isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription);
    
    if (newBookClubPick) {
      res.send(newBookClubPick);
    } else {res.send({message: "There was an error in adding this book."})}
  } catch (error) {
    next(error);
  }
});

bookClubBooksRouter.delete("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const deletedBookClubPick = await destroyBookClubPicksBook(Number(req.params.isbn))
    res.send(deletedBookClubPick)
  } catch (error) {
    throw (error)
  }
});

bookClubBooksRouter.put("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const bookISBN = Number(req.params.isbn)
    const updatedData = req.body
    const NewlyUpdatedBookClubPick = await updateBookClubPicksBook(bookISBN, updatedData)
    res.send(NewlyUpdatedBookClubPick)
  } catch (error) {
    throw (error)
  }
})

module.exports = bookClubBooksRouter;
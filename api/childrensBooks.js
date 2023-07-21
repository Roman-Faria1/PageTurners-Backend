const express = require("express");
const childrensBooksRouter = express.Router();
const { createChildrensBook, getAllChildrensBooks, getAllChildrensBooksByISBN, updateChildrensBook, destroyChildrensBook } = require("../db/childrensBooks.js");

childrensBooksRouter.get("/:isbn", async (req, res, next) => {
    try {
      console.log(req.params.isbn)
      const singleChildrensBook = await getAllChildrensBooksByISBN(Number(req.params.isbn))
      res.send(singleChildrensBook)
    } catch (error) {
      next (error)
    }
    });

childrensBooksRouter.get("/", async (req, res, next) => {
  try {
    const allChildrensBooks = await getAllChildrensBooks()
    res.send(allChildrensBooks);
  } catch (error) {
    next(error);
  }
});

childrensBooksRouter.post("/", async (req, res, next) => {
  try {
    const {isbn, title, author, illustrator, genre, summary, publisher, yearPublished, bookCover, audience, physicalDescription} = req.body

    const newChildrensBook = await createChildrensBook(isbn, title, author, illustrator, genre, summary, publisher, yearPublished, bookCover, audience, physicalDescription);

    if (newChildrensBook) {
      res.send(newChildrensBook);

    } else {res.send({message: "There was an error in adding this book."})}

  } catch (error) {
    next(error);
  }
});

childrensBooksRouter.delete("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const deletedChildrensBook = await destroyChildrensBook(Number(req.params.isbn))
    res.send(deletedChildrensBook)
  } catch (error) {
    throw (error)
  }
});

childrensBooksRouter.put("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const bookISBN = Number(req.params.isbn)
    const updatedData = req.body
    const NewlyUpdatedChildrensBook = await updateChildrensBook(bookISBN, updatedData)
    res.send(NewlyUpdatedChildrensBook)
  } catch (error) {
    throw (error)
  }
})

module.exports = childrensBooksRouter;
const client = require("./index");

async function createFictionBook (isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription) {
  try {
    const {rows: [bookFic]} = await client.query(
      `
    INSERT INTO "fictionBooks" (isbn, title, author, genre, summary, publisher, "yearPublished", "bookCover", "physicalDescription")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `,
      [isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription]
    );

    return bookFic;
  } catch (error) {
    throw error;
  }
}

async function getAllFictionBooks() {
  try {
    const {rows} = await client.query(
      `
      SELECT *
      FROM "fictionBooks";
       `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllFictionBooksByISBN(ISBN) {
  try {
    const {rows:[bookFic]} = await client.query (`
      SELECT * FROM "fictionBooks"
      WHERE "ISBN" = $1
    `, [ISBN]);
    return bookFic
  } catch (error) {
    throw error;
  }
}

async function updateFictionBook(isbn, fields = {}) {
  // build the set string 
  const fieldsKeys = Object.keys(fields)
  console.log(fieldsKeys, "fieldsKeys in update fiction books")
  
  const mapOfStrings = fieldsKeys.map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  )
  console.log (mapOfStrings, "map of string in update fiction books")
  
  const setString =  mapOfStrings.join(', ');
  console.log (setString, "set string on update fiction books")
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ bookFic ] } = await client.query(`
      UPDATE "fictionBooks"
      SET ${ setString }
      WHERE isbn=${ isbn }
      RETURNING *;
    `, Object.values(fields));

    return bookFic;
  } catch (error) {
    throw error;
  }
}

async function destroyFictionBook(ISBN) {
  try {
    const {rows: [bookFic]} = await client.query(`
        DELETE FROM "fictionBooks" 
        WHERE id = $1
        RETURNING *;
    `, [ISBN]);
    if (rows.length) {
    return bookFic;
  }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createFictionBook,
  getAllFictionBooks,
  getAllFictionBooksByISBN,
  updateFictionBook,
  destroyFictionBook
};
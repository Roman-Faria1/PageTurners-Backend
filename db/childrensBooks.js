const client = require("./index");

async function createChildrensBook (isbn, title, author, illustrator, genre, summary, publisher, yearPublished, bookCover, audience, physicalDescription) {
  try {
    const {rows: [bookJuv]} = await client.query(
      `
    INSERT INTO "childrensBooks" (isbn, title, author, illustrator, genre, summary, publisher, "yearPublished", "bookCover", audience, "physicalDescription")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
    `,
      [isbn, title, author, illustrator, genre, summary, publisher, yearPublished, bookCover, audience, physicalDescription]
    );

    return bookJuv;
  } catch (error) {
    throw error;
  }
}

async function getAllChildrensBooks() {
  try {
    const {rows} = await client.query(
      `
      SELECT *
      FROM "childrensBooks";
       `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllChildrensBooksByISBN(ISBN) {
  try {
    const {rows:[bookJuv]} = await client.query (`
      SELECT * FROM "childrensBooks"
      WHERE "ISBN" = $1
    `, [ISBN]);
    return bookJuv
  } catch (error) {
    throw error;
  }
}

async function updateChildrensBook(isbn, fields = {}) {
  // build the set string 
  const fieldsKeys = Object.keys(fields)
  console.log(fieldsKeys, "fieldsKeys in update childrens books")
  
  const mapOfStrings = fieldsKeys.map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  )
  console.log (mapOfStrings, "map of string in update childrens books")
  
  const setString =  mapOfStrings.join(', ');
  console.log (setString, "set string on update childrens books")
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ bookJuv ] } = await client.query(`
      UPDATE "childrensBooks"
      SET ${ setString }
      WHERE isbn=${ isbn }
      RETURNING *;
    `, Object.values(fields));

    return bookJuv;
  } catch (error) {
    throw error;
  }
}

async function destroyChildrensBook(ISBN) {
  try {
    const {rows: [bookJuv]} = await client.query(`
        DELETE FROM "childrensBooks" 
        WHERE id = $1
        RETURNING *;
    `, [ISBN]);
    return bookJuv;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createChildrensBook,
  getAllChildrensBooks,
  getAllChildrensBooksByISBN, 
  updateChildrensBook,
  destroyChildrensBook
};
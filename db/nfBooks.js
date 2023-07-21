const client = require("./index");

async function createNFBook (isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription) {
  try {
    const {rows: [bookNF]} = await client.query(
      `
    INSERT INTO "nfBooks" (isbn, title, author, genre, summary, publisher, "yearPublished", "bookCover", "physicalDescription")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `,
      [isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription]
    );

    return bookNF;
  } catch (error) {
    throw error;
  }
}

async function getAllNFBooks() {
  try {
    const {rows} = await client.query(
      `
      SELECT *
      FROM "nfBooks";
       `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllNFBooksByISBN(ISBN) {
  try {
    const {rows:[bookNF]} = await client.query (`
      SELECT * FROM "nfBooks"
      WHERE "ISBN" = $1
    `, [ISBN]);
    return bookNF
  } catch (error) {
    throw error;
  }
}

async function updateNFBook(isbn, fields = {}) {
  // build the set string 
  const fieldsKeys = Object.keys(fields)
  console.log(fieldsKeys, "fieldsKeys in update nonfiction books")
  
  const mapOfStrings = fieldsKeys.map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  )
  console.log (mapOfStrings, "map of string in update nonfiction books")
  
  const setString =  mapOfStrings.join(', ');
  console.log (setString, "set string on update nonfiction books")
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ bookNF ] } = await client.query(`
      UPDATE "nfBooks"
      SET ${ setString }
      WHERE isbn=${ isbn }
      RETURNING *;
    `, Object.values(fields));

    return bookNF;
  } catch (error) {
    throw error;
  }
}

async function destroyNFBook(ISBN) {
  try {
    const {rows: [bookNF]} = await client.query(`
        DELETE FROM "nfBooks" 
        WHERE id = $1
        RETURNING *;
    `, [ISBN]);
    return bookNF;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createNFBook,
  getAllNFBooks,
  getAllNFBooksByISBN,
  updateNFBook,
  destroyNFBook
};
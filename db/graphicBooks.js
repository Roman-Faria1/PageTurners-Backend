const client = require("./index");

async function createGraphicNovelBook (isbn, title, author, artist, genre, summary, publisher, yearPublished, bookCover, physicalDescription) {
  try {
    const {rows: [bookGN]} = await client.query(
      `
    INSERT INTO "graphicNovelsAndMangaBooks" (isbn, title, author, artist, genre, summary, publisher, "yearPublished", "bookCover", "physicalDescription")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
    `,
      [isbn, title, author, artist, genre, summary, publisher, yearPublished, bookCover, physicalDescription]
    );

    return bookGN;
  } catch (error) {
    throw error;
  }
}

async function getAllGraphicNovelBooks() {
  try {
    const {rows} = await client.query(
      `
      SELECT *
      FROM "graphicNovelsAndMangaBooks";
       `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllGraphicNovelBooksByISBN(ISBN) {
  try {
    const {rows:[bookGN]} = await client.query (`
      SELECT * FROM "graphicNovelsAndMangaBooks"
      WHERE "ISBN" = $1
    `, [ISBN]);
    return bookGN
  } catch (error) {
    throw error;
  }
}

async function updateGraphicNovelBook(isbn, fields = {}) {
  // build the set string 
  const fieldsKeys = Object.keys(fields)
  console.log(fieldsKeys, "fieldsKeys in update graphic books")
  
  const mapOfStrings = fieldsKeys.map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  )
  console.log (mapOfStrings, "map of string in update graphic books")
  
  const setString =  mapOfStrings.join(', ');
  console.log (setString, "set string on update graphic books")
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ bookGN ] } = await client.query(`
      UPDATE "graphicNovelsAndMangaBooks"
      SET ${ setString }
      WHERE isbn=${ isbn }
      RETURNING *;
    `, Object.values(fields));

    return bookGN;
  } catch (error) {
    throw error;
  }
}

async function destroyGraphicNovelBook(ISBN) {
  try {
    const {rows: [bookGN]} = await client.query(`
        DELETE FROM "graphicNovelsAndMangaBooks" 
        WHERE id = $1
        RETURNING *;
    `, [ISBN]);
    return bookGN;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createGraphicNovelBook,
  getAllGraphicNovelBooks,
  getAllGraphicNovelBooksByISBN,
  updateGraphicNovelBook,
  destroyGraphicNovelBook
};
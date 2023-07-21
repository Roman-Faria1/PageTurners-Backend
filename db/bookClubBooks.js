const client = require("./index");

async function createBookClubPicksBook (isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription) {
  try {
    const {rows: [bookClub]} = await client.query(
      `
    INSERT INTO "bookClubPicksBooks" (isbn, title, author, genre, summary, publisher, "yearPublished", "bookCover", "physicalDescription")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
    `,
      [isbn, title, author, genre, summary, publisher, yearPublished, bookCover, physicalDescription]
    );

    return bookClub
  } catch (error) {
    throw error;
  }
}

async function getAllBookClubPicksBooks() {
  try {
    const {rows} = await client.query(
      `
      SELECT *
      FROM "bookClubPicksBooks";
       `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}


async function getAllBookClubPicksBooksByISBN(ISBN) {
  try {
    const {rows:[bookClub]} = await client.query (`
      SELECT * FROM "bookClubPicksBooks"
      WHERE "ISBN" = $1
    `, [ISBN]);
    return bookClub
  } catch (error) {
    throw error;
  }
}

async function updateBookClubPicksBook(isbn, fields = {}) {
  // build the set string 
  const fieldsKeys = Object.keys(fields)
  console.log(fieldsKeys, "fieldsKeys in update picks")
  
  const mapOfStrings = fieldsKeys.map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  )
  console.log (mapOfStrings, "map of string in update picks")
  
  const setString =  mapOfStrings.join(', ');
  console.log (setString, "set string on update picks")
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ bookClub ] } = await client.query(`
      UPDATE "bookClubPicksBooks"
      SET ${ setString }
      WHERE isbn=${ isbn }
      RETURNING *;
    `, Object.values(fields));

    return bookClub;
  } catch (error) {
    throw error;
  }
}

async function destroyBookClubPicksBook(ISBN) {
  try {
    const {rows: [bookClub]} = await client.query(`
        DELETE FROM "bookClubPicksBooks"
        WHERE id = $1
        RETURNING *;
    `, [ISBN]);
    return bookClub;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createBookClubPicksBook,
  getAllBookClubPicksBooks,
  getAllBookClubPicksBooksByISBN,
  updateBookClubPicksBook,
  destroyBookClubPicksBook
};
const client = require("./index");

async function createAllBooks(
  ISBN,
  title,
  author,
  artist,
  illustrator,
  genre,
  summary,
  publisher,
  yearPublished,
  bookCover,
  audience,
  physicalDescription,
  booktype
) {
  try {
    const {
      rows: [allbook],
    } = await client.query(
      `
    INSERT INTO allbooks (isbn, title, author, artist, illustrator, genre, summary, publisher, "yearPublished", "bookCover", audience, "physicalDescription", booktype)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
    `,
      [
        ISBN,
        title,
        author,
        artist,
        illustrator,
        genre,
        summary,
        publisher,
        yearPublished,
        bookCover,
        audience,
        physicalDescription,
        booktype,
      ]
    );

    return allbook;
  } catch (error) {
    throw error;
  }
}

async function getAllBooks() {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM allbooks;
       `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllBooksByISBN(ISBN) {
  try {
    const {
      rows: [allbook],
    } = await client.query(
      `
      SELECT * FROM allbooks
      WHERE isbn = $1
    `,
      [ISBN]
    );
    return allbook;
  } catch (error) {
    throw error;
  }
}

async function updateAllBooks(id, fields = {}) {
  // build the set string
  const fieldsKeys = Object.keys(fields);
  console.log(fieldsKeys, "fieldsKeys in update all books");

  const mapOfStrings = fieldsKeys.map((key, index) => `"${key}"=$${index + 1}`);
  console.log(mapOfStrings, "map of string in update all books");

  const setString = mapOfStrings.join(", ");
  console.log(setString, "set string on update all books");
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [allbook],
    } = await client.query(
      `
      UPDATE allbooks
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return allbook;
  } catch (error) {
    throw error;
  }
}

async function destroyBook(ISBN) {
  try {
    const {
      rows: [allbook],
    } = await client.query(
      `
        DELETE FROM allbooks
        WHERE isbn = $1
        RETURNING *;
    `,
      [ISBN]
    );
    return allbook;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createAllBooks,
  getAllBooks,
  getAllBooksByISBN,
  updateAllBooks,
  destroyBook,
};

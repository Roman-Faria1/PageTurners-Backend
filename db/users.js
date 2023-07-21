const client = require("./index");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createUser(
  name,
  username,
  password,
  email,
  is_admin,
  avatar,
  location,
  website,
  favoriteBooks,
  aboutMe,
  myComments
) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  console.log("is hashPassword working?", hashedPassword);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users (name, username, password, email,"is_admin", avatar, location, website, "favoriteBooks", "aboutMe", my_comments)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
    `,
      [
        name,
        username,
        hashedPassword,
        email,
        is_admin,
        avatar,
        location,
        website,
        favoriteBooks,
        aboutMe,
        myComments,
      ]
    );
    console.log("is query working?", user);
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM users;
      `
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  // first get the user
  console.log(userName);
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username = $1;
    `,
      [userName]
    );

    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    // delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByEmail(email) {
  // first get the user
  console.log(email);
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM users
      WHERE email = $1;
    `,
      [email]
    );

    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUser(username, password) {
  if (!username || !password) {
    console.log("no username and/or password in first section of getUser");
    return;
  }

  try {
    const user = await getUserByUsername(username);
    console.log(user);
    if (!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordsMatch) return;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  // first get the user
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE id = $1;
    `,
      [userId]
    );
    // if it doesn't exist, return null
    if (!user) return null;
    // if it does:
    // delete the 'password' key from the returned object
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  if (fields.password){
    const hashedPassword = await bcrypt.hash(fields.password, SALT_COUNT);
    fields.password = hashedPassword
  }
  const fieldsKeys = Object.keys(fields);

  const mapOfStrings = fieldsKeys.map((key, index) => `"${key}"=$${index + 1}`);
  console.log(mapOfStrings, "map of string in update user");

  const setString = mapOfStrings.join(", ");
  console.log(setString, "set string on update user");
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function destroyUser(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING *;
    `,
      [id]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  getUserById,
  getUserByUsername,
  updateUser,
  destroyUser,
  getUserByEmail,
};

const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  getAllUsers,
  getUserByUsername,
  getUserById,
  updateUser,
  destroyUser,
  getUser,
  getUserByEmail,
} = require("../db/users");

const jwt = require("jsonwebtoken");

usersRouter.get("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const response = await getUserById(userId);
    res.send(response);
  } catch (error) {
    throw error;
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({ users });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body.user;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser(username, password);

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "you're logged in!",
        token,
        id: user.id,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  const {
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
    myComments,
  } = req.body;

  try {
    const _user = await getUserByUsername(req.body.user.username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }
    const userObj = req.body.user;

    const user = await createUser(
      userObj.name,
      userObj.username,
      userObj.password,
      userObj.email,
      userObj.is_admin
    );

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "thank you for signing up",
      token,
      id: user.id,
    });
  } catch (error) {
    console.log(error);
  }
});

usersRouter.put("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const updatedData = req.body;
    const NewlyUpdatedUser = await updateUser(userId, updatedData);
    res.send(NewlyUpdatedUser);
  } catch (error) {
    throw error;
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await destroyUser(Number(req.params.id));
    res.send(deletedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;

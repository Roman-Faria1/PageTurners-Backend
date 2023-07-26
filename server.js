require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

// const BASE_URL = "http://localhost:5173";
// const BASE_URL = "https://pageturnersreviews.netlify.app";
const BASE_URL = "https://pageturners-book-reviews.netlify.app/";

const passport = require("passport");
require("./passportConfig")(passport);

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

const client = require("./db/index");
client.connect();

app.use(cookieParser());

app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.use(express.json());

app.use("/api", require("./api"));

app.get("/failed", (req, res) => {
  res.send("Failed");
});

// Redirect the user to the Google signin page
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
// Retrieve user data using the access token received
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  (req, res) => {
    console.log(req.user, "console log for req.user");
    jwt.sign(
      { user: req.user },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          });
        } else {
          res.cookie("id", req.user.id, { httpOnly: false });
          res.cookie("username", req.user.username, { httpOnly: false });
          //Token set in cookie
          res.cookie("token", token, { httpOnly: false });
          res.redirect(302, `${BASE_URL}/browse`);
        }
      }
    );
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect(`${BASE_URL}`);
});

app.listen(PORT, () => {
  console.log(`The server is up and running on port: ${PORT}`);
});

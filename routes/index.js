const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const EmailTemplate = require("email-templates-v2").EmailTemplate;

require("dotenv").config();

const Product = require("../models/product");
const Deal = require("../models/deals");
const User = require("../models/user");
const Cart = require("../models/cart");
const Token = require("../models/token");

mongoose.connect(`${process.env.DB_DEV}`);
const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("Database connection succeeded Index");
});

/* GET home page. */

router.get("/", function (req, res, next) {
  db.collection("products")
    .find({ category: "electronics" })
    .toArray(function (err, productElectronics) {
      if (err) {
        res.json(err);
      } else {
        db.collection("products")
          .find({ category: "clothing" })
          .toArray(function (err, productClothing) {
            if (err) {
              res.json(err);
            } else {
              db.collection("deals")
                .find()
                .toArray(function (err, dealChunk) {
                  if (err) {
                    res.json(err);
                  } else {
                    res.render("index", {
                      title: "E-Commerce",
                      email: req.cookies.email,
                      deal: dealChunk,
                      clothes: productClothing,
                      electronics: productElectronics,
                      namee: req.cookies.cc,
                      quant: req.cookies.quant,
                    });
                    // console.log(dealChunk);
                  }
                });
            }
          });
      }
    });
});

//Search
router.post("/search", function (req, res) {
  let category = req.body.search;
  let collect = req.body.searchOptions;
  console.log(collect);
  console.log(category);
  stringCollect = String(collect);
  db.collection(stringCollect)
    .find({ title: {$regex: new RegExp("^" + category, "i")} })
    .toArray(function (err, searchResult) {
      if (err) {
        console.log(err);
      } else {
        console.log(searchResult);
        res.cookie("search", searchResult);
        res.render("grid-page", {
          title: "Results",
          searchResult: searchResult,
          stringCollect: stringCollect,
        });
      }
    });
});

router.post("/register", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const city = req.body.city;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const country = req.body.country;
  const gender = req.body.gender;
  const terms = req.body.terms;

  if (
    !firstName ||
    !lastName ||
    !password ||
    !confirmPassword ||
    !email ||
    !country ||
    !gender
  ) {
    res.render("./register", { message: "Please fill all fields" });
  }
  if (!terms) {
    res.render("./register", {
      message: "Please accept the terms to continue",
    });
  }
  if (password !== confirmPassword) {
    res.render("./register", { message: "Passwords dont match" });
  }
  if (password.length < 6) {
    res.render("./register", {
      message: "Password length should be more than 6",
    });
  } else {
    //validation passed
    User.findOne({ email: { $regex: email } }).then((user) => {
      if (user) {
        res.render("./register", {
          message: "Email already exists",
        });
      } else {
        bcrypt.hash(password, null, null, function (err, hash) {
          // Store hash in your password DB
          let hashedPass = hash;
          let user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            hashedPass: hashedPass,
            city: city,
            country: country,
            gender: gender,
            terms: terms,
          });

          // Create a verification token for this user
          let token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString("hex"),
          });

          // Save the verification token
          token.save(function (err) {
            if (err) {
              return res.status(500).send({ msg: err.message });
            }

            // Send the email
            const sengridu = process.env.SENDGRID_USERNAME;
            const sengridp = process.env.SENDGRID_PASSWORD;
            const transporter = nodemailer.createTransport({
              service: "Sendgrid",
              auth: {
                user: sengridu,
                pass: sengridp,
              },
            });

            const send = transporter.templateSender(
              new EmailTemplate("../emails/confirmation"),
              {
                from: "no-reply@yourwebapplication.com",
              }
            );

            // use template based sender to send a message
            send(
              {
                to: user.email,
                // EmailTemplate renders html and text but no subject so we need to
                // set it manually either here or in the defaults section of templateSender()
                subject: "Account verification token",
              },
              {
                name: user.firstName,
                text:
                  "Hello,\n\n" +
                  "Please verify your account by clicking the link: \nhttp://" +
                  req.headers.host +
                  "/confirmation/" +
                  token.token +
                  ".\n",
              },
              function (err, info) {
                if (err) {
                  console.log("Error");
                } else {
                  console.log("Token sent");
                }
              }
            );
          });

          user.save((err) => {
            if (err) throw err;
            console.log("New user registered Successfully");
          });
        });
      }
    });
  }
});

router.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.isVerified) {
        // Load hash from your password DB.
        res.cookie("cc", user.firstName, { maxAge: 180 * 60 * 1000 });
        bcrypt.compare(password, user.hashedPass, function (err, isMatch) {
          // res == true
          if (!isMatch) {
            res.render("./login", { message: "Password is incorrect" });
            console.log("incorrect password");
          }
          if (isMatch) {
            jwt.sign(
              { email: email },
              "secretkey",
              { expiresIn: "3h" },
              (err, token) => {
                res.cookie("token", token, { maxAge: 180 * 60 * 1000 });
                res.cookie("email", email, { maxAge: 180 * 60 * 1000 });
                //res.send({message:'Logged in successfully', success:'message'});
                //res.render(res.redirect('/'),{token: generateToken(user),message:'Logged in successfully', success:'message', email: req.cookies.email, quant: req.cookies.quant});
                res.redirect("/");
                console.log("logged in successfully", token + email);
              }
            );
          }
        });
      } else {
        console.log("user is not verified");
        res.render("./login", { message: "You need to be verified. Check your email" });
      }
    } else {
      console.log("user does not exist");
      res.render("./login", { message: "Hmm... we cannot find that user" });
    }
  });
});

router.get("/confirmation/:token", (req, res, next) => {
  res.render("confirmation", {
    title: "E-Commerce || Confirm",
    token: req.params.token,
  });
  console.log(req.params.token);
});

router.post("/confirmation", (req, res, next) => {
  const email = req.body.email;
  const token = req.body.token;

  console.log(token);

  if (!email) {
    res.send({ message: "User doesn't exist" });
  }
  if (!token) {
    res.send({ message: "Token doesn't exist or may have expired" });
  } else {
    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
      if (!token)
        return res.status(400).send({
          msg:
            "We were unable to find a valid token. Your token may have expired.",
        });

      // If we found a token, find a matching user
      User.findOne({ _id: token._userId, email: req.body.email }, function (
        err,
        user
      ) {
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this token." });
        if (user.isVerified)
          return res
            .status(400)
            .send({ msg: "This user has already been verified." });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The account has been verified. Please log in.");
        });
      });
    });
  }
});

router.post("/resend", () => {});

router.get("/logout", (req, res) => {
  //req.logout();
  res.clearCookie("token");
  res.clearCookie("email");
  res.render("index", {
    message: "You are now logged out",
    success: "message",
  });
});

module.exports = router;

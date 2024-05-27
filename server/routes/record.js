const express = require("express");
const passport = require("passport");
const bcrypt = require('bcrypt');
const dbo = require("../db/conn");

const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
recordRoutes.route("/products").get(function (req, res) {
  const limit = parseInt(req.query.limit) || 20; // Default limit to 20 if not specified
  const offset = parseInt(req.query.offset) || 0; // Default offset to 0 if not specified

  let db_connect = dbo.getDb("VintageRoom");
  db_connect
    .collection("Products")
    .find({})
    .skip(offset) // Skip the specified number of entities
    .limit(limit) // Limit the result to the specified number of entities
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
recordRoutes.route("/products/:id").get(function (req, res) {
  let db_connect = dbo.getDb("VintageRoom");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("Products").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

/**
 * @swagger
 * /filter:
 *   get:
 *     summary: Filter products by category and size
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: The category to filter by
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         required: false
 *         description: The size to filter by
 *     responses:
 *       200:
 *         description: A list of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
recordRoutes.route("/filter").get(function (req, res) {
  const category = req.query.category;
  let sizeQuery = { category: category };
  const size = req.query.size;
  if (size !== "all") {
    sizeQuery.size = size;
  }
  let db_connect = dbo.getDb("VintageRoom");
  db_connect
    .collection("Products")
    .find(sizeQuery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signup response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
recordRoutes.route("/signup").post(function (req, res, next) {
  let db_connect = dbo.getDb("VintageRoom");
  db_connect.collection("Users").findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.error("Error while finding user:", err);
      return next(err);
    }
    if (user) {
      return res.status(400).send({success: false, message: "That email is already taken." });
    } else {
      passport.authenticate("local-signup", function (err, user, info) {
        if (err) {
          console.error("Passport.authenticate error:", err);
          return next(err);
        }
        if (!user) {
          return res.send({ success: false, message: "Authentication failed." });
        }
        req.logIn(user, function (err) {
          if (err) {
            console.error("req.logIn error:", err);
            return next(err);
          }
          return res.send({
            success: true,
            message: "Authentication succeeded.",
          });
        });
      })(req, res, next);
    }
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
recordRoutes.route("/login").post(function (req, res, next) {
  passport.authenticate("local-login", function (err, user, info) {
    if (err) {
      console.error("Passport.authenticate error:", err);
      return next(err);
    }
    if (!user) {
      return res.send({ success: false, message: "There was a problem logging in. Check your email and password or create an account." });
    }
    req.logIn(user, function (err) {
      if (err) {
        console.error("req.logIn error:", err);
        return next(err);
      }
      return res.send({
        success: true,
        message: "Successful login! Redirecting to home page...",
      });
    });
  })(req, res, next);
});

/**
 * @swagger
 * /password:
 *   put:
 *     summary: Update a user's password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password update response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
recordRoutes.route('/password').put(async function(req, res) {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    const db_connect = dbo.getDb("VintageRoom");
    const result = await db_connect.collection("Users").updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    if (result.modifiedCount === 0) {
      return res.send({ success: false, message: "Unable to update password" });
    }
    return res.send({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a user
 *     responses:
 *       200:
 *         description: Logout response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
recordRoutes.route("/logout").post(function (req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/record');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({success: false, message:'You need to log in to access this page'})
}

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user information
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

recordRoutes.route('/user').get(isLoggedIn, function (req, res) {
  res.send(req.user);
});

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's shopping cart
 *     responses:
 *       200:
 *         description: User's shopping cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

recordRoutes.route('/cart').get(isLoggedIn, async function(req, res) {
  try {
    const cart = req.session.cart || {};
    const itemIds = Object.keys(cart);

    const db_connect = dbo.getDb("VintageRoom");
    const cartItems = await db_connect.collection("Products").find(
      { id: { $in: itemIds } },
      { projection: { id : 1, productName: 1, imgUrl: 1, size : 1, price : 1} }
    ).toArray();

    const totalAmount = cartItems.reduce((acc, product) => acc + product.price, 0);
    const totalQuantity = itemIds.length;

    res.json({ cartItems, totalAmount, totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

/**
 * @swagger
 * /cart/{id}:
 *   post:
 *     summary: Add a product to the shopping cart
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to add to cart
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product added to cart
 */

recordRoutes.route("/cart/:id").post(isLoggedIn, function (req, res) {
  const itemId = req.params.id;
  const cart = req.session.cart || {};

  if (cart[itemId]) {
    return res.status(400).json({ success: false, message: 'Item is already in cart' });
  }

  cart[itemId] = true;

  req.session.cart = cart;

  res.json({ success: true, message: 'Product added to cart' });
});

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Checkout the items in the shopping cart
 *     responses:
 *       200:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order placed successfully
 */

recordRoutes.route('/checkout').post(isLoggedIn, async function(req, res) {
  const userId = req.user._id;
  const cart = req.session.cart;

  if (!cart) {
    return res.json({ success: false, message: 'No items in cart' });
  }

  const cartItems = Object.keys(cart);

  try {
    const db_connect = dbo.getDb("VintageRoom");
    const ordersCollection = db_connect.collection('Orders');

    const productIds = Object.keys(cart);
    const products = await db_connect.collection("Products").find(
      { id: { $in: productIds } },
      { projection: { price: 1 } }
    ).toArray();

    const amount = products.reduce((acc, product) => acc + product.price, 0);
    const orderItems = productIds.map(itemId => ({ _id: itemId }));
    
    const order = {
      user_id: userId,
      items: orderItems,
      date: new Date(),
      totalAmount: amount,
      totalQuantity: cartItems.length
    };
    const orderResult = await ordersCollection.insertOne(order);
    console.log(orderResult.insertedCount + ' order added to orders collection');

    delete req.session.cart;

    res.json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    console.error('Error placing order:', err);
    res.json({ success: false, message: 'Error placing order' });
  }
});

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove a product from the shopping cart
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to remove from cart
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product removed from cart
 */

recordRoutes.route("/cart/:id").delete(isLoggedIn, canDeleteItems, function(req, res) {
  const itemId = req.params.id;
  const cart = req.session.cart || {};

  if (!cart[itemId]) {
    return res.status(400).json({ message: 'Item not found in cart' });
  }

  delete cart[itemId];

  req.session.cart = cart;

  res.json({ success: true, message: 'Product removed from cart' });
});

function canDeleteItems(req, res, next) {
  const userRole = req.user.role; 

  if (userRole === 'restricted') {
    return res.status(403).json({ success: false, message: "You are not authorized to delete items from the cart" });
  }
  next();
}

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get orders summary for the current user
 *     responses:
 *       200:
 *         description: Orders summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAmount:
 *                   type: number
 *                   example: 100.5
 *                 totalQuantity:
 *                   type: integer
 *                   example: 5
 */

recordRoutes.route('/order').get(isLoggedIn, async function(req, res) {
  try {
    const userId = req.user._id;

    const db_connect = dbo.getDb("VintageRoom");
    const ordersCollection = db_connect.collection('Orders');

    const orders = await ordersCollection.find({ user_id: userId }).toArray();

    const totalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalQuantity = orders.reduce((acc, order) => acc + order.totalQuantity, 0);

    res.json({ totalAmount, totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders summary" });
  }
});

module.exports = recordRoutes;

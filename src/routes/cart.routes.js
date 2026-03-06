const express = require('express')
const router = express.Router()

const cartController = require('../modules/cart/cart.controller')
const verifyToken = require('../common/middleware/auth.middleware')

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart APIs
 */


/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', verifyToken, cartController.getCart)



/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', verifyToken, cartController.addToCart)



/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', verifyToken, cartController.updateQuantity)



/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', verifyToken, cartController.removeItem)

module.exports = router
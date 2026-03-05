const express = require('express')
const router = express.Router()

const productController = require('../modules/product/product.controller')
const { verifyToken, authorizeRoles } = require('../common/middleware/auth.middleware')

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs + endpoints for customers to browse products
 */


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search product by name
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, created_at, name]
 *         description: Sort field
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *
 *     responses:
 *       200:
 *         description: Product list retrieved successfully
 */
router.get('/', productController.getProducts)



/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product detail
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProductDetail)



/**
 * @swagger
 * /api/products/shop/{shopId}:
 *   get:
 *     summary: Get products by shop
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Products of shop
 */
router.get('/shop/:shopId', productController.getProductsByShop)



/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product (Shop only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  verifyToken,
  authorizeRoles('SHOP'),
  productController.createProduct
)



/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (Shop only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('SHOP'),
  productController.updateProduct
)



/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Shop only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('SHOP'),
  productController.deleteProduct
)

module.exports = router
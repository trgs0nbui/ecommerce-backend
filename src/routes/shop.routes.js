const express = require('express')
const router = express.Router()

const shopController = require('../modules/shop/shop.controller')
const { verifyToken, authorizeRoles } = require('../common/middleware/auth.middleware')

router.post(
  '/',
  verifyToken,
  authorizeRoles('SHOP'),
  shopController.createShop
)

router.get(
  '/me',
  verifyToken,
  authorizeRoles('SHOP'),
  shopController.getMyShop
)

router.put(
  '/me',
  verifyToken,
  authorizeRoles('SHOP'),
  shopController.updateMyShop
)

module.exports = router
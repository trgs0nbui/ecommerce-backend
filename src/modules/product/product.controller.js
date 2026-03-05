const productService = require('./product.service')
const {
  createProductSchema,
  updateProductSchema
} = require('./product.validation')

exports.createProduct = async (req, res) => {
  try {

    const { error } = createProductSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    const result = await productService.createProduct(
      req.user.id,
      req.body
    )

    res.status(201).json(result)

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.getProducts = async (req, res) => {

    try {

        const result = await productService.getProducts(req.query)

        res.json(result)

    } catch (err) {

        res.status(500).json({
            message: err.message
        })

    }

}

exports.getProductDetail = async (req, res) => {

    try {

        const product = await productService.getProductDetail(req.params.id)

        res.json(product)

    } catch (err) {

        res.status(404).json({
            message: err.message
        })

    }
}
exports.getProductsByShop = async (req, res) => {

  const products = await productService.getProductsByShop(
    req.params.shopId
  )

  res.json(products)
}

exports.updateProduct = async (req, res) => {

  const { error } = updateProductSchema.validate(req.body)

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  const result = await productService.updateProduct(
    req.params.id,
    req.user.id,
    req.body
  )

  res.json(result)
}

exports.deleteProduct = async (req, res) => {

  const result = await productService.deleteProduct(
    req.params.id,
    req.user.id
  )

  res.json(result)
}
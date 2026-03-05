const slugify = require('slugify')
const productRepository = require('./product.repository')
const shopRepository = require('../shop/shop.repository')

class ProductService {

  async createProduct(userId, data) {

    const shop = await shopRepository.findByUserId(userId)

    if (!shop) {
      throw new Error('Shop not found')
    }

    const slug = slugify(data.name, { lower: true })

    const productId = await productRepository.createProduct({
      shop_id: shop.id,
      name: data.name,
      slug,
      price: data.price,
      stock: data.stock,
      description: data.description
    })

    if (data.images && data.images.length > 0) {
      await productRepository.addProductImages(productId, data.images)
    }

    return {
      productId
    }
  }

  async getProducts(query) {

        return await productRepository.getProducts(query)

    }

    async getProductDetail(id) {

        const product = await productRepository.findById(id)

        if (!product) {
            throw new Error('Product not found')
        }

        const images = await productRepository.getImages(id)

        return {
            ...product,
            images
        }
    }

  async getProductsByShop(shopId) {

    return await productRepository.getProductsByShop(shopId)
  }

  async updateProduct(id, userId, data) {

    const product = await productRepository.findById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    const shop = await shopRepository.findByUserId(userId)

    if (product.shop_id !== shop.id) {
      throw new Error('Permission denied')
    }

    await productRepository.updateProduct(id, data)

    return { message: 'Product updated' }
  }

  async deleteProduct(id, userId) {

    const product = await productRepository.findById(id)

    const shop = await shopRepository.findByUserId(userId)

    if (product.shop_id !== shop.id) {
      throw new Error('Permission denied')
    }

    await productRepository.deleteProduct(id)

    return { message: 'Product deleted' }
  }
}

module.exports = new ProductService()
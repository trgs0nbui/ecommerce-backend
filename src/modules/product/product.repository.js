const pool = require('../../database/connection')

class ProductRepository {

  async createProduct(data) {
    const { shop_id, name, slug, price, stock, description } = data

    const [result] = await pool.query(
      `INSERT INTO products (shop_id, name, slug, price, stock, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [shop_id, name, slug, price, stock, description]
    )

    return result.insertId
  }

  async addProductImages(product_id, images) {

    const values = images.map(url => [product_id, url])

    await pool.query(
      `INSERT INTO product_images (product_id, image_url)
       VALUES ?`,
      [values]
    )
  }

    async getProducts({
        page = 1,
        limit = 10,
        search,
        sort = 'created_at',
        order = 'DESC',
        minPrice,
        maxPrice
    }) {

        const offset = (page - 1) * limit

        let query = `
            SELECT p.*, s.shop_name
            FROM products p
            JOIN shops s ON p.shop_id = s.id
            WHERE 1=1
        `

        const params = []

        if (search) {
            query += ` AND p.name LIKE ?`
            params.push(`%${search}%`)
        }

        if (minPrice) {
            query += ` AND p.price >= ?`
            params.push(minPrice)
        }

        if (maxPrice) {
            query += ` AND p.price <= ?`
            params.push(maxPrice)
        }

        query += ` ORDER BY p.${sort} ${order}`
        query += ` LIMIT ? OFFSET ?`

        params.push(parseInt(limit), parseInt(offset))

        const [rows] = await pool.query(query, params)

        const [[{ total }]] = await pool.query(`
            SELECT COUNT(*) as total
            FROM products
        `)

        return {
            data: rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total
            }
        }
    }

    async findById(id) {

        const [rows] = await pool.query(
            `SELECT * FROM products WHERE id = ?`,
            [id]
        )

        return rows[0]
    }

    async getImages(productId) {

        const [rows] = await pool.query(
            `SELECT image_url FROM product_images WHERE product_id = ?`,
            [productId]
        )

        return rows
    }

  async getProductsByShop(shopId) {

    const [rows] = await pool.query(
      `SELECT * FROM products WHERE shop_id = ?`,
      [shopId]
    )

    return rows
  }

  async updateProduct(id, data) {

    const { name, price, stock, description } = data

    await pool.query(
      `UPDATE products
       SET name=?, price=?, stock=?, description=?
       WHERE id=?`,
      [name, price, stock, description, id]
    )
  }

  async deleteProduct(id) {

    await pool.query(
      `DELETE FROM products WHERE id = ?`,
      [id]
    )
  }
}

module.exports = new ProductRepository()
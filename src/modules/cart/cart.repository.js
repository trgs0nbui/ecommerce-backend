const pool = require('../../database/connection')

class CartRepository {

async getCartByUserId(userId) {

    const [rows] = await pool.query(
        `SELECT * FROM carts WHERE user_id = ?`,
        [userId]
    )

    return rows[0]
}

async createCart(userId) {

    const [result] = await pool.query(
        `INSERT INTO carts (user_id) VALUES (?)`,
        [userId]
    )

    return result.insertId
}

async findCartItem(cartId, productId) {

    const [rows] = await pool.query(
        `SELECT * FROM cart_items 
         WHERE cart_id = ? AND product_id = ?`,
        [cartId, productId]
    )

    return rows[0]
}

async addCartItem(connection, cartId, productId, quantity) {

    await connection.query(
        `INSERT INTO cart_items(cart_id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [cartId, productId, quantity]
    )
}

async updateCartItem(connection, id, quantity) {

    await connection.query(
        `UPDATE cart_items
         SET quantity = ?
         WHERE id = ?`,
        [quantity, id]
    )
}

async removeCartItem(cartItemId) {

    await pool.query(
        `DELETE FROM cart_items WHERE id = ?`,
        [cartItemId]
    )
}

async getCartItems(cartId) {

    const [rows] = await pool.query(

        `SELECT 
            ci.id,
            ci.quantity,
            p.id as product_id,
            p.name,
            p.price,
            p.stock,
            pi.image_url

        FROM cart_items ci

        JOIN products p 
        ON ci.product_id = p.id

        LEFT JOIN product_images pi 
        ON p.id = pi.product_id

        WHERE ci.cart_id = ?
        GROUP BY ci.id`,
        
        [cartId]
    )

    return rows
}

}

module.exports = new CartRepository()
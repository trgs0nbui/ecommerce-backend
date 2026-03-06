const pool = require('../../database/connection')
const cartRepository = require('./cart.repository')

class CartService {

async addToCart(userId, productId, quantity) {

    const connection = await pool.getConnection()

    try {

        await connection.beginTransaction()

        let cart = await cartRepository.getCartByUserId(userId)

        if (!cart) {

            const cartId = await cartRepository.createCart(userId)

            cart = { id: cartId }
        }

        const existingItem =
            await cartRepository.findCartItem(cart.id, productId)

        if (existingItem) {

            const newQty = existingItem.quantity + quantity

            await cartRepository.updateCartItem(
                connection,
                existingItem.id,
                newQty
            )

        } else {

            await cartRepository.addCartItem(
                connection,
                cart.id,
                productId,
                quantity
            )
        }

        await connection.commit()

        return { message: "Added to cart" }

    } catch (err) {

        await connection.rollback()
        throw err

    } finally {

        connection.release()

    }
}

async updateQuantity(cartItemId, quantity) {

    if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0')
    }

    const connection = await pool.getConnection()

    try {

        await connection.beginTransaction()

        await cartRepository.updateCartItem(
            connection,
            cartItemId,
            quantity
        )

        await connection.commit()

        return { message: "Cart updated" }

    } catch (err) {

        await connection.rollback()
        throw err

    } finally {

        connection.release()

    }
}

async removeItem(cartItemId) {

    await cartRepository.removeCartItem(cartItemId)

    return { message: "Item removed" }
}

async getCart(userId) {

    const cart = await cartRepository.getCartByUserId(userId)

    if (!cart) {
        return { items: [] }
    }

    const items = await cartRepository.getCartItems(cart.id)

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    return {
        items,
        total
    }
}

}

module.exports = new CartService()
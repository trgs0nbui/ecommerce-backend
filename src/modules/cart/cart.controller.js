const cartService = require('./cart.service')

exports.addToCart = async (req, res) => {

try {

    const userId = req.user.id
    const { productId, quantity } = req.body

    const result =
        await cartService.addToCart(userId, productId, quantity)

    res.status(201).json(result)

} catch (err) {

    res.status(400).json({
        message: err.message
    })

}

}

exports.updateQuantity = async (req, res) => {

try {

    const result =
        await cartService.updateQuantity(
            req.params.id,
            req.body.quantity
        )

    res.json(result)

} catch (err) {

    res.status(400).json({
        message: err.message
    })

}

}

exports.removeItem = async (req, res) => {

try {

    const result =
        await cartService.removeItem(req.params.id)

    res.json(result)

} catch (err) {

    res.status(400).json({
        message: err.message
    })

}

}

exports.getCart = async (req, res) => {

try {

    const cart =
        await cartService.getCart(req.user.id)

    res.json(cart)

} catch (err) {

    res.status(500).json({
        message: err.message
    })

}

}
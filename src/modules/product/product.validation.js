const Joi = require('joi')

exports.createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  description: Joi.string().allow(''),
  images: Joi.array().items(Joi.string().uri())
})

exports.updateProductSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  stock: Joi.number(),
  description: Joi.string().allow('')
})
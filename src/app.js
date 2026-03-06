const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const shopRoutes = require("./routes/shop.routes");
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');

const setupSwagger = require("./config/swagger");

const app = express();
// Swagger setup
setupSwagger(app);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

module.exports = app;

const { Router } = require("express");

//MongoDB
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  deleteProductById,
} = require("../controller/MongoDB/productosController");

//Firebase
const {
  getAllProductsF,
  getProductByIdF,
  addProductF,
  updateProductByIdF,
  deleteProductByIdF,
} = require("../controller/firebase/productosController");

const productosRouter = Router();

//Modo prueba: cambiar las funciones si se desea utilizar MongoDB o firebase
productosRouter.get(`/`, getAllProductsF);
productosRouter.get(`/:id`, getProductByIdF);
productosRouter.post(`/`, addProductF);
productosRouter.put(`/:id`, updateProductByIdF);
productosRouter.delete(`/:id`, deleteProductByIdF);

module.exports = productosRouter;
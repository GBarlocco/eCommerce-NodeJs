const { Router } = require("express");

//Mongo
const {
  getAllProductsByIdCart,
  createCart,
  addProduct,
  deleteCartById,
  deleteProductById
} = require("../controller/MongoDB/carritoController");

//Firebase
const {
  getAllProductsByIdCartF,
  createCartF,
  addProductF,
  deleteCartByIdF,
  deleteProductByIdF
} = require("../controller/firebase/carritoController");

const carritoRouter = Router();

//Modo prueba: cambiar las funciones si se desea utilizar MongoDB o firebase

carritoRouter.get(`/:id/productos`, getAllProductsByIdCart);
carritoRouter.post(`/`, createCartF);
carritoRouter.post(`/:idCar/:idProd`, addProductF);
carritoRouter.delete(`/:id`, deleteCartByIdF);
carritoRouter.delete(`/:id/productos/:id_prod`, deleteProductById);

module.exports = carritoRouter;




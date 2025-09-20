import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controller/product.controller.js';

const productRouter = express.Router();

productRouter.get('/getproduct', getAllProducts);
productRouter.get('/product/:id', getProductById);
productRouter.post('/createproduct', createProduct);
productRouter.put('/updateproduct/:id', updateProduct);
productRouter.delete('/deleteproduct/:id', deleteProduct);

export default productRouter;

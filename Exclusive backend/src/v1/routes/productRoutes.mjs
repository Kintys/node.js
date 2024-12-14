import express from 'express'
import ProductController from '../controllers/productController.mjs'
import FilterService from '../controllers/filtersController.mjs'

import upload from '../../../middleware/UploadManager.mjs'

const router = express.Router()

router.get('/filters-data', FilterService.getFiltersData)
router.get('/:id', ProductController.getById)
router.get('/', ProductController.getAllProducts)
router.get('/register/:id?', ProductController.registerForm)
router.post(
  '/register/:id?',
  upload.single('image'),
  ProductController.registerProduct
)
router.put('/:id', upload.single('image'), ProductController.registerProduct)
router.delete('/', ProductController.deleteProduct)

export default router

import express from 'express'
import { addFood, listfood, removeFood } from '../controllers/foodController.js'
import { bulkUpload } from '../controllers/bulkUploadController.js'
import multer from 'multer'

const foodRouter = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads') // Store in uploads folder (ensure it exists or root)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({ storage: storage })

foodRouter.post('/add', addFood)
foodRouter.get("/list", listfood)
foodRouter.post("/remove", removeFood)
foodRouter.post("/bulk-upload", upload.single("file"), bulkUpload)

export default foodRouter;
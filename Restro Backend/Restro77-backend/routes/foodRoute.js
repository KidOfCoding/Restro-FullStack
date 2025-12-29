import express from 'express'
import { addFood, listfood, removeFood } from '../controllers/foodController.js'

const foodRouter = express.Router();




foodRouter.post('/add', addFood)
foodRouter.get("/list", listfood)
foodRouter.post("/remove", removeFood)




export default foodRouter;
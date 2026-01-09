import foodModel from "../models/foodModel.js";

// add food items 
const addFood = async (req, res) => {
  try {
    const food = new foodModel({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      type: req.body.type,
      variants: req.body.variants || [] // Add variants support
    })

    await food.save();

    // Emit socket event
    const io = req.app.get('socketio');
    if (io) io.emit("foodListUpdated");

    res.json({ success: true, message: "Food Added" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// List of All Food
const listfood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// Remove food items
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    await foodModel.findByIdAndDelete(req.body.id);

    // Emit socket event
    const io = req.app.get('socketio');
    if (io) io.emit("foodListUpdated");

    res.json({ success: true, message: "food Removed" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}

// Update food item (Inline Edit)
const updateFood = async (req, res) => {
  try {
    const { id, field, value, variantName } = req.body;

    let updateData = {};

    // Handle variant updates if needed, otherwise standard field update
    // For simplicity now, let's assume direct field updates or complex logic later
    // But for Excel-like edit, we might just update the specific field

    if (variantName) {
      // Logic to update specific variant price... to be refined
      // This is a placeholder for the "Inline Edit" task later
    } else {
      updateData[field] = value;
    }

    // For now, let's just use findByIdAndUpdate if it's a direct property
    // But since we didn't fully spec the update body yet for inline edit, 
    // I will add a generic update for now (Full Update) which serves bulk upload too

    // Actually, let's stick to the requested Scope: Update Controller for Add/List/Remove + Socket

    // I will add a generic "updateFood" for now to support single item updates
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

export { addFood, listfood, removeFood }
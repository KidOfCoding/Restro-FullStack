
import xlsx from 'xlsx';
import foodModel from '../models/foodModel.js';
import fs from 'fs';

const bulkUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No file uploaded" });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Read as array of arrays to handle mixed content
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        const bulkOps = [];
        let currentSection = "Uncategorized"; // Default category

        const processedItemNames = [];

        // Skip Header Row (Index 0)
        for (let i = 1; i < data.length; i++) {
            const row = data[i];

            // Skip empty rows
            if (!row || row.length === 0) continue;

            const col0 = row[0]; // Section or undefined (for variants)
            const col1 = row[1]; // Item Name
            const col2 = row[2]; // Price (or 'HALF')
            const col3 = row[3]; // 'FULL' or Second Price

            // Case 1: Section Header or Category change
            // In the provided excel, Column 0 is "Section".
            // If it's a new item, it has a section.

            // Logic to identify valid item row:
            // "Item Name" must exist.
            if (!col1) continue;

            // Update current Category if present
            if (col0) currentSection = col0;

            const itemName = col1;
            processedItemNames.push(itemName);

            // Check if it is a variant row (containing "Half"/"Full" price structure)
            // The excel scan showed:
            // [ "MAIN COURSE - VEG", "Paneer Masala", 100, 180 ]
            // So Col 2 is Half Price, Col 3 is Full Price

            let price = 0; // Default base price
            let variants = [];

            // Heuristic using the "analyze.js" output:
            // Standard: [ "NOODLES", "Veg", 50 ] (Col 3 is undefined)
            // Variant: [ "MAIN", "Paneer", 100, 180 ] (Col 3 has value)

            if (col3 !== undefined && col3 !== null) {
                // It's likely a variant item
                const halfPrice = Number(col2);
                const fullPrice = Number(col3);

                // Set base price to Full Price (or Half, decision needed. Usually Full)
                price = fullPrice;

                variants.push({ name: "Half", price: halfPrice });
                variants.push({ name: "Full", price: fullPrice });

            } else {
                // Standard Item
                price = Number(col2);
            }

            // Determine 'type' (Veg/Non-Veg) based on Section Name
            let type = "veg";
            let category = currentSection;

            const sectionLower = currentSection.toLowerCase();

            // Logic to split "NOODLES - VEG" -> Category: "Noodles", Type: "veg"
            if (sectionLower.includes("- veg")) {
                category = currentSection.replace(/- veg/i, "").trim();
                type = "veg";
            } else if (sectionLower.includes("- non veg")) {
                category = currentSection.replace(/- non veg/i, "").trim();
                type = "non-veg";
            } else if (sectionLower.includes("non veg")) { // Fallback if no hyphen
                type = "non-veg";
            }

            // Clean up Category (Capitalize like "Noodles")
            category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

            // Normalize Common Categories (Singular -> Plural)
            const categoryMap = {
                "Starter": "Starters",
                "Roll": "Rolls",
                "Bread": "Breads",
                "Rice": "Rice", // Rice is Rice
                "Noodle": "Noodles",
                "Main course": "Main Course"
            };

            if (categoryMap[category]) {
                category = categoryMap[category];
            }

            // Construct Update Operation (Upsert by Name)
            bulkOps.push({
                updateOne: {
                    filter: { name: itemName },
                    update: {
                        $set: {
                            category: category,
                            price: price,
                            type: type,
                            variants: variants
                            // Note: We are NOT updating image here, preserving existing images
                        }
                    },
                    upsert: true
                }
            });
        }

        if (bulkOps.length > 0) {
            await foodModel.bulkWrite(bulkOps);

            // ================== SYNC LOGIC (Delete Missing Items) ==================
            // Comment out the block below to revert to "Merge" mode (Keep existing items)
            if (processedItemNames.length > 0) {
                await foodModel.deleteMany({ name: { $nin: processedItemNames } });
            }
            // =======================================================================
        }

        // Emit Socket Event
        const io = req.app.get('socketio');
        if (io) io.emit("foodListUpdated");

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({ success: true, message: `Processed ${bulkOps.length} items.` });

    } catch (error) {
        console.error("Bulk Upload Error:", error);
        res.json({ success: false, message: "Error processing file" });
    }
}

export { bulkUpload };

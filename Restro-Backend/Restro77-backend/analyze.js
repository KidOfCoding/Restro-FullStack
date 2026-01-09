
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up two levels to root (Restro-Backend/Restro77-backend -> Restro-Backend -> Root)
// actually it is in c:\Users\newak\OneDrive\Desktop\Restro FullStack\Restro FullStack V2\RESTRO77_Menu.xlsx
// Script is in c:\Users\newak\OneDrive\Desktop\Restro FullStack\Restro FullStack V2\Restro-Backend\Restro77-backend\analyze.js
const filePath = path.join(__dirname, '../../RESTRO77_Menu.xlsx');

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    console.log("Total Rows:", data.length);

    // Find row with "HALF" to see context
    const halfRowIndex = data.findIndex(row => row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('half')));

    if (halfRowIndex !== -1) {
        console.log(`\nFound 'HALF' at row ${halfRowIndex}. Context:`);
        // Print 2 rows before and 5 rows after
        const start = Math.max(0, halfRowIndex - 2);
        const end = Math.min(data.length, halfRowIndex + 10);
        console.log(JSON.stringify(data.slice(start, end), null, 2));
    } else {
        console.log("No 'HALF' found in raw scan.");
    }

    console.log("\nFirst 5 rows:");
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
} catch (err) {
    console.error("Error reading file:", err);
}

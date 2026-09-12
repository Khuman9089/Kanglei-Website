import fs from 'fs';
import path from 'path';

// Extract INITIAL_GEMSTONE_PRODUCTS from defaultProducts.ts
const filePath = path.join(process.cwd(), 'src/config/defaultProducts.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Find the array
const startIndex = content.indexOf('[');
const endIndex = content.lastIndexOf(']');

if (startIndex !== -1 && endIndex !== -1) {
  const arrayCode = content.substring(startIndex, endIndex + 1);
  try {
    const products = eval(arrayCode);
    const destPath = path.join(process.cwd(), 'data/shop_products.json');
    fs.writeFileSync(destPath, JSON.stringify(products, null, 2), 'utf8');
    console.log(`Successfully synced ${products.length} products to data/shop_products.json`);
  } catch (err) {
    console.error('Error parsing products:', err);
  }
} else {
  console.error('Could not locate array brackets');
}

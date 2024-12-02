const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));  // Increased body size limit
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // For form data handling
app.use(cors());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// --------------------- ENSURE DATA DIRECTORY AND FILES EXIST ----------------------

const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');
const menuFilePath = path.join(dataDir, 'menu.json');
const hotdealFilePath = path.join(dataDir, 'hotdeal.json');
const ordersFilePath = path.join(dataDir, 'orders.json');

// Helper function to ensure the data directory and JSON files exist
const ensureDataDirectoryAndFilesExist = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('✅ Created "data" directory.');
  }
  
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
    console.log('✅ Created "users.json" file.');
  }
  if (!fs.existsSync(hotdealFilePath)) {
    fs.writeFileSync(hotdealFilePath, JSON.stringify([], null, 2));
    console.log('✅ Created "hotdeal.json" file.');
  }
  if (!fs.existsSync(menuFilePath)) {
    fs.writeFileSync(menuFilePath, JSON.stringify([], null, 2));
    console.log('✅ Created "menu.json" file.');
  }
  if (!fs.existsSync(ordersFilePath)) {
    fs.writeFileSync(ordersFilePath, JSON.stringify([], null, 2));
    console.log('✅ Created "orders.json" file.');
  }
};

// Ensure the data directory and files exist when the app starts
ensureDataDirectoryAndFilesExist();



// --------------------- HELPER FUNCTIONS ----------------------

// Helper function to read JSON from a file
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading file "${filePath}":`, err);
    throw new Error('File read error');
  }
};

// Helper function to write JSON to a file
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to file "${filePath}":`, err);
    throw new Error('File write error');
  }
};


// --------------------- orders ENDPOINTS ----------------------
// --------------------- orders ENDPOINTS ----------------------

// Endpoint to submit a new order
app.post('/submit-order', async (req, res) => {
  try {
    const order = req.body;

    if (!order.name || !order.products || order.products.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    const data = await fs.promises.readFile(ordersFilePath, 'utf8');
    let orders = JSON.parse(data);

    // Generate a unique ID for the new order
    const newOrder = {
      id: orders.length ? orders[orders.length - 1].id + 1 : 1,
      ...order,
    };

    // Add the new order to the list
    orders.push(newOrder);

    // Save updated orders list
    await fs.promises.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));

    res.status(201).json({ message: 'Order submitted successfully', order: newOrder });
  } catch (err) {
    console.error('Error saving order:', err.message);
    res.status(500).json({ message: 'Error saving order', error: err.message });
  }
});

// --------------------- show products  ENDPOINT ----------------------

app.get('/orders/:id/products', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);

    if (isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const data = await fs.promises.readFile(ordersFilePath, 'utf8');
    const orders = JSON.parse(data || '[]');

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.products || order.products.length === 0) {
      return res.status(404).json({ message: 'No products found for this order' });
    }

    res.status(200).json(order.products);
  } catch (err) {
    console.error('Error fetching products for order:', err.message);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});



// --------------------- Fetch orders ENDPOINT ----------------------
app.get('/orders', async (req, res) => {
  try {
    const data = await fs.promises.readFile(ordersFilePath, 'utf8');
    const orders = JSON.parse(data || '[]');  // Parse existing orders data
    res.status(200).json(orders);  // Respond with the orders data as JSON
  } catch (err) {
    console.error('Error reading orders.json:', err);
    res.status(500).send('Error fetching orders');
  }
});
// Endpoint to mark an order as complete
app.put('/orders/:id/complete', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const data = await fs.promises.readFile(ordersFilePath, 'utf8');
    let orders = JSON.parse(data);

    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Completed'; // Add a status property and set it to "Completed"
      await fs.promises.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
      return res.status(200).json({ message: 'Order marked as completed', order });
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error handling orders.json:', err.message);
    return res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});

// Endpoint to clear (delete) an order
app.delete('/orders/:id/clear', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const data = await fs.promises.readFile(ordersFilePath, 'utf8');
    let orders = JSON.parse(data);

    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders.splice(orderIndex, 1); // Remove the order from the list
      await fs.promises.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
      return res.status(200).json({ message: 'Order cleared (deleted)' });
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('Error handling orders.json:', err.message);
    return res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
});

// --------------------- USER ENDPOINTS ----------------------

// Endpoint to serve users.json
app.get('/data/users.json', (req, res) => {
  if (fs.existsSync(usersFilePath)) {
    res.sendFile(usersFilePath);
  } else {
    res.status(404).send('users.json file not found');
  }
});

// Endpoint to add a new user
app.post('/api/add-user', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users file:', err);
      return res.status(500).json({ message: 'Error reading users file' });
    }

    let users = [];
    if (data) {
      try {
        users = JSON.parse(data);
      } catch (jsonErr) {
        console.error('Error parsing users file:', jsonErr);
        return res.status(500).json({ message: 'Error parsing users file' });
      }
    }

    // Instead of hashing the password, directly store it as it is
    const newUser = { username, password };

    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving users file:', writeErr);
        return res.status(500).json({ message: 'Error saving users file' });
      }

      res.status(201).json({ message: 'User added successfully' });
    });
  });
});







// --------------------- MENU ENDPOINTS ----------------------

// Endpoint to fetch menu items
app.get('/menu', (req, res) => {
  try {
    const menuItems = readJSONFile(menuFilePath);
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).send('Error fetching menu items.');
  }
});

// Endpoint to save a new menu item
app.post('/menu', (req, res) => {
  const { dishName, price, category, image } = req.body;

  // Validate request body
  if (!dishName || !price || !category || !image) {
    return res.status(400).send('All fields (dishName, price, category, image) are required.');
  }

  const newMenuItem = { id: Date.now(), dishName, price, category, image };

  try {
    const menuItems = readJSONFile(menuFilePath);
    menuItems.push(newMenuItem);
    writeJSONFile(menuFilePath, menuItems);
    console.log(`✅ Added new menu item: ${JSON.stringify(newMenuItem)}`);
    res.status(201).json(newMenuItem);
  } catch (err) {
    res.status(500).send('Error saving menu item.');
  }
});

// Endpoint to delete a menu item by ID
app.delete('/menu/:id', (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  // Check for invalid or default ID (0)
  if (itemId === 0) {
    return res.status(400).send('ID 0 is not a valid menu item ID.');
  }

  // Input validation for itemId
  if (isNaN(itemId)) {
    return res.status(400).send('Invalid ID format.');
  }

  try {
    const menuItems = readJSONFile(menuFilePath);
    const updatedMenu = menuItems.filter((item) => item.id !== itemId);

    if (menuItems.length === updatedMenu.length) {
      console.warn(`⚠️ Menu item with ID ${itemId} not found.`);
      return res.status(404).send('Menu item not found.');
    }

    writeJSONFile(menuFilePath, updatedMenu);
    console.log(`✅ Deleted menu item with ID: ${itemId}`);
    res.status(200).send(`Menu item with ID ${itemId} deleted.`);
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).send('Error deleting menu item.');
  }
});

// --------------------- HOT DEAL ENDPOINTS ----------------------

// --------------------- HOT DEAL ENDPOINTS ----------------------

// Endpoint to fetch hot deals
app.get('/hotdeal', (req, res) => {
  try {
    const hotDeals = readJSONFile(hotdealFilePath);
    res.status(200).json(hotDeals);
  } catch (err) {
    res.status(500).send('Error fetching hot deal items.');
  }
});

// Endpoint to save a new hot deal item (menu item)
app.post('/hotdeal', (req, res) => {
  const { dishName, price, image } = req.body; // Removed category

  // Validate request body (no need to validate category anymore)
  if (!dishName || !price || !image) {
    return res.status(400).send('All fields (dishName, price, image) are required.');
  }

  const newHotDeal = { id: Date.now(), dishName, price, image };

  try {
    const hotDeals = readJSONFile(hotdealFilePath);
    hotDeals.push(newHotDeal);
    writeJSONFile(hotdealFilePath, hotDeals);
    res.status(201).json(newHotDeal);
  } catch (err) {
    res.status(500).send('Error saving hot deal item.');
  }
});

// Endpoint to delete a hot deal item by ID
app.delete('/hotdeal/:id', (req, res) => {
  const itemId = parseInt(req.params.id, 10);

  if (isNaN(itemId)) {
    return res.status(400).send('Invalid ID format.');
  }

  try {
    const hotDeals = readJSONFile(hotdealFilePath);
    const updatedHotDeals = hotDeals.filter((item) => item.id !== itemId);

    if (hotDeals.length === updatedHotDeals.length) {
      return res.status(404).send('Hot deal item not found.');
    }

    writeJSONFile(hotdealFilePath, updatedHotDeals);
    res.status(200).send(`Hot deal item with ID ${itemId} deleted.`);
  } catch (err) {
    res.status(500).send('Error deleting hot deal item.');
  }
});


// --------------------- SERVER START ----------------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
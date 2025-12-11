# Supply Chain Service

Supply Chain Management microservice for managing suppliers, products, and purchase orders.

## Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file (optional):
```
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=supplydb
PORT=3002
```

### Database Setup

The database is automatically initialized on first run using `config/init-db.sql`. This creates:
- `suppliers` table
- `products` table
- `inventory` table
- `purchase_orders` table
- `purchase_order_items` table
- `shipments` table

### Running the Service

```bash
npm start
```

The service will start on `http://localhost:3002`

### API Endpoints

#### Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

#### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Purchase Orders
- `GET /api/purchase-orders` - List all purchase orders
- `GET /api/purchase-orders/:id` - Get PO details with items
- `POST /api/purchase-orders` - Create new purchase order
- `PUT /api/purchase-orders/:id` - Update purchase order
- `DELETE /api/purchase-orders/:id` - Delete purchase order

### Sample Data

The database initialization includes sample data for:
- 3 suppliers (Global Electronics Ltd, Asia Manufacturing Co, European Parts Supply)
- 5 products with SKUs and pricing
- 5 inventory records
- 3 purchase orders

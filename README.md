# Shopify_ADMIN

Shopify Multi-Tenant Dashboard – Detailed Explanation

Project Overview
The project is a multi-tenant shopify dashboard designed to allow multiple shopify store owners to access their store details like their customers, orders and products. Each tenant has access to their own data, they can’t see or access others data.
The project has four pages which are dashboard, customers, orders, products and settings. Dashboard is to see the brief details of their store, it will show top customers, graph, top products, total revenue and growth rate. In customer section the user can see this customer’s details like email, phone numbers in orders and products also same the tenant can see the details of the store and the details are fetched directly from the live shopify APIs. The tenant credentials are stored in the MongoDB atlas.
Features Implemented
1.	Tenant Signup & Authentication
-	There is a safe authentication process where the tenant needs to provide their name, email, password, shopify store domain l(mystore.myshopify.com) and a shopify access token.
-	The backend stored the data in MongoDB atlas which allows the application to identify which shopify stores belongs to which tenant. 

2.	Multi-Tenant Data Handling
-	The backend does not store shopify products, orders, or customer data.
-	Instead, when data is requested:
 Frontend sends a request to backend endpoint (e.g., /api/products).
 Backend identifies tenant from local storage or headers.
 Backend uses shopify API with tenant’s access token.
 Shopify API returns live data, which is forwarded to the frontend.
-	This approach keeps the dashboard lightweight and ensures data is always live and updated.

3.	Dashboard Components
-	Metrics section 
Total Top customers
Total orders
Total revenue
Growth rate
-	Analytics 
which shows the top customers by spending.
-	Top customers
shorted according to their revenue and their mail and number of orders with their total revenue are displayed.
-	Recent orders
The customers who recently purchased. 
-	Top products 
shows the more recent top products.

4.	Backend Architecture
-	 Node.js + Express.js used for API server.
-	MongoDB used to store tenant credentials.
-	 APIs:
•	/api/customers (fetches live customer data from Shopify).
•	/api/orders (fetches live order data from Shopify).
•	/api/products (fetches live product data from shopify).
•	/api/tenants/signup (stores tenant info in MongoDB).
•	/api/tenants/login (authenticates tenant).
-	Every request includes tenant-id to ensure multi-tenancy.

5.	Frontend Architecture
-	React.js + Tailwind CSS for clean and responsive UI.
-	Components:
  Header – Navigation and user info.
  Sidebar – Menu to switch between dashboard pages.
  Metric Cards – Show key metrics like total revenue, orders, and   customers.
  Products Page – Displays product data in a searchable table.
 Settings Page – Allows tenants to update basic store info.

6.	Data Flow
-	Tenant signup – credentials stored in MongoDB.
-	Tenant login – with same credentials which are used during signup.
-	Frontend requests product/order/customer data – backend fetching live from shopify.
-	Data returns to frontend – displays in dashboard metrics and tables.

7.	Security & multi-tenancy
-	Tenant credentials stored securely in MongoDB.
-	All API requests include tenant ID in headers.
-	 Dashboard ensures each tenant only sees their own data.
How Data is Fetched
1.	Tenant logs in → access token and shop domain are fetched from MongoDB/local storage.
2.	Frontend calls backend APIs (/customers, /orders, /products).
3.	Backend uses shopify API and tenant credentials to fetch live data.
4.	Dashboard displays the data directly from shopify, no product/order/customer data is stored in your database.

Setup Instructions
Requirements
Node.js & npm installed
MongoDB Atlas account
Shopify Partner account (for API credentials)

Backend Setup
Clone the repo and navigate to backend folder:
cd backend
npm install

Create a .env file with the following:
MONGO_URI=mongodb+srv://db_name:password@cluster0.jokvml6.mongodb.net/myDatabase?retryWrites=true&w=majority
PORT=5001
SHOPIFY_TOKEN=shpat_XXXXXXXXXXXXXXXXX
SHOPIFY_API_KEY=bce7c4d4cd534dxxxxxxxx
SHOPIFY_API_SECRET=44b2553f6xxxxxxxxxxxxx

HOST=https://shopify-admin-backend-rgkc.onrender.com/api
FRONTEND=https://shopify-admin-frontend-1.onrender.com
SCOPES=read_products,read_customers,read_orders

JWT_SECRET=sxxxxxxxxxxxx


Start the backend:
npm run dev
Frontend Setup
Navigate to frontend folder:
cd frontend
npm install
Update .env with backend API URL:
REACT_APP_API_URL=https://shopify-admin-backend-rgkc.onrender.com/api
Start the frontend:
npm start


Architecture Diagram
         ┌─────────────┐
         │   Frontend  │ (React + Tailwind)
         │   Dashboard │
         └──────┬──────┘
                │ API calls
         ┌─────────────┐
         │   Backend   │ (Node.js + Express)
         └──────┬──────┘
                │
   ┌────────────┼────────────┐
   │            │            │
Shopify API   MongoDB     Auth Layer
(Live data)  (Tenant      (JWT-based,
             credentials) tenant isolation)
   
  Deployment
-	Backend Deployment
•	Used Node.js + Express for the API server.
•	Hosted the backend on Render.
•	Connected the backend to MongoDB Atlas for storing tenant credentials.
-	 Frontend Deployment
•	Built the frontend with React.js + Tailwind CSS.
•	Deployed the frontend on Render.
•	Configured it to call backend APIs for fetching live data from Shopify.

Possible Improvements
•	Add charts for better visual insights (Chart.js, Recharts).
•	Store data like customer, orders, products in the MongoDB so that it won’t take much time to fetch 

 
Live demo:
You can try the project here: [Shopify Multi-Tenant Dashboard]
https://shopify-admin-frontend-1.onrender.com
NOTE: The credentials to login the  application for testing purpose
Tenant 1
Email: molika_y@srmap.edu.in
Password: molika
Tenant 2
Email: saiyashwanth_pulivenkata@srmap.edu.in 
Password: yash
Test accounts are included above for verification.  
Contact: molika_y@srmap.edu.in 
Thanks for reviewing.



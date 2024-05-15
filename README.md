# The back-end for the E-Commerce application project.

### Overview:

This documentation outlines the architecture, features, and functionalities of a distributed online market built using Node.js, Express.js, MySQL, JWT for authentication, and Express Validator for input validation. The system aims to provide various features such as user authentication, account management, data manipulation, online payment, multi-search options, inventory management, and reporting capabilities.

### Technologies Used:

-   **Node.js**: A JavaScript runtime for building server-side applications.
-   **Express.js**: A web application framework for Node.js used to build robust APIs.
-   **MySQL**: A relational database management system used for storing and managing data.
-   **JWT (JSON Web Tokens)**: A standard for securely transmitting information between parties as a JSON object.
-   **Express Validator**: Middleware for Express.js used for input validation and sanitization.

---

### Features:

1.  **User Authentication**:

    -   Users can create a new account and login securely using JWT.
    -   Different types of users are supported (Customer - Seller), each with their own permissions and access levels.

2.  **Data Management**:

    -   Users can add, edit, and remove data that is shared between them, ensuring real-time collaboration.
    -   Inventory management allows users to track their items and manage stock levels efficiently.

3.  **Online Payment**:

    -   Integration with payment gateways to facilitate secure online transactions.

4.  **Multi-Search Options**:

    -   Advanced search functionality enables users to search for items using various criteria.

5.  **Account Information**:

    -   Users can view their account info, including current cash balance, purchased items, sold items, and pending transactions.

6.  **Reporting**:

    -   Generate different types of reports, such as transaction summaries, inventory reports, and sales analytics.

7.  **RESTful Web Services**:

    -   The system is built on REST architecture, providing a uniform interface for interacting with resources.

8.  **Distributed Database Model**:
    -   Utilizes a distributed database model with appropriate partitioning of tables for scalability and performance.

---

### let's summarize the functionalities for each user type in the online market:

### Customer:

1. **View Items**:

    - Can view all items available in the market.

2. **Add to Cart**:

    - Can add items to their shopping cart for purchasing.

3. **Charge Balance**:

    - Can charge their balance using a credit card for making purchases.

4. **View Order History**:
    - Can view their order history to track past purchases.
      
5. **Search for Items**:
      1. Search using item name.
      2. Search by category.

### Seller:

1. **Manage Items**:

    - Can perform CRUD operations (Create, Read, Update, Delete) on items they are selling.

2. **View Reports**:
    - Can view reports on item performance, including sales data (e.g., revenue generated) for each item they are selling.

### Additional Considerations:

-   **Authentication**:

    -   Implement authentication to differentiate between customers and sellers and authorize their actions accordingly.

-   **Authorization**:

    -   Ensure that customers can only access functionalities related to viewing items, adding to cart, charging balance, and viewing order history.
    -   Sellers should have access to manage their own items and view reports related to their sales data.

-   **Input Validation**:

    -   Validate input parameters for each endpoint to prevent errors and enhance security.

-   **Error Handling**:

    -   Implement error handling to provide meaningful error messages to users in case of failures.

-   **Database Design**:

    -   Design the database schema to support customer orders, item management, and sales reporting efficiently.
       ![Database](https://github.com/eidHossam/E_Commerce_Backend/assets/106603484/c8ac5e62-56ed-409a-8056-55d649a569d6)


-   **Reporting Module**:
    -   Develop a reporting module to generate sales reports for sellers based on item sales data.

By incorporating these functionalities and considerations, you can create a robust and user-friendly online market platform that meets the needs of both customers and sellers.

---

### System Architecture:

The system follows a modular architecture, with components organized into layers:
![server](https://github.com/eidHossam/E_Commerce_Backend/assets/106603484/8d2ae560-0a9c-4010-b62b-011e13aed516)

1. **Presentation Layer**:

    - Handles user interface interactions and client-server communication.
    - Implemented using Express.js to define routes and controllers for handling requests.

2. **Business Logic Layer**:

    - Contains the core business logic and application-specific rules.
    - Responsible for user authentication, data manipulation, payment processing, and report generation.

3. **Data Access Layer**:

    - Interacts with the database to perform CRUD operations and retrieve/store data.
    - Utilizes MySQL as the relational database management system.

4. **Security Layer**:
    - Implements authentication and authorization mechanisms using JWT for secure access control.
    - Input validation and sanitization are enforced using Express Validator to prevent security vulnerabilities such as SQL injection and XSS attacks.

---
### API Endpoints:

### Customer Module (`customerRoutes.js`)

-   **Endpoints**:
    -   `/orders`:
        -   POST: Add an item to the order.
        -   GET: Get order details.
        -   PUT: Update an item in the order.
        -   DELETE: Delete the entire order.
    -   `/orders/:Item_ID`: DELETE specific item from order.
    -   `/balance`: PUT request to charge balance.
    -   `/orders/checkout/balance`: POST request to checkout using balance.
    -   `/history`: GET request to retrieve customer purchase history.
-   **Middleware**:
    -   `validateToken`: Validates JWT token for authentication.
    -   `validateOrderItem`: Middleware for validating order items.
    -   `validateTransaction`: Middleware for validating transactions.

### Item Module (`itemRoutes.js`)

-   **Endpoints**:
    -   `/categories`: GET request to retrieve all categories.
    -   `/categories/:category`: GET request to retrieve items by category.
    -   `/:itemName`: GET request to retrieve items by name.

### Seller Module (`sellerRoutes.js`)

-   **Endpoints**:
    -   `/item`:
        -   POST: Add a new item.
        -   GET: Retrieve seller's items.
    -   `/item/:Item_ID`:
        -   PUT: Update item details.
        -   DELETE: Delete an item.
    -   `/reports/`: GET request to retrieve seller performance reports.
-   **Middleware**:
    -   `validateItem`: Middleware for validating item data.
    -   `validateToken`: Validates JWT token for authentication.

### User Module (`userRoutes.js`)

-   **Endpoints**:
    -   `/customers/register`: POST request to register a customer.
    -   `/customers/addresses`: POST request to add customer address.
    -   `/customers/cards`: POST request to add customer card.
    -   `/sellers/register`: POST request to register a seller.
    -   `/login`: POST request to login.
    -   `/current/:userType`: GET request to retrieve current user details.
-   **Middleware**:
    -   `validateRegistration`: Middleware for validating user registration data.
    -   `validateCard`: Middleware for validating card data.
    -   `validateAddress`: Middleware for validating address data.
    -   `validateToken`: Validates JWT token for authentication.

Each module uses Express.js Router to define its routes and associated controller functions. Additionally, middleware functions are utilized for input validation and user authentication.

Great! Since the details of all endpoints are available on Postman API tool, you can refer users to Postman for comprehensive documentation. Here's how you can include that information in your project documentation:

---

### Endpoint Documentation:

For detailed documentation of each endpoint, including request parameters, responses, and usage examples, please refer to the Postman API tool. You can access the API documentation using the following link:

[Postman API Documentation](https://www.postman.com/e-commerce-project-4180/workspace/online-market/overview)

In the Postman documentation, you'll find:

-   Comprehensive descriptions of each endpoint.
-   Examples of requests and responses.
-   Information on required headers, query parameters, and request bodies.
-   Any authentication requirements or authorization scopes.
-   Notes on error handling and status codes.

Please ensure you have Postman installed or access to the Postman web platform to explore and interact with the API endpoints effectively.

---

### Conclusion:

This documentation provides an overview of the distributed online software system, including its features, architecture, technologies used, and deployment considerations. By leveraging Node.js, Express.js, MySQL, JWT, and Express Validator, the system offers a scalable, secure, and feature-rich platform for online collaboration, data management, and e-commerce functionalities.

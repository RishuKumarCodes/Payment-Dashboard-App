# Full-Stack Payment Dashboard App

A secure, mobile-first Payment Management Dashboard built with **React Native** and **NestJS** that enables viewing and filtering payment transactions, simulating new payments, viewing payment trends and metrics, and managing users.

## 📱 Features

### Frontend (React Native with expo)

- **Login Screen**: JWT-based authentication with secure token storage
- **Dashboard Screen**: Key payment metrics with interactive charts
- **Transactions List**: Paginated list with advanced filtering options
- **Transaction Details**: Detailed view of individual payments
- **Add Payment Form**: Create new simulated payments
- **Real-time Updates**: WebSocket integration for live data

### Backend (NestJS, JWT, MongoDB)

- **Authentication Module**: JWT token generation and validation
- **Payments Module**: CRUD operations with filtering and pagination
- **Statistics API**: Payment metrics and trend data

### Demo Credentials

- **Username:** `admin`
- **Password:** `admin123`

# Features

### Dashboard Screen

- Total payments today/this week
- Total revenue
- Failed transactions count
- Revenue trend chart (last 7 days)
- Real-time updates via WebSocket

### Transaction List

- Paginated transaction list
- Filter by:
  - Date range
  - Status (success, failed, pending)
  - Payment method
- Tap to view transaction details

### Add Payment Form

- Amount input
- Receiver name
- Payment status selection
- Payment method selection
- Form validation

## Bonus Features Implemented

- **Advanced Filtering**: Date range, status, and method filters
- **Pagination**: Efficient data loading with pagination
- **Charts**: Interactive revenue trend visualization
- **Secure Storage**: JWT tokens stored securely on mobile
- **Error Handling**: Comprehensive error handling and user feedback

### API Testing with Postman

Import the Postman collection (included in project) to test all API endpoints.

### Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation with class-validator
- CORS protection
- Secure token storage on mobile

### Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for large datasets
- WebSocket connections for real-time updates
- Efficient React Native rendering

## My Learnings:

I learned the more of NestJS by comparing it with your existing MERN/Next.js knowledge, understanding its structured architecture using Controllers, Services, and Modules. I also grasped how NestJS routes and business logic are organized differently using decorators and dependency injection.

# Laernify - Online Learning Marketplace

Laernify is an innovative platform designed to empower users to buy and sell courses. With comprehensive features for both users and administrators, Laernify streamlines the process of online learning and teaching.

## Features

### User Side

1. **Authentication System**

   - Secure JWT-based authentication.
   - Signup, login, and logout functionality.
   - Forget and reset password capabilities for user convenience.

2. **Subscriptions**

   - Seamless subscription purchasing options for users.

3. **Course Exploration and Purchase**

   - Browse through a wide range of courses.
   - Purchase courses easily with an integrated payment gateway.

4. **Lecture Viewing**

   - Watch course lectures directly within the platform.

5. **User Profile Management**

   - Update profile information and profile pictures.
   - Change passwords and manage account details.

### Admin Side

1. **Authentication**

   - Secure login system for administrators.

2. **Admin Dashboard**

   - Interactive charts and analytics.
   - View and manage payment-related data.
   - Access detailed user analytics, including course purchases and popular courses.

3. **Razorpay Integration**

   - Handle payments securely through Razorpay.

4. **Course Management**

   - Create and delete courses efficiently.

5. **Lecture Management**

   - Add and remove lectures from courses.

## Tech Stack

- **Frontend**: React.js, Redux, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (optional mention if used)
- **Authentication**: JSON Web Tokens (JWT)
- **Payment Gateway**: Razorpay

## Project Highlights

### User Workflow

1. **Signup/Login**: Users register and authenticate securely.
2. **Explore Courses**: Browse through available courses using an intuitive UI.
3. **Purchase**: Buy subscriptions or individual courses using Razorpay.
4. **Access Content**: Watch lectures seamlessly on the platform.
5. **Manage Profile**: Update profile and account settings conveniently.

### Admin Workflow

1. **Dashboard Access**: View critical metrics and insights on the admin dashboard.
2. **Course Management**: Create and manage courses with ease.
3. **Lecture Management**: Organize course content effectively by adding or deleting lectures.
4. **Analytics**: Gain insights into user activity, course popularity, and payment data.

## Installation and Setup

### Prerequisites

- Node.js installed on your system.
- MongoDB instance running (if database is used).
- Razorpay account for payment integration.

### Steps to Run Locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/sumit7754/laernify.git
   cd laernify
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the following:

   ```env
   NODE_ENV=development

   PORT=5000

   MONGO_URI=mongodb://127.0.0.1:27017/lms

   JWT_SECRET=<YOUR_LONG_JWT_SECRET>
   JWT_EXPIRY=<JWT_EXPIRY>

   CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
   CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
   CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>

   SMTP_HOST=<YOUR_SMTP_HOST>
   SMTP_PORT=<YOUR_SMTP_PORT>
   SMTP_USERNAME=<YOUR_SMTP_USERNAME>
   SMTP_PASSWORD=<YOUR_SMTP_PASSWORD>
   SMTP_FROM_EMAIL=<YOUR_SMTP_FROM_EMAIL>

   RAZORPAY_KEY_ID=<YOUR_RAZORPAY_KEY>
   RAZORPAY_SECRET=<YOUR_RAZORPAY_SECRET>
   RAZORPAY_PLAN_ID=<YOUR_RAZORPAY_PLAN_ID>

   FRONTEND_URL=<YOUR_FRONTEND_WEBSITE_URL>

   CONTACT_US_EMAIL=<YOUR_CONTACT_US_EMAIL>
   ```

4. **Start the Application**:

   - Backend:
     ```bash
     npm run server
     ```
   - Frontend:
     ```bash
     cd client
     npm start
     ```

5. **Access the Application**: Open [http://localhost:5174](http://localhost:5174) in your browser.

## Screenshots

- **User Dashboard**: [Add screenshots of user dashboard]
- **Admin Dashboard**: [Add screenshots of admin dashboard]
- **Course Page**: [Add screenshots of course details page]

## Future Enhancements

1. **Mobile App Development**: Build a mobile app for better accessibility.
2. **Enhanced Analytics**: Add more detailed insights for admins.
3. **Gamification**: Introduce badges and rewards for users completing courses.
4. **Multilingual Support**: Enable courses in multiple languages.

---

Laernify simplifies online learning and teaching, making it accessible and efficient for everyone. Join us in revolutionizing the way people learn and teach online!

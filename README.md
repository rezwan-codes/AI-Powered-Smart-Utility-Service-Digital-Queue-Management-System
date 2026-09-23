# AI-Powered Smart Utility Service & Digital Queue Management System

**Smart Utility** is a full-stack digital platform designed to modernize public utility service management. The system enables citizens to submit and track complaints, technicians to manage assigned service requests, and administrators to monitor and coordinate operations through dedicated dashboards.

The platform combines **digital queue management, complaint handling, technician coordination, real-time location support, notifications, communication, and analytics** into a centralized system.

## 🌐 Live Application

**Live Site:** https://smart-utility-frontend.onrender.com

> The application is deployed for demonstration and academic purposes.

---

## 📌 Project Overview

Traditional utility service systems often rely on manual complaint submission, physical queues, and fragmented communication between citizens, technicians, and administrators.

**Smart Utility** provides a centralized digital solution where citizens can submit complaints online, track service progress, receive notifications, communicate with support staff, and monitor relevant service information.

Administrators can manage complaints, users, technicians, emergency alerts, and service analytics, while technicians can view and manage their assigned requests.

### Core Objectives

* Digitize public utility complaint management
* Reduce dependency on physical queues
* Improve communication between citizens and service providers
* Streamline technician assignment and service handling
* Provide real-time service and location visibility
* Support emergency complaint and alert management
* Provide analytics for administrative decision-making

---

# ✨ Key Features

## 👤 Citizen Portal

Citizens can:

* Create an account and log in securely
* Verify their email address using OTP
* Submit utility complaints
* Upload complaint images/files
* Track complaint status
* View complaint history
* Receive notifications
* Communicate through chat
* Monitor assigned service progress
* Submit reviews and ratings

## 🛠️ Technician Management

Technicians can:

* Register/request technician access
* Receive assigned complaints
* View service requests
* Manage assigned tasks
* Update complaint/service status
* Share location information where supported
* Respond to service requests

## 🛡️ Admin Dashboard

Administrators can:

* Monitor the overall platform
* Manage citizen accounts
* Manage technicians
* Review technician requests
* Assign technicians to complaints
* Manage complaints
* Monitor emergency alerts
* View service activity
* Analyze system data
* Monitor user and service performance

## 🗺️ Location & Map Services

The system integrates **Google Maps API** to support location-based functionality.

Features include:

* Complaint location visualization
* Live complaint map
* Technician location support
* Location-based service monitoring

## 🚨 Emergency Alert Management

The platform provides emergency alert functionality for identifying and monitoring urgent service-related incidents.

Administrators can monitor emergency alerts and coordinate appropriate responses.

## 💬 Communication

The system includes communication features for improving interaction between users and service providers.

* Chat support
* Notifications
* Email communication
* OTP verification

## 📊 Analytics

The administrative dashboard provides data visualization and analytics to help monitor service activity and system performance.

**Recharts** is used for presenting analytical information through interactive charts.

---

# 🧰 Technology Stack

## Frontend

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| React           | User interface                |
| TypeScript      | Type-safe development         |
| Vite            | Development and build tooling |
| Tailwind CSS    | UI styling                    |
| React Router    | Client-side routing           |
| Axios           | API communication             |
| Recharts        | Data visualization            |
| Lucide React    | Interface icons               |
| Framer Motion   | UI animations                 |
| Google Maps API | Maps and location services    |

## Backend

| Technology | Purpose                        |
| ---------- | ------------------------------ |
| Node.js    | Runtime environment            |
| Express.js | Backend framework              |
| Prisma ORM | Database access and management |
| PostgreSQL | Relational database            |
| JWT        | Authentication                 |
| Bcrypt.js  | Password hashing               |
| Multer     | File and image uploads         |
| Nodemailer | Email communication            |

---

# 🏗️ System Architecture

The application follows a full-stack client-server architecture.

```text
┌─────────────────────────────────────────┐
│              Citizens                   │
│        Technicians / Admins             │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              React Frontend             │
│        TypeScript + Tailwind CSS        │
│                                         │
│  Citizen │ Technician │ Admin Portal    │
└───────────────────┬─────────────────────┘
                    │
               REST APIs
                    │
                    ▼
┌─────────────────────────────────────────┐
│           Node.js + Express.js          │
│                                         │
│ Authentication │ Complaints │ Chat      │
│ Notifications  │ Requests   │ Admin     │
│ Technicians    │ File Uploads           │
└───────────────────┬─────────────────────┘
                    │
               Prisma ORM
                    │
                    ▼
┌─────────────────────────────────────────┐
│              PostgreSQL                 │
│             Database Layer              │
└─────────────────────────────────────────┘
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│ Google Maps API  │  │ Email Services   │
│ Location Support │  │ OTP/Notifications│
└──────────────────┘  └──────────────────┘
```

---

# 🔄 Complaint Management Workflow

```text
Citizen
   │
   ▼
Submit Complaint
   │
   ▼
Complaint Registered
   │
   ▼
Admin Review
   │
   ▼
Technician Assignment
   │
   ▼
Technician Handles Request
   │
   ▼
Service Status Updated
   │
   ▼
Complaint Resolved
   │
   ▼
Citizen Review & Rating
```

---

# 📁 Project Structure

```text
smart-utility/
│
├── backend/
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
│   │   │
│   │   ├── lib/
│   │   │   ├── prisma.js
│   │   │   ├── email.js
│   │   │   ├── multer.js
│   │   │   ├── tokens.js
│   │   │   └── formatters.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── complaintRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── requestRoutes.js
│   │   │   └── technicianRoutes.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   │
│   ├── public/
│   │   ├── images/
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── common/
│   │   │   ├── complaint/
│   │   │   ├── layout/
│   │   │   └── map/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── citizen/
│   │   │   ├── landing/
│   │   │   └── technician/
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   └── package.json
│
├── package.json
└── README.md
```

---

# 🔐 Authentication & Security

The application implements authentication and basic security mechanisms including:

* JWT-based authentication
* Password hashing using Bcrypt.js
* Email verification
* OTP-based verification
* Protected routes
* Role-based access to citizen, technician, and administrator functionality
* Environment-based configuration
* Centralized backend error handling

Sensitive credentials and environment variables should be stored outside the source code using environment configuration.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Git

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-utility.git
cd smart-utility
```

## 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

# ⚙️ Environment Configuration

Create the required `.env` files for the backend and frontend.

Example backend configuration:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Example frontend configuration:

```env
VITE_API_URL=your_backend_api_url
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> Never commit actual API keys, database credentials, JWT secrets, or email passwords to GitHub.

---

# 🗄️ Database Setup

The project uses **PostgreSQL** with **Prisma ORM**.

After configuring the database connection, run:

```bash
npx prisma migrate dev
```

To generate the Prisma client:

```bash
npx prisma generate
```

If seed data is configured:

```bash
node prisma/seed.js
```

---

# ▶️ Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

## Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend will then be available through the local development server provided by Vite.

---

# 📱 User Roles

The platform is organized around three primary user roles:

| Role              | Main Responsibilities                                                           |
| ----------------- | ------------------------------------------------------------------------------- |
| **Citizen**       | Submit complaints, track requests, chat, receive notifications, provide reviews |
| **Technician**    | Manage assigned service requests and update service progress                    |
| **Administrator** | Manage users, complaints, technicians, emergency alerts, and analytics          |

---

# 🎯 Project Goals

The project was developed with the following goals:

1. **Digitalize utility service management**
2. **Reduce physical queue dependency**
3. **Improve complaint tracking**
4. **Connect citizens with service technicians**
5. **Improve administrative monitoring**
6. **Provide location-aware service management**
7. **Support data-driven decision-making**

---

# 🔮 Future Enhancements

Potential future improvements include:

* AI-assisted complaint classification
* Intelligent technician assignment
* Predictive queue and service-time estimation
* Automated complaint prioritization
* Advanced fraud/anomaly detection
* Mobile application
* Real-time WebSocket-based updates
* Advanced geographic analytics
* Multilingual support
* Integration with additional public utility APIs

---

# 🎓 Academic Project

**Project:** AI-Powered Smart Utility Service & Digital Queue Management System

**Type:** Undergraduate Capstone Project

**Program:** Bachelor of Science in Computer Science and Engineering

**Institution:** Presidency University Bangladesh

### Development Focus

* Full-Stack Web Development
* Database Management
* REST API Development
* Digital Queue Management
* Complaint Management
* Location-Based Services
* Authentication & Authorization
* Data Visualization
* System Design

---

# 👨‍💻 Developer Contribution

As a team member/team leader, my contribution included:

* Designing and developing full-stack application components
* Developing React and TypeScript interfaces
* Building backend services with Node.js and Express.js
* Designing and managing PostgreSQL data models using Prisma
* Implementing authentication and authorization
* Developing complaint and service-request workflows
* Integrating Google Maps functionality
* Implementing dashboards and data visualization
* Integrating notification, file-upload, and communication functionality
* Contributing to overall system architecture and integration

---

# 📊 Project Highlights

| Area           | Implementation            |
| -------------- | ------------------------- |
| Frontend       | React + TypeScript + Vite |
| Backend        | Node.js + Express.js      |
| Database       | PostgreSQL                |
| ORM            | Prisma                    |
| Authentication | JWT + Bcrypt.js           |
| Maps           | Google Maps API           |
| Charts         | Recharts                  |
| File Upload    | Multer                    |
| Email          | Nodemailer                |
| Styling        | Tailwind CSS              |
| Animation      | Framer Motion             |

---

# 📄 License

This project was developed as an academic capstone project.

© 2026 Md Rezwan Molla. All rights reserved.

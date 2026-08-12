# Hackathon Registration Platform — Mobile App Club 2026

A production-quality, high-performance, and futuristic technology hackathon registration platform built for Sathyabama Institute of Science and Technology's **Mobile App Club**.

Features a deep dark cybernetic aesthetic, dynamic grids, glowing elements, scroll reveals, timeline animations, a 5-step registration wizard with client/server validation, full database transactions in MySQL, and an automated PDF confirmation generator.

---

## 🚀 Project Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Inline CSS theme customizations)
- **Animations**: Framer Motion
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **PDF Compiler**: html2canvas + jsPDF

### Backend
- **Framework**: Node.js + Express.js
- **Language**: TypeScript
- **Database Driver**: `mysql2/promise`
- **Security Middlewares**: Helmet, CORS, Express Rate Limit
- **Environment**: dotenv

### Database
- **Engine**: MySQL 8.0+

---

## 📁 Repository Structure

```text
mad - reg/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css          # Cyberpunk styling & theme configuration
│   │   │   ├── layout.tsx           # Global font imports & SEO metadata
│   │   │   ├── page.tsx             # Interactive high-tech landing page
│   │   │   ├── register/
│   │   │   │   └── page.tsx         # 5-step validation sign-up wizard
│   │   │   └── success/
│   │   │       └── page.tsx         # Confirmation board & PDF exporter
│   │   ├── components/
│   │   │   ├── AccordionItem.tsx    # Smooth drawer FAQ/Rules
│   │   │   ├── Countdown.tsx        # Dynamic deadline counter
│   │   │   ├── CustomCursor.tsx     # Magnetic cursor and tracking glow
│   │   │   ├── Footer.tsx           # Brand credits & socials redirects
│   │   │   ├── IntroLoader.tsx      # Entry loading screen
│   │   │   ├── Navbar.tsx           # Sticky responsive mobile menu
│   │   │   └── StatCounter.tsx      # Auto-incrementing stats badge
│   │   └── config/
│   │       └── event.ts             # Central event metadata config
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # MySQL pool connection config
│   │   │   └── event.ts             # Central event config (backend rules copy)
│   │   ├── routes/
│   │   │   └── registration.ts      # API routes (transact registration, details, stats)
│   │   └── server.ts                # Express startup, middleware configuration
│   ├── .env                         # Server environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── schema.sql                   # MySQL DB structures
│   └── seed.sql                     # Dummy testing seed script
│
└── README.md                        # Documentation
```

---

## 🛠️ Installation & Setup Instructions

### 1. Prerequisite Checklist
- **Node.js**: v18.0.0 or higher (Tested on `v26.5.0`)
- **npm**: v9.0.0 or higher (Tested on `11.17.0`)
- **MySQL Server**: 8.0.0 or higher (Running on port `3306`)

---

### 2. Database Initialization
Open your MySQL shell/CLI (or tools like MySQL Workbench / phpMyAdmin) and log in. Run the schema and seed scripts using the command line:

```bash
# Set up tables
mysql -u root -p -e "source database/schema.sql"

# Add test/seed entries (Optional)
mysql -u root -p -e "source database/seed.sql"
```

---

### 3. Backend Setup & Run
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Configure environmental settings in `backend/.env`:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hackathon_registration
   CORS_ORIGIN=http://localhost:3000
   ```
3. Run the development server (runs Nodemon with TypeScript):
   ```bash
   npm run dev
   ```

*The backend server will verify the MySQL database connection pool and start listening on port `5000`.*

---

### 4. Frontend Setup & Run
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Run the Next.js development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   **[http://localhost:3000](http://localhost:3000)**

---

## 🔌 API Endpoints Documentation

### 1. POST `/api/registrations`
Submits a complete team sign-up. Under the hood, this runs a MySQL transaction to prevent partial records if any field or unique constraints fail.
- **Payload Body**:
  ```json
  {
    "teamName": "Byte Busters",
    "track": "Web Technology",
    "problemStatement": "Developing a secure portal to manage carbon credits for small industries.",
    "technologyStack": "Next.js, TailwindCSS, Node.js, Express, MySQL",
    "leader": {
      "fullName": "Alice Johnson",
      "email": "alice.j@example.com",
      "phone": "9876543210",
      "studentId": "STU-2026-001"
    },
    "members": [
      {
        "fullName": "Bob Miller",
        "email": "bob.m@example.com",
        "phone": "9876543211",
        "studentId": "STU-2026-002"
      }
    ]
  }
  ```
- **Responses**:
  - `201 Created`: Returns `{ success: true, registrationId: "HACK-2026-00002", teamName: "Byte Busters" }`
  - `400 Bad Request`: Validation failure (duplicate email, student ID, team name, too few members, etc.)
  - `500 Internal Error`: Database transaction error.

### 2. GET `/api/registrations/:registrationId`
Fetches the complete registration summary (leader info, members array, team specifications, and timestamps).
- **Responses**:
  - `200 OK`: Returns full details.
  - `404 Not Found`: Registration ID does not exist.

### 3. GET `/api/registrations/dashboard/stats`
Analytical statistics summarizing total teams, participants, track breakdowns, and recent registrations (prepares server routing for the future admin dashboard).

---

## 🛡️ Security Implementations
- **Parameterized SQL Queries**: All database queries are fully parameterized through the `mysql2` driver, avoiding SQL Injection vulnerabilities.
- **Database Transactions**: Any signup utilizes SQL transactions (`beginTransaction`, `commit`, `rollback`) ensuring data integrity.
- **Helmet Security Headers**: Secure headers applied automatically in Express.
- **Express Rate Limiter**: Configured rate-limiting middleware (max 100 requests per 15 minutes) applied to all `/api/` endpoints to throttle robotic attacks.
- **CORS Protection**: Access to backend routes restricted to defined domain origins (`http://localhost:3000`).
# mad-reg

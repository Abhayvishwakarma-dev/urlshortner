# Shortly — URL Shortener

A lightweight and full-stack URL Shortener built with **Node.js, Express.js, MongoDB and Vanilla JavaScript**.

Shortly allows users to create short URLs from long URLs, redirect users through short links, track visitor analytics, and automatically expire short URLs after a defined period.

---

## Live Project

### Frontend

https://stellar-praline-edc1e1.netlify.app/

### Backend API

https://urlshortner-vnbg.onrender.com/

---

## Features

* Create short URLs from long URLs
* Generate unique short IDs using NanoID
* Redirect short URLs to original URLs
* Track total clicks
* Store visitor information
* Store visitor IP address
* Store visit timestamps
* Analytics dashboard
* Automatic URL expiration
* MongoDB TTL index for expired URLs
* REST API architecture
* CORS support
* Environment variable configuration
* Health-check endpoint
* Responsive frontend
* No user registration required

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Responsive Design

### Backend

* Node.js
* Express.js
* REST API
* NanoID
* CORS
* dotenv

### Database

* MongoDB
* Mongoose
* MongoDB TTL Index

### Deployment

* Frontend: Netlify
* Backend: Render
* Database: MongoDB Atlas
* Source Code: GitHub

---

# Project Architecture

```text
                    User
                     |
                     v
              +--------------+
              |   Frontend   |
              | HTML/CSS/JS  |
              +--------------+
                     |
                     | HTTP Request
                     v
              +--------------+
              |    Express   |
              |   REST API   |
              +--------------+
                     |
          +----------+----------+
          |                     |
          v                     v
   URL Controller          Redirect Handler
          |                     |
          +----------+----------+
                     |
                     v
              +--------------+
              |   MongoDB    |
              |   Database   |
              +--------------+
```

---

# How It Works

## 1. Create Short URL

User enters a long URL in the frontend.

Example:

```text
https://www.example.com/very/long/url
```

Frontend sends:

```http
POST /url
```

with:

```json
{
  "url": "https://www.example.com/very/long/url"
}
```

Backend generates a unique short ID using NanoID.

Example:

```text
2P8sVfME
```

MongoDB stores the mapping:

```text
shortId      →  redirectURL

2P8sVfME     →  https://www.example.com/very/long/url
```

The frontend displays:

```text
https://urlshortner-vnbg.onrender.com/2P8sVfME
```

---

# 2. Redirect System

When a user opens:

```text
https://urlshortner-vnbg.onrender.com/2P8sVfME
```

the backend receives:

```http
GET /2P8sVfME
```

Express extracts:

```js
req.params.shortId
```

Then MongoDB is searched:

```js
URL.findOne({
    shortId: shortId
});
```

If the short ID exists, the backend redirects the user:

```js
res.redirect(entry.redirectURL);
```

Flow:

```text
Short URL
    |
    v
Express
    |
    v
MongoDB
    |
    v
Find original URL
    |
    v
HTTP Redirect
    |
    v
Original Website
```

---

# 3. Click Analytics

Every time a valid short URL is opened, a visit record is stored in `visitHistory`.

Example:

```json
{
  "timestamp": "2026-09-27T10:30:00.000Z",
  "ip": "127.0.0.1"
}
```

Multiple visits create multiple records:

```text
visitHistory
    |
    +-- Visit 1
    +-- Visit 2
    +-- Visit 3
    +-- Visit 4
```

Total clicks are calculated using:

```js
result.visitHistory.length
```

For example:

```text
visitHistory.length = 4

Total Clicks = 4
```

---

# 4. Analytics API

To get analytics for a short URL:

```http
GET /url/analytics/:shortId
```

Example:

```http
GET /url/analytics/2P8sVfME
```

Response:

```json
{
  "totalClicks": 4,
  "analytics": [
    {
      "timestamp": "2026-09-27T10:30:00.000Z",
      "ip": "127.0.0.1"
    },
    {
      "timestamp": "2026-09-27T10:35:00.000Z",
      "ip": "127.0.0.1"
    }
  ]
}
```

The frontend displays this information in the Analytics Dashboard.

---

# 5. URL Expiration

Short URLs can automatically expire after a specified time.

The project uses:

```js
expiresAt
```

Example:

```js
const expiresAt = new Date(
    Date.now() + 60 * 60 * 1000
);
```

This means:

```text
60 minutes = 1 hour
```

MongoDB TTL is configured using:

```js
expires: 0
```

Example:

```js
expiresAt: {
    type: Date,
    required: true,
    expires: 0
}
```

MongoDB automatically removes expired documents through its TTL monitor.

The backend also checks expiration before redirecting:

```js
if (new Date() > entry.expiresAt) {
    return res.status(410).json({
        error: "Short URL has expired"
    });
}
```

This provides an application-level expiration check in addition to MongoDB's background cleanup.

---

# 6. Backend Health Check

The backend provides a health-check endpoint:

```http
GET /url/health
```

Response:

```text
App is running
```

The frontend can call this endpoint a few seconds after loading the page.

Example:

```js
setTimeout(async function () {

    try {

        const response = await fetch(
            `${API_BASE_URL}/url/health`
        );

        const data = await response.text();

        console.log("Backend:", data);

    } catch (error) {

        console.error(
            "Backend health check failed:",
            error
        );

    }

}, 5000);
```

This allows the frontend to check the backend after a short delay.

---

# API Documentation

## Create Short URL

### Endpoint

```http
POST /url
```

### Request

```json
{
  "url": "https://example.com"
}
```

### Response

```json
{
  "id": "2P8sVfME",
  "expiresAt": "2026-09-27T12:00:00.000Z"
}
```

---

## Redirect

### Endpoint

```http
GET /:shortId
```

Example:

```http
GET /2P8sVfME
```

### Result

Redirects the user to the original URL.

---

## Analytics

### Endpoint

```http
GET /url/analytics/:shortId
```

Example:

```http
GET /url/analytics/2P8sVfME
```

### Response

```json
{
  "totalClicks": 3,
  "analytics": [
    {
      "timestamp": "2026-09-27T10:30:00.000Z",
      "ip": "127.0.0.1"
    }
  ]
}
```

---

## Health Check

### Endpoint

```http
GET /url/health
```

### Response

```text
App is running
```

---

# Project Structure

```text
url/
│
├── backend/
│   │
│   ├── controllers/
│   │   └── url.js
│   │
│   ├── models/
│   │   └── url.js
│   │
│   ├── routes/
│   │   └── url.js
│   │
│   ├── connect.js
│   │
│   ├── index.js
│   │
│   ├── package.json
│   │
│   ├── package-lock.json
│   │
│   └── .gitignore
│
├── frontend/
│   └── index.html
│
└── README.md
```

---

# Backend Responsibilities

The backend handles:

* URL validation
* Short ID generation
* Database operations
* URL redirection
* Click tracking
* Visitor analytics
* URL expiration
* Health checks
* REST API
* CORS configuration

---

# Frontend Responsibilities

The frontend handles:

* URL input
* Sending API requests
* Displaying generated short URL
* Copying short URL
* Analytics input
* Analytics dashboard
* Displaying total clicks
* Displaying visitor information
* Responsive user interface

---

# Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=8001

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/short-url

FRONTEND_URL=http://localhost:5500

NETLIFY_URL=https://stellar-praline-edc1e1.netlify.app
```

Do not upload `.env` to GitHub.

Add this to `.gitignore`:

```text
.env
node_modules/
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Abhayvishwakarma-dev/urlshortner.git
```

Go into the project:

```bash
cd urlshortner
```

---

# Backend Setup

Go to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Or:

```bash
node index.js
```

Backend will run on:

```text
http://localhost:8001
```

---

# Frontend Setup

Open the frontend:

```text
frontend/index.html
```

You can run it using VS Code Live Server or another static web server.

Example:

```text
http://localhost:5500
```

The frontend automatically selects the backend according to the hostname.

Local:

```text
http://localhost:8001
```

Production:

```text
https://urlshortner-vnbg.onrender.com
```

---

# Database

This project uses MongoDB with Mongoose.

Example document:

```json
{
  "_id": "...",
  "shortId": "2P8sVfME",
  "redirectURL": "https://example.com",
  "visitHistory": [
    {
      "timestamp": "2026-09-27T10:30:00.000Z",
      "ip": "127.0.0.1"
    }
  ],
  "expiresAt": "2026-09-27T12:00:00.000Z"
}
```

---

# Security Considerations

The project uses environment variables for sensitive configuration.

Important files such as:

```text
.env
```

should never be committed to GitHub.

MongoDB credentials should also never be hardcoded in source code.

---

# CORS

The backend allows requests from configured frontend origins.

Example:

```js
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.NETLIFY_URL
];

app.use(cors({
    origin: allowedOrigins
}));
```

This allows the deployed frontend to communicate with the backend API.

---

# Deployment

## Backend

The backend can be deployed on Render.

Production backend:

```text
https://urlshortner-vnbg.onrender.com
```

Required environment variables on Render:

```text
MONGODB_URI
PORT
FRONTEND_URL
NETLIFY_URL
```

---

## Frontend

The frontend can be deployed on Netlify.

Production frontend:

```text
https://stellar-praline-edc1e1.netlify.app/
```

The frontend uses the deployed Render API when running outside localhost.

---

# Complete Request Flow

## Creating URL

```text
User
 |
 | Enter long URL
 v
Frontend
 |
 | POST /url
 v
Express API
 |
 | Generate NanoID
 v
MongoDB
 |
 | Save shortId + original URL
 v
Express
 |
 | Return short ID
 v
Frontend
 |
 | Display short URL
 v
User
```

## Opening Short URL

```text
User
 |
 | GET /2P8sVfME
 v
Express
 |
 | Find shortId
 v
MongoDB
 |
 | Get original URL
 v
Save visit analytics
 |
 v
HTTP Redirect
 |
 v
Original Website
```

## Analytics

```text
User
 |
 | Enter Short ID
 v
Frontend
 |
 | GET /url/analytics/:shortId
 v
Express
 |
 v
MongoDB
 |
 | visitHistory
 v
Analytics Response
 |
 v
Frontend Dashboard
```

---

# HTTP Status Codes

The API uses appropriate HTTP status codes.

| Status | Meaning             |
| ------ | ------------------- |
| 200    | Request successful  |
| 400    | Invalid request     |
| 404    | Short URL not found |
| 410    | Short URL expired   |
| 500    | Server error        |

---

# Future Improvements

Possible future features:

* User authentication
* User-specific URL management
* QR code generation
* Custom short URLs
* URL click charts
* Device analytics
* Browser analytics
* Country/location analytics
* Rate limiting
* URL validation
* Password-protected URLs
* API authentication
* Admin dashboard
* Redis caching
* Docker support

---

# Learning Outcomes

This project provides practical experience with:

* Node.js
* Express.js
* REST APIs
* MongoDB
* Mongoose
* CRUD operations
* HTTP request/response cycle
* URL redirection
* Dynamic routes
* Middleware
* CORS
* Environment variables
* MongoDB TTL indexes
* API integration
* Frontend and backend communication
* Deployment
* Git and GitHub

---

# Author

**Abhay Vishwakarma**

B.Tech Computer Science Engineering Student

Interested in:

* Backend Development
* MERN Stack
* Generative AI
* LLM Applications
* REST APIs
* MongoDB

GitHub:

https://github.com/Abhayvishwakarma-dev

---

# License

This project is created for learning, development, and portfolio purposes.

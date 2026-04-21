# Blog API (Backend)

A RESTful API for a blog platform supporting posts, comments, likes, follows, and notifications. Built with Node.js, Express, and PostgreSQL.

---

## Features

-  JWT Authentication
-  User Profile Management
-  Posts (CRUD + image upload)
-  Comments (Nested replies)
-  Like System
-  Follow System
-  Notification System (like, follow)
-  Pagination, Search, Sorting
-  Soft Delete

---

##  Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **File Upload:** Multer  
- **Architecture:** MVC (Route → Controller → Service)

---

## Key Features

###  Posts
- CRUD operations
- Image upload via Multer
- Pagination, search, sorting
- Ownership validation

### Comments
- Nested comments (replies)
- Tree structure transformation

### Likes
- Prevent duplicate likes
- Trigger notifications

### Follows
- Many-to-many relationship
- Composite primary key

### Notifications
- Event-driven (like, follow)
- Read/unread state
- Bulk update (mark all as read)

---

## Installation

```bash
git clone https://github.com/your-username/blog-api.git
cd blog-api
npm install

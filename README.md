# 📝 Blogify - Full-Stack Blog Application

A modern, full-featured blog application built with Node.js, Express, and MongoDB. Create, share, and engage with blog posts in a beautiful, responsive interface.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## ✨ Features

### 🔐 **Authentication & User Management**

- **User Registration** with profile image upload
- **Secure Login/Logout** with JWT tokens
- **Session Management** with 24-hour token expiration
- **Custom profile picture**

### 📖 **Blog Management**

- **Create Blog Posts** with rich text content
- **Image Upload** for blog cover images
- **View All Blogs** in a responsive card layout
- **Blog Details** with full content display
- **Author Attribution** with profile information

### 💬 **Interactive Comments**

- **Add Comments** to blog posts (authenticated users only)
- **Comment Threading** with user avatars
- **Author Badges** for blog creators in comments
- **Real-time Comment Count** display

### 🎨 **User Experience**

- **Responsive Design** for mobile, tablet, and desktop
- **Modern UI** with Bootstrap 5
- **Image Preview** during upload
- **Error Handling** with user-friendly messages
- **Loading States** and visual feedback

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/GitWitAnish/Blog-App.git
   cd Blog-App
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up MongoDB**

   - Make sure MongoDB is running locally on `mongodb://localhost:27017`
   - Or update the connection string in `index.js` for your database

4. **Create uploads directory**

   ```bash
   mkdir -p public/uploads/profiles
   ```

5. **Start the application**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

6. **Open your browser**
   - Visit `http://localhost:8000`
   - Start creating your blog!

## 📁 Project Structure

```
Blog-App/
├── 📂 middlewares/
│   └── authentication.js       # JWT authentication middleware
├── 📂 models/
│   ├── blog.js                 # Blog post schema
│   ├── comment.js              # Comment schema (separate model)
│   └── user.js                 # User schema with authentication
├── 📂 public/
│   ├── 📂 images/
│   │   └── avatar.jpg          # Default user avatar
│   └── 📂 uploads/
│       └── 📂 profiles/        # User profile pictures
├── 📂 routes/
│   ├── blog.js                 # Blog and comment routes
│   └── user.js                 # Authentication routes
├── 📂 services/
│   └── authentication.js      # JWT token creation/verification
├── 📂 views/
│   ├── 📂 partials/
│   │   ├── head.ejs           # HTML head section
│   │   ├── nav.ejs            # Navigation bar
│   │   └── scripts.ejs        # JavaScript imports
│   ├── 404.ejs                # Error page
│   ├── addBlog.ejs           # Blog creation form
│   ├── blogDetails.ejs       # Blog post display
│   ├── home.ejs              # Homepage with blog list
│   ├── signin.ejs            # Login form
│   └── signup.ejs            # Registration form
├── .gitignore
├── index.js                   # Main application entry point
├── package.json
└── README.md
```

## 🛠️ Technology Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Cookie Parser** - Cookie parsing middleware

### Frontend

- **EJS** - Embedded JavaScript templating
- **Bootstrap 5** - CSS framework
- **Vanilla JavaScript** - Client-side interactions

### Security & Features

- **Password Hashing** with crypto module
- **File Upload Validation** (size, type)
- **XSS Protection** with proper templating
- **Session Management** with JWT expiration
- **Error Handling** throughout the application

## 🔧 Configuration

### Environment Variables 

Create a `.env` file for production configurations:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blogify

# JWT
JWT_SECRET=your-super-secret-key-here

# Server
PORT=8000

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### Database Configuration

The app automatically creates the `blogify` database and required collections on first run.

## 📝 API Routes

### Authentication Routes

- `GET /user/signup` - Registration page
- `POST /user/signup` - Create new user account
- `GET /user/signin` - Login page
- `POST /user/signin` - User authentication
- `GET /user/logout` - Logout and clear session

### Blog Routes

- `GET /` - Homepage with all blogs
- `GET /blog/add` - Create new blog page (auth required)
- `POST /blog/add` - Submit new blog post (auth required)
- `GET /blog/:id` - View specific blog post
- `POST /blog/:id/delete` - Delete blog post (author only)

### Comment Routes

- `POST /blog/comment/:blogId` - Add comment (auth required)

## 👤 User Features

### For Visitors

- ✅ View all blog posts
- ✅ Read full blog content and comments
- ✅ Register for new account
- ✅ Login to existing account

### For Authenticated Users

- ✅ All visitor features
- ✅ Create new blog posts with images
- ✅ Add comments to any blog post
- ✅ Upload custom profile picture
- ✅ See personalized navigation
- ✅ Delete own blog posts (future feature)

### For Blog Authors

- ✅ Special "Author" badge in comments
- ✅ Author attribution on blog posts
- ✅ Profile display in blog details


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature`)
5. Open a Pull Request

### Future Enhancements

- [ ] **User Profiles** - Dedicated profile pages
- [ ] **Blog Editing** - Edit existing blog posts
- [ ] **Comment Replies** - Nested comment threading
- [ ] **Search & Filter** - Find blogs by title, author, or content
- [ ] **Categories & Tags** - Organize blogs by topics
- [ ] **Like System** - Like blogs and comments
- [ ] **Admin Dashboard** - Manage users and content
- [ ] **Email Notifications** - Notify users of new comments
- [ ] **Social Sharing** - Share blogs on social media
- [ ] **Rich Text Editor** - WYSIWYG blog editor

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Anish** - [@GitWitAnish](https://github.com/GitWitAnish)

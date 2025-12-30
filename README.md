# <img src="client/src/assets/logo1.png" alt="Logo" width="50" height="50" style="vertical-align: middle;"/> DSA Playground 🚀

A comprehensive Data Structures and Algorithms visualization platform with interactive visualizers for learning and practicing DSA concepts. This project combines a modern React frontend with a robust Express backend to provide an engaging learning experience.

## ✨ Features

- **Interactive Visualizers**: Visual representations of popular data structures and algorithms
  - Sorting Algorithms (Bubble Sort, Quick Sort, Merge Sort, etc.)
  - Binary Search Trees
  - Graphs (DFS, BFS, and more)
  - Stacks and Queues
  - Linked Lists (Single & Doubly)
  - Recursion
  
- **Creative Space (Whiteboard)**: Digital canvas for learning and note-taking
  - Drawing mode with customizable colors and brush sizes
  - Note-taking mode with rich text editor
  - Save and load functionality for drawings and notes
  - History sidebar to manage and organize saved work
  - Eraser tool for corrections

- **Dark/Light Mode**: Theme toggle for comfortable viewing experience

- **User Authentication**: Secure login/signup system with JWT authentication
- **Striver's SDE Sheet**: Integrated problem-solving tracker
- **Responsive Design**: Works seamlessly across different devices
- **Real-time Animations**: Step-by-step execution of algorithms

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v4.4 or higher)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tharunkunamalla/Dsa-playground.git
   cd Dsa-playground
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for the root, client, and server directories.

## ⚙️ Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   
   Edit the `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/DSA_Visualiser
   JWT_SECRET=your-secret-key-here
   ```

3. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS/Linux
   sudo systemctl start mongod
   
   # Or using homebrew on macOS
   brew services start mongodb-community
   ```

## 🏃 Running the Application

### Development Mode

**Run both client and server concurrently:**
```bash
npm start
```

**Run only the server:**
```bash
npm run server
```

**Run only the client:**
```bash
npm run client
```

The application will be available at:
- Frontend: `http://localhost:5173` (Vite default port)
- Backend API: `http://localhost:5000`

### Production Mode

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server:**
   ```bash
   cd server
   npm start
   ```

## 📁 Project Structure

```
Dsa-playground/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (Auth, etc.)
│   │   ├── pages/         # Page components
│   │   ├── visualizers/   # DSA visualizer components
│   │   │   ├── Sorting/
│   │   │   ├── Tree/
│   │   │   ├── Graph/
│   │   │   ├── Stack/
│   │   │   ├── Queue/
│   │   │   ├── LinkedList/
│   │   │   ├── DLL/
│   │   │   └── Recursion/
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── server.js          # Server entry point
│   └── package.json
├── module/                 # Shared modules
├── package.json           # Root package.json
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🎮 Available Visualizers

1. **Sorting Algorithms** - Visualize various sorting techniques
2. **Binary Search Trees** - Interactive BST operations
3. **Graph Algorithms** - Graph traversal and algorithms
4. **Stack Operations** - Push, pop, and peek operations
5. **Queue Operations** - Enqueue and dequeue operations
6. **Linked Lists** - Singly linked list operations
7. **Doubly Linked Lists** - DLL operations
8. **Recursion** - Recursive algorithm visualization

## 🎨 Additional Features

### Creative Space (Whiteboard)
A dedicated workspace for brainstorming and note-taking:
- **Drawing Canvas**: Freehand drawing with color picker and adjustable brush sizes
- **Notes Editor**: Write and organize your thoughts and problem-solving notes
- **Save & Load**: Persist your work with custom titles for easy retrieval
- **History Management**: Access previously saved drawings and notes
- **Dual Mode**: Switch seamlessly between drawing and note-taking

### Theme Customization
- Toggle between light and dark modes for comfortable viewing
- Theme preference saved across sessions

## 🧪 Testing

```bash
# Run client linter
cd client
npm run lint

# Run server tests (when available)
cd server
npm test
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run both client and server concurrently |
| `npm run client` | Run only the frontend |
| `npm run server` | Run only the backend |
| `npm run install-all` | Install all dependencies |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Tharun Kunamalla**
- GitHub: [@Tharunkunamalla](https://github.com/Tharunkunamalla)

## 🙏 Acknowledgments

- Inspired by various DSA visualization tools
- Built with modern web technologies
- Community contributions and feedback

---

⭐ If you find this project helpful, please consider giving it a star!

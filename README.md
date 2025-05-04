
# FeedHub Dashboard

A modern, responsive dashboard application that allows users to manage and interact with aggregated content from various social media platforms.

![FeedHub Dashboard](https://via.placeholder.com/800x400?text=FeedHub+Dashboard)

## 📋 Overview

FeedHub Dashboard is a powerful web application that aggregates content from platforms like Twitter and Reddit, allowing users to browse, save, and interact with content from a single interface. Built with modern web technologies, it offers a seamless, intuitive user experience with a credit-based system.

## ✨ Features

- **User Authentication**: Secure signup and login system
- **Personalized Feed**: Curated content from Twitter and Reddit
- **Credit System**: Earn and spend credits for premium features
- **Content Management**: Save, report, and manage feed items
- **Responsive Design**: Optimized for desktop and mobile devices
- **User Profile**: Manage personal information and preferences
- **Admin Dashboard**: For platform management (admin users only)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd feed-hub-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [React Query](https://tanstack.com/query) - Data fetching
- [React Router](https://reactrouter.com/) - Navigation
- [Recharts](https://recharts.org/) - Data visualization

## 📦 Project Structure

```
feed-hub-dashboard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Application pages
│   ├── services/       # Service layer for API calls
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── ...                 # Config files
```

## 👥 User Roles

- **User**: Regular users who can browse feeds, save content, and manage their profiles
- **Admin**: Administrators with access to platform management features

## 📊 Credit System

Users start with 10 credits upon registration. Credits can be:
- Earned through platform engagement
- Used for premium features and content
- Managed in the Credits section

## 🔒 Authentication

The application uses a secure authentication system with:
- Email/password signup and login
- Persistent sessions via local storage
- Role-based access control

## 🎨 UI/UX Features

- Dark mode support
- Responsive layout optimized for all device sizes
- Interactive dashboards with real-time updates
- Intuitive navigation system

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run linting checks

### Adding New Features

When adding new features:
1. Create components in the appropriate directory
2. Update types if necessary
3. Add services for any API integration
4. Update the relevant context providers

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [https://github.com/yourusername/feed-hub-dashboard](https://github.com/yourusername/feed-hub-dashboard)

---

Built with ❤️ using [Lovable](https://lovable.dev)

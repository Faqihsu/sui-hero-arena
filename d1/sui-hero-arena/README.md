# Sui Hero Arena - Workshop Ready dApp

A modular, workshop-ready React frontend for interacting with Sui Move smart contracts. This application demonstrates NFT minting, training, and transfer functionality with a clean, maintainable architecture.

## 🏗️ Architecture

### Modular Structure
```
src/
├── components/          # Reusable UI components
│   ├── HeroCard.tsx     # Individual hero display
│   ├── MintForm.tsx      # Hero creation form
│   ├── Navigation.tsx     # Tab navigation
│   ├── TransferModal.tsx  # Transfer confirmation
│   ├── HeroCollection.tsx # Hero grid display
│   ├── TrainingLogs.tsx   # Activity log display
│   └── index.ts          # Component exports
├── hooks/               # Custom React hooks
│   ├── useHeroes.ts       # Hero state management
│   ├── useTransfer.ts      # Transfer state management
│   └── index.ts          # Hook exports
├── services/            # External service integrations
│   └── geminiService.ts   # AI service for content
├── types/               # TypeScript type definitions
│   └── index.ts          # Type exports
├── constants/           # Application constants
│   └── index.tsx         # Constants and icons
├── App.tsx              # Main application component
└── index.tsx            # Application entry point
```

## 🎯 Key Features

### Component-Based Architecture
- **HeroCard**: Reusable hero display with training and transfer actions
- **MintForm**: AI-powered hero creation with form validation
- **Navigation**: Tab-based navigation system
- **TransferModal**: Two-step transfer confirmation process
- **HeroCollection**: Grid layout for hero management
- **TrainingLogs**: Activity tracking and history

### Custom Hooks
- **useHeroes**: Centralized hero state and operations
- **useTransfer**: Transfer modal state management

### Service Integration
- **Gemini AI Service**: Content generation for backstories and training narratives
- **Type Safety**: Full TypeScript integration

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Gemini API key (for AI features)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd sui-hero-arena

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Gemini API key to .env.local
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Customization
The application is designed to be easily customizable:

1. **Theme**: Modify CSS variables in `index.html`
2. **API Endpoints**: Update service files for different backends
3. **Hero Classes**: Extend the `HeroClass` enum in `types/index.ts`
4. **Constants**: Update game balance values in `constants/index.tsx`

## 📚 Workshop Integration

This frontend is designed to work seamlessly with the Sui Move workshop:

### Module Integration
- **Module 1**: Basic React and state management
- **Module 2**: Component composition and props
- **Module 3**: Custom hooks and state patterns
- **Module 4**: Service integration and async handling
- **Module 5**: TypeScript and type safety

### Learning Objectives
Participants will learn:
- React component architecture
- State management patterns
- Service integration
- TypeScript best practices
- Modular development
- UI/UX design patterns

## 🎨 Design System

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Glass Morphism**: Modern frosted glass effects
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions

### Component Patterns
- **Compound Components**: Composable UI elements
- **Render Props**: Flexible component customization
- **State Lifting**: Proper state management
- **Error Boundaries**: Graceful error handling

## 🔌 Features

### Hero Management
- **Minting**: AI-powered hero creation
- **Training**: Experience and leveling system
- **Transfer**: Secure ownership transfer
- **Collection**: Grid-based hero display

### User Experience
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Confirmation Dialogs**: Prevent accidental actions
- **Responsive Design**: Works on all devices

## 🛠️ Development Guidelines

### Code Organization
- **Single Responsibility**: Each component has one clear purpose
- **Reusable Components**: Build once, use everywhere
- **Custom Hooks**: Extract complex state logic
- **Type Safety**: Full TypeScript coverage

### Best Practices
- **Consistent Naming**: Clear, descriptive names
- **File Structure**: Logical organization
- **Import Paths**: Relative imports for maintainability
- **Error Handling**: Graceful degradation

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Responsive design works on all devices
- **Progressive Enhancement**: Core functionality works everywhere

## 🔍 Debugging

### Development Tools
- **React DevTools**: Component inspection and debugging
- **Network Tab**: API request monitoring
- **Console Logging**: Structured error reporting
- **Type Checking**: Full TypeScript validation

## 🚀 Deployment

### Build Process
```bash
# Build optimized production bundle
npm run build

# Files are output to dist/ directory
# Ready for static hosting
```

### Hosting Options
- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment
- **GitHub Pages**: Free static hosting
- **Custom**: Any static file hosting

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

### Code Standards
- **ESLint**: Consistent code style
- **Prettier**: Automatic formatting
- **TypeScript**: Strict type checking
- **Comments**: Clear documentation

## 📄 License

MIT License - feel free to use this code for learning and development.

## 🆘 Support

For workshop support and questions:
- Check the workshop documentation
- Review the Move modules
- Ask instructors for guidance
- Use browser dev tools for debugging

---

This frontend application provides a solid foundation for learning Sui Move development while demonstrating modern React best practices and modular architecture.

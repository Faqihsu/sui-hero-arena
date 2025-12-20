# Sui Hero Arena - Workshop Ready dApp

A modular, workshop-ready React frontend for interacting with Sui Move smart contracts. This application demonstrates NFT minting, training, and transfer functionality with a clean, maintainable architecture using TanStack React Query and Sui dApp Kit.

## 🏗️ Architecture

### Modular Structure
```
src/
├── components/          # Reusable UI components
│   ├── HeroCard.tsx     # Individual hero display
│   ├── MintForm.tsx     # Hero creation form
│   ├── Navigation.tsx   # Tab navigation
│   ├── TransferModal.tsx # Transfer confirmation
│   ├── HeroCollection.tsx # Hero grid display
│   ├── TrainingLogs.tsx  # Activity log display
│   ├── Toast.tsx        # Toast notifications
│   ├── WalletConnect.tsx # Wallet connection
│   ├── Button.tsx       # Reusable button component
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   ├── useHeroes.ts     # Hero data fetching with React Query
│   ├── useMintHero.ts   # Hero minting mutation
│   ├── useTrainHero.ts  # Hero training mutation
│   ├── useTransferHero.ts # Hero transfer mutation
│   ├── useTransfer.ts   # Transfer modal state
│   ├── useToast.ts      # Toast notification state
│   └── index.ts         # Hook exports
├── config/              # Configuration files
│   └── contract.ts      # Smart contract configuration
├── types/               # TypeScript type definitions
│   └── index.ts         # Type exports
├── constants/           # Application constants
│   └── index.tsx        # Constants and icons
├── App.tsx              # Main application component
└── index.tsx            # Application entry point
```

## 🎯 Key Features

### Component-Based Architecture
- **HeroCard**: Reusable hero display with training and transfer actions
- **MintForm**: Hero creation form with validation (name, class, image URL, attack, defense)
- **Navigation**: Tab-based navigation system
- **TransferModal**: Two-step transfer confirmation process with loading states
- **HeroCollection**: Grid layout for hero management
- **TrainingLogs**: Activity tracking and history
- **Toast**: Success/error notifications for all transactions
- **WalletConnect**: Sui wallet connection using dApp Kit

### Custom Hooks
- **useHeroes**: Hero data fetching using `useSuiClientQuery` with automatic refetching
- **useMintHero**: Hero minting mutation with React Query
- **useTrainHero**: Hero training mutation with React Query
- **useTransferHero**: Hero transfer mutation with React Query
- **useTransfer**: Transfer modal state management
- **useToast**: Toast notification state management

### Technology Stack
- **TanStack React Query**: Data fetching, caching, and state management
- **Sui dApp Kit**: Wallet integration and blockchain interactions
- **TypeScript**: Full type safety throughout the application
- **Real-time Updates**: Automatic data refetching after transactions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Sui wallet (Sui Wallet extension or compatible wallet)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd sui-hero-arena

# Install dependencies
npm install

# Configure contract
# Update src/config/contract.ts with your deployed contract package ID
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

### Contract Configuration
Update `src/config/contract.ts` with your deployed contract details:
```typescript
export const CONTRACT_CONFIG = {
  PACKAGE_ID: '0x...', // Your deployed package ID
  MODULE_NAME: 'hero',  // Your module name
};
```

### Customization
The application is designed to be easily customizable:

1. **Theme**: Modify CSS variables in `index.html`
2. **Network**: Change default network in `index.tsx` (testnet/mainnet/localnet)
3. **Hero Classes**: Extend the `HeroClass` enum in `types/index.ts`
4. **Constants**: Update game balance values in `constants/index.tsx`
5. **Stats Range**: Modify attack/defense validation in `MintForm.tsx` (currently 1-100)

## 📚 Workshop Integration

This frontend is designed to work seamlessly with the Sui Move workshop:

### Module Integration
- **Module 1**: Basic React and state management
- **Module 2**: Component composition and props
- **Module 3**: Custom hooks and React Query patterns
- **Module 4**: Sui blockchain integration with dApp Kit
- **Module 5**: TypeScript and type safety
- **Module 6**: Transaction handling and real-time updates

### Learning Objectives
Participants will learn:
- React component architecture with hooks
- TanStack React Query for data fetching and caching
- Sui dApp Kit integration for wallet and transactions
- Transaction building with Sui Transaction API
- Real-time data updates after blockchain transactions
- TypeScript best practices
- Modular development patterns
- UI/UX design with loading states and notifications

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
- **Minting**: Create heroes with custom name, class, image URL, attack (1-100), and defense (1-100)
- **Training**: Train heroes to increase their level
- **Transfer**: Secure ownership transfer to other addresses
- **Collection**: Grid-based hero display with real-time updates

### User Experience
- **Loading States**: Visual loading indicators on all action buttons
- **Toast Notifications**: Success/error notifications for all transactions
- **Real-time Updates**: Automatic data refetching after transactions (immediate + backup refetch)
- **Error Handling**: User-friendly error messages with toast notifications
- **Confirmation Dialogs**: Two-step transfer confirmation to prevent accidental actions
- **Responsive Design**: Works on all devices with mobile-first approach
- **Wallet Integration**: Seamless Sui wallet connection using dApp Kit

## 🛠️ Development Guidelines

### Code Organization
- **Single Responsibility**: Each component has one clear purpose
- **Reusable Components**: Build once, use everywhere
- **Custom Hooks**: Extract complex state logic and data fetching
- **React Query**: Centralized data fetching and caching
- **Type Safety**: Full TypeScript coverage

### Best Practices
- **Consistent Naming**: Clear, descriptive names
- **File Structure**: Logical organization with clear separation of concerns
- **Path Aliases**: Use `@/` alias for cleaner imports
- **Error Handling**: Graceful degradation with user-friendly messages
- **Loading States**: Always show loading indicators during async operations
- **Real-time Updates**: Automatic refetching after mutations for immediate UI updates

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

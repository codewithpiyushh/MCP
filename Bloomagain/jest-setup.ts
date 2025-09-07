import '@testing-library/jest-native/extend-expect';

// Mock Descope SDK
jest.mock('@descope/react-native-sdk', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({
    session: null,
    clearSession: jest.fn(),
    manageSession: jest.fn(),
  }),
  useDescope: () => ({
    logout: jest.fn(),
  }),
  useFlow: () => ({
    start: jest.fn(),
  }),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: ({ children }: { children: React.ReactNode }) => children,
  Redirect: ({ href }: { href: string }) => null,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Video: () => null,
  ResizeMode: {
    COVER: 'cover',
  },
}));

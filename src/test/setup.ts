// Mock MMKV for tests
jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    getAllKeys: jest.fn(() => []),
  })),
}));

// Silence console warnings in tests
const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("Require cycle")) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

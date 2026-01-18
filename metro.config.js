const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Fix for "Cannot use 'import.meta' outside a module" error on web
// Prioritize CommonJS modules over ESM to bypass import.meta checks
// See: https://github.com/expo/expo/issues/30323
config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
];

module.exports = withNativeWind(config, { input: "./src/global.css" });

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          // Transform import.meta for web compatibility
          // See: https://github.com/expo/expo/issues/30323
          unstable_transformImportMeta: true,
        },
      ],
    ],
  };
};

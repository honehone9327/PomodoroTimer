// mobile-app/metro.config.js
const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const defaultConfig = getSentryExpoConfig(__dirname);

// 'shared' ディレクトリへの絶対パスを追加
defaultConfig.watchFolders = [
  path.resolve(__dirname, '../shared'),
];

// nodeModulesPaths を設定して、親ディレクトリの node_modules を認識させる
defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../node_modules'), // プロジェクトのルートにある node_modules
];

// エイリアスの設定（必要に応じて）
defaultConfig.resolver.extraNodeModules = {
  "@shared": path.resolve(__dirname, '../shared'),
};

module.exports = defaultConfig;
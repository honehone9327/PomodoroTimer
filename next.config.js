// next.config.js

const { i18n } = require('./next-i18next.config')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  i18n,
  // 他のNext.jsの設定があればここに追加
})

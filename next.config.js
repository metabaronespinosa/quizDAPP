/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')([
  '@mui/material',
  'clsx',
  'tss-react'
])

module.exports = withTM({
  reactStrictMode: true
})

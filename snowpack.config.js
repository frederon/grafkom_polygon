// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

export default {
  plugins: [
    [
      '@snowpack/plugin-webpack',
      {},
    ],
    ['snowpack-plugin-glslify', { "compress": false }]
  ],
  exclude: ['**/.git/**/*']
}
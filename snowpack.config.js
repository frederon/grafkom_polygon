// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

export default {
  plugins: [
    [
      '@snowpack/plugin-webpack',
      {},
    ],
    ['snowpack-plugin-glslify', { "compress": false }],
    ['@snowpack/plugin-typescript']
  ],
  exclude: ['**/.git/**/*'],
  buildOptions: {
    out: "_build"
  },
  optimize: {
    bundle: true,
    minify: true,
    sourcemap: false
  }
}
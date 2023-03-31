import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    file: './dist/to-tailwind.js',
    format: 'cjs'
  },
  plugins: [babel({ exclude: './node_modules/**' })]
}
// webpack.config.cjs
const path = require('path');

module.exports = {
    entry: './public/random.js', //  relative path
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'), // Output directory
    },
    mode: 'development', // Added mode
};

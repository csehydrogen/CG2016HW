module.exports = {
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.(frag|vert|txt)$/, loader: "raw" },
      { test: /\.json$/, loader: "json" },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: { presets: ['es2015'] }
      }
    ]
  }
};

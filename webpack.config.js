const path = require("path"); // Importar módulo path para resolver caminhos

module.exports = {
  mode: "production", // Habilitar modo de desenvolvimento
  entry: "./frontend/main.js", // Arquivo de entrada
  output: {
    path: path.resolve(__dirname, "public", "assets", "js"), // Caminho de saída
    filename: "bundle.js", // Nome do bundle
  },
  module: {
    rules: [
      {
        exclude: /node_modules/, // Ignorar a pasta node_modules
        test: /\.js$/, // Analisar arquivos .js
        use: {
          loader: "babel-loader", // Usar Babel para transpilar
          options: {
            presets: ["@babel/env"], // Configuração do Babel
          },
        },
      },
    ],
  },
  devtool: "source-map", // Configuração global para source maps no Webpack
};

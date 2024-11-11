// Importando o Express com ES6 Modules
import express from "express";
// Iniciando o Express na variável app
const app = express();
// Importando o Sequelize (com os dados da conexão)
import connection from "./config/sequelize-config.js";
// Importando os Controllers (onde estão as rotas)
import ClientesController from "./controllers/ClientesController.js";
import ProdutosController from "./controllers/ProdutosController.js";
import PedidosController from "./controllers/PedidosController.js";
import UsersController from "./controllers/UsersController.js";
// Importando o gerador de sessões do express
import session from "express-session"
// Importando o middleware Auth
import Auth from "./middleware/Auth.js"
// Importando o express flash
import flash from "express-flash"
// Configurar as flash messages
app.use(flash())

// Configurando o express-session
app.use(session({
  secret: "lojasecret",
  cookie: {maxAge: 3600000}, // Sessão expira em 1 hora
  saveUninitialized: false,
  resave: false
}))

// Permite capturar dados vindo de formulários
app.use(express.urlencoded({extended: false}))

// Realizando a conexão com o banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados feita com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

// Criando o banco de dados se ele não existir
connection.query(`CREATE DATABASE IF NOT EXISTS loja;`).then(() => {
  console.log("O banco de dados está criado.");
}).catch((error) => {
    console.log(error)
});

// Define o EJS como Renderizador de páginas
app.set("view engine", "ejs");
// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static("public"));

// Definindo o uso das rotas dos Controllers
app.use("/", ClientesController);
app.use("/", ProdutosController);
app.use("/", PedidosController);
app.use("/", UsersController);

// ROTA PRINCIPAL
app.get("/", Auth, function (req, res) {
  res.render("index", {
    messages: req.flash()
  });
});

// INICIA O SERVIDOR NA PORTA 8080
app.listen(8080, function (erro) {
  if (erro) {
    console.log("Ocorreu um erro!");
  } else {
    console.log("Servidor iniciado com sucesso!");
  }
});

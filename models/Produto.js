import Sequelize from "sequelize";
import { connection } from "../config/sequelize-config.js";

const Produto = connection.define("produtos", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preco: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  estoque: {
    type: Sequelize.INTEGER,
    allowNull: false,  // O campo 'estoque' não pode ser nulo
  },
  categoria: {
    type: Sequelize.STRING,
    allowNull: false,  // Certifique-se de que a categoria seja obrigatória também
  }
});

Produto.sync({ alter: true }).then(() => {
  console.log("Tabela de Produtos sincronizada.");
}).catch((error) => {
  console.log("Erro ao sincronizar tabela de Produtos: ", error);
});

export default Produto;

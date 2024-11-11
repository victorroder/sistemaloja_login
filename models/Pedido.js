import Sequelize from "sequelize";
import { connection } from "../config/sequelize-config.js";

const Pedido = connection.define("pedidos", {
  numero: {
    type: Sequelize.STRING,
    allowNull: false,  // Não pode ser nulo
  },
  valor: {
    type: Sequelize.FLOAT,
    allowNull: false,  // Não pode ser nulo
  },
});

Pedido.sync({ alter: true }).then(() => {
  console.log("Tabela de Pedidos sincronizada.");
}).catch((error) => {
  console.log("Erro ao sincronizar tabela de Pedidos: ", error);
});

export default Pedido;

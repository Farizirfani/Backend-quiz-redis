import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "sql.freedb.tech",
  port: 3306,
  username: "freedb_farizirfani",
  password: "zDw&Hx2?Ex#!95k",
  database: "freedb_fullstack_db",
});

export default sequelize;

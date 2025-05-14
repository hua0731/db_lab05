// orm.js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('university_db', 'root', '930731', {
  host: 'localhost',
  dialect: 'mariadb'
});

// 測試連線是否成功
sequelize.authenticate()
  .then(() => {
    console.log('連線成功！');
  })
  .catch((err) => {
    console.error('連線失敗：', err);
  });

module.exports = { sequelize, DataTypes };

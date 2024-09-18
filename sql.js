const mysql = require('mysql2');
const fs = require('fs');

// Função para criar a tabela e inserir os dados do JSON para o MySQL
async function jsonToMysql(jsonFilePath) {
  // Configuração de conexão com o banco de dados
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Substitua pelo seu usuário MySQL
    password: 'ifpb',  // Substitua pela sua senha MySQL
    database: 'mac_db'    // Nome do banco de dados
  });

  // SQL para criar a tabela se ela não existir
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS mac_addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mac VARCHAR(20) NOT NULL,
      fabricante VARCHAR(255) NOT NULL
    );
  `;

  // Criando a tabela
  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Erro ao criar a tabela:', err);
      connection.end();
      return;
    }
    console.log('Tabela criada ou já existe.');

    // Leitura do arquivo JSON
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        return;
      }

      const macAddresses = JSON.parse(data);

      // Loop pelos dados e inserção no banco de dados
      macAddresses.forEach((entry) => {
        const mac = entry.mac;
        const fabricante = entry.fabricante;

        // Comando SQL para inserção
        const insertQuery = 'INSERT INTO mac_addresses (mac, fabricante) VALUES (?, ?)';
        connection.query(insertQuery, [mac, fabricante], (error, results) => {
          if (error) {
            console.error('Erro ao inserir dados no MySQL:', error);
          } else {
            console.log(`MAC ${mac} inserido com sucesso!`);
          }
        });
      });

      // Fechando a conexão após todas as inserções
      connection.end();
    });
  });
}

// Chamada da função com o caminho para o arquivo JSON
const jsonFilePath = '/home/ifpb/dw/Projeto-Dw/codes/data/dispositivos.json';  // Caminho do arquivo JSON
jsonToMysql(jsonFilePath);

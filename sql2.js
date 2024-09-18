const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Função para criar a tabela e inserir os dados do JSON para o SQLite
async function jsonToSqlite(jsonFilePath) {
  // Conectar ao banco de dados SQLite (cria o arquivo 'mac_addresses.db' se não existir)
  const db = new sqlite3.Database('mac_addresses.db', (err) => {
    if (err) {
      console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
      console.log('Conectado ao banco de dados SQLite.');
    }
  });

  // SQL para criar a tabela se ela não existir
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS mac_addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mac TEXT NOT NULL,
      fabricante TEXT NOT NULL
    );
  `;

  // Criar a tabela
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela:', err.message);
    } else {
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
          const insertQuery = `INSERT INTO mac_addresses (mac, fabricante) VALUES (?, ?)`;
          db.run(insertQuery, [mac, fabricante], (err) => {
            if (err) {
              console.error('Erro ao inserir dados no SQLite:', err.message);
            } else {
              console.log(`MAC ${mac} inserido com sucesso!`);
            }
          });
        });

        // Fechar a conexão após todas as inserções
        db.close((err) => {
          if (err) {
            console.error('Erro ao fechar o banco de dados:', err.message);
          } else {
            console.log('Conexão ao banco de dados SQLite fechada.');
          }
        });
      });
    }
  });
}

// Chamada da função com o caminho para o arquivo JSON
const jsonFilePath = '/home/ifpb/dw/Projeto-Dw/codes/data/dispositivos.json';  // Caminho do arquivo JSON
jsonToSqlite(jsonFilePath);

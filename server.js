const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// Define o diretório de arquivos estáticos (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

const filePath = 'enviroments.json';

  // Lendo o arquivo JSON
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo JSON:', err);
      return;
    }
    
    try {
      // Parseando o conteúdo do arquivo como JSON
      returnSitesFromsheet = JSON.parse(data);
      console.log(returnSitesFromsheet);
      // Agora você pode trabalhar com os dados JSON
    } catch (err) {
      console.error('Erro ao fazer o parse do JSON:', err);
    }
});

function buscarUsuario(nome) {
  for (const item of returnSitesFromsheet) {
      if (item.name === nome) {
          // Se encontrar uma correspondência, retorna userId e authToken
          return { userId: item.userId, authToken: item.authToken };
      }
  }
  // Se não encontrar uma correspondência, retorna null
  return null;
}



// Rota de API para obter a mensagem
app.get('/api/message', async (req, res) => {
  try {
    const site = req.headers['x-status-filter'];
    const resultado = buscarUsuario(site);
    console.log(resultado)

    const apiUrl = `${site}/api/v1/users.list`;
    let allUsers = [];
    let offset = 0;
    const pageSize = 100;
    const headers = {
      'X-Auth-Token': resultado.authToken,
      'X-User-Id': resultado.userId,
    };

    let response = await axios.get(apiUrl, {
      headers,
      params: { offset, count: pageSize },
    });

    const total = response.data.total || 0;
    allUsers = response.data.users;

    while (offset + pageSize < total) {
      offset += pageSize;
      response = await axios.get(apiUrl, {
        headers,
        params: { offset, count: pageSize },
      });
      allUsers = allUsers.concat(response.data.users);
    }

    // console.log("Todos os usuários:", allUsers);
    res.json({ users: allUsers, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter dados da API' });
  }
});

// Rota para servir a página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

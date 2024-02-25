const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT || 3000;

// Define o diretório de arquivos estáticos (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Rota de API para obter a mensagem
app.get('/api/message', async (req, res) => {
  const apiUrl = `https://sapios.chat/api/v1/users.list`;
  let allUsers = [];
  let offset = 0;
  const pageSize = 100;
  const headers = {
    'X-Auth-Token': "fk3Pv_oL3_tr2R48vxFIOPrRuafex1EIGkEfeEszKIq",
    'X-User-Id': "KM3EgkBEHsXiRAbKt",
  };

  try {
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

    console.log("Todos os usuários:", allUsers);
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

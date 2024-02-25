const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require("axios")

// Mensagem a ser enviada para o frontend
// const messageToSend = "Olá, mundo! Esta é a mensagem do servidor.";

// Rota de API para obter a mensagem
// app.get('/api/message', (req, res) => {
//   res.json({ message: messageToSend });
// });

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
      let response;
      do {
          response = await axios.get(apiUrl, {
              headers,
              params: { offset, count: response?.data?.total || pageSize },
          });

          allUsers = allUsers.concat(response.data.users);
          offset += pageSize;

      } while (offset < response?.data?.total);
      console.log("teste",allUsers)

      res.json({ users: allUsers, total: response?.data?.total });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao obter dados da API' });
  }
});

// Rota para servir a página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

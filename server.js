const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// Define o diretório de arquivos estáticos (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

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


app.get('/api/lincenseUsers', async (req, res) => {
  let response;
  let lincenseUsers


  try {
    const site = req.headers['x-status-filter'];
    const resultado = buscarUsuario(site);
    const headers = {
      'X-Auth-Token': resultado.authToken,
      'X-User-Id': resultado.userId,
  };
    const getRoles = `${site}/api/v1/licenses.maxActiveUsers`;
      response = await axios.get(getRoles, {
          headers
      });
      lincenseUsers = response.data;
      console.log(lincenseUsers)

      res.status(200).json({ message: 'Sucesso', lincenseUsers }); 
  } catch (error) {
      console.error('Erro ao obter dados da API:', error.message);
  }
});


app.get('/api/rolesList', async (req, res) => {
  let response;
  let allRoles

  try {
    const site = req.headers['x-status-filter'];
    const resultado = buscarUsuario(site);
    const getRoles = `${site}/api/v1/roles.list`;

    const headers = {
      'X-Auth-Token': resultado.authToken,
      'X-User-Id': resultado.userId,
    };
  
          response = await axios.get(getRoles, {
              headers
          });
          allRoles = response.data.roles;
          // console.log(allRoles)
      res.status(200).json({ message: 'Sucesso', allRoles }); 
  } catch (error) {
      console.error('Erro ao obter dados da API:', error.message);
  }
});

//rotas de update 

// app.post('/api/updateUser', async (req, res) => {
//   const textoRecebido = req.body.texto; // Obtendo o texto enviado do frontend
//   console.log("Texto recebido do frontend:", textoRecebido); // Imprimindo o texto no console

//   // Aqui você pode adicionar o restante do seu código para processar a solicitação, se necessário
  
//   res.status(200).json({ message: 'Texto recebido com sucesso' });
// });

app.post('/api/updateUser', async (req, res) => {
  const objetoRecebido = req.body; // Obtendo o texto enviado do frontend
  console.log(objetoRecebido)
  try {
    

      const site = req.headers['x-status-filter'];
      const resultado = buscarUsuario(site);
      const xAuthToken = resultado.authToken;
      const xUserId = resultado.userId;

      // Configurando os cabeçalhos da solicitação
      const headers = {
          'X-Auth-Token': xAuthToken,
          'X-User-Id': xUserId,
          'Content-Type': 'application/json' // Certifique-se de definir o Content-Type
      };

      // Construindo o endpoint para atualizar o usuário
      const updateUserEndpoint = `${site}/api/v1/users.update`;

      // Fazendo a solicitação POST para atualizar o usuário
      const response = await axios.post(updateUserEndpoint, objetoRecebido, { headers });

      // Enviando uma resposta de sucesso com os dados recebidos do backend
      res.status(200).json({ message: 'Sucesso', responseData: response.data });
  } catch (error) {
      // Lidando com erros durante a solicitação
      console.error('Erro ao atualizar usuário:', error.message);
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});







// Rota para servir a página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

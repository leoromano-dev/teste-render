const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Mensagem a ser enviada para o frontend
const messageToSend = "Olá, mundo! Esta é a mensagem do servidor.";

// Rota de API para obter a mensagem
app.get('/api/message', (req, res) => {
  res.json({ message: messageToSend });
});

// Rota para servir a página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

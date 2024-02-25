// Função para fazer a requisição HTTP e exibir a mensagem na página
function fetchMessage() {
    // Obter o host atual da página
    const host = window.location.origin;
    // Construir a URL completa da rota da API
    const apiUrl = `${host}/api/message`;
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter a mensagem do servidor');
        }
        // Retornar a resposta JSON para ser utilizada no próximo .then()
        return response.json();
      })
      .then(data => {
        // Imprimir a resposta JSON no console
        console.log('Resposta da API:', data);
        
        // Exibir a mensagem na página
        const messageElement = document.getElementById('server-message');
        messageElement.textContent = JSON.stringify(data);
      })
      .catch(error => {
        console.error('Erro:', error);
        const messageElement = document.getElementById('server-message');
        messageElement.textContent = 'Erro ao obter a mensagem do servidor';
      });
  }
  
  // Chamar a função fetchMessage() quando a página carregar
  document.addEventListener('DOMContentLoaded', fetchMessage);
  
  console.log('teste');
  
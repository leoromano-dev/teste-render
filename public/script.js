// Função para fazer a requisição HTTP e exibir a mensagem na página
function fetchMessage() {
    return fetch('/api/message')
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

        return data;
      })
      .catch(error => {
        console.error('Erro:', error);
        const messageElement = document.getElementById('server-message');
        messageElement.textContent = 'Erro ao obter a mensagem do servidor';
        throw error; // Rejeita a Promise para que seja capturada pelo bloco catch de displayAgentes()
      });
  }
  
  // Chamar a função fetchMessage() quando a página carregar
  document.addEventListener('DOMContentLoaded', fetchMessage);
  
  async function displayAgentes(){
      try{
          let data = await fetchMessage();
          console.log("data:",  data);

          const userDataDiv = document.getElementById("userData");

          // Limpar elementos com a classe "userInfo"
          const userInfoElements = document.querySelectorAll(".userInfo");
          userInfoElements.forEach((element) => {
            element.parentNode.removeChild(element);
          });
      
          if (data.users) {
            data.users.forEach((user) => {
              const userRow = document.createElement("tr");
              userRow.id = user._id;
              userRow.className = "userInfo";
              let email =
                user.emails && user.emails.length > 0
                  ? user.emails[0].address
                  : "N/A";
              let colunas = [
                `${user.name}`,
                `${user.username}`,
                `${email}`,
                `${user.status}`,
                `${"☰"}`
              ];
          
              for (let i = 0; i < colunas.length; i++) {
                let novaCelula = document.createElement("td");
                if (colunas[i] === "☰") {
                  let botao = document.createElement("button");
                  botao.className = "button-dept"
                  botao.id = 'load-data-button'
                  botao.innerHTML = '☰';

                  novaCelula.appendChild(botao);
                } else if (i === 3) { // Se estiver na coluna do user.status
                  let active = user.active
                  let num = colunas[i]
               
                //   let elementStatus = createUserStatus(num, active)
                //   novaCelula.appendChild(elementStatus);
                } else {
                  novaCelula.textContent = colunas[i];
                }
                userRow.appendChild(novaCelula);
              }
          
              let tbody = document.querySelector("#list table tbody");
              tbody.appendChild(userRow);
            });
          } else {
            console.warn("Nenhum dado de usuário disponível.");
          }
      
      } catch(error) {
          console.log("Erro:", error);
          console.log("teste falho");
      }
  }
  
  displayAgentes();
  
// const host = window.location.origin;
    
//     try {
//       const siteSelected = document.getElementById("statusFilter").value;
//       console.log(siteSelected)
  
//       const apiUrl = `${host}/api/rolesList`;
  
//       const headers = {
//         "Content-Type": "application/json",
//         "X-Status-Filter": siteSelected,
//       };
  
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: headers,
//       });

async function getLicenceUsers() {
  const host = window.location.origin;

    const siteSelected = document.getElementById("statusFilter").value;
    let lincensesUsers;
    try {
  
      const apiUrl = `${host}/api/lincenseUsers`;
  
      const headers = {
        "Content-Type": "application/json",
        "X-Status-Filter": siteSelected,
      };
  
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`Erro na solicitação: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData)

      // Aqui você pode filtrar os dados recebidos conforme necessário
      // Por exemplo, se houver um campo chamado 'dados' no JSON recebido e você quiser apenas isso:
      lincensesUsers = responseData.lincenseUsers;
      
      console.log(lincensesUsers);

    } catch (error) {
      console.error("Erro ao obter dados da API:", error.message);
    }
    return lincensesUsers;
}


async function loadLincenseUsers(){
    let dataLinceseUserns 
    try {
         dataLinceseUserns = await getLicenceUsers()
      } catch (error) {
        console.error("Erro ao obter dados da API:", error.message);
      }
    var numOfUsers = document.getElementById("num-users-lincense");
    var progressBar = document.querySelector(".progress-bar"); // Seleciona pelo seletor de classe

    var activeUsers = dataLinceseUserns.activeUsers;
    var maxUsers = dataLinceseUserns.maxActiveUsers
    var porcentagem = (activeUsers / maxUsers) * 100;
    
    porcentagem = porcentagem.toFixed(2);

    if(porcentagem >= 90 && porcentagem <= 97){
        progressBar.style.backgroundColor = "#ec9800"
    }else if(porcentagem >= 98 && porcentagem <= 100){
        progressBar.style.backgroundColor = "#a10000"
    }else if(porcentagem >= 0 && porcentagem <= 89) {
        progressBar.style.backgroundColor = "#3b913f"
    }

    var novaLargura = porcentagem; // Por exemplo, 75% de progresso
    progressBar.style.width = novaLargura + "%";
    
    numOfUsers.textContent = `${maxUsers-activeUsers} lugares disponíveis ${activeUsers}/${maxUsers}`
    console.log("teste", dataLinceseUserns)
}

loadLincenseUsers()
// Função para fazer a requisição HTTP e exibir a mensagem na página
function fetchMessage() {
    const siteSelected = document.getElementById("statusFilter").value;
    console.log(siteSelected)

    const host = window.location.origin;
    const apiUrl = `${host}/api/message`;

    const headers = {
      "Content-Type": "application/json",
      "X-Status-Filter": siteSelected,
    };

    return fetch(apiUrl,{
      method: "GET",
      headers: headers,
    })
      
    .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter a mensagem do servidor');
        }
        // Retornar a resposta JSON para ser utilizada no próximo .then()
        return response.json();
      })
      .then(data => {
        
        return data;
      })
      .catch(error => {
        console.error('Erro:', error);
        const messageElement = document.getElementById('server-message');
        messageElement.textContent = 'Erro ao obter a mensagem do servidor';
        throw error; // Rejeita a Promise para que seja capturada pelo bloco catch de displayAgentes()
      });
  }
  
  async function rolesList() {

    const host = window.location.origin;
    
    try {
      const siteSelected = document.getElementById("statusFilter").value;
      console.log(siteSelected)
  
      const apiUrl = `${host}/api/rolesList`;
  
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
  
      let data = await response.json();
      data = data.allRoles
      console.log(data)
  
      roles = []
      for(let id of data){
        roles.push(id._id)
      }
  
      console.log(roles)
      
      
    } catch (error) {
      console.error("Erro ao obter dados da API:", error.message);
      errorApiMsg();
    }
    return roles
  }

  rolesList()
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
                  botao.onclick = toggleMenu;
                  novaCelula.appendChild(botao);
                } else if (i === 3) { // Se estiver na coluna do user.status
                  let active = user.active
                  let num = colunas[i]
               
                  let elementStatus = createUserStatus(num, active)
                  novaCelula.appendChild(elementStatus);
                } else {
                  novaCelula.textContent = colunas[i];
                }
                userRow.appendChild(novaCelula);
              }
          
              let tbody = document.querySelector("#list table tbody");
              tbody.appendChild(userRow);
            });
            loadLincenseUsers()
          } else {
            console.warn("Nenhum dado de usuário disponível.");
          }
      
      } catch(error) {
          console.log("Erro:", error);
          console.log("teste falho");
      }
  }

  



  function createUserStatus(num, active) {
    let status = num
  
      let statusInfo = document.createElement("div")
      let ballStatus = document.createElement("div")
      let statusUsers = document.createElement("div")
      ballStatus.classList = "user-status"
  
      if(active == true){
        if(status == "online"){
          status = "Online"
          ballStatus.classList += " status-online"
        }else if(status == "away"){
          status = "Ausente"
          ballStatus.classList += " status-away"
        }else if(status == "busy"){
          status = "Ocupado"
          ballStatus.classList += " status-busy"
        }else if(status == "offline"){
          status = "Offline"
          ballStatus.classList += " status-offline"
        }else{
          status = status
          ballStatus.classList += " status-offline"
        }
      }else{
        status = "Desabilitado"
        ballStatus.classList += " status-offline"
      }
     
      statusUsers.textContent = status
      statusInfo.classList = "statusInfo"
      statusInfo.appendChild(ballStatus)
      statusInfo.appendChild(statusUsers)
  
  
      return statusInfo
  }
  
  displayAgentes();
  



  const container = document.querySelector(".container");
  container.classList.add("btn-container"); // Adiciona a classe ao contêiner
  
  document.addEventListener('DOMContentLoaded', function() {
      var buttonDept = document.querySelector('.button-dept');
      buttonDept.addEventListener('click', toggleMenu);
  });
  



  function filterDropdown() {
    var input, filter, dropdown, labels, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    dropdown = document.getElementById("myDropdown");
    labels = dropdown.getElementsByTagName("label");
    for (var i = 0; i < labels.length; i++) {
      txtValue = labels[i].textContent || labels[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        labels[i].style.display = "";
      } else {
        labels[i].style.display = "none";
      }
    }
  }

  function toggleDropdown() {
    var dropdown = document.getElementById("myDropdown");
    dropdown.classList.toggle("show");
  
    // Verificar se o dropdown está fechado
    if (!dropdown.classList.contains("show")) {
         // Dropdown está fechado, então salvar os dados
         saveDataWhenDropdownClosed();
    }
  }

  document.getElementById("myDropdown").onclick = function(event) {
    event.stopPropagation();
  }

// Função principal para manipular o menu
async function toggleMenu() { 

  console.log('aqui ok')
  var trElement = event.target.closest('tr');
  let agentInfo;
  let userId

  if (trElement) {
    userId = trElement.id
  }

  var container = document.querySelector('.container1');
  container.classList.toggle('menu-closed');
  var offcanvasMenu = document.querySelector('.offcanvas-menu');
  var overlay = document.querySelector('.overlay');
  let userData 

  try {
    agentInfo = await fetchMessage();
    agentInfo = agentInfo.users
    userData = agentInfo.filter(item => item._id === userId);
      // Faça algo com o retorno da função aqui
      console.log("Retorno de agente:", userData);
  } 
  catch (error) {
      console.error('Erro ao obter dados do departamento:', error.message);
  }

  
// Criar uma tabela
var table = document.createElement("table");
var tbody = document.createElement("tbody");
let row = document.createElement("tr");
row.className = "offCanvaInfo";

let name = criaName(userData)
row.appendChild(name)

let username = criaUserName(userData)
row.appendChild(username)

let email = criaEmail(userData)
row.appendChild(email)

let senha = criaSenha()
row.appendChild(senha)

let roles = criaPasswordRequired(username)
row.appendChild(roles)

try {
  dropdownDiv = await criaInputAgentes(userData);
  // Faça algo com o retorno da função aqui
  console.log("Retorno da departamentInfo:");
} catch (error) {
  console.error('Erro ao obter dados do departamento:', error.message);
}


document.body.appendChild(dropdownDiv);
row.appendChild(dropdownDiv)

let btnCell = document.createElement("td")
        btnCell.className = "btnCell"
        let btn = document.createElement("button")
        btn.textContent = "Editar"
        let btnRease = document.createElement("button")
        btnRease.textContent = "Apagar"
        btnRease.className = 'btn-delete'
        btn.onclick = updateAgent
        btnCell.appendChild(btnRease)
        btnCell.appendChild(btn)

        row.appendChild(btnCell);

tbody.id = userId

tbody.appendChild(row);       
// Adicionar a tabela ao offcanvasMenu
table.appendChild(tbody);
document.querySelector('.offcanvas-menu').appendChild(table)
  
  if (offcanvasMenu.style.right === '0px') {
      offcanvasMenu.style.right = '-400px';
      overlay.style.display = 'none';
      
      // Limpar o conteúdo da tabela ao fechar o menu
      offcanvasMenu.innerHTML = '';
  } else {
      offcanvasMenu.style.right = '0';
      overlay.style.display = 'block';

      // Adiciona um evento de clique ao overlay para fechar o menu ao clicar fora dele
      overlay.addEventListener('click', closeMenu);
  }
}

async function createInputAgentes() {
  let options

  let dropdownDiv = document.createElement("div");
  dropdownDiv.className = "dropdown";

  // Criar o elemento input do tipo texto
  let inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "searchInput";
  inputText.setAttribute("placeholder", "Search...");
  inputText.onclick = toggleDropdown; // Adicionar o evento onclick
  inputText.oninput = filterDropdown; // Adicionar o evento oninput

  // Criar o elemento button
  let button = document.createElement("button");
  button.className = "dropbtn";
  button.textContent = "Selecione";

  // Criar o elemento div com a classe "dropdown-content"
  let dropdownContentDiv = document.createElement("div");
  dropdownContentDiv.id = "myDropdown";
  dropdownContentDiv.className = "dropdown-content";

  // Adicionar os elementos das opções dentro do div "dropdown-content"
  try {
    options = await rolesList();
    console.log("Retorno das roles:", options);
  } 
  catch (error) {
      console.error('Erro ao obter dados das roles:', error.message);
  }
  // let options = ["user", "admin", "Moderador", "livechat-agent", "Livechat-manager", "Livechat-monitor", "bot", "app"];
  

      options.forEach(function (option) {
          let i = 0
          let label = document.createElement("label");
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = option;
          checkbox.checked = false;

          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(" " + option));
          dropdownContentDiv.appendChild(label);
          i += 1
      });

  dropdownDiv.appendChild(inputText);
  dropdownDiv.appendChild(dropdownContentDiv);

  let divLine = document.createElement("td");
  divLine.className = "depInfoCanva";
  divLine.innerHTML = "Roles: <br>";
  divLine.appendChild(dropdownDiv);

  return divLine;
}

function saveDataWhenDropdownClosed() {
  let selectedValues = getSelectedValues();
  return selectedValues
}

function getSelectedValues() {
  var dropdown = document.getElementById("myDropdown");
  var checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
  var selectedValues = [];
  for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
          selectedValues.push(checkboxes[i].value);
      }
  }
  return selectedValues;
}

function criaName(userData){
  var labelCell = document.createElement("td");
        labelCell.className = "depInfoCanva";
        var inputElement = document.createElement("input");
        inputElement.id = "inputName"
        inputElement.value = userData[0].name ;
        labelCell.innerHTML = "Nome: <br>";
        labelCell.appendChild(inputElement)

  return labelCell
}

function criaUserName(userData){
  var labelCell = document.createElement("td");
        labelCell.className = "depInfoCanva";
        var inputElement = document.createElement("input");
        inputElement.id = "inputUsername"
        inputElement.value = userData[0].username ;
        labelCell.innerHTML = "Usuario: <br>";
        labelCell.appendChild(inputElement)

  return labelCell
}

function criaEmail(userData){
  var labelCell = document.createElement("td");
        labelCell.className = "depInfoCanva";
        var inputElement = document.createElement("input");
        inputElement.id = "inpuEmail"
        inputElement.value = userData[0].emails[0].address ;
        labelCell.innerHTML = "Email: <br>";
        labelCell.appendChild(inputElement)

  return labelCell
}

function criaSenha(userData){
  var labelCell = document.createElement("td");
        labelCell.className = "depInfoCanva";
        var inputElement = document.createElement("input");
        inputElement.id = "inputPassword"
        inputElement.type = "password"
        labelCell.innerHTML = "Senha: <br>";
        labelCell.appendChild(inputElement)

  return labelCell
}

function criaPasswordRequired(userData){
  var labelCell = document.createElement("td");
        labelCell.className = "depInfoCanva";
        labelCell.innerHTML = `
        <div class="password-isRequired">
        <label>Exigir alteração de senha</label>
        <div class="form-check form-switch">
        <input onclick="getValue()" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheck" >
      </div></div>` ;

  return labelCell
}

function getValue() {
    // Seleciona o elemento input pelo ID
    var checkbox = document.getElementById("flexSwitchCheck");
    // Verifica se o checkbox está marcado
    if (checkbox.checked)  {
      return true
    }else{
      return false
    }
}



async function criaInputAgentes(userData) {
  let userRoles = userData[0].roles
  let options
  console.log(userRoles)

  let dropdownDiv = document.createElement("div");
  dropdownDiv.className = "dropdown";


  // Criar o elemento input do tipo texto
  let inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "searchInput";
  inputText.setAttribute("placeholder", "Search...");
  inputText.onclick = toggleDropdown; // Adicionar o evento onclick
  inputText.oninput = filterDropdown; // Adicionar o evento oninput

  // Criar o elemento button
  let button = document.createElement("button");
  button.className = "dropbtn";
  button.textContent = "Selecione";

  // Criar o elemento div com a classe "dropdown-content"
  let dropdownContentDiv = document.createElement("div");
  dropdownContentDiv.id = "myDropdown";
  dropdownContentDiv.className = "dropdown-content";

  // Adicionar os elementos das opções dentro do div "dropdown-content"
  try {
    options = await rolesList();
    console.log("Retorno das roles:", options);
  } 
  catch (error) {
      console.error('Erro ao obter dados das roles:', error.message);
  }
  // let options = ["user", "admin", "Moderador", "livechat-agent", "Livechat-manager", "Livechat-monitor", "bot", "app"];
  

      options.forEach(function (option) {
          let i = 0
          let label = document.createElement("label");
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = option;

          let encontrado = false;
          for (let i = 0; i < userRoles.length; i++) {
            if (userRoles[i] === option) {
              encontrado = true;
              break;
            }
           }
           checkbox.checked = encontrado;


          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(" " + option));
          dropdownContentDiv.appendChild(label);
          i += 1
      });

  dropdownDiv.appendChild(inputText);
  dropdownDiv.appendChild(dropdownContentDiv);

  let divLine = document.createElement("td");
  divLine.className = "depInfoCanva";
  divLine.innerHTML = "Roles: <br>";
  divLine.appendChild(dropdownDiv);

  return divLine;
}


function updateAgent(){
  let id
  var name = document.getElementById("inputName").value;
  var email = document.getElementById("inpuEmail").value;
  var username = document.getElementById("inputUsername").value;
  var password = document.getElementById("inputPassword").value;
  let roles = saveDataWhenDropdownClosed();
  console.log("roles",roles)
  let passwordRequired = getValue()

  var tbodies = document.getElementsByTagName("tbody");

  id = tbodies[1].id
    let dataUserUpdate = {"userId": id, 
              "data": {
              "roles": roles,
              "name": name,
              "password": password,
              "username": username,
              "email": email,
              "requirePasswordChange": passwordRequired
              }
      }

  
  console.log(dataUserUpdate);
  udapetUser(dataUserUpdate)
}


//teste nova função http
async function udapetUser(dataUserUpdate) {
  try {

    const siteSelected = document.getElementById("statusFilter").value;
    const host = window.location.origin;

    const headers = {
      "Content-Type": "application/json",
      "X-Status-Filter": siteSelected,
    };

    const apiUrl = `${host}/api/updateUser`;
    const objetoJSON = JSON.stringify(dataUserUpdate); // Serializando o objeto para JSON

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: objetoJSON, // Enviando o objeto serializado no corpo da requisição
    });

    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status}`);
    }

    const responseData = await response.json(); // Aguardando a resposta do backend
    console.log("Resposta do backend:", responseData);
    sucessApiMsg()
    displayAgentes()
    closeMenu()
  } catch (error) {
    console.error("Erro ao enviar objeto para o backend:", error.message);
  }
}






function closeMenu() {
  var container = document.querySelector('.container1');
  container.classList.add('menu-closed');
  var offcanvasMenu = document.querySelector('.offcanvas-menu');
  var overlay = document.querySelector('.overlay');
  offcanvasMenu.style.right = '-500px';
  overlay.style.display = 'none';
  agentesToRemove = []
  console.log(agentesToRemove)
  clearOffcanvasMenu()
  // Remove o evento de clique do overlay ao fechar o menu
  overlay.removeEventListener('click', closeMenu);

}

function clearOffcanvasMenu() {
  // Limpar o conteúdo da tabela ao fechar o menu
  let offcanvasMenu = document.querySelector('.offcanvas-menu');
  let tabelaNaOffcanvasMenu = offcanvasMenu.querySelector('table');

  if (tabelaNaOffcanvasMenu) {

      tabelaNaOffcanvasMenu.remove();
  }
}
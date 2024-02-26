//  window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn') && !event.target.matches('#searchInput')) {
//       var dropdowns = document.getElementsByClassName("dropdown-content");
//       for (var i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//           openDropdown.classList.remove('show');
//         }
//       }
//     }
//   }

  
  
  // Função para fechar o menu
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


//   function toggleDropdownOnClick(event) {
//     var dropdownContent = document.getElementById("myDropdown");
//     var searchInput = document.getElementById("searchInput");
    
//     // Verificar se o clique foi dentro ou fora do dropdown
//     var isInsideDropdown = dropdownContent.contains(event.target);
//     var isSearchInput = event.target === searchInput;

//     if (!isInsideDropdown) {
//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         for (var i = 0; i < dropdowns.length; i++) {
//             var openDropdown = dropdowns[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show');
//             }
//         }
//     } else if (isSearchInput && dropdownContent.classList.contains('show')) {
//         // Fechar o dropdown se o clique foi no input enquanto o dropdown estiver aberto
//         dropdownContent.classList.remove('show');
//     }
// }

  // function filterDropdown() {
  //   var input, filter, dropdown, labels, txtValue;
  //   input = document.getElementById("searchInput");
  //   filter = input.value.toUpperCase();
  //   dropdown = document.getElementById("myDropdown");
  //   labels = dropdown.getElementsByTagName("label");
  //   for (var i = 0; i < labels.length; i++) {
  //     txtValue = labels[i].textContent || labels[i].innerText;
  //     if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //       labels[i].style.display = "";
  //     } else {
  //       labels[i].style.display = "none";
  //     }
  //   }
  // }
  // //   document.getElementById("myDropdown").onclick = function(event) {
  // //   event.stopPropagation();
  // // }

  // function saveDataWhenDropdownClosed() {
  //   let selectedValues = getSelectedValues();
  //   console.log(selectedValues)
  //   return selectedValues
  // }
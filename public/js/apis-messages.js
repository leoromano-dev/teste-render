function errorApiMsg(){
    iziToast.error({
      title: 'Erro',
      message: 'Ocorreu um erro ao processar a ação!',
      position: 'topRight' // Posição onde a notificação será exibida
    });
  } 
  
   function sucessApiMsg(){
    iziToast.success({
      title: 'Sucesso',
      message: 'Usuario atutualizado com sucesso!',
      position: 'topRight' // Posição onde a notificação será exibida
    });
  } 
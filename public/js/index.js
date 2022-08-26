console.log(localStorage.getItem('token'))
if(localStorage.getItem('token') && localStorage.getItem('token').length > 0){
  
}else{
  console.log('未登录')
  let baseUrl = window.location.protocol + "//" + window.location.host;
  window.location.href = baseUrl.substring(0, baseUrl.length-4) + "3000/login.html";
}
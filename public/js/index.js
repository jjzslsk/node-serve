console.log(localStorage.getItem('token'))
if(localStorage.getItem('token') && localStorage.getItem('token').length > 0){
  
}else{
  console.log('未登录')
  let baseUrl = window.location.protocol + "//" + window.location.host;
  window.location.href = baseUrl.substring(0, baseUrl.length-4) + "3000/login.html";
}
function logoutFn(){
    localStorage.removeItem('token')
    let baseUrl = window.location.protocol + "//" + window.location.host;
    window.location.href = baseUrl.substring(0, baseUrl.length-4) + "3000/login.html";
}
function edit(id){
  id = id.replace(/"/g,"")
  $.ajax({
      url:`/editUser?id=${id}`,
      type:'get',
      success:function (result) {
          console.log(JSON.stringify(result))
          if(result.success){
          let baseUrl = window.location.protocol + "//" + window.location.host;
          window.location.href = baseUrl.substring(0, baseUrl.length-4) + "3000/index.html";
          }else{
            alert(result.message);
          }
      },
      error:function (msg) {
          alert('系统发生错误');
      }
  })
}
function del(id){
  id = id.replace(/"/g,"")
  $.ajax({
      url:`/delUser?id=${id}`,
      type:'get',
      success:function (result) {
          console.log(JSON.stringify(result))
          if(result.success){
          let baseUrl = window.location.protocol + "//" + window.location.host;
          window.location.href = baseUrl.substring(0, baseUrl.length-4) + "3000/index.html";
          }else{
            alert(result.message);
          }
      },
      error:function (msg) {
          alert('系统发生错误');
      }
  })
}
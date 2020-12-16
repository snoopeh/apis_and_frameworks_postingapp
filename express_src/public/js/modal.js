// Get the modal
var modal = document.getElementById('id01');

validateForm = function(){
  alert("opened alert");
  var username = document.forms["loginFormulary"]["uname"].value;
  var password = document.forms["loginFormulary"]["psw"].value;
  const authData = {email:username, password: password};
  fetch("http://localhost:3000/api/user/login", authData).subscribe(response => {
    const token = response.token;
    if (token) {
      alert("logged in sucessfully");
      return false;
    }
    else{
      alert("login failed");
      return false;
    }
  }, error => {
    alert("submition failed");
    return false;
  });
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

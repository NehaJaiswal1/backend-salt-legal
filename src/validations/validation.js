



//Name

const validateName = (name) => {
    return /^([a-zA-Z ]){2,30}$/.test(name);
  };
  
  // Email
  
  const validateEmail = (email) => {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
  };
  
  //Password
  
  const validatePassword = (password) => {
    //8-15 characters, one lowercase letter and one number and maybe one UpperCase & special character:
    return /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,15}$/.test(password);
  };
  
  const validateNumber = (number)=>{
    // return /^\d{10}$/.test(number);
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(number);
  }
  

  module.exports = {
    validateName,
    validateEmail,
    validatePassword,
    validateNumber
  };
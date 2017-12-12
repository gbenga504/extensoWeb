export const LoginUtils = {
  loginValidation: (username, password) => {
    let pattern = /^[a-zA-Z]{1,}$/;
    return pattern.test(username) && password.length > 3;
  }
};

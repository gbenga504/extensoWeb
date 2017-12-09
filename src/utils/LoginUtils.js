export const LoginUtils = {
  loginValidation: (username, password) => {
    let pattern = /[^\s@]+@[^\s@.]+\.[^\s@]+/;
    return pattern.test(username) && password.length > 3;
  }
};
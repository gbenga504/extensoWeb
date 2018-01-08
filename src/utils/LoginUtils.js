export const LoginUtils = {
  /**
   * @return bool
   * @param {String} username
   * @param {String} password
   * @function validates the login form of a particular posts against the regular expression
   */
  loginValidation: (username, password) => {
    let pattern = /^[a-zA-Z]{1,}$/;
    return pattern.test(username) && password.length > 3;
  }
};

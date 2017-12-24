export default statusCode => {
  let result = undefined;
  switch (statusCode) {
    case 200:
      result = { type: "ok" };
      break;
    case 304:
      result = { type: "ok" };
      break;
    case 404:
      result = {
        type: "error",
        data: { code: 404, message: "The page you requested is not complete" }
      };
      break;
    case 501:
      result = {
        type: "error",
        data: { code: 501, message: "Current User isnt authorized" }
      };
      break;
    default:
      result = {
        type: "error",
        data: { code: 0, message: "Unknown error just occurred" }
      };
      break;
  }
  return result;
};

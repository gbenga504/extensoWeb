export default statusCode => {
  let result = undefined;
  switch (statusCode) {
    case 200:
      result = { type: "ok" };
      break;
    case 304:
      result = { type: "ok" };
      break;
    default:
      result = {
        type: "error"
      };
      break;
  }
  return result;
};

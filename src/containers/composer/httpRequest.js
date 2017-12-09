export default (method, config, progressCallback = null) => {
  return new Promise((resolve, reject) => {
    let httpRequest = null,
      configuration = config || {};

    if (method.toUpperCase() === "POST" && !configuration.formRef) {
      throw new Error("The form data for the request must be provided");
    }

    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      httpRequest = new window.ActiveXObject("Microsoft.XMLHTTP");
    }

    httpRequest.onreadystatechange = function() {
      try {
        if (httpRequest.status === 200 && httpRequest.readyState === 4) {
          let result = JSON.parse(httpRequest.responseText);
          return resolve({ success: true, message: result });
        }
      } catch (err) {
        return reject({ success: false, message: err });
      }
    };

    httpRequest.onprogress = function(oEvent) {
      if (oEvent.lengthComputable) {
        let computed = oEvent.loaded / oEvent.total;
        progressCallback && progressCallback(computed);
      }
    };

    httpRequest.onerror = function() {
      return reject({
        success: false,
        message: "An error just occurred"
      });
    };

    httpRequest.onabort = function() {
      return reject({
        success: false,
        message: "The request was aborted"
      });
    };

    httpRequest.timeout = configuration.timeout || 100000;

    let GET_URL =
      configuration.url +
      (/\?/.test(configuration.url) ? "&" : "?") +
      Date.now();

    httpRequest.open(
      method.toUpperCase(),
      method.toUpperCase() !== "GET" ? configuration.url : GET_URL,
      true
    );
    httpRequest.send(
      method.toUpperCase() !== "GET" ? new FormData(configuration.formRef) : null
    );
  });
};

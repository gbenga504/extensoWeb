export default (method, config, progressCallback = null) => {
  return new Promise((resolve, reject) => {
    let httpRequest = null,
      configuration = config || {};

    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      httpRequest = new window.ActiveXObject("Microsoft.XMLHTTP");
    }

    httpRequest.onreadystatechange = function() {
      try {
        if (httpRequest.status === 200 && httpRequest.readyState === 4) {
          let result = JSON.parse(httpRequest.responseText);
          resolve({ success: true, message: result });
        }
      } catch (err) {
        reject({ success: false, message: err });
      }
    };

    httpRequest.onprogress = function(oEvent) {
      if (oEvent.lengthComputable) {
        let computed = oEvent.loaded / oEvent.total;
        progressCallback && progressCallback(computed);
      }
    };

    httpRequest.onerror = function() {
      reject({
        success: false,
        message: "Oops, a network error occurred"
      });
    };

    httpRequest.onabort = function() {
      reject({
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

    /**
     * HIGHLY DANGEROUS AND MESSY ; DO NOT ENGAGE 
     * This is serious monkey patching
     */
    let token = localStorage.getItem("jwt"),
      formData = null;
    if (method.toUpperCase() !== "GET") {
      formData = new FormData(configuration.formRef || null);
      formData.set("token", token);
    }

    httpRequest.send(method.toUpperCase() !== "GET" ? formData : null);
  });
};

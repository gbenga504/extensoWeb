export default (method, url, { timeout, formRef }) => {
  if (method === "POST" && !formRef) {
    throw new Error("The form data for the request must be provided");
  }

  let httpRequest = null;
  if (window.XMLHttpRequest) {
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = function() {
    try {
      if (httpRequest.status === 200 && httpRequest.readyState === 4) {
        let result = JSON.parse(httpRequest.responseText);
        return Promise.resolve({ success: true, message: result });
      }
    } catch (err) {
      return Promise.reject({ success: false, message: err });
    }
  };

  httpRequest.onprogress = function(oEvent) {
    if (oEvent.lengthComputable) {
      let computed = oEvent.loaded / oEvent.total;
    }
  };

  httpRequest.onerror = function() {
    return Promise.reject({
      success: false,
      message: "An error just occurred"
    });
  };

  httpRequest.onabort = function() {
    return Promise.reject({
      success: false,
      message: "The request was aborted"
    });
  };

  httpRequest.timeout = timeout || 100000;

  let GET_URL = url + (/\?/.test(url) ? "&" : "?") + Date.now();

  httpRequest.open(method, method === "POST" ? url : GET_URL, true);
  httpRequest.send(method === "POST" ? new FormData(formRef) : null);
};

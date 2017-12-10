export const Throwable = {
  throwVariablesUnavailabilityError: options => {
    if (typeof options === "function") {
      if (
        !options({}).variables &&
        typeof options({}).variables !== "object" &&
        options({}).variables.length !== undefined
      ) {
        throw new Error(
          "[variables] is needed as a key in config.options(query) or config(mutations) and it must be a function accepting props or an Object"
        );
      }
    } else {
      if (
        !options.variables &&
        typeof options.variables !== "object" &&
        options.variables.length !== undefined
      ) {
        throw new Error(
          "[variables] is needed as a key in config.options(query) or config(mutations) and it must be a function accepting props or an Object"
        );
      }
    }
  },

  initThrowable: (method, { name, options }) => {
    if (!method || typeof method !== "string") {
      throw new Error(
        "composer requires that the [method] needs to be specified as a string. One of the following type is supported /n 1) GET 2) PUT 3) DELETE 4)PUSH 5) POST"
      );
    }

    if (!name || name.trim().length === 0) {
      throw new Error("composer needs a [config] containing [name] as a key");
    }

    Throwable.throwVariablesUnavailabilityError(options);
  }
};

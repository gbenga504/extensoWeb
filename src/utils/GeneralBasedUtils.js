export const GeneralBasedUtils = {
  sanitizeProps: (prevProps, arrayOfExclusion) => {
    let newProps = Object.keys(prevProps).reduce((acc, value) => {
      if (!acc[value] && arrayOfExclusion.indexOf(value) === -1) {
        acc[value] = prevProps[value];
      }
      return acc;
    }, {});
    return newProps;
  },

  getHasTags: postMessage => {
    let pattern = /#[a-zA-Z0-9]{1,}/gi,
      matches = [],
      resultFromMatch = [];
    while ((resultFromMatch = pattern.exec(postMessage))) {
      matches.push(resultFromMatch);
    }
    return matches;
  },

  formatPostWithHashTags: postMessage => {
    let matches = GeneralBasedUtils.getHasTags(postMessage),
      hashTags = "",
      appender = undefined,
      beginning = "",
      word = "",
      ending = "";
    for (let i = matches.length - 1; i >= 0; i--) {
      appender = i == 0 ? "" : ",";
      hashTags += `${matches[i][0]}${appender} `;

      beginning = postMessage.substring(0, matches[i].index);
      ending = postMessage.substring(matches[i].index + matches[i][0].length);
      word = `<a href="#" hashTag="${matches[i][0]}">${matches[i][0]}</a>`;

      postMessage = `${beginning}${word}${ending}`;
    }
    return { body: postMessage, tags: hashTags };
  }
};

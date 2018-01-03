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

  getHasTags: (postMessage, pattern) => {
    let matches = [],
      resultFromMatch = [];
    while ((resultFromMatch = pattern.exec(postMessage))) {
      matches.push(resultFromMatch);
    }
    return matches;
  },

  hashTags: [],

  formatPostWithHashTags: postMessage => {
    let matches = GeneralBasedUtils.getHasTags(
        postMessage,
        /[^">]#[a-zA-Z0-9]{1,}/gi
      ),
      appender = undefined,
      beginning = "",
      word = "",
      ending = "";
    for (let i = matches.length - 1; i >= 0; i--) {
      appender = i == 0 ? "" : ",";
      GeneralBasedUtils.hashTags.push(
        matches[i][0]
          .replace("#", "")
          .trim()
          .toLowerCase()
      );

      beginning = postMessage.substring(0, matches[i].index);
      ending = postMessage.substring(matches[i].index + matches[i][0].length);
      word = ` <a href="#" hashTag="${matches[i][0].trim()}">${matches[
        i
      ][0].trim()}</a>`;

      postMessage = `${beginning}${word}${ending}`;
    }
    return {
      body: postMessage,
      tags: JSON.stringify(GeneralBasedUtils.hashTags)
    };
  },

  formaHashTagUrlForSearch: hash => ({
    urlParams: hash
      .replace("#", "")
      .trim()
      .toLowerCase()
  })
};

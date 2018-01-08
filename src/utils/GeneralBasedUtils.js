export const GeneralBasedUtils = {
  /**
   * @return Object
   * @param {Object} prevProps
   * @param {Array} arrayOfExclusion
   * @function santizes the passed props by composing another object of props while removing the items in the arrayOfExclusion
   * Props to be removed from the composed new props object should be added to this array
   */
  sanitizeProps: (prevProps, arrayOfExclusion) => {
    let newProps = Object.keys(prevProps).reduce((acc, value) => {
      if (!acc[value] && arrayOfExclusion.indexOf(value) === -1) {
        acc[value] = prevProps[value];
      }
      return acc;
    }, {});
    return newProps;
  },

  /**
   * @return Array
   * @param {String} postMessage
   * @param {Object} pattern
   * @function gets hash tags matches from a supplied string and returns an array containing the hash tags in the supplied string
   */
  getHasTags: (postMessage, pattern) => {
    let matches = [],
      resultFromMatch = [];
    while ((resultFromMatch = pattern.exec(postMessage))) {
      matches.push(resultFromMatch);
    }
    return matches;
  },

  hashTags: [],

  /**
   * @return {Object}
   * @param {String} postMessage
   * @function formats a posts containing hash tags and returns an object containing the
   * formatted tags to be inserted to the DOM and a stringified JSON body to be used for tags insertion into the database
   * This function simply formats a string containing hash tags to obtain the equivalent hash tags present in the string
   */
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

  /**
   * @return Object
   * @param {String} hash
   * @function formats an hash tag by removing the # so it could be used to perfrom a search against contents in the database
   */
  formaHashTagUrlForSearch: hash => ({
    urlParams: hash
      .replace("#", "")
      .trim()
      .toLowerCase()
  }),

  /**
   * @return number
   * @param {String} content
   * @function permutates and gets the reading time for a particular post
   */
  permutateReadingTime: content => {
    let readTime = Math.floor(parseInt(content.length) / 150);
    return readTime === 0 ? 1 : readTime;
  }
};

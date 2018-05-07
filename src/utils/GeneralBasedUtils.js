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

  hashTags: [],

  /**
   * @param {Array} tags
   * @function sets the initial has tags for the application based on what has been saved before
   */
  setInitialHashTags: tags => {
    GeneralBasedUtils.hashTags = tags;
  },

  formatHashTagsToPostgresArrayType: tags => {
    let result = "";
    if (tags.length !== 0) {
      result = tags.reduce((acc, value, i) => {
        i !== tags.length - 1 ? (acc += `${value},`) : (acc += `${value}}`);
        return acc;
      }, "{");
    } else {
      result = "{}";
    }
    return result;
  },

  /**
   * @param {string} postMessage
   * @function removes all  tags which are no longer in the text or post message so that tags that are still
   * there could be inserted correctly
   */
  removeNulledHashTags: postMessage => {
    let { hashTags } = GeneralBasedUtils;

    for (let j = 0; j < hashTags.length; j++) {
      if (postMessage.indexOf(`#${hashTags[j]}`) === -1) {
        hashTags.splice(j, 1);
      }
    }
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
        //(FIX) : this regular expression is buggy in case we have words starting with > from the editorState
        /[^&]#[a-zA-Z0-9]{1,}\s?/gi
      ),
      srcPattern = /publicid="([a-zA-Z0-9\.\-\:\/]+)?"/gi,
      appender = undefined,
      beginning = "",
      word = "",
      ending = "";

    GeneralBasedUtils.removeNulledHashTags(postMessage);

    for (let i = matches.length - 1; i >= 0; i--) {
      appender = i == 0 ? "" : ",";
      let value = matches[i][0]
        .replace("#", "")
        .trim()
        .toLowerCase();

      if (GeneralBasedUtils.hashTags.indexOf(value) === -1) {
        GeneralBasedUtils.hashTags.push(value);
      }

      beginning = postMessage.substring(0, matches[i].index);
      ending = postMessage.substring(matches[i].index + matches[i][0].length);
      word = ` <a href="${matches[i][0].trim()}" hashTag="${matches[
        i
      ][0].trim()}">${matches[i][0].trim()}</a>`;

      postMessage = `${beginning}${word}${ending}`;
    }

    let postThumbnail = srcPattern.exec(postMessage),
      _thumbnail = (postThumbnail && postThumbnail[0]) || "";

    let displaySrc = _thumbnail.replace(/publicid=/, "").replace(/'|"/gi, "");

    return {
      body: postMessage,
      tags: GeneralBasedUtils.hashTags,
      displaySrc
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

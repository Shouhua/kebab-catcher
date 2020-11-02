/**
 * kebab case
 * @param {String} str 
 */
function kebabCase(str) {
	return str.replace(/(?!^)([A-Z\u00C0-\u00D6])/g, function (match) {
		return '-' + match.toLowerCase();
  });
};

/**
 * test if array
 * @param {Object} obj 
 */
const isArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

module.exports = {
  kebabCase,
  isArray
}
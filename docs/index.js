const basicInfo = require('./basicInfo');
const servers = require('./servers');
const definitions = require('./definitions');
const tags = require('./tags');
const auth = require('./auth');

module.exports = {
    ...basicInfo,
    ...servers,
    ...definitions,
    ...tags,
    ...auth
};

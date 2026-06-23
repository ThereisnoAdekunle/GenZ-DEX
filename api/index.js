const { createDefaultEngine, createRequestListener } = require('../naira_protocol/server');

const handler = createRequestListener(createDefaultEngine());

module.exports = handler;
module.exports.default = handler;

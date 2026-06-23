const { renderArchitecturePage } = require('../naira_protocol/architecture');

const handler = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(renderArchitecturePage());
};

module.exports = handler;
module.exports.default = handler;

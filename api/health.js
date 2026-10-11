'use strict';
const {health} = require('../server/craft.cjs');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({error: 'method'});
    return;
  }
  res.status(200).json(health());
};

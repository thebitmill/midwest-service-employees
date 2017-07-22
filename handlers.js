'use strict';

// modules > 3rd party
const _ = require('lodash');

const sql = require('easy-postgres/sql-helpers');
const { many } = require('easy-postgres/result');

// modules > midwest
const factory = require('midwest/factories/rest-handlers');
const resolveCache = require('./resolve-cache');

const columns = [
  'id',
  'givenName',
  'familyName',
  'telephone',
  'email',
  'jobTitle',
  'description',
  'createdAt',
  'createdById',
  'modifiedAt',
  'modifiedById',
];

const columnsString = sql.columns(columns);

module.exports = _.memoize((config) => {
  function getAll(client = config.db) {
    const query = `SELECT ${columnsString} FROM employees ORDER BY id ASC;`;

    return client.query(query).then(many);
  }

  const handlers = factory({
    db: config.db,
    emitter: config.emitter,
    exclude: ['getAll'],
    table: 'employees',
    columns,
  });

  return Object.assign(handlers, { getAll });
}, resolveCache);

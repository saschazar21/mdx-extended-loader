/* eslint-disable */
const {
  defaults
} = require('jest-config');

module.exports = {
  verbose: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  modulePaths: ['<rootDir>/src', '<rootDir>/test'],
  rootDir: './',
  roots: ['<rootDir>', '<rootDir>/src', '<rootDir>/test']
}

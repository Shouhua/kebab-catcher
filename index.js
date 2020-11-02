#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const camelcase = require('camelcase');
const vueParser = require('vue-eslint-parser');
const jsParser = require('acorn');
const walk = require('acorn-walk');

const pkg = require('./package.json');
const { kebabCase, isArray } = require('./utils');
const parserConfig = require('./parser.config.js');

/**
 * list import syntax by parsing file
 * @param {String} p file path
 * @param {Object} parser parser
 */
const parse = function(p, parser) {
  let ast = {};
  try {
    const file = fs.readFileSync(p, 'utf8');
    ast = parser.parse(file, parserConfig);
    hanleImportDeclaration(ast, p);
  } catch(err) {
    console.error(err.message);
  }
}

/**
 * handle import declaration
 * @param {String} ast
 * @param {String} p file path
 */
const hanleImportDeclaration = function(ast, p) {
  walk.simple(ast, {
    ImportDeclaration(node) {
      if(node.source) {
        const fileName = path.parse(node.source.value).name;
        if(kebabCase(fileName) !== fileName) {
          console.log(`file: ${p}, line: ${node.source.loc.start.line}, column: ${node.source.loc.start.column}: ${node.source.value}`)
        }
      }
    }
  });
}

/**
 * parse file 
 * @param {p} p path
 */
const parseFile = function(p) {
  const pathInfo = path.parse(p);
  if(pathInfo.ext === '.vue') {
    parse(p, vueParser);
  }
  if(pathInfo.ext === '.js') {
    parse(p, jsParser);
  }
}

/**
 * traverse directory
 * @param {String} p directory path
 */
const parseDirectory = function(p) {
  const files = fs.readdirSync(p);  
  for(const file of files) {
    const filePath = path.join(p, file);
    const stat = fs.statSync(filePath);
    if(stat.isDirectory()) {
      parseDirectory(filePath);
    } else {
      parseFile(filePath)
    }
  }
}

const args = process.argv.slice(2);
args.forEach(e => {
  try {
    const stats = fs.statSync(e);
    if(stats.isDirectory()) {
      parseDirectory(e);
    }
    if(stats.isFile()) {
      parseFile(e);
    }
  } catch (error) {
    console.error(error.message);
  }
});

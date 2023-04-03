#! /usr/bin/env node

const { resolve } = require('path')
const { Command } = require('commander')

const config = require('./config')
const toTailwind = require('../src')

const program = new Command()

Object.values(config).forEach(({ option, descriptor }) => {
  program.option(option, descriptor)
})

const { css, html, output } = program.parse()._optionValues

if (!html) {
  console.log('error: html input missing!')

  return
} 

if (!css) {
  console.log('error: css input missing!')

  return 
}

if (!output) {
  console.log('error: output missing!')

  return 
}

const cwd = process.cwd()
const htmlInput = resolve(cwd, html)
const cssInput = resolve(cwd, css)
const _output = resolve(cwd, output)

toTailwind(htmlInput, cssInput, _output)

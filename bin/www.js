#! /usr/bin/env node

const { resolve } = require('path')
const { Command } = require('commander')

const config = require('./config')
const toTailwind = require('../src')

const program = new Command()

Object.values(config).forEach(({ option, descriptor }) => {
  program.option(option, descriptor)
})

const { html, css } = program.parse()._optionValues

if (!html) {
  console.log('error: html input missing!')

  return
} else if (!css) {
  console.log('error: css input missing!')

  return 
}

const cwd = process.cwd()
const htmlInput = resolve(cwd, html)
const cssInput = resolve(cwd, css)
const output = resolve(cwd, './target/output.html')

toTailwind(htmlInput, cssInput, output)

/*
 * Copyright 2017 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'standard',
    'standard-react'
  ],
  env: {
    browser: true
  },
  plugins: [
    'babel',
    'import',
    'flowtype'
  ],
  globals: {
    '__DEV__'      : false,
    '__PROD__'     : false,
    '__DEBUG__'    : false,
    '__DEBUG_NEW_WINDOW__' : false,
    '__BASENAME__' : false,
    '__VERSION__' : false,
    '__WEB__': false,
    '__SERVER__': false,
    '__TEST__': false,
    'jest': false,
    'it': false,
    'describe': false,
    'before': false,
    'beforeEach': false,
    'after': false,
    'afterEach': false,
    'expect': false
  },
  rules: {
    'jsx-quotes': [2, 'prefer-single'],
    'generator-star-spacing': 0,
    'no-duplicate-imports': 0,
    'object-shorthand': [2, 'always'],
    'prefer-const': [2, { 'destructuring': 'all', 'ignoreReadBeforeAssign': true }],
    'semi' : [2, 'never'],
    'generator-star-spacing': [2, 'both'],

    'flowtype/define-flow-type': 1,
    'flowtype/object-type-delimiter': [2, 'comma'],
    'flowtype/use-flow-type': 1,

    'import/no-duplicates': 2,

    'react/jsx-no-bind': 0,
    'react/jsx-key': 2,
    'react/no-string-refs': 2
  }
}

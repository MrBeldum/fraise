// MIT License
//
// Copyright (c) 2026 René-Jean Corneille
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');

const workflow = readFileSync(`${__dirname}/../workflows/pull-request.yaml`, 'utf8');
const match = workflow.match(/^\s+regex: '([^']+)'$/m);
assert.ok(match, 'the workflow must declare its branch-name regex');
const branchPattern = new RegExp(match[1]);

for (const branch of [
  'deps/bump-x-net-0.60.0',
  'albedo/pr-branch-conventions',
  'feat/rate-limiting',
  'fix/empty-response-body',
  'docs/sdk-py-readme',
  'style/formatting',
  'refactor/query-parser',
  'perf/query-cache',
  'test/query-cache',
  'build/container',
  'ci/pr-checks',
  'chore/cleanup',
  'revert/query-cache',
]) {
  test(`accepts ${branch}`, () => {
    assert.ok(branchPattern.test(branch));
  });
}

for (const branch of [
  'unknown/change',
  'deps/',
  'albedo/',
  'deps/Bump-net',
  'albedo/UPPERCASE',
  'albedo/nested/branch',
  'fix/trailing-',
  'fix/double--separator',
  'prefix/deps/bump-net',
  'deps/bump-net\nextra',
]) {
  test(`rejects ${JSON.stringify(branch)}`, () => {
    assert.equal(branchPattern.test(branch), false);
  });
}

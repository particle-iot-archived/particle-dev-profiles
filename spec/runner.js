'use babel'

import {createRunner} from 'atom-mocha-test-runner';

module.exports = createRunner({
	testSuffixes: ['spec.js'],
});

#!/bin/bash
tmpdir=`mktemp -d /tmp/temp.XXXX`
dir=`pwd`
git clone `git config --get remote.origin.url` $tmpdir
cd $tmpdir
git checkout gh-pages
cd $dir
node_modules/documentation/bin/documentation.js build src/profile-manager.js --shallow -f html -o $tmpdir
cd $tmpdir
git add .
git commit -m 'Update docs'
git push -u origin gh-pages
cd $dir

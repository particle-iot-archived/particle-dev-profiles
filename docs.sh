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
git -c user.name='Travis CI' -c user.email='bots@particle.io' commit -m 'Update docs'
git push -f -q https://suda:$GITHUB_API_KEY@github.com/spark/particle-dev-profiles gh-pages &2>/dev/null
cd $dir

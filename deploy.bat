@ECHO off
:: deploy to gh-pages branch
npm run build && CD dist && git init && git add -A && git commit -m 'deploy' && git push -f https://github.com/risbi0/HoloCure-Build-Maker.git main:gh-pages && CD ..
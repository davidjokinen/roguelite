# Rougelite
Aiming to build a game

## Current playable version
[https://roguelite-3rkvm.ondigitalocean.app/index.html](https://roguelite-3rkvm.ondigitalocean.app/index.html)
It updates everytime I push.

## Getting it working in dev mode
1. Install Node.js
2. Run build commands
```
cd ./game
npm install
npm run watch
```
3. Run sever
```
cd ./server
npm install
npm start
```
4. Game should be up and running!


## CI setup
build 
```
cd ../game
npm install
npm run build
cp -r ./static ../server/static
cp -r ./ ../server/test
```
run
```
cp -r ./test ../game
npm start
```
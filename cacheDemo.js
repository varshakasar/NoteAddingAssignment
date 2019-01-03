const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

obj = { my: "sqr", variable: 42 };
const success = myCache.set( "myKey", obj, 10000 );
console.log('Before cache : ' + success);

const value = myCache.get( "myKey" );

console.log('After cache : ' + value);
console.log(value);

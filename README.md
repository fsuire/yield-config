## yield-config

A simple node.js config lib that uses generators

### Installation

```
$ npm install yield-config
```

### Exemple

We start from some json config files :


{config directory}/myconfig.json :
```json
{
    "one": "i am the first",
    "two": "i am the second"
}
```

{config directory}/myconfig.development.json :
```json
{
    "two": "i am the second, and i am for the development environment only",
    "three": "i am the third, and i only exist in the development environment"
}
```

{config directory}/anotherconfig.json :
```json
{
    "foo": "bar"
}
```

And we use it :

```js
var co = require('co'),
    Config = require('yield-config');

co(function *() {

    /////////////////////////
    // create a new config //
    /////////////////////////

    // the argument used for construction points to your service directory
    var myConfigDirectory = __dirname + '/config';
    var config = yield new Config(myConfigDirectory);

    // your config instance merged in an inner object the content of all the json files
    // in your config directory (but didn't care of eventuals subdirectories)

    var one = config.get('myconfig/one');
    // one === 'i am the first'

    var two = config.get('myconfig/two');
    // two === 'i am the second'

    var three = config.get('myconfig/three');
    // three === undefined;

    three = config.get('myconfig/three', 'a default value');
    // three === 'a default value');

    var myconfig = config.get('myconfig');
    // var myconfig === {
    //     one: 'i am the first',
    //     two: 'i am the second'
    // }

    var foo = config.get('anotherconfig/foo');
    // foo === 'bar'

    var anotherconfig = config.get('anotherconfig');
    // anotherconfig === {
    //     foo: 'bar'
    // }

    ///////////////////////////////////////////////////////
    // create a new config using an environment variable //
    ///////////////////////////////////////////////////////

    var env = process.env.NODE_ENV;
    var config = new yield Config(myConfigDirectory, env);

    // if env === 'development', your config instance will also use the myconfig.development.json file

    var one = config.get('myconfig/one');
    // one === 'i am the first'

    var two = config.get('myconfig/two');
    // two === 'i am the second, and i am for the development environment only'

    var three = config.get('myconfig/three');
    // three === 'i am the third, and i only exist in the development environment';

    var myconfig = config.get('myconfig');
    // var myconfig === {
    //     one: 'i am the first',
    //     two: 'i am the second, and i am for the development environment only',
    //     three: 'i am the third, and i only exist in the development environment'
    // }

    //////////////////////////
    // get the whole config //
    //////////////////////////

    var wholeConfig = config.config;
    // wholeconfig === {
    //     myconfig: {
    //         one: 'i am the first',
    //         two: 'i am the second, and i am for the development environment only',
    //         three: 'i am the third, and i only exist in the development environment'
    //     },
    //     anotherconfig: {
    //         foo: 'bar
    //     }
    // }

})();
```
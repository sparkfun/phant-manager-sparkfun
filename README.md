# phant-manager-sparkfun

the fork of [phant-manager-http](https://github.com/sparkfun/phant-manager-sparkfun) that is currently hosted at [data.sparkfun.com](http://data.sparkfun.com).

## Setting up a dev environment

    $ node -v
    v0.10.26
    $ npm install -g grunt-cli
    $ git clone git@github.com:sparkfun/phant-manager-sparkfun.git
    $ cd phant-manager-sparkfun
    $ git remote add upstream git@github.com:sparkfun/phant-manager-http.git
    $ npm install
    $ grunt dev

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 SparkFun Electronics. Licensed under the GPL v3 license.

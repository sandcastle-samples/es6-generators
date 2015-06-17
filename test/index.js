'use strict';

const assert = require('assert');


describe('generators', function(){


    // -------------------

    function *basic(){
        yield 1;
        yield 2;
    }

    it('should return a iterator, when calling a generator function', function(){

        /*
            The .next() function returns an iterator value, that will have
            two properties "value" which is the result of the iterator call
            and "done" which indicates that the iterator has reached the end
        */

        assert.equal(typeof basic(), 'object');
    });

    it('should return a iterator value on .next()', function(){

        /*
            The .next() function returns an iterator value, that will have
            two properties "value" which is the result of the iterator call
            and "done" which indicates that the iterator has reached the end
        */

        let iterator = basic();
        assert.deepEqual(iterator.next(), { value: 1, done: false });
    });

    it('should return an iterator value of undefined, when at the end of the iterator', function(){

        /*
            If .next() is called on an iterator once the end has been reached
            a "value" property of "undefined" and a "done" property of "true"
            will be returned
        */

        let iterator = basic();
        assert.deepEqual(iterator.next(), { value: 1, done: false });
        assert.deepEqual(iterator.next(), { value: 2, done: false });
        assert.deepEqual(iterator.next(), { value: undefined, done: true });
    });

    // -------------------

    function *returner(){
        return 1;
    }

    function *yieldAndReturner(){
        yield 1;
        return 2;
    }

    it('should be possible to yield & return values', function(){

        /*
            It possible to use in both return and yield statements within
            a generator function
        */

        let iterator = yieldAndReturner();
        assert.equal(iterator.next().value, 1);
        assert.equal(iterator.next().value, 2);
    });

    it('should return done=true for a return statement', function(){

        /*
            A return statement will result in an iterator "done" value
            of "true"
        */

        let iterator = returner();
        assert.deepEqual(iterator.next(), { value: 1, done: true });
    });

    it('should return done=false for a yeild statement', function(){

        /*
            A yield statement will result in an iterator "done" value
            of "false"
        */

        let iterator = yieldAndReturner();
        assert.deepEqual(iterator.next(), { value: 1, done: false });
        assert.deepEqual(iterator.next(), { value: 2, done: true });
    });

    // -------------------

    function *voidGenerator(){ }

    it('should return value=undefined, done=true for a void genertor', function(){

        /*
            If a generator function doesnt yield or return anything
            then the iterator will be at the end immediately
        */

        let iterator = voidGenerator();
        assert.deepEqual(iterator.next(), { value: undefined, done: true });
    });

    // -------------------

    function *outer(){
        yield* inner();
        yield* inner();
    }

    function *inner(){
        yield 1;
        yield 2;
    }

    it('should yield other generator values', function(){

        /*
            The yield* operator allows you to yield another generator
            and return the result of the inner generator. You will notice
            that this results in an endless iterator and it restarts the
            inner once the end is reached - not something I expected
        */

        let iterator = outer();
        assert.equal(iterator.next().value, 1);
        assert.equal(iterator.next().value, 2);
        assert.equal(iterator.next().value, 1);
        assert.equal(iterator.next().value, 2);
    });

    // -------------------

    function *pauser(){
        var name = yield 'Hello';
        return name;
    }

    it('should exucute anything on right of the current yield when calling next()', function(){

        /*
            This one takes a while to get your head around.

            When you call yield you’re pausing the generator. If you call
            iterator.next() again (with or without params) it will execute
            anything on the right-hand side of the current yield statement
            and continue through until it’s paused again.
        */

        let iterator = pauser();
        assert.equal(iterator.next().value, 'Hello');
        assert.equal(iterator.next('Goodbye').value, 'Goodbye');
    });

    // -------------------

    it('should be possible to create a generator with a constructor', function(){

        /*
            Its possible to create a generator using a contstructor function,
            though I cant really see this being useful in many cases - but its
            here just for completeness

            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
        */

        var GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;
        var g = new GeneratorFunction('a', 'yield a * 2');
        var iterator = g(10);

        assert.equal(iterator.next().value, 20);
    });

    // -------------------

    function *foo(){
        yield 5;
        yield 5;
    }

    function *bar(){
        yield 5;
        yield 5;
        return 10;
    }

    it('should be possible to for..of an interator', function(){

        /*
            The new ES6 for..of operator supports generators and
            will automatically extract the "value" after calling next
            while the "done" value is still true
        */

        let total = 0;
        for (var v of foo()) {
            total += v;
        }

        assert.equal(total, 10);
    });

    it('should be possible to for..of an interator, but return statements are excluded', function(){

        /*
            This case is the same as the one above, except that it
            shows that return values are excluded from generators
            as a return statement will result in a "done" value of true,
            which is excluded by the iterator
        */

        let total = 0;
        for (var v of bar()) {
            total += v;
        }

        assert.equal(total, 10); // notice that the 3rd value was excluded
    });

    // -------------------

});

const chai = require('chai');
const assert = chai.assert;

suite('Unit Tests', function () {

  suite('Basic Assertions', function () {
    test('#isNull, #isNotNull', function () {
      assert.isNull(null);
      assert.isNotNull(1);
    });

    test('#isDefined, #isUndefined', function () {
      // null is a defined value (an object) in JavaScript, so this passes.
      assert.isDefined(null);
      assert.isUndefined(undefined);
      assert.isDefined('hello');
    });

    test('#isOk, #isNotOk', function () {
      // #isOk passes if the value is truthy. #isNotOk passes if falsy.
      assert.isNotOk(null); // null is falsy
      assert.isOk("I'm truthy"); // string is truthy
      assert.isOk(true);
    });

    test('#isTrue, #isNotTrue', function () {
      // #isTrue checks if the value is strictly true (not just truthy).
      assert.isTrue(true);
      assert.isTrue(!!'truthy'); // converts truthy string to boolean true
      assert.isNotTrue({ value: 'truthy' }); // object is truthy, but not strictly true
    });
  });

  suite('Equality', function () {
    test('#equal, #notEqual', function () {
      // #equal uses loose (==) comparison
      assert.equal(12, '12');
      assert.notEqual({ value: 1 }, { value: 1 }); // objects are different instances
      assert.equal(6 * '2', 12); // 6 * '2' uses type coercion
      assert.notEqual(6 + '2', 8); // 6 + '2' results in '62'
    });

    test('#strictEqual, #notStrictEqual', function () {
      // #strictEqual uses strict (===) comparison
      assert.strictEqual(6, 6);
      assert.strictEqual(6, 3 * 2);
      assert.notStrictEqual(6 * '2', '12'); // 6 * '2' is 12 (number), '12' is string
      assert.notStrictEqual([1, 'a', {}], [1, 'a', {}]); // still different instances
    });

    test('#deepEqual, #notDeepEqual', function () {
      // #deepEqual checks the value of object properties, not just the reference
      assert.deepEqual({ a: '1', b: 5 }, { b: 5, a: '1' }); // property order doesn't matter
      assert.notDeepEqual({ a: [5, 6] }, { a: [6, 5] }); // arrays are different
    });
  });

  function weirdNumbers(delta) {
    return 1 + delta - Math.random();
  }

  suite('Comparisons', function () {
    test('#isAbove, #isAtMost', function () {
      assert.isAbove('hello!'.length, 5);
      assert.isAbove(1, 0);
      assert.isAbove(Math.PI, 3);
      assert.isAtMost(1 - Math.random(), 1);
    });

    test('#isBelow, #isAtLeast', function () {
      assert.isBelow('hi'.length, 5);
      assert.isAtLeast(2 * Math.random(), 0);
      assert.isBelow(5 % 2, 2);
      assert.isBelow(2 / 3, 1);
    });

    // ----------------------------------------------------------------------
    // SOLUTION FOR THE CHALLENGE (Test #10 equivalent)
    // ----------------------------------------------------------------------
    test('#approximately (The solution for Test #10)', function () {
      // Calculate the largest difference required for the test to pass:
      // |Math.PI - 3.14| ≈ 0.00159...
      // We must choose a delta greater than 0.00159 and less than 1.
      const delta = 0.002;
        
      assert.approximately(1.0001, 1.0002, delta, 'The difference is 0.0001');
      assert.approximately(Math.PI, 3.14, delta, 'The difference is 0.00159...');
    });
  });

  const winterMonths = ['dec', 'jan', 'feb', 'mar'];
  const backendLanguages = ['php', 'python', 'javascript', 'ruby', 'asp'];

  suite('Arrays', function () {
    test('#isArray, #isNotArray', function () {
      assert.isArray('abc'.split(''));
      assert.isNotArray([1, 2, 3].indexOf(2));
    });

    test('Array #include, #notInclude', function () {
      assert.notInclude(winterMonths, 'jul');
      assert.include(backendLanguages, 'javascript');
    });
  });

  const formatPeople = function (name, age) {
    return '# name: ' + name + ', age: ' + age + '\n';
  };

  suite('Strings', function () {
    test('#isString, #isNotString', function () {
      assert.isNotString(Math.sin(Math.PI / 4));
      assert.isString(process.env.PATH);
      assert.isString(JSON.stringify({ type: 'object' }));
    });

    test('String #include, #notInclude', function () {
      assert.include('Arrow', 'row');
      assert.notInclude('dart', 'queue');
    });

    test('#match, #notMatch', function () {
      const regex = /^#\sname\:\s[\w\s]+,\sage\:\s\d+\s?$/;
      assert.match(formatPeople('John Doe', 35), regex);
      assert.notMatch(formatPeople('Paul Smith III', 'twenty-four'), regex);
    });
  });

  const Car = function () {
    this.model = 'sedan';
    this.engines = 1;
    this.wheels = 4;
  };
  const Plane = function () {
    this.model = '737';
    this.engines = ['left', 'right'];
    this.wheels = 6;
    this.wings = 2;
  };

  const myCar = new Car();
  const airlinePlane = new Plane();

  suite('Objects', function () {
    test('#property, #notProperty', function () {
      assert.notProperty(myCar, 'wings');
      assert.property(airlinePlane, 'engines');
      assert.property(myCar, 'wheels');
    });

    test('#typeOf, #notTypeOf', function () {
      assert.typeOf(myCar, 'object');
      assert.typeOf(myCar.model, 'string');
      assert.typeOf(airlinePlane.wings, 'number');
      assert.typeOf(airlinePlane.engines, 'array');
      assert.typeOf(myCar.wheels, 'number');
    });

    test('#instanceOf, #notInstanceOf', function () {
      assert.notInstanceOf(myCar, Plane);
      assert.instanceOf(airlinePlane, Plane);
      assert.instanceOf(airlinePlane, Object);
      assert.notInstanceOf(myCar.wheels, String);
    });
  });
});
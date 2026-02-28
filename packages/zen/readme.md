# Zen 1.0.0 - Alpha - WIP DOCS

**Zen** offers a radical way to type-check all values and iterate / projéct / filter / reduce etc, consistently over **all the different JS values & types**. `Zen` is (so much more than) a collection of essential useful utils for JavaScript & TypeScript, missing from JS and popular libs like lodash & others! Zen is the backbone of 2 of the most fundamental operations in a dynamic runtime like JS. 

Subsequent versions aim to make it an almost drop-in replacement of lodash, carrying all its functions (expose indefferent ones), but reimplement all other iterative/projecting ones, in the Zen way! 

## Main features

### Type Checking (Runtime & Compile time)
 
Zen brings proper type-checking to JS and TS: 

* a **Runtime Type System**, to check the real-world types, so much better than `typeof`, `instanceof` & and all lodash `is.isXxx` we all use.  
* Coupled by a **Static TypeScript typings** system, to make sane typing decisions

### Iteration & Projections on steroids, via Generators 

With **Zen** you can simplify (& deprecate) all the **inconsistent** ways of: 

* Iterating (i.e looping) with legacy ways, for example `for..in`, `for..of`, `Array.forEach()`, `_.each`, `Object.keys` etc
  
* Projecting with a myriad different ways, different for avery type (eg `Array.map`, `_.filter()`, `_.mapValues()`)    

With Zen, you unify the subtle differences across the varying data types, both when you iterate & project upon. 

// @todo: 
* Consistently & JS natively `for const [val, key] of loop(anyValue) {...}`
    * Without callbacks (but an `z.each` also exists!)

* you can iterate/map/filter etc on `Array`, `Set`, `Map`, `ArrayBuffer` etc in the same, sane & consistent way.

Zen features: 

* a **JS Native Iteration on Anything** function called **loop()**, that is powered by Generators
* a **Projection & Filtering on Anything** engine build on top of `loop()`, with **native Keys & object Props** & string & Symbol props included (all optional, via options)
* All behaviors are optional and configurable, cause **Options are King**. 

### Typed & tested

* Zen is rigorously typed with TypeScript 5.6, **Extensively Tested** with 1000's of tests (including generated ones) and more!

# The Runtime Type Checking System

**Zen** dares to propose an extended, very logical and only a bit radical **Runtime Type System** for JS/TS, to fix the UTTERLY BROKEN runtime typing system of JS in 2024, 29 years after its conception. That's why **The Bad Parts** is a must read before even **The Good Parts**, for anyone touching this otherwise great language! 

In short, Zen's **Runtime Type System**:

  * Is "complying" when it's OK, its "extending" when it should, it is "fixing" when breaking is a must and is "improving" when it's wise. The Bad Parts is a good background!

  * You can forget and never use again the myriad inconsistencies of the existing `typeof`, `instanceof` & other type-related absurdities of JS & the status-quo. My favorite is `NaN !== NaN` ;-)

  * Also, you can bypass lodash's shortcomings around types (and more below):
  
Can you believe it's 2024 and native / status quo JS is :-(

\`\`\`ts    
    typeof myPromise === 'object'
    typeof Promise === 'function'
    Promise.isPromise === undefined 
    _.isPromise === undefined
\`\`\`

We can only rely on `myPromise instanceof Promise`, for a limited `true` or `false` check.
      
Compare with the consistency of Zen's Type System:

\`\`\`ts
    z.isPromise(prom) === true
    z.type(prom) = 'Promise'
    z.type(Promise) === 'class'      
    z.classType(Promise) === 'systemClass'
    z.constructor(prom) === Promise
\`\`\`  

And this is just 1 example, just for `Promise`, but almost ALL types have similar or even worse issues (fixed by Zen)! For example, `typeof null` is `'object'` and `typeof NaN` is `'number'`!

With Zen / ZenType you'll get a consistent, logical, and rich type system, that is also well-typed with TypeScript.

Consider a system Class/constructor & instance info:

\`\`\`ts
    // vanilla JS
    typeof Set === 'function'
    typeof new Set() === 'object'    
\`\`\`

Really, is `Set` just a `function`? Can we really call `Set([])`? No! It is a class/constructor and we have to `new Set([])`! 

And the set instance, is it just an `object`? You should know that everything (except _some_ primitives) is a typeof `object` in JS! 

JS is lying to us relentlessly and `typeof` is utterly broken!

Compare with Zen:

\`\`\`ts
    z.type(Set) === 'class'
    z.type(new Set()) === 'Set'

    // And more: 
    z.classType(Set) === 'systemClass'
    z.instanceType(new Set()) = 'systemInstance'
\`\`\`

What about user classes and instances?

\`\`\`ts
    class Aclass {a = 1}
    const aInstance = new Aclass()
    
    // Vanilla JS
    typeof Aclass === 'function'
    typeof aInstance === 'object'
\`\`\`

Sucks like above! Compare it with Zen:

\`\`\`ts    
    // Zen `type()` basics
    z.type(Aclass) === 'class'
    z.type(aInstance) === 'realObject'
    
    // Zen Extras
    z.realObjectType(aInstance) === 'instance'
    z.realType(aInstance) === 'instance'
    z.classType(Aclass) === 'userClass'
    z.instanceType(aInstance) === 'userInstance'
\`\`\`

Perhaps the epitome of JS madness is `NaN !== NaN`. But test your self, do you know the `typeof null`? You'll be surprised, I still am ;-)

Let 2024 be the year we stopped using `typeof`, `instanceof`, `Object.isObject` and the rest of the gang, and started using a proper Type System, with [`z.type`](./functions/type.html)and `z.isXxx`!

The Type System comes packed with:

* [`z.type`](./functions/type.html) & many other `xxxType()` functions, with many natural-occuring & synthetic types

* A plethora of individual type inference checkers like ( [`z.isSingle`](./functions/isSingle-1.html),  [`z.isMany`](./functions/isMany.html),  [`z.isPrimitive`](./functions/isPrimitive.html), [`z.isClass`](./functions/isClass.html) and tens more

* You also get useful types like [`Tany`](./types/Tany.html) (so you can `Exclude<Tany, TPrimitive>`), along with [`TPrimitive`](./types/TPrimitive.html), [`TSingle`](./types/TSingle.html) & [`Many`](./types/Many.html) and many more, to help you with your TypeScript types.

* You even get [`PrimitiveNames`](./types/PrimitiveNames.html) and [`SingleNames`](./types/SingleNames.html) and similarly for all, to help you with your TypeScript types handling!

* To be complete, you also get a runtime [`PRIMITIVE_NAMES`](./variables/PRIMITIVE_NAMES.html), [`SINGLE_NAMES`](./variables/SINGLE_NAMES.html) and similarly for all, to help you with your runtime type checks!

* Equality & similarity checkers like [`z.isEqual`](./functions/isEqual.html),  [`z.isLike`](./functions/isLike.html) and many more, and all `isXxx` type checks you'll ever need ( [`z.isBigInt`](./functions/isBigInt.html),  [`z.isGenerator`](./functions/isGenerator.html) etc) & few set-theory utils (`z.isSetEqual`). All accepting options, to cover many different use cases.

* All typesafe with TypeScript ;-)

## Native Iteration on anything

The mighty [z.loop](./functions/loop.html) allows the iteration on ALL collections/nested values types (a.k.a `z.isMany` like `Array`, `realObject`, `Set`, `Map`, `Iterator`, `Generator`, `AsyncIterator` etc) **in the exact same way**, with native JS only:

```ts
    for (const [val, key, count, input] of z.loop(anyInput)) {/*code*/}
```

to iterate on `anyInput` that has nested values on it, in the same way, with the same code, without any special cases or special libraries or weird callbacks and APIs. In plain, native JS.

Forget iteration (and projections) with `Array.forEach/map/filter()`, lodash limited `_.each` & `_.map` etc and the same with Ramda, IxJs, `Set.entries()` and the myriads other ways for iteration & projections. They are suboptimal, some don't support async/await, others have steep APIs, others don't support `Set` and `Map` etc. 

Just a `for...of z.loop(anything)` and you can loop over anything has nested values / props (and also `map`, `filter`, `take` etc while doing so, declaratively!)

## Project & Filter Anything

A collection of projection functions like [`z.map()`](./functions/map.html) / [`z.filter()`](./functions/filter.html) / [`z.take()`](./functions/take.html) / [`z.clone()`](./functions/clone.html) / [`z.keys()`](./functions/keys.html) and more like [`z.reduce()`](./functions/reduce.html)]  (all based on the [z.loop](./functions/loop.html)) that **return the same type, as the input value type**!

* You pass an Array, you get an Array (with mapped/filtered/etc elements - i.e `_.map` / `_.filter`).

* You pass an Object, you get an Object with (with mapped/filtered/etc values - i.e `_.mapValues` / `_.pickBy`).

* Similar for `Map`, `Set`, `Iterator`, `Generator` etc!

* You can also optionally pass a single value (experimental) and get the *mapped*/*filtered* etc single value back! Booxed, if it was Boxed, primitive if it was primitive.

You can forget `_.filter`, `_.map`, `_.mapValues`, `_.pickBy`, `_.clone`, `keys()` and many others, that are limited and stringent and working only on narrow cases, (eg only for objects or only for Arrays etc) and none for Maps & Sets ;-(. `z.` works with *Zenything*, in the same way! 

Note: FP flavour coming soon ;-)

## Keys & Props Included

All methods differentiate between normal `keys/Indices`, `elements` & `values` of a nested value (like an `Array`, `Set` etc) and the props all `_.isObject` values have. You can choose what to include/exclude in any iteration / projection (eg `own`, `inherited`, `non-enumerable`, `symbols`, `props` as well or `props only` etc) in the `options`!

## Options are King

Almost all functions are accepting a plethora of `options`, that allow customisable behaviour in meaningful ways. Many of the options are common among functions (eg `ImapOptions extends IloopOptions` and in turn `IloopOptions extends IkeysOptions`) hence synergies emerge. All projections like `map()`, `filter()`, `take()` etc share the same implementation, just with different types and tiny extra checks.

## Lib & Type System is Typed

The Type System and whole library are typed with TypeScript (workable, not perfect in v1).

For example, passing an `AsyncIterator` to c will return an `AsyncGenerator` type and not a `Generator` type, respecting the types of the original type. Similarly, passing an `Array` to `z.map()` will return an `Array`, passing a `realObject` will return an `Record` and not something different. 

## Lib & Type System is Tested

Extensively tested, with 1000's of exhaustive & interpolated edge test cases ;-)

Typings are also tested, mostly via [`ts-expect`](https://github.com/TypeStrong/ts-expect), check the `xxx-typing-tests.ts`

# Highlights

## Nested / Collections & Iteration

- [z.loop](./functions/loop.html) returns an `Iterator` of tuples `[item, idxOrKey, count]` **that work the same way** with any kind of nested values (i.e collection) such as `Array`, `Object`, `Map`, `Set`, `Iterator`, `class` and more). But even [`z.isSingle`](./functions/isSingle-1.html) (i.e non-nested) values are iterated once, yielding the value itself (but you can opt to be strict)! Currently, in the JS world there was no way to iterate on anything in the same way, but now you can `for (const [keyOrIdx, item, count] of z.loop(value)) {...}` and it will work as expected. At the same time you `filter`, `map`, `take` etc while doing so, declaratively!

- [z.each](./functions/each.html) is a more powerful `_.each()` (which improved `Array.forEach` by allowing objects as well), that based is based on [`z.loop`](./functions/loop.html) and works with any kind of nested values (i.e collection) such as Array, Object, Map & Set). It accepts a callback `(item, keyOrIdx, count) => {}` and since its built on `z.loop`, it accepts the same options so you can also `map`, `filter`, `take` while looping, and more

- [z.keys](./functions/keys.html) optionally returns ALL possible natural keys or indexes of any object (Real object, Array, Function, Map & Set entries etc) with many twists: it can also bring `props` of the underlying JS object (instead of its normal keys/indexes), is supports both string & Symbol props, it can filter own & inherited keys, enumerable & non-enumerable and top-level keys (eg `toString`). Naturally, you can choose which keys/indexes/props to include/exclude.

- [`z.map()`](./functions/map.html) / [`z.filter()`](./functions/filter.html) / [`z.reduce()`](./functions/reduce.html)] / [`z.take()`](./functions/take.html) / [`z.clone()`](./functions/clone.html) / [`z.keys()`](./functions/keys.html) and more are in place, more coming soon. Most are based on the [z.loop](./functions/loop.html) and accept the same options. They all **return the same type, as the input value type** (eg you pass an Array, you get an Array, with filtered/mapped/etc elements).

Check docs for the full list of functions & usage.

## Objects & Arrays

- [z.getProp](./functions/getProp.html) gets a property from a nested Property Bag (i.e objects, classes) or Array, using a custom separated string or array path, with many twists (e.g. `separator`, `defaultKey`, `inherited` etc.)

- [z.setProp](./functions/setProp.html) sets a property to a nested Property Bag (i.e objects, classes) or Array, using a string or array path, with many twists (such as `separator`, `create`, `overwrite`).

- [z.mutate](./functions/mutate.html) mutates values of an object/array, using a mutator function, if *agreements* are met.

## Equality & Similarity

- [z.isEqual](./functions/isEqual.html) checks if two values are deep equal, similar to `_.isEqual` but with many optional twists (`inherited`, `like`, `path`, `exclude` etc.)

- [z.isLike](./functions/isLike.html) checks if two values are deep equal, but the first value only having a subset of props being equal. Shortcut to [ z.isEqual](./functions/isEqual.html).

- [z.isExact](./functions/isExact.html) checks if two values are deep equal, then all refs must point to the same objects, not lookalike clones! Shortcut to [ z.isEqual](./functions/isEqual.html).

- [z.isDisjoint](./functions/isDisjoint.html) Checks if there are no common value between the two objects/arrays (i.e. their intersection is empty)

- [z.isRefDisjoint](./functions/isRefDisjoint.html) Given two Property Bags (i.e objects, classes) or Arrays, it returns `true` if there are **NO common/shared references** in their properties.

- [z.isSetEqual](./functions/isArraySetEqual.html) Checks if 2 Sets or 2 arrays are equal, without caring about the order of their items, with custom equality functions (on one, or either side).

### Type Checks - Runtime Type System

- [z.type](./functions/type.html) returns the type of the value, as a superset of `typeof` (with a compatible naming format when these co-exist), but in a much richer & *non-Bad Parts* manner, recognising & many more distinct "real world" types. For example `'object'` is considered only and for all real `{}` objects, in all object forms (i.e plain {} object, instance etc.) but does NOT include Arrays, Functions etc unlike lodash & typeof. Naturally `null`'s type is well... `'null'` and not `'object'`, unlike JS's dummy `type`. Also, functions are recognised as `'function'` but ES6 Classes as `'class'`. And NaNs as just a `'NaN'`, not a number as the name stipulates! Finally, it recognises many other types, like Set, Map, Iterator etc.

- [z.functionType](./functions/functionType.html) returns the specific type of the function, eg `'class'`, `'Function'`, `'AsyncFunction'`, `'GeneratorFunction'`, `'AsyncGeneratorFunction'` & `'ArrowFunction'`.

- [z.objectType](./functions/objectType.html) returns the specific type of the real object, either `'pojso'` or `'instance'`.

More in the docs

### isXxx Type Checks

A plethora of missing type `isXxx(value)` checks (more than 25), that are not provided by lodash and most other libraries or are scattered around stackoverflow and other libs. In Zen they are all & tested in one place. For example:

- [z.isClass](./functions/isClass.html) checks if a value is an ES2015 class

- [z.isPromise](./functions/isPromise.html) checks if a value is a (native) Promise

- [z.isRealObject](./functions/isRealObject.html) checks if a value is a Hash (a.k.a. an `{}` object in any form, such as object literal, class instance created with `new MyClass`, or object created by `Object.create(parent)`, with or without a prototype constructor etc.). There is no other way to check for this, as `_.isObject` & `_.isPlainObject` don't do the trick!

- [z.isSingle](./functions/isSingle-1.html) checks if the value's data type is "plain" in terms of NOT naturally/normally having nested items (eg props, array items etc.) inside it. For example number, string etc. are single.

- [z.isMany](./functions/isMany.html) the opposite of isSingle: checks if the value's data type is "nested" in terms of naturally/normally having nested items (eg props, array items etc.) inside it. For example object, array, Map etc. are nested.

- [z.isPrimitive](./functions/isPrimitive.html) according to the [definition of "primitive" in JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)

plus many more...

### Numbers: From strict to any

JavaScript has a lot of numbers, and it sucks when it comes to checking which is which. Trying to smooth it a bit, we have 3 levels of checks:

- [z.isStrictNumber](./functions/isStrictNumber.html) checks if value is a strict `number`, excluding NaNs, boxed `new Number('123')`, `BigInt` & `Infinity`.

- [z.isNumber](./functions/isNumber.html) checks if value is a **strict number** OR `BigInt` OR `Infinity`, excluding only the invalid `NaN`s & boxed Numbers.

- [z.isAnyNumber](./functions/isAnyNumber.html) Checks and returns true, if value is any kind of a "real number", a good candidate for `Number()`: boxed `new Number()`, `BigInt`, `Infinity` or even a string that represents a "real number" (i.e. any value that is resulting to a non-NaN via `Number(value)`).

### More...

More exotic ones exist - check the typedoc Docs for the full list (`npm run docs!`).

### Various type utils

- [z.numberEnumToNumberVal](./functions/numberEnumToNumberVal.html) converts any value of either side of a **numeric enum** to the number side of the enum

- [z.numberEnumToStringKey](./functions/numberEnumToStringKey.html) converts any value of either side of a **numeric enum** to the string key side

## Various / Experimental / Abandoned

- [z.isAgree](./functions/isAgree.html) checks if value is in *agreement* with one or more agreement(s) (functions or values).

- [z.arrayize](./functions/arrayize.html) converts a `value` to an array with `[ value ]`, if value is not already an array. Only `undefined` yields an empty array.

## History & Codebase

Some of the functions & tests setup originated from outdated [uberscore](https://github.com/anodynos/uberscore). Parts of the library has originated from transpiled CoffeeScript v1, so some code (mainly testing) is a bit unreadable, as redundant code is present (excessive `let`, `ref` variables, obsolete `results.push()` in loops, not needed returns etc.

## Versions & Generations

**Zen** versions follows [Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning): Only when it breaks functionality (hopefully rarely) eg with current version 1.x.x, it goes from 1.x.x to 2.0.0 etc. Not when features are added. [Read more](https://www.geeksforgeeks.org/introduction-semantic-versioning).

What's more interesting, is **Generation**, which is quite independent of Version.

- Version 1.0.0 & Gen 1.0.0 is with initial functionality, with many Not Implemented exotic features, but still immensely useful ;-) Tested enough, but not battle tested yet. Version 2.0.0, 3.0.0 etc will be just iterations, possibly breaking of those! Think of v1.0.0 G1 as 0.1.0 & then v2.0.0 G1 as 0.2.0, but with semantic versioning!

- Gen 2.0.0, Version XX.0.0 (unknown yet) will start dealing with some future features stuff and a more stable release train!

### Future Features - G2/G3 & Beyond

- Synergy with `ValidZen`, to augment with the **Runtime Type Checks** and **Static & Runtime Args Extraction & Function Signature Validation** for Functions with one or more overloaded signatures. Imagine `Joi` / `yup` / `zod` on steroids, via `ValidZen`'s & `Zen`'s magic sauce. 

- `ZenType` to the next level: enclose your code or function in a `ZenType` block/decorators and get: 
  - Better TypeScript types, leveraging the vast amount of Type helpers that emerge in `Zen`, `type-fest`, `ValidZen` and others (eg imagine `TnumberString[]`)!
  - Runtime type checks, declaratively/automagically in function calls (see `ValidZen` above). Your code should never need to check or choke on types no more!   

- Functional Programming flavour `zen/fp` (like `lodash/fp` / `Ramda`), while supporting `options` optionally - for example:
  - `zf.filter(filterCb)(value)`
    -`zf.filter(filterCb, options)(value)`

- Assess `loop()` & `project()/map()/filter()/reduce()` support/interoperability for other **Pull Iterables** (like IxJs, nodejs  streams API etc) and more.

- Wild thinking about Push Iterators like RxJs/Signals/Push Streams? Can these API's ever converge via `loop()`, with a mediator buffer in the middle (backed by memory or a KeyValue store)?

- More functions like `findKey`, `filterKeys` & more from lodash

- Refine Type System based on feedback & battle tests

- Refactoring, more synergies, more options

- Improve Docs - separate stuff & more examples upfront

- Fix Bugs, improve performance

- More/better tests via SpecZen

# Installation & Usage

    npm i @neozen/zen

Then in your code (ES Modules or TypeScript):

    import * as z from '@neozen/zen'

and then

    z.getProp(obj, 'a/b/c')

OR

    import { getProp, setProp } as z from '@neozen/zen'

and then

    setProp(obj, 'a.b.c', 123, {seperator: '.'} )

Similarly, in CommonJS:

    const z = require('@neozen/zen')

OR

    const { getProp, setProp } = require('@neozen/zen')

# Developing & Testing: CliZen

## CliZen

Zen uses CliZen, a collection of conventions around npm scripts, that makes it easier to develop & test projects, by providing a simple & consistent interface. CliZen allows you to build, test, watch for changes and re-run, generate documentation etc via a simple & consistent CLI.

### CliZen Conventions

You only need these 2 conventions to understand the scripts:

- `~` (Post-fix) means it opens one or more `neoTerm` consoles **and returns control**, perhaps after some sleep. It typically opens multiple `neoTerm` consoles, some might be a one-off command that closes, but typically they are xxx! commands, that just stay open and execute on changes etc

- `!` (Post-fix) eg `test!` means it's a `test:watch`, so control is NOT returned once it runs. These are tasks like `test:watch` or `build:watch` (we now write them as `build!` & `test!`) which re-run when we have some signal, like code changes etc. When you can run in your current Terminal, it blocks your input, and you need to open a new terminal manually. So they will probably be invoked to run inside their own neoTerm, by some other `task~` that groups them together logically. 
 
For example `dev~: 't -npr build! test! serve!'` will call them serially, and each will open in it own `neoTerm`. These commands typically have a plain equivalent, that runs once & finishes (eg the straight `test` without watch, used in ci etc). These 2 should behave roughly the same (and the `'task!'` could call into the plain `'task'` via extra `--watch` flags or nodemon etc). 

In rare cases, the simple `xxx!` can't run in one terminal (eg having 2 different kind of tests running at the same time, say `jest!` and `assert!`), then we only have `test~` which calls `t jest! assert!` to open two separate test in different `neoTerm` consoles. In these cases, we only note the `tilda~`, as the watch inside is assumed.

### `neoTerm` in CliZen

All npm scripts that are post-fixed with a **tilde** (i.e `~`), for example `npm run dev~`, rely on [neoTerm](https://neoterm.dev) that opens new `neoTerm` Terminals / Consoles where it is required, to separate the building, testing etc processes and thus make development & testing easier to follow. You can mimic what `neoTerm` does, by executing each npm script contained in it at a separate terminal window manually ;-)

## Development Installation

Zen is part of the `neozen-tools` [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo.

To start development installation, clone the repo locally, cd to the repo's root and execute:

    $ npm install

to install the repo's root dependencies.

You'll also need `npm-run-all` globally (as local `npx npm-run-all` fails for some reason):

    $ npm install -g npm-run-all

Finally execute:

    $ npm run boot

This will run a boostrap pipeline that installs all dependencies inside `./packages`, builds all packages, and installs locally all sibling deps via DistZen.

**Note**: DO NOT run a normal `npm install` inside each package, as this will fail (since it can not find sibling dependencies).

You can issue an:

    $ npm run test

inside neozen-tools root, to execute all tests in all packages & verify everything's OK.

NOTE: Tests in src/code/loopzen/__tests__/all-typings are generated and are literally HUGE! Nodejs crashes with default RAM, so you need to run them with `
export NODE_OPTIONS="--max-old-space-size=8192"` on your node (might work with less). Also note they will take a long time to run (up to 5 or 10 minutes, depending on your machine), so you might want to run them separately:

- This will run ONLY those long tests

    $ npm run test:long! 

- And this will run the rest of the tests

    $ npm run test:short!

You can also configure other "workbench" tests when developing, examples in package.json

## Development

For the quickest and fullest development cycle for Zen, you can issue:

    $ cd packages/zen

    $ npm run dev~

_(mind the tilde ~)_ This starts the development environment, which watches for changes and re-builds & re-tests the project (along with the assert-based integration light test suite) and also watch-builds and serves the documentation. Each of these tasks is running in a separate terminal window (4 in total) which relies on [neoTerm](https://neoterm.dev) (preview only - not fully released).

You can also run the following commands in 3 separate terminal windows to mimic it:

    $ npm run build:watch
    $ npm run mocha:watch    
    $ npm run docs:watch

or you can pick which ones you need each time ;-)

## Testing

Assuming the project has being built, execute

    $ npm test

which runs Mocha based tests and then generates the assert-based integration test suite and executes it. It runs only once and stops.

Similarly, you can also run `$ npm run test:coverage` to see the test coverage.

WARNING: Tests will fail with nodejs < 20 & you need `NODE_OPTIONS=--max_old_space_size=8096` in your environment. Make sure `$ node -e 'const ram=v8.getHeapStatistics().heap_size_limit/(1024*1024);const low=ram<8000;console[low ? `error`:`log`](`${ low ? "WARNING" : "NOTE"} nodejs heap_size_limit RAM =`, ram)'` returns at least `8144` Mbytes

NOTE: tests (& build) take a huge time to run (5-15 minutes, depending on machine), cause a lot of combinations are generated (if generation is on, see `src/test-utils/generate.ts`)! 

### Testing with watch

Execute

    $ npm test!~

_(mind the tilde ~)_
which (assuming the project has been build) runs the tests in 2 separate terminal windows (via [neoTerm](https://neoterm.dev)) and watches for changes to re-run them.

So for now you run this in a separate terminal window:

    $ npm run mocha:watch

### Testing on multiple node engines via Docker (*Nix/WSL only)

Zen is tested against the node version contained in `.docker-node-versions` file, which is currently

* 22.11.0
* 20.18.0

To test against all `.docker-node-versions`, first execute `$ chmod +x z/*` to make the scripts executable. Then issue:

    $ npm run test:all_node_versions

To test a specific node version, issue:

    $ npm run test:node_version 20.18.0

## TypeScript versions

The Zen library is best used with TS version > 5.0, ideally `5.6.3` that is used to compile and run all the tests. It has been tested that it compiles with projects on `5.0.2` & `4.9.5` but its advised that `5.x` is used.   

## Documentation

To generate the documentation, execute:

    $ npm run docs:build

To generate the documentation while watching for changes and regenerating and also serve via a local-web-server, execute:

    $ npm run docs:watch

These generate docs inside `./dist/docs-html` directory, in HTML format using [TypeDoc](http://typedoc.org/). You can serve via a local web server, by executing:

    $ npm run docs:serve

and then browse to [http://localhost:8091](http://localhost:8091)

# Acknowledgements, references, inspirations & useful links ;-) 

- https://zirkelc.dev/posts/extract-class-methods
- [type-fest](https://github.com/sindresorhus/type-fest)
- https://blog.logrocket.com/pattern-matching-type-safety-typescript/
- @todo: add others / stackoverflow, keysFiltered etc.

# License

MIT NON-AI

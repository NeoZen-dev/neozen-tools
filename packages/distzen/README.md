# DistZen v1.0.0

Install & watch clean/copy/sync multiple local packages, production-level via `npm i`, without symlinks, in a snap! All that with a single line of config (the package & path)! Works great with Docker, monorepos (eg npm workspaces) & standalone. 

**Note**: Currently, it is tested / supports only TypeScript projects, vanilla JS support coming in the near future.

## TLDR

Symbolic links for `node_modules` (i.e `npm link`, npm/yarn workspaces etc) are great, but they cam cause huge headaches: 
* they fail with Docker (when docker container mounts local dir, symlinks aren't followed)   
* WSL/networked access (open a project that resides inside your WSL, links aren't followed) 
* inconsistent usage of non-published lib artifacts (files that should, but don't exist on the published lib, but is present on the project's dir, appears as working. But it will break in when published one is used!).  
* use a different lib package than intended: your full dir linked is different to what is published! The simplest error is having a devDependency, that should really be a normal dependency! 

I'm sure there's more scenarios that links can suck.

But monorepos and npm/yarn workspaces excessively use linking, and don't allow for a **real installation** strategy (that is same as if the lib was published and installed from the npm registry).

On the other hand, links always point to the exact latest code, without any syncing needed, so it's great for development.  

**DistZen** helps you having monorepo packages (or even unrelated foreign packages) **installed locally**, synchronise easily & quickly when there are changes, and work seamlessly with Docker & networking, since it doesn't use Symbolic Links!  

#### Usage:

In your BigApp's `package.json` or `.distzen.yml` add:

      "localDependencies": {
         "great-lib1": "../path/to/great-lib1",
         "great-lib2": "../other/path/to/great-lib2",      
      }

then execute: 

    $ distzen --watch

and `great-lib1/2` will always be properly locally installed & synced in your BigApp's `node_modules/great-libX/dist`, in a snap!

Can it get easier that this?

## Intro 

You often need to work locally together with packages that are external dependencies (eg **Libraries**) in your Dependant **BigApp** you're working on, and have them always at sync. Monorepos and npm use Sympolic Links, which cause many issues - see below. 

While you develop/debug Libs and App, you want to have any change in Libs installed properly and their changes instantly reflected inside the App's `node_modules`. Even if your BigApp, runs inside a Docker or WSL! 

You need to instantly restart the App with the new changed code (or better Hot Reload), without a single build step, intervention or other time-consuming way. No docker rebuilds or restarts. The App should instantly reflect the change in the lib, as if the Lib was part of your App's source code!     

DistZen helps do that, as it watches for changes, installing missing dependencies, copying and removing obsolete residual files (such `*.js *.d.ts *.js.map`), while you're tweaking both App & libraries!

At every build of your lib (from an incremental `build:watch` to full clean build), you get the package/library assets, 100% npm installed, 100% identically reflected in all your Application's `node_modules`. All in a snap, a second or two is all it takes for each small change, after the slowish initial `install-local` step is done. 

All without having to publish to npm (I 've seen this), having to reinstall via custom `npm pack` scrips or (better) `install-local`, or worse of all `npm link` of the library. 

And Without having to write scripts to automate this horrid process! All of these tasks are time-consuming and error-prone. And the fastest one of all (symbolic links) is also breaking in many cases! 

## Why? Motivation

- Symbolic Linking problems - see below.
- I'm personally using `install-local` for years, works great but workflow is slow for fresh installs, at every lib change.
- I'm also using [`ts-clean-built`](https://github.com/wclr/ts-clean-built) lately, which has saved me from having the wrong (residual) files around.
- I had to have scripts for cleaning & copying & watching `./dist` folders, to support this workflow (get a fresh compilation inside my Dependant App quickly). 

Having to deal with all those via npm scripts was doable, but very verbose and error-prone. They couldn't scale up!

I decided to write DistZen to solve all this in a single declaration!

## Symboplic Linking Problems

Monorepo tools (historically lerna, now npm/yarn workspaces) and `npm link` solve the inter-project local dependencies problem by symbolic linking. [It seems to work great... but](https://github.com/lerna/lerna/issues/2256#issuecomment-539253511) it has [many issues](https://github.com/lerna/lerna/issues/3590):  

### Symbolic Links break on Docker

Docker breaks on Symbolic Links, when you have mounted your local `node_modules`, for instance in `docker-composer.yml`: 

    volumes:
        - ./node_modules:/srv/node_modules

The Docker OS can't possibly follow the links on the Host! In general, symlink-based monorepo tools (such as the now-historical lerna) aren't made to support [Dockerisation of a single package](https://github.com/lerna/lerna/issues/1703) and [supporting Docker altogether](https://github.com/lerna/lerna/issues/2256#issuecomment-539253511).

But why would you mount your local `node_modules` inside the Docker container? 

At **development time**:

- It makes `docker:build` rapidly fast (no `npm i` step is needed at docker build, as it uses your already installed `node_modules`). 
- Also, you have the exact same `node_modules` used in your IDE and the execution environment, always up-to-date. 
- Finally, you have the ability to tweak/update `node_modules` with hot restart/reload, while Docker container continues to be up and running! 

### Symbolic Links breaks on Windows WSL

When you access those files on `\\wsl.localhost\...` or any other scenario of Mapped/Shared netowrk drives, the Symbolic Links break. When you open the folders File manager or an Editor/IDE, you'll only see the link icon! Links cant be followed, and your IDE's resolution of libs breaks down. 

### Symbolic Links management for non-monorepo 

What if you want to sync the lib's output (i.e pull its changes), to a project/app OUTSIDE your monorepo? 
Then links have to be maintained by you! And these links can't be commited, shared, audited. Not a good idea...  

### Symbolic Links confuse navigation of local node_modules

Let's say `great-app` is using `my-great-lib1` which is turn uses `third-party-lib` and you have issues with them and want to debug or tweak. Assume `my-great-lib1` is linked to `great-app`, but `third-party-lib` isn't (i.e it comes from npm registry). 

Now, if you navigate to `node_modules/my-great-lib1` and then head off to `third-party-lib`, you'll end up in your local  `my-great-lib1/node_modules/third-party-lib` and NOT the one you might have expected, i.e `great-app/node_modules/third-party-lib`. This is how node its self resolves dependencies when encountering links: it's not using `third-party-lib` of your `great-app` when you're using `my-great-lib1`, but it does for the rest of the `great-app`. Hence, you have TWO different versions of `third-party-lib` running, even if they are the same version, which can complicate things not just when debugging, but also when you're normally operating!   

You can also read [`install-local`'s view](https://github.com/nicojs/node-install-local#whats-wrong-with-npm-link) on linking.

## Can we solve all this mess ?

We can try

### Install locally

You could partially solve this with just package [`install-local`](https://www.npmjs.com/package/install-local) (*DistZen* does under the hood). The problem with vanilla install-local is that it takes a while (minutes sometimes) to actually do the "proper" `npm install`. Hence, it's not good for rapid re-compilation resulting to rapid re-integration & re-testing in a Hot Reload/TDD manner ;-)

### Copy / Update folders

You could also automate with an update recursive update copy of `./dist` folder (like *DistZen* does), using for example `cp -r -u -v ...`, but be careful where you're copying to, you might end up with `/mylib/dist/dist` easily ;-) Also, `cp ...` wont work on Windows! 

Another option is to use something like [`mirror-directories`](https://github.com/insidewhy/mirror-directories), but it deals with directories, not packages and does only that. 

### Clean / tidy up folders

Especially if you use TypeScript or any other compiled language, you might have residual files (eg when you refactor your lib, you end up with have `leftovers.js` & `leftovers.d.ts` etc) after copying. These can drive your IDE and execution crazy! Hence, you would need to use something like [`ts-clean-built`](https://www.npmjs.com/package/ts-clean-built) after the copying is done.

### Watch for changes

Then you would need to do all those steps, everytime your `great-lib/dist` folder changes, hence you might go with something like the popular [nodemon](https://www.npmjs.com/package/nodemon), and you'll probably need a nodemon config, scripts to invoke it and execute all the above each time! 

### Scripts Dichotomy

For all these scripts, you need to maintain a number of source & destination package directories, their dist/build folders and so on. Many commands to try out and test.

But the main question that begs is **where would you add those install, clean, copy, watch scripts etc** ? You have 2 choices:  

#### 1: Push, great-lib scripts

You can add all those onto your **great-lib** `package.json` scripts (i.e push lib changes to App(s)). 

Your lib would become very verbose, for every **great-app** that uses it! 
And it needs to know about them all! 
And update them all, all the time, whether you're working on those Apps or not, just cause you meddling with the lib! 

Worse off, these scripts are irrelevant to *YourLib*, i.e the copy & clean & watch scripts are useful only at your current dev time, at your machine, for you. You probably don't want to share those when publishing and sharing with others. 

#### 2: Pull, great-app scripts

If you add all those stuff to **great-app** `package.json` scripts, you're pulling lib changes into your App's node_modules. It is more legit, but again the scripts are horid: you have to maintain all those directories in multiple places. Imagine the configs and scripts inside **great-app** to nodemon watch and copy/clean/install from some folder in `../some/path/node_modules/great-lib/dist`? Horrible.         

# What DistZen does

In a nutshell, **DistZen** performs all of the above, **inside each Target App**, in a highly optimized workflow and with minimum config (in your `package.json` or `.distzen.yml`):

      "localDependencies": {
         "great-lib1": "../path/to/great-lib1",
         "great-lib2": "../other/path/to/great-lib2",      
      }

That's all you need, 95% of the time! In detail, a DistZen cycle performs: 

1. (Optionally) does a `clean` (i.e `rimraf`) of all your great-app's artifacts of the lib on your App's node_modules (eg. the `great-app/node_modules/great-lib*/dist` folders), the 1st time it runs. It can also `deepClean`, the whole package ;-) 

2. Runs `install-local` of all libs (only if needed - missing `package.json` or is a symbolic link)

3. Executes [`ts-clean-built`](https://github.com/wclr/ts-clean-built) to clean up residual files, the `./source` against your `./mylib/dist` folder. Having residual files can "confuse" your build and break your app when you clean + build, and should definitely have [`ts-clean-built`](https://github.com/wclr/ts-clean-built) in your TDD workflow!

4. Copies all `./dist` lib files into `node_modules/mylib/dist` (recursive & update only, cross-platform via `fs-jetpack`[https://github.com/szwacz/fs-jetpack#])

5. Executes [`ts-clean-built`](https://github.com/wclr/ts-clean-built), this time the `./source` against your dependant App version of the lib), i.e. `/great-app/node_modules/mylib/dist`

6. Watches for changes on all lib's `./dist` folder and executes the above all over again, with a configurable [debounce](https://css-tricks.com/debouncing-throttling-explained-examples). 

All of that with ONE simple configuration, "localDependencies"! Can't get any simpler than this!

You can (and should!) also have the normal dependencies on your package.json, and it won't bother npm or DistZen: 

      "dependencies": {
         "great-lib1": "@3.6.9",
         "great-lib2": "^@42",      
      },

* *Note*: On monorepo setups that use symlinks (e.g. the now-historical lerna `bootstrap`, or npm/yarn workspaces), sibling libs are installed as symbolic links on the dependent packages that need them. When `install-local` executes the first time, it is replacing them by a "proper" installation.

## Usage & Workflow 

1. `npm install -g distzen` or install locally with `npm i distzen` 

2. Optionally create a config `.distzen.yml` at your Application project root, using [read-config-ng](https://www.npmjs.com/package/read-config-ng) rules.


      dryRun: false                    
      logLevel: info
      localDependecnies:  # not needed if "localDependecnies" exists on yout package.json (from install-local)
        great-lib1: ../my/app/path/great-lib1
        great-lib2: ../../some/app2/path/great-lib2    

and more options - see `$ dist --help` below for full options list.

3. Execute it!


      $ distzen

It does all the work it needs to do! 

4. Optionally add or adjust these to `package.json` scripts of your Application:

       "distzen": "npx distzen",
       "distzen:watch": "npx distzen --watch",
       "build:watch": "npm-run-all --parallel build:ts:watch distzen:watch",

& invoke it when you start your App development. With `build:watch`, any changes in your lib will be reflected back to App! 

## Usage: CLI & config options

```
╰─$ distzen --help
Usage: distzen [options]

Install & watch clean/copy/sync multiple local packages, production-level via `npm i`, without symlinks, in a snap!

All options can be used on cli or config (except "localDependencies" & "targetDepNames" below which are config-only).

Config (optional) looks like:

      # file: .distzen.yml

      # The "localDependencies" can also reside in package.json and they are merged. You need to have ALL localDependencies declared somewhere, cause npm can't do partial installs.

      "localDependencies":
        "great-lib1": "../path/to/great-lib1"
        "great-lib2": "../other/path/to/great-lib2"
        "great-lib3": "../other/path/to/great-lib3"

      # A string[] of the dependency names you only care about (to watch, clean, copy, ts-clean-build etc).
      # If omitted, all "localDependencies" become targets

      "targetDepNames":
        - "great-lib1"
        - "great-lib2"

Examples:

      $ distzen --watch                                  # executes & watches, using default config ".distzen.yml"

      $ distzen --config some-config.json                # executes, using "some-config.json"


Options:
  -c --config <config>      Use given config filename, relative to cwd (not workDir). Errors if not given file not found. Defaults to `.distzen.yml`, no error or warning if that is not found.
  -w --watch [debounce]     Watch all target dist directories for changes, trigger a DistZen cycle on changes. Note that clean & deepClean is only running on 1st run, so it's not participating on watch cycles. Debounce in milliseconds, defaults to 1000 - learn debounce here https://css-tricks.com/debouncing-throttling-explained-examples/. A Debounce of 2000 is recommended, if you are seeing many DistZen restarts while updating.

  -d --workDir <workDir>    Specify working directory, which is relative to CWD unless it starts with '/' or '~' where it becomes absolute. Default is CWD. All target apps are relative to this resolved
                            directory. Defaults to './'
  -l --logLevel <logLevel>  A LogLevel, using LogZen ELogLevel: [none, error, warn, log, ok, info, verbose, debug, silly]. Defaults to 'info'.
  -d --debug                Same as logLevel=DEBUG, outputs the command(s) before executing
  -y --dryRun               Enables debugging but it doesnt actually execute anything, only logs it
  -k --skipInstallLocal     Skip install-local, even if needed - might cause issues
  -f --forceInstallLocal    Force install-local, even if not needed - it takes a while!
  -n --clean [libs...]      Clean libs dist directory contents (inside the local App's node_modules) and exits.

      Filter specific libs using "$ distzen --clean my-lib" to clean my-lib only, i.e directory "great-app/node_modules/my-lib/dist".

      If [libs...] is completelly omitted, it deletes all "localDependencies" declared.

      By default it exits after cleaning, but you can avoid exiting with --noCleanExit
  -N --deepClean [libs...]  Like --clean, but it deletes the whole lib directory, i.e "great-app/node_modules/my-lib"
  -z --noCleanExit          Do not exit after clean/deepClean (default is to exit)
  -h, --help                display help for command
```

## Contributing

Help to improve *DistZen* is welcome! Please open an issue or PR if you have issues or suggestions. No automated tests currently, but please do test before! 

## References & inspiration

* [`install-local`](https://www.npmjs.com/package/install-local)
* [`nodemon`](https://www.npmjs.com/package/nodemon)
* [`ts-clean-built`](https://www.npmjs.com/package/ts-clean-built)
* [`fs-jetpack`](https://github.com/szwacz/fs-jetpack)
  
Copyright (c) 2023-24 Angelos Pikoulas a.k.a AnoDyNoS

MIT NON-AI License

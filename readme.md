# NeoZen Tools Monorepo

## Home of NeoZen tools:

* Zen
* LogZen
* ValidZen
* SpecZen
* DistZen

Check ./packages for the individual projects & docs

To install/build/test the whole monorepo:

Always use Node with increased heap_size_limit

export NODE_OPTIONS=--max_old_space_size=8096

```bash
rm -rf node_modules && npm i && npx npm-run-all nuke boot test 
```

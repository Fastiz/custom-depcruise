# Dependency cruiser
## About
Just playing around building a simple dependency cruiser that reads rules from a file. Those rules represent imports that are forbidden.
## Configure rules
Create a `rules-config.json` file in the root directory.
The file schema should be like the following:
````
{
    "rules": [
        {
            "name": "Dependencies should be instantiated only from the iocContainer",
            "fromPattern": "{{regex that matches the dependent module}}",
            "toPattern": "{{regex that matches the dependency module}}"
        },
        ...
    ]
}
````
## Run
For running the program just do:
- `yarn install`
- `yarn start`
The program will run in the same directory against the source code of this project. But it should be easy to support running in a different directory by modifying the file `/src/cli/violationsFromRuleFile/violationsFromRuleFile.ts`.
## Drawbacks
- This is a very naive implementation and it is not optimized at all
- Only works with files that have a `.ts` extension

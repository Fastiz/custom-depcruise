# Dependency cruiser
## About
Just playing around building a simple dependency cruiser.

Features:
- Find import violations specified from a configuration file
- Create a graph of dependencies in .dot format

## How to run
### Import violations
#### Configure rules
Those rules represent imports that are forbidden. For configuring them create a `rules-config.json` file in the root directory.
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
#### Run
For running the program just do:
- `yarn install`
- `yarn run violationsFromRuleFile -- {{rootFile}} {{rulesFilePath}}`

Where:
- {{rootFile}} is the path of the source file to start cruising from. The .ts extension should be excluded.
- {{rulesFilePath}} is the path of the file that defines the rules

### Dependency graph
#### Run
For running the program just do:
- `yarn install`
- `yarn run exportDependencyGraph -- {{rootFile}}`

Where:
- {{rootFile}} is the path of the source file to start cruising from. The .ts extension should be excluded.

The program will print into the standard output the content of a .dot file. This .dot file can be converted into an image using [graphviz](https://www.graphviz.org/doc/info/command.html).

#### Example graph
![dependency-graph](https://user-images.githubusercontent.com/12635493/227739484-a51b3115-5560-4faa-b4d0-7fb906f7b7bd.png)

## Drawbacks and pitfalls
- This is a very naive implementation and it is not optimized at all
- Only works with files that have a `.ts` extension
- The program takes the base path as the current working directory. This is used for mapping imports relative to the project to the absolute path in the computer.

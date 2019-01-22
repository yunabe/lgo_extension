# lgo_extension

JupyterLab extension for Go Jupyter Kernel


## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install @yunabe/lgo_extension
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

## Version compatibility
`jupyter lab` builds the core JS library and extension JS libraries into one file with `webpack`.
If `jupyter lab` and extensions depend on different versions of `@jupyterlab/...` libraries,
it will cause the duplication of the libraries in the final output and may causes mysterious bugs.

At this moment, this extension depends on `^0.17` because the current latest version of jupyterlab installed with `pip` depends on `^0.17`.
I hope `jupyter lab` will develop the better way to manage this version skew issue in the future.

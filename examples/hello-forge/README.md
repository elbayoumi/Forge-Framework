# Hello Forge Example

A minimal example project for the Forge compiler.

## Structure

- `src/ui.js`: The semantic UI declaration.

## How to Build

Run the Forge CLI from this directory:

```bash
forge build
```

This will generate:

1. Semantic Bundle: `.forge/semantic/semantic.json`
2. Android Project: `.forge/native/android/`

## Inspecting

View the semantic structure without building:

```bash
forge inspect semantic
```

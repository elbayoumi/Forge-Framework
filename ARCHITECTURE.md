# Forge Architecture

## What is a Semantic Compiler

A semantic compiler extracts meaning from source code and transforms it into a different representation without executing the original code. Unlike traditional compilers that translate one programming language to another while preserving execution semantics, a semantic compiler analyzes intent and generates code that achieves the same outcome through different means.

Forge is a semantic compiler that:

1. Parses JavaScript UI declarations (syntax analysis)
2. Extracts semantic intent (what the UI should represent)
3. Generates native code that implements that intent

The key distinction: Forge does not translate JavaScript to native code. It extracts the semantic meaning of UI declarations and generates equivalent native implementations.

## Why Forge Avoids Runtime JavaScript

Runtime JavaScript execution on native platforms introduces fundamental problems:

**Performance**: JavaScript engines (V8, JavaScriptCore) add significant overhead. Even with JIT compilation, JavaScript execution is slower than native code for UI rendering.

**Bundle Size**: Shipping a JavaScript runtime increases application size by several megabytes. This impacts download time, storage, and memory usage.

**Security**: Runtime code execution creates attack surfaces. Dynamic evaluation and reflection capabilities in JavaScript runtimes are security liabilities.

**Debugging**: Runtime JavaScript requires source maps, remote debugging protocols, and dual-stack debugging (JavaScript + native). This complicates troubleshooting.

**Platform Integration**: JavaScript runtimes sit between application code and platform APIs, adding abstraction layers that complicate platform feature access.

Forge eliminates these problems by generating native code at build time. The output is indistinguishable from hand-written native applications.

## Component Responsibilities

### forge-core

**Purpose**: Type contracts and semantic model definitions

**Responsibilities**:

- Define TypeScript interfaces for semantic models (UI, State, Action, Design)
- Establish `ForgeSemanticBundle` as the canonical data structure
- Provide type-level validation contracts
- No runtime logic or implementation

**Exports**:

- Type definitions only
- No executable code

**Consumers**: All other Forge packages import types from forge-core

### forge-web-builder

**Purpose**: JavaScript → Semantic transformation

**Responsibilities**:

- Parse JavaScript UI declarations using Babel
- Extract semantic intent from AST
- Build `ForgeSemanticBundle` objects
- Write semantic bundles to `.forge/semantic/semantic.json`
- Provide orchestration entry point (`runWebSemanticBuild`)

**Input**: `src/ui.js` (JavaScript UI declarations)

**Output**: `.forge/semantic/semantic.json` (semantic bundle)

**Key Constraint**: No code generation. Only semantic extraction.

**Implementation**:

- AST parsing via `@babel/parser`
- Tree traversal and semantic mapping
- JSON serialization

### forge-native-android

**Purpose**: Semantic → Android code generation

**Responsibilities**:

- Read semantic bundles from disk
- Generate complete Android Gradle projects
- Map semantic components to Jetpack Compose code
- Create build configuration files (Gradle, Manifest)
- Generate Kotlin source files

**Input**: `.forge/semantic/semantic.json`

**Output**: `.forge/native/android/` (complete Gradle project)

**Key Constraint**: No semantic analysis. Only code generation from semantic bundle.

**Component Mapping**:

- `text` → `Text()`
- `button` → `Button(onClick = {...}) { Text(...) }`
- `column` → `Column { ... }`
- `row` → `Row { ... }`

**Generated Files**:

- `settings.gradle.kts`, `build.gradle.kts` (project config)
- `app/build.gradle.kts` (app config)
- `AndroidManifest.xml`
- `MainActivity.kt`, `AppTheme.kt` (Kotlin sources)

### forge-cli

**Purpose**: Orchestration and inspection

**Responsibilities**:

- Provide command-line interface
- Orchestrate build pipeline (web → android)
- Invoke forge-web-builder and forge-native-android
- Provide inspection commands for semantic bundles
- Handle errors and exit codes

**Commands**:

- `forge build web` - Invoke web semantic builder
- `forge build android` - Invoke Android code generator
- `forge inspect ui` - Display UI tree
- `forge inspect semantic` - Display full semantic bundle

**Key Constraint**: No business logic. Only orchestration and I/O.

**Error Handling**:

- Check for semantic bundle existence before Android build
- Provide clear error messages
- Exit with appropriate codes (0 = success, 1 = error)

## Determinism and Inspectability

### Determinism

Forge guarantees deterministic output: identical input produces identical output across all builds.

**Implementation**:

- Component IDs are generated using a counter that resets on each build
- No timestamps, random values, or system-dependent data in output
- JSON serialization uses consistent formatting (2-space indent)
- File generation order is deterministic

**Verification**: Running the same build twice produces byte-identical output files.

### Inspectability

Every stage of the Forge pipeline produces explicit, inspectable artifacts.

**Semantic Bundle** (`.forge/semantic/semantic.json`):

- Human-readable JSON
- Complete representation of UI intent
- Can be manually edited and re-compiled
- Single source of truth for code generation

**Generated Code**:

- Standard Gradle projects (no custom tooling required)
- Readable Kotlin code (no obfuscation)
- Can be modified post-generation if needed
- No hidden build steps or code injection

**Inspector Commands**:

- `forge inspect ui` - View UI tree structure
- `forge inspect semantic` - View complete semantic bundle
- Read-only operations (no side effects)

**Benefits**:

- Debugging: Developers can inspect intermediate artifacts
- Verification: Output can be manually reviewed
- Learning: Generated code serves as reference implementation
- Trust: No hidden transformations or magic behavior

## Design Principles

1. **Separation of Concerns**: Each package has a single, well-defined responsibility
2. **Explicit Artifacts**: All transformations produce inspectable output
3. **No Magic**: Every transformation is explicit and documented
4. **Compile-Time Only**: No runtime dependencies or execution
5. **Standard Output**: Generated projects use standard tooling (Gradle, Xcode)

## Future Extensions

The architecture supports future targets without modifying the semantic model:

- **iOS Generator**: Consume semantic bundle, generate SwiftUI code
- **Web Generator**: Consume semantic bundle, generate framework-agnostic HTML/CSS/JS
- **Desktop Generators**: Consume semantic bundle, generate Qt/Electron/native desktop code

Each new target is an independent package that consumes the same semantic bundle format.

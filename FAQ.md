# Forge FAQ

## Is Forge a framework?

No. Forge is a compiler.

Frameworks provide runtime libraries, component systems, and execution environments. Forge analyzes source code at build time and generates native applications. The generated code does not depend on Forge at runtime.

React is a framework. Forge is a compiler. They are fundamentally different tools.

## Does Forge run JavaScript at runtime?

No. Forge does not execute JavaScript on device.

The JavaScript you write is analyzed at build time to extract semantic intent. Forge then generates native code that implements that intent. The generated application contains zero JavaScript and no JavaScript engine.

Your `ui.js` file is a compile-time DSL, not runtime code.

## Why not just use React Native?

React Native runs JavaScript at runtime using a JavaScript engine (Hermes or JavaScriptCore). It maintains two execution environments (JavaScript and native) that communicate through a bridge. This creates:

- Runtime overhead (JavaScript engine execution)
- Memory overhead (dual execution environments)
- Synchronization complexity (bridge communication)
- Debugging difficulty (errors span two environments)

Forge generates pure native code at build time. No JavaScript runtime, no bridge, no synchronization. The tradeoff is compile-time restrictions (static analysis only).

If you need dynamic runtime behavior, use React Native. If you can express your UI statically, Forge generates smaller, faster applications.

## Why not just use Flutter?

Flutter uses a custom rendering engine (Skia) and Dart runtime. It draws every pixel itself rather than using platform-native UI components. This creates:

- Non-native appearance (custom rendering, not platform widgets)
- Runtime overhead (Dart VM execution)
- Framework dependency (Flutter runtime required)
- Platform integration complexity (plugins for native features)

Forge generates platform-standard native code (Jetpack Compose, SwiftUI). No custom rendering engine, no framework runtime. The output uses the same UI components as hand-written native apps.

If you need a mature, production-ready cross-platform framework, use Flutter. If you want compile-time generation of platform-native code, use Forge (when it's mature).

## Why is the DSL so strict?

Forge performs static semantic analysis. It must understand your UI structure at compile time without executing code.

Variables, loops, and conditionals require runtime execution:

```javascript
// This requires runtime execution to determine the value
const greeting = Math.random() > 0.5 ? "Hello" : "Hi";
ui(text(greeting));
```

Forge cannot execute this code. It can only analyze static structure:

```javascript
// This is static structure
ui(text("Hello"));
```

The strictness is not arbitrary. It is a fundamental constraint of compile-time semantic analysis.

Future versions will support conditional rendering and lists through **semantic primitives** (compile-time declarations of runtime behavior), not runtime JavaScript execution.

## Why no arrays?

Arrays are runtime data structures. Forge does not execute code.

```javascript
// This is runtime code
const items = [1, 2, 3];
items.map((i) => text(i));
```

This requires:

1. Creating an array at runtime
2. Iterating over it at runtime
3. Calling a function for each element at runtime

Forge cannot do any of this. It only analyzes static structure.

Future versions will support list rendering through semantic primitives:

```javascript
// Hypothetical future syntax (not implemented)
list(items, (item) => text(item.name));
```

This declares the **intent** to render a list. Forge can analyze this intent at compile time and generate appropriate native code (LazyColumn in Compose, List in SwiftUI).

## Why no JSX?

JSX is syntax sugar for function calls. It requires a transpiler (Babel) configured specifically for JSX.

Forge uses plain JavaScript function calls because:

1. No additional transpilation step required
2. Standard JavaScript parsers work without configuration
3. Simpler toolchain (fewer dependencies)
4. More explicit (function calls are clearer than XML-like syntax)

JSX support could be added in the future, but it provides no semantic value. `text("Hello")` and `<Text>Hello</Text>` express the same intent.

## Is this production-ready?

No. Absolutely not.

v0.1 supports:

- Four UI components (text, button, column, row)
- Android only
- No state management
- No navigation
- No user input beyond button clicks
- No styling
- No animations
- No network requests

You cannot build real applications with v0.1.

v0.1 is a **compiler architecture demonstration**. It proves the concept of compile-time semantic analysis and native code generation. It is not a usable framework.

Production readiness requires:

- Comprehensive component libraries
- State management primitives
- Navigation systems
- Multiple platform compilers (iOS, Web, Desktop)
- Extensive testing and validation
- Real-world usage and iteration

This is years away, not months.

## Why Android only?

Limited implementation time. Android was chosen first because:

1. Jetpack Compose provides a modern, declarative UI framework
2. Kotlin code generation is straightforward
3. Gradle projects are well-documented
4. Android Studio provides excellent tooling

iOS support (SwiftUI code generation) is planned for future versions. Web and Desktop will follow.

The architecture supports multiple platforms. Only the code generators are platform-specific. The semantic bundle is platform-agnostic.

## Can I use Forge with existing apps?

No. Not in v0.1.

Forge generates complete Android projects from scratch. It does not integrate with existing codebases.

Future versions may support:

- Generating individual screens/components
- Exporting as library modules
- Integration with existing navigation systems

But v0.1 is all-or-nothing: Forge generates the entire application, or you don't use Forge.

## Can I use npm packages?

No. Forge does not execute JavaScript.

npm packages are runtime libraries. They export functions, classes, and objects that execute at runtime. Forge only reads JavaScript as a declarative DSL.

There is no mechanism to "import" runtime behavior into a compile-time analysis tool.

## Can I write normal JavaScript functions?

No. Forge does not execute code.

Functions require runtime execution:

```javascript
function MyComponent() {
  return column(text("Hello"));
}

ui(MyComponent());
```

This requires:

1. Defining a function at runtime
2. Calling the function at runtime
3. Returning a value at runtime

Forge cannot do this. It only analyzes static structure.

Future versions may support **semantic components** (compile-time declarations of reusable UI patterns), but these will not be JavaScript functions.

## How does Forge compare to native development?

v0.1 is **far worse** than native development.

Native development gives you:

- Complete platform APIs
- Full component libraries
- Mature tooling and debugging
- Extensive documentation and community
- Production-ready stability

Forge v0.1 gives you:

- Four components
- No state management
- No navigation
- No styling
- Experimental tooling

The value proposition is **future potential**, not current capability. If compile-time semantic analysis proves viable, future versions could enable cross-platform development without runtime overhead.

But today, native development is objectively better for building real applications.

## What's the point if it's so limited?

Forge is a research project exploring compile-time semantic analysis.

The hypothesis: UI can be expressed as semantic intent (what you want) rather than imperative code (how to build it). If true, a compiler can analyze that intent and generate optimal native code for each platform.

v0.1 validates the compiler architecture:

- Parsing works
- Semantic analysis works
- Code generation works
- Deterministic builds work
- Inspectable artifacts work

The architecture is sound. Now it needs features, platforms, and real-world validation.

This is a long-term bet on a different approach to cross-platform development. It may fail. But if it succeeds, it could eliminate runtime overhead while maintaining native UI quality.

## When should I use Forge?

You should NOT use Forge for:

- Real applications
- Production projects
- Client work
- Anything with deadlines

You might use Forge for:

- Exploring compiler architecture
- Experimenting with semantic analysis
- Contributing to an early-stage project
- Learning about code generation

Forge is an experiment, not a product.

## How can I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) (if it exists) or open an issue to discuss.

Forge is architecture-first. Contributions must maintain:

- Deterministic builds
- Compile-time guarantees
- Inspectable artifacts
- Test coverage

Code quality and architectural consistency are more important than feature velocity.

## Where is this going?

The roadmap is aspirational, not guaranteed:

**v0.2:** Conditional rendering, lists, state management, navigation

**v0.3+:** iOS compiler, expanded component library, styling primitives

**v1.0:** Multiple platforms, comprehensive components, production-ready tooling

**Beyond:** Web compiler, desktop compilers, advanced semantic models

This assumes the approach proves viable. It may not. Forge is an experiment.

## Is Forge open source?

Yes. MIT license.

You can use, modify, and distribute Forge freely. No restrictions beyond standard MIT terms.

## Who maintains Forge?

This is an experimental project. Maintenance is not guaranteed.

If the experiment succeeds, a community may form. If it fails, the project may be abandoned.

Do not depend on Forge for anything important.

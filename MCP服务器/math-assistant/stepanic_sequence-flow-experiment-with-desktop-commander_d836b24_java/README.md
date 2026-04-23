# sequence-flow-experiment-with-desktop-commander
Fully AI generated Flutter app in Claude Desktop with 3.7 Sonnet by MCP servers desktop-commander and sequential-thinking

# Sequence Flow - HTN Planning System

A Flutter application for visualizing and managing Hierarchical Task Networks (HTN).

## Overview

Sequence Flow is an interactive HTN Planning System that enables users to model complex planning problems through a guided AI conversation. It provides a visual representation of planning tasks as a directed graph and supports hierarchical compression of subgraphs to manage complexity while preserving cross-boundary references.

## Key Features

- **Interactive Modeling**: Guided AI conversation for complex planning problems
- **Directed Graph Visualization**: Planning tasks displayed as a directed graph with complex dependencies
- **Hierarchical Compression**: Compress subgraphs to manage complexity while preserving references
- **Three-Column Interface**: AI chat, interactive graph, and hierarchical task list
- **Iterative Problem Solving**: Dynamic question selection based on current planning state
- **External Persistence**: Prevents data loss from LLM context limitations

## Project Structure

```
sequence_flow/
├── lib/
│   ├── behaviors/      # Implements HTN planning behaviors
│   ├── models/         # Data models for the application
│   │   └── entities/   # Core entity definitions
│   ├── screens/        # Application screens
│   ├── services/       # External service integrations
│   ├── utils/          # Utility functions and helpers
│   └── widgets/        # Reusable UI components
├── assets/             # Static assets (icons, images)
└── test/               # Unit and widget tests
```

## Getting Started

### Prerequisites

- Flutter (>= 3.6.1)
- Dart (>= 3.6.0)
- An IDE (VS Code, Android Studio, or IntelliJ)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sequence_flow.git
   cd sequence_flow
   ```

2. Install dependencies:
   ```
   flutter pub get
   ```

3. Run the app:
   ```
   flutter run
   ```

## Core Components

### Entities

- **Task**: The fundamental building block of HTN planning
- **Method**: Defines ways to decompose a compound task
- **TaskDecomposition**: Hierarchical relationship between tasks
- **TaskDependency**: Non-hierarchical dependencies between tasks
- **CrossBoundaryReference**: References that span compressed subgraph boundaries
- **WorldState**: Representation of world states during planning
- **Plan**: Solution to a planning problem
- **Conversation**: AI-guided planning conversation

### Behaviors

- **HierarchicalCompression**: Manages compression/expansion of subgraphs
- **AIGuidedPlanning**: Controls the AI-driven planning conversation
- **GraphStateManagement**: Manages persistence and history of graph state

### User Interface

- **ThreeColumnLayout**: Main application layout with three panels
- **AIChat**: Left column for conversation with AI
- **DirectedGraph**: Middle column for graph visualization
- **TaskList**: Right column for hierarchical task view

## Development

### Code Style

This project follows the official [Dart style guide](https://dart.dev/guides/language/effective-dart/style) and uses the recommended Flutter lints.

### Building

Build for web deployment:
```
flutter build web
```

## Acknowledgments

- This project is based on HTN planning techniques for complex domain modeling
- The UI/UX design is inspired by modern graph visualization tools

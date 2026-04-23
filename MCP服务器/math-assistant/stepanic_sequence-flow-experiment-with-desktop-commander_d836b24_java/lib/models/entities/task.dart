import 'dart:convert';

/// Task type enumeration.
enum TaskType { COMPOUND, PRIMITIVE, METHOD }

/// Represents an action or activity in the planning domain.
///
/// Tasks can be either compound (decomposable) or primitive (directly executable).
/// Compound tasks can be broken down into subtasks, while primitive tasks represent
/// concrete, executable actions. Tasks can be compressed/expanded to manage visual complexity.
class Task {
  /// Unique identifier for the task.
  final String id;

  /// Human-readable name of the task.
  String name;

  /// Detailed description of the task.
  String description;

  /// Classification of the task (COMPOUND, PRIMITIVE, METHOD).
  TaskType type;

  /// Whether the task can be decomposed into subtasks.
  bool get isCompound => type == TaskType.COMPOUND || type == TaskType.METHOD;

  /// Whether the task's subtasks are currently hidden/serialized.
  bool isCompressed;

  /// JSON representation of compressed children when task is compressed.
  String? serializedSubgraph;

  /// Additional properties including UI positioning.
  Map<String, dynamic> metadata;

  /// List of child tasks (subtasks).
  List<Task> children = [];

  Task({
    required this.id,
    required this.name,
    required this.description,
    required this.type,
    this.isCompressed = false,
    this.serializedSubgraph,
    Map<String, dynamic>? metadata,
  }) : metadata = metadata ?? {};

  /// Serializes subtasks and hides them.
  void compress() {
    if (!isCompound || children.isEmpty) return;
    
    serializedSubgraph = jsonEncode({
      'children': children.map((child) => child.toJson()).toList(),
    });
    isCompressed = true;
    children.clear();
  }

  /// Deserializes and shows subtasks.
  void expand() {
    if (!isCompound || !isCompressed || serializedSubgraph == null) return;

    final Map<String, dynamic> data = jsonDecode(serializedSubgraph!);
    final List<dynamic> childrenData = data['children'] as List<dynamic>;
    
    children = childrenData
        .map((childData) => Task.fromJson(childData as Map<String, dynamic>))
        .toList();
    
    isCompressed = false;
    serializedSubgraph = null;
  }

  /// Adds a subtask to this task.
  void addChild(Task child) {
    if (!isCompound) return;
    children.add(child);
  }

  /// Removes a subtask by ID.
  void removeChild(String childId) {
    if (!isCompound) return;
    children.removeWhere((child) => child.id == childId);
  }

  /// Creates a dependency to another task.
  void connectTo(Task target, String dependencyType) {
    // Implementation will be added when TaskDependency is created
  }

  /// Converts task to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'type': type.toString().split('.').last,
      'isCompressed': isCompressed,
      'serializedSubgraph': serializedSubgraph,
      'metadata': metadata,
      'children': children.map((child) => child.toJson()).toList(),
    };
  }

  /// Creates a Task from JSON representation.
  factory Task.fromJson(Map<String, dynamic> json) {
    final task = Task(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      type: TaskType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
        orElse: () => TaskType.COMPOUND,
      ),
      isCompressed: json['isCompressed'] as bool? ?? false,
      serializedSubgraph: json['serializedSubgraph'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>? ?? {},
    );

    if (json.containsKey('children') && json['children'] is List) {
      for (final childJson in json['children']) {
        task.children.add(Task.fromJson(childJson as Map<String, dynamic>));
      }
    }

    return task;
  }
}

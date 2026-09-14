import 'dart:convert';
import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';
import '../utils/id_generator.dart';
import 'enums.dart';

part 'task.g.dart';

/// Represents an action or activity in the planning domain.
/// Compound tasks can be broken down into subtasks.
/// Primitive tasks represent concrete, executable actions.
/// Tasks can be compressed/expanded to manage visual complexity.
@JsonSerializable()
class Task extends Equatable {
  /// Unique identifier
  final String id;
  
  /// Human-readable name
  final String name;
  
  /// Detailed description
  final String description;
  
  /// Task classification
  final TaskType type;
  
  /// Whether it can be decomposed
  final bool isCompound;
  
  /// Whether its subtasks are hidden/serialized
  bool isCompressed;
  
  /// JSON representation of compressed children
  String? serializedSubgraph;
  
  /// Additional properties including UI positioning
  final Map<String, dynamic> metadata;

  Task({
    String? id,
    required this.name,
    required this.description,
    required this.type,
    this.isCompound = false,
    this.isCompressed = false,
    this.serializedSubgraph,
    Map<String, dynamic>? metadata,
  }) : id = id ?? IdGenerator.generateId(),
       metadata = metadata ?? {};
  
  /// Serializes subtasks and hides them
  void compress(List<Task> children) {
    // Only compound tasks can be compressed
    if (!isCompound) return;
    
    // Serialize the children to JSON
    serializedSubgraph = jsonEncode(children.map((e) => e.toJson()).toList());
    isCompressed = true;
  }
  
  /// Deserializes and shows subtasks
  List<Task> expand() {
    // If not compressed or no serialized data, return empty list
    if (!isCompressed || serializedSubgraph == null) return [];
    
    // Convert serialized data back to tasks
    final List<dynamic> decodedList = jsonDecode(serializedSubgraph!);
    final List<Task> tasks = decodedList.map((json) => Task.fromJson(json)).toList();
    
    // Mark as expanded
    isCompressed = false;
    serializedSubgraph = null;
    
    return tasks;
  }
  
  /// Creates a copy of this task with optional new values
  Task copyWith({
    String? name,
    String? description,
    TaskType? type,
    bool? isCompound,
    bool? isCompressed,
    String? serializedSubgraph,
    Map<String, dynamic>? metadata,
  }) {
    return Task(
      id: id,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
      isCompound: isCompound ?? this.isCompound,
      isCompressed: isCompressed ?? this.isCompressed,
      serializedSubgraph: serializedSubgraph ?? this.serializedSubgraph,
      metadata: metadata ?? Map.from(this.metadata),
    );
  }
  
  /// Convert to JSON for serialization
  Map<String, dynamic> toJson() => _$TaskToJson(this);
  
  /// Create from JSON for deserialization
  factory Task.fromJson(Map<String, dynamic> json) => _$TaskFromJson(json);
  
  @override
  List<Object?> get props => [
    id, name, description, type, isCompound, isCompressed, serializedSubgraph, metadata
  ];
}

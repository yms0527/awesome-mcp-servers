import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';
import '../utils/id_generator.dart';
import 'enums.dart';

part 'task_dependency.g.dart';

/// Represents dependencies between tasks beyond the hierarchical structure.
/// These include ordering constraints, causal links, resource usage, etc.
/// This enables modeling of complex relationships in a directed graph structure.
@JsonSerializable()
class TaskDependency extends Equatable {
  /// Unique identifier
  final String id;
  
  /// Task that must be completed first
  final String sourceId;
  
  /// Task that depends on the source
  final String targetId;
  
  /// Type of dependency
  final DependencyType type;
  
  /// Specific constraint details
  final String? constraint;

  TaskDependency({
    String? id,
    required this.sourceId,
    required this.targetId,
    required this.type,
    this.constraint,
  }) : id = id ?? IdGenerator.generateId();
  
  /// Creates a copy of this dependency with optional new values
  TaskDependency copyWith({
    String? sourceId,
    String? targetId,
    DependencyType? type,
    String? constraint,
  }) {
    return TaskDependency(
      id: id,
      sourceId: sourceId ?? this.sourceId,
      targetId: targetId ?? this.targetId,
      type: type ?? this.type,
      constraint: constraint ?? this.constraint,
    );
  }
  
  /// Convert to JSON for serialization
  Map<String, dynamic> toJson() => _$TaskDependencyToJson(this);
  
  /// Create from JSON for deserialization
  factory TaskDependency.fromJson(Map<String, dynamic> json) => 
      _$TaskDependencyFromJson(json);
  
  @override
  List<Object?> get props => [id, sourceId, targetId, type, constraint];
}

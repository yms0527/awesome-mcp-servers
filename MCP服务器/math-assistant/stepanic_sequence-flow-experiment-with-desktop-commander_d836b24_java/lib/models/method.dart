import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';
import '../utils/id_generator.dart';
import 'task.dart';

part 'method.g.dart';

/// Represents a strategy for accomplishing a compound task.
/// A compound task may have multiple alternative methods.
/// Methods define the subtasks and their ordering constraints.
@JsonSerializable()
class Method extends Equatable {
  /// Unique identifier
  final String id;
  
  /// Human-readable name
  final String name;
  
  /// The compound task this method decomposes
  final String taskId;
  
  /// Conditions under which this method can be used
  final Map<String, dynamic> applicabilityConditions;
  
  /// Constraints on the execution order of subtasks
  final Map<String, dynamic> orderingConstraints;

  Method({
    String? id,
    required this.name,
    required this.taskId,
    Map<String, dynamic>? applicabilityConditions,
    Map<String, dynamic>? orderingConstraints,
  }) : id = id ?? IdGenerator.generateId(),
       applicabilityConditions = applicabilityConditions ?? {},
       orderingConstraints = orderingConstraints ?? {};
  
  /// Creates a copy of this method with optional new values
  Method copyWith({
    String? name,
    String? taskId,
    Map<String, dynamic>? applicabilityConditions,
    Map<String, dynamic>? orderingConstraints,
  }) {
    return Method(
      id: id,
      name: name ?? this.name,
      taskId: taskId ?? this.taskId,
      applicabilityConditions: applicabilityConditions ?? 
          Map.from(this.applicabilityConditions),
      orderingConstraints: orderingConstraints ?? 
          Map.from(this.orderingConstraints),
    );
  }
  
  /// Apply this method to decompose a task
  /// Returns the list of subtasks created
  List<Task> apply(Task task) {
    // Implement decomposition logic here
    // This would create and return a list of subtasks
    
    // For now, return empty list (placeholder)
    return [];
  }
  
  /// Convert to JSON for serialization
  Map<String, dynamic> toJson() => _$MethodToJson(this);
  
  /// Create from JSON for deserialization
  factory Method.fromJson(Map<String, dynamic> json) => _$MethodFromJson(json);
  
  @override
  List<Object?> get props => [
    id, name, taskId, applicabilityConditions, orderingConstraints
  ];
}

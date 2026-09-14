import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';
import '../utils/id_generator.dart';

part 'task_decomposition.g.dart';

/// Represents the hierarchical relationship between a parent task and its subtasks.
/// Forms the hierarchical structure of the HTN.
@JsonSerializable()
class TaskDecomposition extends Equatable {
  /// Unique identifier
  final String id;
  
  /// The compound task being decomposed
  final String parentId;
  
  /// A subtask in the decomposition
  final String childId;
  
  /// The method used for decomposition (if applicable)
  final String? methodId;
  
  /// Position in the sequence of subtasks
  final int orderIndex;

  TaskDecomposition({
    String? id,
    required this.parentId,
    required this.childId,
    this.methodId,
    required this.orderIndex,
  }) : id = id ?? IdGenerator.generateId();
  
  /// Creates a copy of this decomposition with optional new values
  TaskDecomposition copyWith({
    String? parentId,
    String? childId,
    String? methodId,
    int? orderIndex,
  }) {
    return TaskDecomposition(
      id: id,
      parentId: parentId ?? this.parentId,
      childId: childId ?? this.childId,
      methodId: methodId ?? this.methodId,
      orderIndex: orderIndex ?? this.orderIndex,
    );
  }
  
  /// Convert to JSON for serialization
  Map<String, dynamic> toJson() => _$TaskDecompositionToJson(this);
  
  /// Create from JSON for deserialization
  factory TaskDecomposition.fromJson(Map<String, dynamic> json) => 
      _$TaskDecompositionFromJson(json);
  
  @override
  List<Object?> get props => [id, parentId, childId, methodId, orderIndex];
}

/// Represents a strategy for accomplishing a compound task.
///
/// A compound task may have multiple alternative methods.
/// Methods define the subtasks and their ordering constraints.
class Method {
  /// Unique identifier for the method.
  final String id;

  /// Human-readable name of the method.
  String name;

  /// Reference to the compound task this method decomposes.
  String taskId;

  /// Conditions under which this method can be used.
  Map<String, dynamic> applicabilityConditions;

  /// Constraints on the execution order of subtasks.
  Map<String, dynamic> orderingConstraints;

  Method({
    required this.id,
    required this.name,
    required this.taskId,
    Map<String, dynamic>? applicabilityConditions,
    Map<String, dynamic>? orderingConstraints,
  })  : applicabilityConditions = applicabilityConditions ?? {},
        orderingConstraints = orderingConstraints ?? {};

  /// Applies this method to decompose a task.
  void apply(String targetTaskId) {
    // Implementation depends on TaskDecomposition and the overall system architecture
    // Will be implemented when we have the full context
  }

  /// Converts method to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'taskId': taskId,
      'applicabilityConditions': applicabilityConditions,
      'orderingConstraints': orderingConstraints,
    };
  }

  /// Creates a Method from JSON representation.
  factory Method.fromJson(Map<String, dynamic> json) {
    return Method(
      id: json['id'] as String,
      name: json['name'] as String,
      taskId: json['taskId'] as String,
      applicabilityConditions: json['applicabilityConditions'] as Map<String, dynamic>? ?? {},
      orderingConstraints: json['orderingConstraints'] as Map<String, dynamic>? ?? {},
    );
  }
}

/// Dependency type enumeration.
enum DependencyType { ORDERING, CAUSAL, RESOURCE, TEMPORAL }

/// Represents dependencies between tasks beyond the hierarchical structure.
///
/// These include ordering constraints, causal links, resource usage, etc.
/// This enables modeling of complex relationships in a directed graph structure.
class TaskDependency {
  /// Task that must be completed first.
  final String sourceId;

  /// Task that depends on the source.
  final String targetId;

  /// Type of dependency.
  final DependencyType type;

  /// Specific constraint details.
  final String? constraint;

  TaskDependency({
    required this.sourceId,
    required this.targetId,
    required this.type,
    this.constraint,
  });

  /// Converts task dependency to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'sourceId': sourceId,
      'targetId': targetId,
      'type': type.toString().split('.').last,
      'constraint': constraint,
    };
  }

  /// Creates a TaskDependency from JSON representation.
  factory TaskDependency.fromJson(Map<String, dynamic> json) {
    return TaskDependency(
      sourceId: json['sourceId'] as String,
      targetId: json['targetId'] as String,
      type: DependencyType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
        orElse: () => DependencyType.ORDERING,
      ),
      constraint: json['constraint'] as String?,
    );
  }
}

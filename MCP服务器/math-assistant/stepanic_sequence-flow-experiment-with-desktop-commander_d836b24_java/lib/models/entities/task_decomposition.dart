/// Represents the hierarchical relationship between a parent task and its subtasks.
///
/// Forms the hierarchical structure of the HTN.
class TaskDecomposition {
  /// The compound task being decomposed.
  final String parentId;

  /// A subtask in the decomposition.
  final String childId;

  /// The method used for decomposition (if applicable).
  final String? methodId;

  /// Position in the sequence of subtasks.
  int orderIndex;

  TaskDecomposition({
    required this.parentId,
    required this.childId,
    this.methodId,
    required this.orderIndex,
  });

  /// Converts task decomposition to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'parentId': parentId,
      'childId': childId,
      'methodId': methodId,
      'orderIndex': orderIndex,
    };
  }

  /// Creates a TaskDecomposition from JSON representation.
  factory TaskDecomposition.fromJson(Map<String, dynamic> json) {
    return TaskDecomposition(
      parentId: json['parentId'] as String,
      childId: json['childId'] as String,
      methodId: json['methodId'] as String?,
      orderIndex: json['orderIndex'] as int,
    );
  }
}

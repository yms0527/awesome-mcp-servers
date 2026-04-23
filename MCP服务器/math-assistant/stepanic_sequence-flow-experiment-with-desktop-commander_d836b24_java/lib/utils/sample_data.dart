import '../models/entities/index.dart';

/// Utility class for generating sample data.
///
/// Provides consistent sample data for testing and development.
class SampleData {
  /// Creates a sample set of tasks.
  static List<Task> getTasks() {
    return [
      Task(
        id: 'task1',
        name: 'Root Task',
        description: 'The top-level task',
        type: TaskType.COMPOUND,
        metadata: {'position': {'x': 400.0, 'y': 100.0}},
      ),
      Task(
        id: 'task2',
        name: 'Subtask 1',
        description: 'First subtask',
        type: TaskType.COMPOUND,
        metadata: {'position': {'x': 300.0, 'y': 200.0}},
      ),
      Task(
        id: 'task3',
        name: 'Subtask 2',
        description: 'Second subtask',
        type: TaskType.PRIMITIVE,
        metadata: {'position': {'x': 500.0, 'y': 200.0}},
      ),
      Task(
        id: 'task4',
        name: 'Sub-subtask 1',
        description: 'Child of Subtask 1',
        type: TaskType.PRIMITIVE,
        metadata: {'position': {'x': 300.0, 'y': 300.0}},
      ),
    ];
  }

  /// Creates a sample set of hierarchical relationships.
  static List<TaskDecomposition> getTaskDecompositions() {
    return [
      TaskDecomposition(
        parentId: 'task1',
        childId: 'task2',
        orderIndex: 0,
      ),
      TaskDecomposition(
        parentId: 'task1',
        childId: 'task3',
        orderIndex: 1,
      ),
      TaskDecomposition(
        parentId: 'task2',
        childId: 'task4',
        orderIndex: 0,
      ),
    ];
  }

  /// Creates a sample set of dependency relationships.
  static List<TaskDependency> getTaskDependencies() {
    return [
      TaskDependency(
        sourceId: 'task2',
        targetId: 'task3',
        type: DependencyType.ORDERING,
      ),
    ];
  }

  /// Creates a sample set of cross-boundary references.
  static List<CrossBoundaryReference> getCrossBoundaryReferences() {
    return [];
  }

  /// Creates a sample set of questions.
  static List<Question> getQuestions() {
    return [
      Question(
        id: 'q1',
        text: 'What is your planning problem about?',
        purpose: 'Understand the general domain and goals of the planning task',
        priority: 10,
      ),
      Question(
        id: 'q2',
        text: 'What are the main tasks involved in this problem?',
        purpose: 'Identify high-level tasks for the planning domain',
        prerequisiteIds: ['q1'],
        priority: 9,
      ),
      Question(
        id: 'q3',
        text: 'Are there any dependencies between these tasks?',
        purpose: 'Identify task relationships and constraints',
        prerequisiteIds: ['q2'],
        priority: 8,
      ),
      Question(
        id: 'q4',
        text: 'What are the resources required for these tasks?',
        purpose: 'Identify resource constraints and requirements',
        prerequisiteIds: ['q2'],
        priority: 7,
      ),
      Question(
        id: 'q5',
        text: 'What are the timing constraints for these tasks?',
        purpose: 'Identify temporal constraints and deadlines',
        prerequisiteIds: ['q2', 'q3'],
        priority: 6,
      ),
    ];
  }

  /// Creates a mapping of parent tasks to their children.
  static Map<String, List<String>> getChildrenMap() {
    return {
      'task1': ['task2', 'task3'],
      'task2': ['task4'],
      'task3': [],
      'task4': [],
    };
  }
}

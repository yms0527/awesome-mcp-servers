/// Plan status enumeration.
enum PlanStatus { DRAFT, IN_PROGRESS, COMPLETE, FAILED }

/// Represents a complete or partial solution to a planning problem.
///
/// Consists of a sequence of plan steps that execute tasks.
class Plan {
  /// Unique identifier for the plan.
  final String id;

  /// Human-readable name of the plan.
  String name;

  /// Starting world state.
  String initialWorldStateId;

  /// Desired outcome world state.
  String goalWorldStateId;

  /// Current status of the plan.
  PlanStatus status;

  /// Plan steps (ordered task executions).
  List<PlanStep> steps = [];

  Plan({
    required this.id,
    required this.name,
    required this.initialWorldStateId,
    required this.goalWorldStateId,
    this.status = PlanStatus.DRAFT,
  });

  /// Simulates execution of the plan.
  void execute() {
    if (status != PlanStatus.DRAFT && status != PlanStatus.IN_PROGRESS) {
      return;
    }
    
    status = PlanStatus.IN_PROGRESS;
    
    // Would typically involve:
    // 1. Setting all steps to PENDING
    // 2. Executing steps in order
    // 3. Updating step status as they execute
    // 4. Handling failures
    // 5. Setting plan status based on outcome
  }

  /// Checks if plan achieves goal state.
  bool verify() {
    // Would typically:
    // 1. Simulate plan execution from initialState
    // 2. Check if resulting state matches goalState
    // 3. Return success/failure
    
    return status == PlanStatus.COMPLETE;
  }

  /// Converts plan to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'initialWorldStateId': initialWorldStateId,
      'goalWorldStateId': goalWorldStateId,
      'status': status.toString().split('.').last,
      'steps': steps.map((step) => step.toJson()).toList(),
    };
  }

  /// Creates a Plan from JSON representation.
  factory Plan.fromJson(Map<String, dynamic> json) {
    final plan = Plan(
      id: json['id'] as String,
      name: json['name'] as String,
      initialWorldStateId: json['initialWorldStateId'] as String,
      goalWorldStateId: json['goalWorldStateId'] as String,
      status: PlanStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
        orElse: () => PlanStatus.DRAFT,
      ),
    );
    
    if (json.containsKey('steps') && json['steps'] is List) {
      for (final stepJson in json['steps']) {
        plan.steps.add(PlanStep.fromJson(stepJson as Map<String, dynamic>));
      }
    }
    
    return plan;
  }
}

/// Plan step status enumeration.
enum PlanStepStatus { PENDING, IN_PROGRESS, COMPLETED, FAILED }

/// Represents an individual step in a plan, executing a specific task.
///
/// Steps have execution order and status tracking.
class PlanStep {
  /// The plan this step belongs to.
  final String planId;

  /// The task to execute.
  final String taskId;

  /// Position in the execution sequence.
  int orderIndex;

  /// Execution status.
  PlanStepStatus status;

  PlanStep({
    required this.planId,
    required this.taskId,
    required this.orderIndex,
    this.status = PlanStepStatus.PENDING,
  });

  /// Converts plan step to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'planId': planId,
      'taskId': taskId,
      'orderIndex': orderIndex,
      'status': status.toString().split('.').last,
    };
  }

  /// Creates a PlanStep from JSON representation.
  factory PlanStep.fromJson(Map<String, dynamic> json) {
    return PlanStep(
      planId: json['planId'] as String,
      taskId: json['taskId'] as String,
      orderIndex: json['orderIndex'] as int,
      status: PlanStepStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
        orElse: () => PlanStepStatus.PENDING,
      ),
    );
  }
}

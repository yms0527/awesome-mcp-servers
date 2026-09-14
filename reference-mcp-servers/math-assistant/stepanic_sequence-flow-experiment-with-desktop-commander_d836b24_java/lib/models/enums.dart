/// Task type classification
enum TaskType {
  /// Can be broken down into subtasks
  COMPOUND,
  
  /// Concrete, executable action
  PRIMITIVE,
  
  /// Way to decompose a compound task
  METHOD
}

/// Dependency type classification
enum DependencyType {
  /// Ordering constraints
  ORDERING,
  
  /// Causal links
  CAUSAL,
  
  /// Resource usage
  RESOURCE,
  
  /// Temporal constraints
  TEMPORAL
}

/// State type classification
enum StateType {
  /// Starting conditions
  INITIAL,
  
  /// Desired outcomes
  GOAL,
  
  /// States during planning
  INTERMEDIATE
}

/// Plan status classification
enum PlanStatus {
  /// Initial draft
  DRAFT,
  
  /// Currently being developed
  IN_PROGRESS,
  
  /// Completed plan
  COMPLETE,
  
  /// Failed planning attempt
  FAILED
}

/// Plan step status classification
enum PlanStepStatus {
  /// Not yet executed
  PENDING,
  
  /// Currently executing
  IN_PROGRESS,
  
  /// Successfully completed
  COMPLETED,
  
  /// Failed execution
  FAILED
}

/// Message sender classification
enum MessageSender {
  /// AI assistant
  AI,
  
  /// Human user
  USER
}

/// Cross-boundary reference direction
enum ReferenceDirection {
  /// Reference points into compressed node
  INBOUND,
  
  /// Reference points out of compressed node
  OUTBOUND
}

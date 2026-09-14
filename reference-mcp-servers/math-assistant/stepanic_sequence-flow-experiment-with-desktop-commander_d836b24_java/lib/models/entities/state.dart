/// World state type enumeration.
enum WorldStateType { INITIAL, GOAL, INTERMEDIATE }

/// Represents states of the world in HTN planning.
///
/// Includes initial states (starting conditions), goal states (desired outcomes),
/// and intermediate states during planning.
class WorldState {
  /// Unique identifier for the state.
  final String id;

  /// Human-readable name of the state.
  String name;

  /// State classification (INITIAL, GOAL, INTERMEDIATE).
  WorldStateType type;

  /// Name-value pairs representing state properties.
  Map<String, dynamic> properties;

  WorldState({
    required this.id,
    required this.name,
    required this.type,
    Map<String, dynamic>? properties,
  }) : properties = properties ?? {};

  /// Converts state to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type.toString().split('.').last,
      'properties': properties,
    };
  }

  /// Creates a State from JSON representation.
  factory WorldState.fromJson(Map<String, dynamic> json) {
    return WorldState(
      id: json['id'] as String,
      name: json['name'] as String,
      type: WorldStateType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
        orElse: () => WorldStateType.INTERMEDIATE,
      ),
      properties: json['properties'] as Map<String, dynamic>? ?? {},
    );
  }
}

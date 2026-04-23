/// Tracks the current state of the user interface.
///
/// This includes which tasks are expanded, selected, and visible.
/// Supports synchronization between the three UI columns.
class UIState {
  /// Current conversation.
  final String conversationId;

  /// Active view identifier.
  String currentView;

  /// IDs of all expanded nodes.
  List<String> expandedNodeIds;

  /// Currently selected task.
  String? selectedTaskId;

  /// Viewport coordinates for graph visualization.
  Map<String, dynamic> visibleGraphArea;

  UIState({
    required this.conversationId,
    required this.currentView,
    List<String>? expandedNodeIds,
    this.selectedTaskId,
    Map<String, dynamic>? visibleGraphArea,
  })  : expandedNodeIds = expandedNodeIds ?? [],
        visibleGraphArea = visibleGraphArea ?? defaultVisibleArea();

  /// Provides default visible area settings.
  static Map<String, dynamic> defaultVisibleArea() {
    return {
      'x': 0.0,
      'y': 0.0,
      'width': 1000.0,
      'height': 800.0,
      'scale': 1.0,
    };
  }

  /// Adds a node to the expanded list.
  void expandNode(String nodeId) {
    if (!expandedNodeIds.contains(nodeId)) {
      expandedNodeIds.add(nodeId);
    }
  }

  /// Removes a node from the expanded list.
  void collapseNode(String nodeId) {
    expandedNodeIds.remove(nodeId);
  }

  /// Selects a task.
  void selectTask(String taskId) {
    selectedTaskId = taskId;
  }

  /// Deselects the current task.
  void deselectTask() {
    selectedTaskId = null;
  }

  /// Updates the visible graph area.
  void updateVisibleArea(Map<String, dynamic> area) {
    visibleGraphArea = area;
  }

  /// Updates the current view.
  void setCurrentView(String view) {
    currentView = view;
  }

  /// Converts UI state to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'conversationId': conversationId,
      'currentView': currentView,
      'expandedNodeIds': expandedNodeIds,
      'selectedTaskId': selectedTaskId,
      'visibleGraphArea': visibleGraphArea,
    };
  }

  /// Creates a UIState from JSON representation.
  factory UIState.fromJson(Map<String, dynamic> json) {
    return UIState(
      conversationId: json['conversationId'] as String,
      currentView: json['currentView'] as String,
      expandedNodeIds: json.containsKey('expandedNodeIds')
          ? (json['expandedNodeIds'] as List<dynamic>)
              .map((e) => e as String)
              .toList()
          : [],
      selectedTaskId: json['selectedTaskId'] as String?,
      visibleGraphArea: json['visibleGraphArea'] as Map<String, dynamic>? ?? 
          defaultVisibleArea(),
    );
  }
}

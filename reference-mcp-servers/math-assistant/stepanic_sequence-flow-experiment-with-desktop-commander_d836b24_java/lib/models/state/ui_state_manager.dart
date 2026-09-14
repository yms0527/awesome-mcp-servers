import 'package:flutter/foundation.dart';
import '../entities/ui_state.dart';

/// Manages UI state changes with proper notification.
///
/// This class encapsulates UI state and provides controlled methods for updating it,
/// ensuring that notifications are sent only when necessary.
class UIStateManager extends ChangeNotifier {
  /// Current UI state.
  UIState _state;

  /// Creates a new UI state manager with initial state.
  UIStateManager({required UIState initialState}) : _state = initialState;

  /// Gets the current UI state.
  UIState get state => _state;

  /// Updates the selected task ID.
  void selectTask(String? taskId) {
    if (_state.selectedTaskId != taskId) {
      _state.selectedTaskId = taskId;
      notifyListeners();
    }
  }

  /// Adds a node to the expanded list.
  void expandNode(String nodeId) {
    if (!_state.expandedNodeIds.contains(nodeId)) {
      _state.expandedNodeIds.add(nodeId);
      notifyListeners();
    }
  }

  /// Removes a node from the expanded list.
  void collapseNode(String nodeId) {
    if (_state.expandedNodeIds.contains(nodeId)) {
      _state.expandedNodeIds.remove(nodeId);
      notifyListeners();
    }
  }

  /// Updates the visible graph area.
  void updateVisibleArea(Map<String, dynamic> area) {
    _state.visibleGraphArea = area;
    notifyListeners();
  }

  /// Sets the current view.
  void setCurrentView(String view) {
    if (_state.currentView != view) {
      _state.currentView = view;
      notifyListeners();
    }
  }
}

import 'package:flutter/material.dart';
import '../models/state/ui_state_manager.dart';
import 'ai_chat/ai_chat.dart';
import 'directed_graph/directed_graph.dart';
import 'task_list/task_list.dart';

/// The main layout of the application with three columns:
/// 1. Left: AI chat for guided planning
/// 2. Middle: Interactive directed graph visualization
/// 3. Right: Hierarchical task list and details
///
/// This design allows simultaneous viewing of different aspects of the planning process.
class ThreeColumnLayout extends StatelessWidget {
  /// The UI state manager that controls the application state.
  final UIStateManager uiStateManager;

  const ThreeColumnLayout({
    Key? key,
    required this.uiStateManager,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final uiState = uiStateManager.state;
    
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Left column: AI Chat
        Expanded(
          flex: 3,
          child: AIChat(
            conversationId: uiState.conversationId,
            onMessageSent: (message) {
              // Handle new messages
            },
          ),
        ),
        
        // Divider between left and middle columns
        const VerticalDivider(width: 1, thickness: 1),
        
        // Middle column: Directed Graph
        Expanded(
          flex: 5,
          child: DirectedGraph(
            uiState: uiState,
            onNodeSelect: (nodeId) {
              uiStateManager.selectTask(nodeId);
            },
            onNodeExpand: (nodeId) {
              uiStateManager.expandNode(nodeId);
            },
            onNodeCompress: (nodeId) {
              uiStateManager.collapseNode(nodeId);
            },
          ),
        ),
        
        // Divider between middle and right columns
        const VerticalDivider(width: 1, thickness: 1),
        
        // Right column: Task List
        Expanded(
          flex: 3,
          child: TaskList(
            uiState: uiState,
            onTaskSelect: (taskId) {
              uiStateManager.selectTask(taskId);
            },
            onTaskExpand: (nodeId) {
              uiStateManager.expandNode(nodeId);
            },
            onTaskCompress: (nodeId) {
              uiStateManager.collapseNode(nodeId);
            },
          ),
        ),
      ],
    );
  }
}

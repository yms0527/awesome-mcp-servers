import 'package:flutter/material.dart';
import '../../models/entities/index.dart';
import '../../utils/sample_data.dart';
import 'task_details.dart';
import 'system_info.dart';

/// Hierarchical list view of all tasks.
///
/// Shows task hierarchy as a nested, collapsible list.
/// Synchronizes with graph visualization (expansion state).
/// Includes details panel for the selected task.
/// Shows system info and planning statistics.
class TaskList extends StatefulWidget {
  /// Current UI state.
  final UIState uiState;

  /// Callback for when a task is selected.
  final Function(String) onTaskSelect;

  /// Callback for when a task is expanded.
  final Function(String) onTaskExpand;

  /// Callback for when a task is compressed.
  final Function(String) onTaskCompress;

  const TaskList({
    Key? key,
    required this.uiState,
    required this.onTaskSelect,
    required this.onTaskExpand,
    required this.onTaskCompress,
  }) : super(key: key);

  @override
  State<TaskList> createState() => _TaskListState();
}

class _TaskListState extends State<TaskList> {
  // For a real implementation, these would be loaded from a service or repository
  List<Task> _tasks = [];
  Map<String, List<String>> _childrenMap = {};
  
  @override
  void initState() {
    super.initState();
    _loadSampleData();
  }

  /// Loads sample data for demonstration purposes.
  void _loadSampleData() {
    // Load sample data from utility class
    _tasks = SampleData.getTasks();
    _childrenMap = SampleData.getChildrenMap();
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(8.0),
          color: Theme.of(context).colorScheme.primary,
          child: Row(
            children: [
              Icon(
                Icons.list,
                color: Theme.of(context).colorScheme.onPrimary,
              ),
              const SizedBox(width: 8),
              Text(
                'Task Hierarchy',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        
        // Task list (scrollable)
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(8.0),
            children: [
              // We only show root tasks in the top level
              ..._tasks
                  .where((task) => !_isChildOfAnyTask(task.id))
                  .map((task) => _buildTaskItem(task, 0))
                  .toList(),
            ],
          ),
        ),
        
        // Divider
        const Divider(height: 1),
        
        // Task details (if a task is selected)
        if (widget.uiState.selectedTaskId != null)
          TaskDetails(
            task: _findTaskById(widget.uiState.selectedTaskId!),
          ),
        
        // System info
        const SystemInfo(
          planningStats: {
            'totalTasks': 4,
            'completedTasks': 1,
            'inProgressTasks': 2,
            'pendingTasks': 1,
            'completionPercentage': 25,
          },
          conversationProgress: 0.3,
        ),
      ],
    );
  }

  /// Builds a task item with the appropriate indentation level.
  Widget _buildTaskItem(Task task, int level) {
    final isExpanded = widget.uiState.expandedNodeIds.contains(task.id);
    final isSelected = widget.uiState.selectedTaskId == task.id;
    final hasChildren = _childrenMap[task.id]?.isNotEmpty ?? false;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // The task item itself
        Container(
          margin: const EdgeInsets.only(bottom: 2.0),
          decoration: BoxDecoration(
            color: isSelected
                ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(4.0),
          ),
          child: InkWell(
            onTap: () => widget.onTaskSelect(task.id),
            borderRadius: BorderRadius.circular(4.0),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                vertical: 6.0,
                horizontal: 4.0,
              ),
              child: Row(
                children: [
                  // Indentation
                  SizedBox(width: 24.0 * level),
                  
                  // Expand/compress icon (if has children)
                  if (hasChildren)
                    IconButton(
                      icon: Icon(
                        isExpanded
                            ? Icons.arrow_drop_down
                            : Icons.arrow_right,
                        size: 20,
                      ),
                      onPressed: () => isExpanded
                          ? widget.onTaskCompress(task.id)
                          : widget.onTaskExpand(task.id),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(
                        minWidth: 24,
                        minHeight: 24,
                      ),
                    )
                  else
                    const SizedBox(width: 24),
                  
                  // Task type icon
                  Icon(
                    _getTaskTypeIcon(task.type),
                    size: 16,
                    color: _getTaskTypeColor(context, task.type),
                  ),
                  
                  const SizedBox(width: 8),
                  
                  // Task name
                  Expanded(
                    child: Text(
                      task.name,
                      style: TextStyle(
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        
        // Children (if expanded)
        if (isExpanded && hasChildren)
          ...(_childrenMap[task.id] ?? [])
              .map((childId) => _buildTaskItem(_findTaskById(childId), level + 1))
              .toList(),
      ],
    );
  }

  /// Finds a task by its ID.
  Task _findTaskById(String id) {
    return _tasks.firstWhere(
      (task) => task.id == id,
      orElse: () => Task(
        id: id,
        name: 'Unknown Task',
        description: 'Task not found',
        type: TaskType.PRIMITIVE,
      ),
    );
  }

  /// Checks if a task is a child of any other task.
  bool _isChildOfAnyTask(String taskId) {
    return _childrenMap.values.any((children) => children.contains(taskId));
  }

  /// Gets the icon for a task type.
  IconData _getTaskTypeIcon(TaskType type) {
    switch (type) {
      case TaskType.COMPOUND:
        return Icons.folder;
      case TaskType.PRIMITIVE:
        return Icons.task_alt;
      case TaskType.METHOD:
        return Icons.schema;
    }
  }

  /// Gets the color for a task type.
  Color _getTaskTypeColor(BuildContext context, TaskType type) {
    switch (type) {
      case TaskType.COMPOUND:
        return Colors.amber[700]!;
      case TaskType.PRIMITIVE:
        return Colors.blue[700]!;
      case TaskType.METHOD:
        return Colors.green[700]!;
    }
  }
}

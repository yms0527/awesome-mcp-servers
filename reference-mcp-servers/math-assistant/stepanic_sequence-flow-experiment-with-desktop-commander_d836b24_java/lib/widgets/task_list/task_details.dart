import 'package:flutter/material.dart';
import '../../models/entities/index.dart';

/// Shows detailed information about the selected task.
///
/// Includes name, description, type, preconditions, effects,
/// dependencies, and other task-specific properties.
/// Provides controls for editing task properties.
class TaskDetails extends StatelessWidget {
  /// Selected task.
  final Task task;

  const TaskDetails({
    Key? key,
    required this.task,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      color: Colors.grey[50],
      constraints: const BoxConstraints(
        maxHeight: 200,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with task name
          Row(
            children: [
              Icon(
                _getTaskTypeIcon(task.type),
                color: _getTaskTypeColor(context, task.type),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  task.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.edit),
                tooltip: 'Edit Task',
                onPressed: () {
                  // Would open task editing dialog in a real implementation
                },
                iconSize: 18,
              ),
            ],
          ),
          
          const Divider(),
          
          // Task details
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Task type
                  _buildDetailRow('Type', task.type.toString().split('.').last),
                  
                  const SizedBox(height: 8),
                  
                  // Task description
                  const Text(
                    'Description:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                  Text(
                    task.description,
                    style: const TextStyle(fontSize: 12),
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // Compound task info
                  if (task.isCompound) ...[
                    _buildDetailRow(
                      'Subtasks',
                      task.children.isEmpty
                          ? 'None'
                          : '${task.children.length} subtasks',
                    ),
                    _buildDetailRow(
                      'Compressed',
                      task.isCompressed ? 'Yes' : 'No',
                    ),
                  ],
                  
                  // Additional properties
                  const SizedBox(height: 8),
                  const Text(
                    'Properties:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                  
                  // In a real implementation, this would show task-specific properties
                  // For now, we'll just show position from metadata
                  if (task.metadata.containsKey('position'))
                    _buildDetailRow(
                      'Position',
                      'X: ${task.metadata['position']['x']}, Y: ${task.metadata['position']['y']}',
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Builds a detail row with label and value.
  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 12),
            ),
          ),
        ],
      ),
    );
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

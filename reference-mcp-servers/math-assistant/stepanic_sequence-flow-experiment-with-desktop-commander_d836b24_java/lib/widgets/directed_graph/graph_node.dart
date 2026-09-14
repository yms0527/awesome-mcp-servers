import 'package:flutter/material.dart';
import '../../models/entities/index.dart';

/// Visual representation of a task node in the graph.
///
/// Displays task information and provides controls for expansion/compression.
/// Visually distinguishes between compound and primitive tasks.
class GraphNode extends StatelessWidget {
  /// The task to display.
  final Task task;

  /// Whether the node is currently expanded.
  final bool isExpanded;

  /// Whether the node is currently selected.
  final bool isSelected;

  /// Callback for when the node is tapped.
  final VoidCallback onTap;

  /// Callback for when the node is expanded.
  final VoidCallback onExpand;

  /// Callback for when the node is compressed.
  final VoidCallback onCompress;

  const GraphNode({
    Key? key,
    required this.task,
    required this.isExpanded,
    required this.isSelected,
    required this.onTap,
    required this.onExpand,
    required this.onCompress,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isCompound = task.isCompound;
    final nodeWidth = 150.0;
    final nodeHeight = 80.0;
    
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: nodeWidth,
        height: nodeHeight,
        decoration: BoxDecoration(
          color: _getBackgroundColor(context, isCompound),
          borderRadius: BorderRadius.circular(8.0),
          border: Border.all(
            color: isSelected
                ? Theme.of(context).colorScheme.primary
                : Colors.grey[400]!,
            width: isSelected ? 2.0 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(2, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Node content
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Task name
                  Text(
                    task.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  const SizedBox(height: 4),
                  
                  // Task type indicator
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6.0,
                      vertical: 2.0,
                    ),
                    decoration: BoxDecoration(
                      color: _getTypeColor(context, task.type).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(4.0),
                    ),
                    child: Text(
                      task.type.toString().split('.').last,
                      style: TextStyle(
                        fontSize: 10,
                        color: _getTypeColor(context, task.type),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 4),
                  
                  // Task description
                  Expanded(
                    child: Text(
                      task.description,
                      style: const TextStyle(fontSize: 12),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 2,
                    ),
                  ),
                ],
              ),
            ),
            
            // Expansion control for compound tasks
            if (isCompound)
              Positioned(
                right: 4,
                bottom: 4,
                child: IconButton(
                  icon: Icon(
                    isExpanded ? Icons.compress : Icons.expand,
                    size: 16,
                  ),
                  onPressed: isExpanded ? onCompress : onExpand,
                  tooltip: isExpanded ? 'Compress' : 'Expand',
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(
                    minWidth: 24,
                    minHeight: 24,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  /// Gets the background color based on task type.
  Color _getBackgroundColor(BuildContext context, bool isCompound) {
    if (isCompound) {
      return Colors.amber[50]!;
    } else {
      return Colors.blue[50]!;
    }
  }

  /// Gets the color for the task type indicator.
  Color _getTypeColor(BuildContext context, TaskType type) {
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

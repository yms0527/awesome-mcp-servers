import 'package:flutter/material.dart';

/// Displays system information and planning statistics.
///
/// Shows number of tasks, dependencies, completion percentage,
/// planning progress, and other metrics.
/// Provides status overview of the entire planning process.
class SystemInfo extends StatelessWidget {
  /// Planning statistics.
  final Map<String, dynamic> planningStats;

  /// Percentage of questions answered.
  final double conversationProgress;

  const SystemInfo({
    Key? key,
    required this.planningStats,
    required this.conversationProgress,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      color: Colors.grey[200],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Icon(
                Icons.info_outline,
                color: Theme.of(context).colorScheme.primary,
                size: 18,
              ),
              const SizedBox(width: 8),
              Text(
                'System Info',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.refresh, size: 18),
                tooltip: 'Refresh',
                onPressed: () {
                  // Would refresh system info in a real implementation
                },
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(
                  minWidth: 24,
                  minHeight: 24,
                ),
              ),
            ],
          ),
          
          const Divider(),
          
          // Task statistics
          _buildStatisticsSection('Tasks', [
            {
              'label': 'Total',
              'value': planningStats['totalTasks'].toString(),
              'color': Colors.blue,
            },
            {
              'label': 'Completed',
              'value': planningStats['completedTasks'].toString(),
              'color': Colors.green,
            },
            {
              'label': 'In Progress',
              'value': planningStats['inProgressTasks'].toString(),
              'color': Colors.orange,
            },
            {
              'label': 'Pending',
              'value': planningStats['pendingTasks'].toString(),
              'color': Colors.grey,
            },
          ]),
          
          const SizedBox(height: 8),
          
          // Progress bars
          _buildProgressSection('Planning Progress', [
            {
              'label': 'Task Completion',
              'value': planningStats['completionPercentage'] / 100,
              'color': Colors.green,
            },
            {
              'label': 'Conversation Progress',
              'value': conversationProgress,
              'color': Theme.of(context).colorScheme.primary,
            },
          ]),
        ],
      ),
    );
  }

  /// Builds a section of statistics with colored indicators.
  Widget _buildStatisticsSection(String title, List<Map<String, dynamic>> stats) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 4),
        Wrap(
          spacing: 12,
          runSpacing: 4,
          children: stats.map((stat) {
            return Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: stat['color'] as Color,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  '${stat['label']}: ${stat['value']}',
                  style: const TextStyle(fontSize: 11),
                ),
              ],
            );
          }).toList(),
        ),
      ],
    );
  }

  /// Builds a section of progress bars.
  Widget _buildProgressSection(String title, List<Map<String, dynamic>> progressBars) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 4),
        ...progressBars.map((progress) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${progress['label']} (${((progress['value'] as double) * 100).toInt()}%)',
                style: const TextStyle(fontSize: 11),
              ),
              const SizedBox(height: 2),
              LinearProgressIndicator(
                value: progress['value'] as double,
                minHeight: 6,
                backgroundColor: Colors.grey[300],
                valueColor: AlwaysStoppedAnimation<Color>(
                  progress['color'] as Color,
                ),
              ),
              const SizedBox(height: 4),
            ],
          );
        }).toList(),
      ],
    );
  }
}

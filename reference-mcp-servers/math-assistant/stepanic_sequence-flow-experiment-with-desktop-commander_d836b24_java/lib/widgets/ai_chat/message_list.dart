import 'package:flutter/material.dart';
import '../../models/entities/index.dart';

/// Displays the history of messages between the AI and user.
///
/// Visually distinguishes between AI messages and user responses.
/// Shows timestamps and highlights questions/answers.
class MessageList extends StatelessWidget {
  /// Messages to display.
  final List<Message> messages;

  const MessageList({
    Key? key,
    required this.messages,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final message = messages[index];
        return _buildMessageItem(context, message);
      },
    );
  }

  /// Builds a message item based on sender type.
  Widget _buildMessageItem(BuildContext context, Message message) {
    final isAi = message.sender == MessageSender.AI;
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: isAi ? MainAxisAlignment.start : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isAi) _buildAvatar(context, isAi),
          
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12.0),
              margin: EdgeInsets.only(
                left: isAi ? 8.0 : 48.0,
                right: isAi ? 48.0 : 8.0,
              ),
              decoration: BoxDecoration(
                color: isAi
                    ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                    : Theme.of(context).colorScheme.secondary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isAi ? 'AI Assistant' : 'You',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isAi
                          ? Theme.of(context).colorScheme.primary
                          : Theme.of(context).colorScheme.secondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(message.content),
                  const SizedBox(height: 4),
                  Text(
                    _formatTimestamp(message.timestamp),
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  if (message.questionId != null)
                    Container(
                      margin: const EdgeInsets.only(top: 8.0),
                      padding: const EdgeInsets.all(4.0),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4.0),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.help_outline,
                            size: 16,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Question',
                            style: TextStyle(
                              fontSize: 12,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          
          if (!isAi) _buildAvatar(context, isAi),
        ],
      ),
    );
  }

  /// Builds an avatar for the message sender.
  Widget _buildAvatar(BuildContext context, bool isAi) {
    return CircleAvatar(
      radius: 16,
      backgroundColor: isAi
          ? Theme.of(context).colorScheme.primary
          : Theme.of(context).colorScheme.secondary,
      child: Icon(
        isAi ? Icons.smart_toy : Icons.person,
        color: Colors.white,
        size: 18,
      ),
    );
  }

  /// Formats the timestamp into a readable string.
  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final messageDate = DateTime(timestamp.year, timestamp.month, timestamp.day);
    
    if (messageDate == today) {
      return 'Today at ${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}';
    } else if (messageDate == today.subtract(const Duration(days: 1))) {
      return 'Yesterday at ${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}';
    } else {
      return '${timestamp.day}/${timestamp.month}/${timestamp.year} ${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}';
    }
  }
}

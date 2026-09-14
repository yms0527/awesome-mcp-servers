/// Message sender enumeration.
enum MessageSender { AI, USER }

/// Represents a single message in the planning conversation.
///
/// Can be from the AI assistant or the user.
/// May include a snapshot of the graph state at that point.
class Message {
  /// The conversation this message belongs to.
  final String conversationId;

  /// Who sent the message.
  final MessageSender sender;

  /// Message text.
  final String content;

  /// If an AI message poses a question, which one.
  final String? questionId;

  /// State of the planning graph at this point.
  final Map<String, dynamic>? graphStateSnapshot;

  /// Timestamp when the message was created.
  final DateTime timestamp;

  Message({
    required this.conversationId,
    required this.sender,
    required this.content,
    this.questionId,
    this.graphStateSnapshot,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  /// Converts message to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'conversationId': conversationId,
      'sender': sender.toString().split('.').last,
      'content': content,
      'questionId': questionId,
      'graphStateSnapshot': graphStateSnapshot,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  /// Creates a Message from JSON representation.
  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      conversationId: json['conversationId'] as String,
      sender: MessageSender.values.firstWhere(
        (e) => e.toString().split('.').last == json['sender'],
        orElse: () => MessageSender.USER,
      ),
      content: json['content'] as String,
      questionId: json['questionId'] as String?,
      graphStateSnapshot: json['graphStateSnapshot'] as Map<String, dynamic>?,
      timestamp: DateTime.parse(json['timestamp'] as String),
    );
  }
}

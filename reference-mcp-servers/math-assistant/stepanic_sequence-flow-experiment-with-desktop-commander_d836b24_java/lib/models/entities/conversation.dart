import 'dart:convert';
import 'message.dart';

/// Represents the interaction between the user and the AI planning assistant.
///
/// Records the planning process and question/answer flow.
/// This is the foundation of the iterative, AI-guided planning approach.
class Conversation {
  /// Unique identifier for the conversation.
  final String id;

  /// All messages in the conversation.
  List<Message> messages = [];

  /// The plan being developed through conversation.
  final String planId;

  Conversation({
    required this.id,
    required this.planId,
  });

  /// Adds a message to the conversation.
  void addMessage(Message message) {
    messages.add(message);
  }

  /// Converts conversation to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'planId': planId,
      'messages': messages.map((message) => message.toJson()).toList(),
    };
  }

  /// Creates a Conversation from JSON representation.
  factory Conversation.fromJson(Map<String, dynamic> json) {
    final conversation = Conversation(
      id: json['id'] as String,
      planId: json['planId'] as String,
    );
    
    if (json.containsKey('messages') && json['messages'] is List) {
      for (final messageJson in json['messages']) {
        conversation.messages.add(
          Message.fromJson(messageJson as Map<String, dynamic>),
        );
      }
    }
    
    return conversation;
  }

  /// Serializes the conversation to a JSON string.
  String serialize() => jsonEncode(toJson());

  /// Creates a Conversation from a serialized JSON string.
  factory Conversation.deserialize(String serialized) {
    return Conversation.fromJson(jsonDecode(serialized) as Map<String, dynamic>);
  }
}

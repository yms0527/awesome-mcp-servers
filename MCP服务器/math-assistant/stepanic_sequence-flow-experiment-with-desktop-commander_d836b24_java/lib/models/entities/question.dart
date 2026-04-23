/// Represents a question in the predefined pool.
///
/// Questions have prerequisites and relationships to other questions.
/// The AI selects questions dynamically based on conversation progress and graph state.
/// Using a predefined pool prevents hallucinations while maintaining flexibility.
class Question {
  /// Unique identifier for the question.
  final String id;

  /// Question text.
  final String text;

  /// What information this question aims to gather.
  final String purpose;

  /// Questions that should be answered first.
  final List<String> prerequisiteIds;

  /// Potential next questions.
  final List<String> followupQuestionIds;

  /// Relative importance for ordering.
  final int priority;

  Question({
    required this.id,
    required this.text,
    required this.purpose,
    List<String>? prerequisiteIds,
    List<String>? followupQuestionIds,
    this.priority = 0,
  })  : prerequisiteIds = prerequisiteIds ?? [],
        followupQuestionIds = followupQuestionIds ?? [];

  /// Converts question to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'purpose': purpose,
      'prerequisiteIds': prerequisiteIds,
      'followupQuestionIds': followupQuestionIds,
      'priority': priority,
    };
  }

  /// Creates a Question from JSON representation.
  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] as String,
      text: json['text'] as String,
      purpose: json['purpose'] as String,
      prerequisiteIds: json.containsKey('prerequisiteIds')
          ? (json['prerequisiteIds'] as List<dynamic>)
              .map((e) => e as String)
              .toList()
          : [],
      followupQuestionIds: json.containsKey('followupQuestionIds')
          ? (json['followupQuestionIds'] as List<dynamic>)
              .map((e) => e as String)
              .toList()
          : [],
      priority: json['priority'] as int? ?? 0,
    );
  }
}

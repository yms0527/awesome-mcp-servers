import 'dart:async';
import '../models/entities/index.dart';

/// Provides integration with LLM (Large Language Model) services.
///
/// Handles communication between the application and LLM API.
/// Generates AI responses for the guided planning conversation.
/// Interprets user responses to update the planning graph.
/// This is a simplified mock implementation for development.
/// A real implementation would integrate with an actual LLM API.
class LLMService {
  /// Generates the AI's next response and question based on context.
  ///
  /// Returns natural language text suitable for display to the user.
  Future<String> generateResponse({
    required List<Message> conversation,
    required Map<String, dynamic> graphState,
    required Question nextQuestion,
  }) async {
    // In a real implementation, this would call an LLM API
    // For now, we'll return a simple template-based response
    
    // Get the most recent user message (if any)
    final userMessages = conversation.where((m) => m.sender == MessageSender.USER);
    final hasUserMessage = userMessages.isNotEmpty;
    
    if (!hasUserMessage) {
      return 'Welcome to the HTN Planning System! I\'ll help you model your '
          'planning problem. Let\'s start with a simple question: '
          '${nextQuestion.text}';
    }
    
    final lastUserMessage = userMessages.last;
    
    // Generate a response based on the user's message and the next question
    return 'Thank you for sharing that information about "${lastUserMessage.content.substring(0, 
          lastUserMessage.content.length > 20 ? 20 : lastUserMessage.content.length)}...". '
        'Let\'s continue with the next question: ${nextQuestion.text}';
  }

  /// Updates the graph based on a user response.
  ///
  /// Returns the modified graph state reflecting new information.
  Future<Map<String, dynamic>> updateGraphFromResponse({
    required String userResponse,
    required Map<String, dynamic> currentGraph,
  }) async {
    // In a real implementation, this would use an LLM to extract relevant information
    // For now, we'll just return the current graph unchanged
    return currentGraph;
  }

  /// Selects the next question to ask based on context.
  ///
  /// Returns the most relevant question from the pool.
  Future<Question?> selectNextQuestion({
    required List<String> answeredQuestionIds,
    required List<Question> remainingQuestions,
    required Map<String, dynamic> graphState,
  }) async {
    // Filter out questions that have already been answered
    final unansweredQuestions = remainingQuestions
        .where((q) => !answeredQuestionIds.contains(q.id))
        .toList();
    
    if (unansweredQuestions.isEmpty) {
      return null;
    }
    
    // Find questions whose prerequisites have been answered
    final eligibleQuestions = unansweredQuestions.where((q) {
      return q.prerequisiteIds.isEmpty || 
          q.prerequisiteIds.every((pId) => answeredQuestionIds.contains(pId));
    }).toList();
    
    if (eligibleQuestions.isEmpty) {
      return null;
    }
    
    // Sort by priority (highest first)
    eligibleQuestions.sort((a, b) => b.priority.compareTo(a.priority));
    
    // Return the highest priority question
    return eligibleQuestions.first;
  }
}

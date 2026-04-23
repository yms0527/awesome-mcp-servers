import '../models/entities/index.dart';
import '../services/llm_service.dart';
import '../services/persistence_service.dart';

/// Manages the conversational planning process.
///
/// Guides the user through problem description with dynamic questions.
/// Selects questions based on previous answers and graph state.
/// Updates the planning graph based on user responses.
/// Creates checkpoints throughout to preserve progress.
class AIGuidedPlanning {
  final LLMService _llmService;
  final PersistenceService _persistenceService;

  AIGuidedPlanning({
    required LLMService llmService,
    required PersistenceService persistenceService,
  })  : _llmService = llmService,
        _persistenceService = persistenceService;

  /// Begins a new AI-guided planning conversation.
  ///
  /// Creates a conversation object and initial message.
  /// Sets the default first question.
  /// Returns the conversation with the initial AI message.
  Future<Conversation> startConversation({
    required String initialQuestion,
    required String planId,
  }) async {
    // Create a new conversation
    final conversationId = 'conv_${DateTime.now().millisecondsSinceEpoch}';
    final conversation = Conversation(
      id: conversationId,
      planId: planId,
    );
    
    // Create the first question
    final firstQuestion = Question(
      id: 'q_initial',
      text: initialQuestion,
      purpose: 'Understand the planning domain and problem',
      priority: 10,
    );
    
    // Create initial AI message
    final initialMessage = Message(
      conversationId: conversationId,
      sender: MessageSender.AI,
      content: 'Welcome to the HTN Planning System! I\'ll help you model your '
          'planning problem. Let\'s start with a simple question: $initialQuestion',
      questionId: firstQuestion.id,
    );
    
    conversation.addMessage(initialMessage);
    
    // Save the conversation
    await _persistenceService.saveConversation(conversation);
    
    return conversation;
  }

  /// Handles a user's response to the current question.
  ///
  /// Records the response in the conversation.
  /// Updates the planning graph based on the response content.
  /// Selects the next most relevant question.
  /// Creates a checkpoint for the current state.
  /// Returns the updated conversation with the next AI message.
  Future<Conversation> processUserResponse({
    required String content,
    required Conversation conversation,
    required List<Question> answeredQuestions,
    required List<Question> remainingQuestions,
    required Question currentQuestion,
    required Map<String, dynamic> graphState,
  }) async {
    // Add user message to conversation
    final userMessage = Message(
      conversationId: conversation.id,
      sender: MessageSender.USER,
      content: content,
    );
    conversation.addMessage(userMessage);
    
    // Mark current question as answered
    final updatedAnsweredQuestions = List<Question>.from(answeredQuestions)
      ..add(currentQuestion);
    
    // Update graph based on response
    final updatedGraphState = await _llmService.updateGraphFromResponse(
      userResponse: content,
      currentGraph: graphState,
    );
    
    // Create graph checkpoint
    final checkpointId = await _persistenceService.createCheckpoint(
      conversation.id,
      updatedGraphState,
    );
    
    // Select next question
    final nextQuestion = await _llmService.selectNextQuestion(
      answeredQuestionIds: updatedAnsweredQuestions.map((q) => q.id).toList(),
      remainingQuestions: remainingQuestions,
      graphState: updatedGraphState,
    );
    
    // If there are no more questions, return the conversation without adding a new AI message
    if (nextQuestion == null) {
      // Add final AI message
      final finalMessage = Message(
        conversationId: conversation.id,
        sender: MessageSender.AI,
        content: 'Thank you for providing all that information. I\'ve created a planning model '
            'based on your responses. You can now work with the graph visualization to refine it further.',
      );
      conversation.addMessage(finalMessage);
      
      await _persistenceService.saveConversation(conversation);
      return conversation;
    }
    
    // Generate AI response with next question
    final aiResponseText = await _llmService.generateResponse(
      conversation: conversation.messages,
      graphState: updatedGraphState,
      nextQuestion: nextQuestion,
    );
    
    // Add AI message with next question
    final aiMessage = Message(
      conversationId: conversation.id,
      sender: MessageSender.AI,
      content: aiResponseText,
      questionId: nextQuestion.id,
      graphStateSnapshot: updatedGraphState,
    );
    conversation.addMessage(aiMessage);
    
    // Save updated conversation
    await _persistenceService.saveConversation(conversation);
    
    return conversation;
  }
}

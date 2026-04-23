import 'package:flutter/material.dart';
import '../../models/entities/index.dart';
import '../../utils/sample_data.dart';
import 'message_list.dart';
import 'question_display.dart';
import 'input_area.dart';

/// Handles conversation between user and AI planning assistant.
///
/// Shows message history, current question, and input area.
/// Displays question pool status (answered/remaining questions).
/// Starts with "What is your problem about?" and guides through planning.
class AIChat extends StatefulWidget {
  /// ID of the current conversation.
  final String conversationId;

  /// Callback for when a new message is sent.
  final Function(String) onMessageSent;

  const AIChat({
    Key? key,
    required this.conversationId,
    required this.onMessageSent,
  }) : super(key: key);

  @override
  State<AIChat> createState() => _AIChatState();
}

class _AIChatState extends State<AIChat> {
  List<Message> _messages = [];
  Question? _currentQuestion;
  List<Question> _answeredQuestions = [];
  List<Question> _remainingQuestions = [];

  @override
  void initState() {
    super.initState();
    _initializeChat();
  }

  /// Initializes the chat with default questions and AI welcome message.
  void _initializeChat() {
    // Load questions from sample data
    List<Question> allQuestions = SampleData.getQuestions();
    
    // Set the first question as current
    _currentQuestion = allQuestions.isNotEmpty ? allQuestions.first : null;
    
    // Add a welcome message from the AI
    _messages = [
      Message(
        conversationId: widget.conversationId,
        sender: MessageSender.AI,
        content: 'Welcome to the HTN Planning System! I\'ll help you model your '
            'planning problem. Let\'s start with a simple question: '
            '${_currentQuestion?.text ?? "What is your planning problem about?"}',
        questionId: _currentQuestion?.id,
      )
    ];
    
    // Setup remaining questions
    _remainingQuestions = allQuestions.length > 1 
        ? allQuestions.sublist(1) 
        : [];
  }

  /// Handles a new message from the user.
  void _handleMessageSent(String content) {
    if (content.trim().isEmpty) return;
    
    setState(() {
      // Add user message
      _messages.add(
        Message(
          conversationId: widget.conversationId,
          sender: MessageSender.USER,
          content: content,
        ),
      );
      
      // Update question status
      if (_currentQuestion != null) {
        _answeredQuestions.add(_currentQuestion!);
        _selectNextQuestion();
      }
      
      // In a real app, this would trigger the AI to generate a response based on the user's message
      // For now, we'll simulate this with a simple response
      if (_currentQuestion != null) {
        _messages.add(
          Message(
            conversationId: widget.conversationId,
            sender: MessageSender.AI,
            content: 'Thank you for that information. Let\'s continue with the next question: '
                '${_currentQuestion?.text}',
            questionId: _currentQuestion?.id,
          ),
        );
      } else {
        _messages.add(
          Message(
            conversationId: widget.conversationId,
            sender: MessageSender.AI,
            content: 'Thank you for your responses. I\'ve gathered enough information to help with your planning.',
          ),
        );
      }
    });
    
    // Notify parent widget
    widget.onMessageSent(content);
  }

  /// Selects the next question to ask based on prerequisites and priorities.
  void _selectNextQuestion() {
    if (_remainingQuestions.isEmpty) {
      _currentQuestion = null;
      return;
    }
    
    // Find questions whose prerequisites have been answered
    final eligibleQuestions = _remainingQuestions.where((q) {
      return q.prerequisiteIds.isEmpty || 
          q.prerequisiteIds.every((pId) => 
              _answeredQuestions.any((aq) => aq.id == pId));
    }).toList();
    
    if (eligibleQuestions.isEmpty) {
      _currentQuestion = null;
      return;
    }
    
    // Sort by priority (highest first)
    eligibleQuestions.sort((a, b) => b.priority.compareTo(a.priority));
    
    // Select the highest priority question
    _currentQuestion = eligibleQuestions.first;
    _remainingQuestions.remove(_currentQuestion);
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
                Icons.chat,
                color: Theme.of(context).colorScheme.onPrimary,
              ),
              const SizedBox(width: 8),
              Text(
                'AI Planning Assistant',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        
        // Message list (scrollable history)
        Expanded(
          child: MessageList(messages: _messages),
        ),
        
        // Question display (current and upcoming questions)
        if (_currentQuestion != null)
          QuestionDisplay(
            currentQuestion: _currentQuestion!,
            answeredQuestions: _answeredQuestions,
            remainingQuestions: _remainingQuestions,
          ),
        
        // Input area for user responses
        InputArea(
          onSubmit: _handleMessageSent,
          placeholder: _currentQuestion != null
              ? 'Type your answer to the question above...'
              : 'Type your message...',
        ),
      ],
    );
  }
}

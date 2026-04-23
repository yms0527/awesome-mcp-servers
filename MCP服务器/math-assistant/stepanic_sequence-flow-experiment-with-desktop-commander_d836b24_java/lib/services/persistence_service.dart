import 'dart:convert';
import 'dart:async';
import '../models/entities/index.dart';

/// Handles external storage of planning data.
///
/// Provides persistence beyond the application session.
/// Stores graph states, checkpoints, and conversation history.
/// This is a simplified implementation for development.
/// A real implementation would use a database, file system, or cloud storage.
class PersistenceService {
  /// In-memory storage for development/testing
  static final Map<String, dynamic> _storage = {};

  /// Saves the current planning graph state to storage.
  ///
  /// Returns an identifier for later retrieval.
  Future<String> saveGraph(Map<String, dynamic> graphState) async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final id = 'graph_$timestamp';
    _storage[id] = jsonEncode(graphState);
    return id;
  }

  /// Loads a previously saved graph state from storage.
  ///
  /// Returns the complete graph state as originally saved.
  Future<Map<String, dynamic>> loadGraph(String graphId) async {
    if (!_storage.containsKey(graphId)) {
      throw Exception('Graph not found: $graphId');
    }
    
    final graphJson = _storage[graphId] as String;
    return jsonDecode(graphJson) as Map<String, dynamic>;
  }

  /// Saves a conversation to storage.
  ///
  /// Returns an identifier for later retrieval.
  Future<String> saveConversation(Conversation conversation) async {
    final id = 'conversation_${conversation.id}';
    _storage[id] = conversation.serialize();
    return id;
  }

  /// Loads a previously saved conversation from storage.
  Future<Conversation> loadConversation(String conversationId) async {
    final id = 'conversation_$conversationId';
    
    if (!_storage.containsKey(id)) {
      throw Exception('Conversation not found: $conversationId');
    }
    
    final conversationJson = _storage[id] as String;
    return Conversation.deserialize(conversationJson);
  }

  /// Creates a checkpoint of the current graph state.
  ///
  /// Associates the checkpoint with a conversation.
  Future<String> createCheckpoint(String conversationId, Map<String, dynamic> graphState) async {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final id = 'checkpoint_${conversationId}_$timestamp';
    
    _storage[id] = jsonEncode({
      'conversationId': conversationId,
      'timestamp': timestamp,
      'graphState': graphState,
    });
    
    return id;
  }

  /// Restores a graph state from a checkpoint.
  Future<Map<String, dynamic>> restoreCheckpoint(String checkpointId) async {
    if (!_storage.containsKey(checkpointId)) {
      throw Exception('Checkpoint not found: $checkpointId');
    }
    
    final checkpointJson = _storage[checkpointId] as String;
    final checkpoint = jsonDecode(checkpointJson) as Map<String, dynamic>;
    return checkpoint['graphState'] as Map<String, dynamic>;
  }

  /// Lists all checkpoints for a conversation.
  Future<List<String>> listCheckpoints(String conversationId) async {
    return _storage.keys
        .where((key) => key.startsWith('checkpoint_$conversationId'))
        .toList();
  }
}

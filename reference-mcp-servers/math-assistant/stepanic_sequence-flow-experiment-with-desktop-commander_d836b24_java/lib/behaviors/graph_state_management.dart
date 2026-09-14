import 'dart:convert';
import '../models/entities/index.dart';
import '../services/persistence_service.dart';

/// Handles the persistence and versioning of the planning graph.
///
/// Creates checkpoints at significant points in the planning process.
/// Allows restoration of previous states.
/// Prevents data loss and enables exploration of alternative approaches.
class GraphStateManagement {
  final PersistenceService _persistenceService;

  GraphStateManagement({
    required PersistenceService persistenceService,
  }) : _persistenceService = persistenceService;

  /// Creates a persistent checkpoint of the current graph state.
  ///
  /// Returns the checkpoint ID.
  Future<String> createCheckpoint({
    required String conversationId,
    required List<Task> tasks,
    required List<TaskDecomposition> decompositions,
    required List<TaskDependency> dependencies,
    required List<CrossBoundaryReference> references,
    required UIState uiState,
  }) async {
    // Serialize the graph state
    final graphState = {
      'tasks': tasks.map((task) => task.toJson()).toList(),
      'decompositions': decompositions.map((dec) => dec.toJson()).toList(),
      'dependencies': dependencies.map((dep) => dep.toJson()).toList(),
      'references': references.map((ref) => ref.toJson()).toList(),
      'uiState': uiState.toJson(),
      'timestamp': DateTime.now().toIso8601String(),
    };
    
    // Create the checkpoint
    final checkpointId = await _persistenceService.createCheckpoint(
      conversationId,
      graphState,
    );
    
    return checkpointId;
  }

  /// Restores the graph to a previously saved checkpoint.
  ///
  /// Returns the restored graph state.
  Future<Map<String, Object>> restoreCheckpoint({
    required String checkpointId,
  }) async {
    // Load the checkpoint from storage
    final checkpointData = await _persistenceService.restoreCheckpoint(checkpointId);
    
    // Deserialize the graph elements
    final tasks = (checkpointData['tasks'] as List<dynamic>)
        .map((taskJson) => Task.fromJson(taskJson as Map<String, dynamic>))
        .toList();
        
    final decompositions = (checkpointData['decompositions'] as List<dynamic>)
        .map((decJson) => TaskDecomposition.fromJson(decJson as Map<String, dynamic>))
        .toList();
        
    final dependencies = (checkpointData['dependencies'] as List<dynamic>)
        .map((depJson) => TaskDependency.fromJson(depJson as Map<String, dynamic>))
        .toList();
        
    final references = (checkpointData['references'] as List<dynamic>)
        .map((refJson) => CrossBoundaryReference.fromJson(refJson as Map<String, dynamic>))
        .toList();
        
    final uiState = UIState.fromJson(checkpointData['uiState'] as Map<String, dynamic>);
    
    // Return the reconstructed graph state
    return {
      'tasks': tasks,
      'decompositions': decompositions,
      'dependencies': dependencies,
      'references': references,
      'uiState': uiState,
    };
  }

  /// Lists all checkpoints for a conversation.
  ///
  /// Returns a list of checkpoint IDs.
  Future<List<String>> listCheckpoints({
    required String conversationId,
  }) async {
    return await _persistenceService.listCheckpoints(conversationId);
  }

  /// Serializes the current graph state for storage or transmission.
  ///
  /// Returns a JSON string representation of the graph.
  String serializeGraph({
    required List<Task> tasks,
    required List<TaskDecomposition> decompositions,
    required List<TaskDependency> dependencies,
    required List<CrossBoundaryReference> references,
    required UIState uiState,
  }) {
    final graphState = {
      'tasks': tasks.map((task) => task.toJson()).toList(),
      'decompositions': decompositions.map((dec) => dec.toJson()).toList(),
      'dependencies': dependencies.map((dep) => dep.toJson()).toList(),
      'references': references.map((ref) => ref.toJson()).toList(),
      'uiState': uiState.toJson(),
      'timestamp': DateTime.now().toIso8601String(),
    };
    
    return jsonEncode(graphState);
  }

  /// Deserializes a graph state from a JSON string.
  ///
  /// Returns the reconstructed graph state.
  Map<String, Object> deserializeGraph({
    required String serializedGraph,
  }) {
    final Map<String, dynamic> graphData = jsonDecode(serializedGraph);
    
    final tasks = (graphData['tasks'] as List<dynamic>)
        .map((taskJson) => Task.fromJson(taskJson as Map<String, dynamic>))
        .toList();
        
    final decompositions = (graphData['decompositions'] as List<dynamic>)
        .map((decJson) => TaskDecomposition.fromJson(decJson as Map<String, dynamic>))
        .toList();
        
    final dependencies = (graphData['dependencies'] as List<dynamic>)
        .map((depJson) => TaskDependency.fromJson(depJson as Map<String, dynamic>))
        .toList();
        
    final references = (graphData['references'] as List<dynamic>)
        .map((refJson) => CrossBoundaryReference.fromJson(refJson as Map<String, dynamic>))
        .toList();
        
    final uiState = UIState.fromJson(graphData['uiState'] as Map<String, dynamic>);
    
    return {
      'tasks': tasks,
      'decompositions': decompositions,
      'dependencies': dependencies,
      'references': references,
      'uiState': uiState,
    };
  }
}

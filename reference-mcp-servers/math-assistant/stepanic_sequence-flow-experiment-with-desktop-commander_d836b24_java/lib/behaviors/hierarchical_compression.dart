import 'dart:convert';
import '../models/entities/index.dart';

/// Implements the compression and expansion of task subgraphs.
///
/// This is a key innovation that allows scaling to complex planning problems
/// while maintaining a manageable visualization.
/// Works similar to file system directories (compressed = folder, expanded = contents).
/// Preserves references between compressed and external nodes.
class HierarchicalCompression {
  /// Compresses a compound task and all its descendants.
  ///
  /// Serializes the subgraph structure for storage.
  /// Detects and preserves cross-boundary references.
  /// Returns the task with updated compression state.
  static Task compressNode({
    required Task node,
    required List<Task> allTasks,
    required List<TaskDependency> dependencies,
  }) {
    if (!node.isCompound || node.children.isEmpty) {
      return node;
    }
    
    // Collect all descendant nodes
    final descendantIds = _collectDescendantIds(node);
    
    // Find all cross-boundary references
    final crossBoundaryRefs = _detectCrossBoundaryReferences(
      nodeId: node.id,
      descendantIds: descendantIds,
      allTasks: allTasks,
      dependencies: dependencies,
    );
    
    // Create a deep copy of the node for modification
    final compressedNode = Task(
      id: node.id,
      name: node.name,
      description: node.description,
      type: node.type,
      isCompressed: true,
      metadata: Map<String, dynamic>.from(node.metadata),
    );
    
    // Store cross-boundary references in the node metadata
    compressedNode.metadata['crossBoundaryRefs'] = crossBoundaryRefs
        .map((ref) => ref.toJson())
        .toList();
    
    // Serialize the subgraph
    compressedNode.serializedSubgraph = jsonEncode({
      'children': node.children.map((child) => child.toJson()).toList(),
    });
    
    return compressedNode;
  }

  /// Expands a previously compressed node.
  ///
  /// Deserializes the stored subgraph structure.
  /// Restores cross-boundary references.
  /// Returns the task with updated expansion state.
  static Task expandNode({
    required Task node,
  }) {
    if (!node.isCompound || !node.isCompressed || node.serializedSubgraph == null) {
      return node;
    }
    
    // Create a deep copy of the node for modification
    final expandedNode = Task(
      id: node.id,
      name: node.name,
      description: node.description,
      type: node.type,
      isCompressed: false,
      metadata: Map<String, dynamic>.from(node.metadata),
    );
    
    // Deserialize the subgraph
    final Map<String, dynamic> data = jsonDecode(node.serializedSubgraph!);
    final List<dynamic> childrenData = data['children'] as List<dynamic>;
    
    expandedNode.children = childrenData
        .map((childData) => Task.fromJson(childData as Map<String, dynamic>))
        .toList();
    
    return expandedNode;
  }

  /// Collects all descendant IDs of a node.
  static List<String> _collectDescendantIds(Task node) {
    final descendantIds = <String>[];
    
    for (final child in node.children) {
      descendantIds.add(child.id);
      if (child.isCompound && child.children.isNotEmpty) {
        descendantIds.addAll(_collectDescendantIds(child));
      }
    }
    
    return descendantIds;
  }

  /// Detects references that cross compression boundaries.
  static List<CrossBoundaryReference> _detectCrossBoundaryReferences({
    required String nodeId,
    required List<String> descendantIds,
    required List<Task> allTasks,
    required List<TaskDependency> dependencies,
  }) {
    final crossBoundaryRefs = <CrossBoundaryReference>[];
    
    // Find dependencies that cross the compression boundary
    for (final dependency in dependencies) {
      // Outbound references (internal → external)
      if (descendantIds.contains(dependency.sourceId) && 
          !descendantIds.contains(dependency.targetId) &&
          dependency.targetId != nodeId) {
        crossBoundaryRefs.add(
          CrossBoundaryReference(
            compressedNodeId: nodeId,
            externalNodeId: dependency.targetId,
            internalNodePath: [dependency.sourceId],
            referenceType: _convertToReferenceType(dependency.type),
            direction: ReferenceDirection.OUTBOUND,
            portPosition: Point(20.0, 0.0), // Default position, would be calculated in real implementation
          ),
        );
      }
      
      // Inbound references (external → internal)
      if (!descendantIds.contains(dependency.sourceId) && 
          dependency.sourceId != nodeId &&
          descendantIds.contains(dependency.targetId)) {
        crossBoundaryRefs.add(
          CrossBoundaryReference(
            compressedNodeId: nodeId,
            externalNodeId: dependency.sourceId,
            internalNodePath: [dependency.targetId],
            referenceType: _convertToReferenceType(dependency.type),
            direction: ReferenceDirection.INBOUND,
            portPosition: Point(-20.0, 0.0), // Default position, would be calculated in real implementation
          ),
        );
      }
    }
    
    return crossBoundaryRefs;
  }

  /// Converts a DependencyType to ReferenceType.
  static ReferenceType _convertToReferenceType(DependencyType dependencyType) {
    switch (dependencyType) {
      case DependencyType.ORDERING:
        return ReferenceType.ORDERING;
      case DependencyType.CAUSAL:
        return ReferenceType.CAUSAL;
      case DependencyType.RESOURCE:
        return ReferenceType.RESOURCE;
      case DependencyType.TEMPORAL:
        return ReferenceType.TEMPORAL;
    }
  }

  /// Provides targeted navigation to a specific cross-boundary reference.
  ///
  /// Expands only the minimal set of nodes needed to show the reference.
  /// Returns the list of nodes that need to be expanded.
  static List<String> navigateToReference({
    required String compressedNodeId,
    required CrossBoundaryReference reference,
    required List<Task> allTasks,
  }) {
    final nodesToExpand = <String>[compressedNodeId];
    
    // In a real implementation, this would determine the minimal set of nodes
    // that need to be expanded to show the reference.
    // For now, we just return the compressed node itself.
    
    return nodesToExpand;
  }
}

import 'package:flutter/material.dart';
import '../../models/entities/index.dart';
import '../../utils/sample_data.dart';
import 'graph_node.dart';
import 'graph_edge.dart';
import 'graph_port.dart';

/// Interactive visualization of the planning graph.
///
/// Shows tasks as nodes and relationships as edges.
/// Supports compression/expansion of subgraphs.
/// Displays cross-boundary references with visual indicators (ports).
/// Allows zooming, panning, and direct manipulation.
class DirectedGraph extends StatefulWidget {
  /// Current UI state.
  final UIState uiState;

  /// Callback for when a node is selected.
  final Function(String) onNodeSelect;

  /// Callback for when a node is expanded.
  final Function(String) onNodeExpand;

  /// Callback for when a node is compressed.
  final Function(String) onNodeCompress;

  const DirectedGraph({
    Key? key,
    required this.uiState,
    required this.onNodeSelect,
    required this.onNodeExpand,
    required this.onNodeCompress,
  }) : super(key: key);

  @override
  State<DirectedGraph> createState() => _DirectedGraphState();
}

class _DirectedGraphState extends State<DirectedGraph> {
  // For a real implementation, these would be loaded from a service or repository
  List<Task> _nodes = [];
  List<TaskDecomposition> _hierarchicalEdges = [];
  List<TaskDependency> _dependencyEdges = [];
  List<CrossBoundaryReference> _crossBoundaryRefs = [];
  
  // Translation offset for panning
  Offset _offset = Offset.zero;
  
  // Scale factor for zooming
  double _scale = 1.0;

  @override
  void initState() {
    super.initState();
    _loadSampleData();
  }

  /// Loads sample data for demonstration purposes.
  void _loadSampleData() {
    // Load sample data from utility class
    _nodes = SampleData.getTasks();
    _hierarchicalEdges = SampleData.getTaskDecompositions();
    _dependencyEdges = SampleData.getTaskDependencies();
    _crossBoundaryRefs = SampleData.getCrossBoundaryReferences();
  }

  /// Handles node selection.
  void _handleNodeTap(String nodeId) {
    widget.onNodeSelect(nodeId);
  }

  /// Handles node expansion.
  void _handleNodeExpand(String nodeId) {
    widget.onNodeExpand(nodeId);
  }

  /// Handles node compression.
  void _handleNodeCompress(String nodeId) {
    widget.onNodeCompress(nodeId);
  }

  /// Handles scale gesture (combines panning and scaling).
  void _handleScaleUpdate(ScaleUpdateDetails details) {
    setState(() {
      // Handle panning (translation)
      _offset += details.focalPointDelta / _scale;
      
      // Handle scaling
      if (details.scale != 1.0) {
        _scale = (_scale * details.scale).clamp(0.5, 2.0);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      // Use only scale gesture recognizer, which is a superset of pan
      onScaleUpdate: _handleScaleUpdate,
      child: Container(
        color: Colors.grey[100],
        child: Stack(
          children: [
            // Transform for panning and zooming
            Transform.scale(
              scale: _scale,
              child: Transform.translate(
                offset: _offset,
                child: Stack(
                  children: [
                    // Draw edges first (so they appear behind nodes)
                    ..._buildEdges(),
                    
                    // Draw nodes
                    ..._buildNodes(),
                    
                    // Draw cross-boundary reference ports
                    ..._buildPorts(),
                  ],
                ),
              ),
            ),
            
            // Controls overlay
            Positioned(
              top: 16,
              right: 16,
              child: Column(
                children: [
                  FloatingActionButton(
                    mini: true,
                    heroTag: 'zoom_in',
                    child: const Icon(Icons.add),
                    onPressed: () {
                      setState(() {
                        _scale = (_scale * 1.2).clamp(0.5, 2.0);
                      });
                    },
                  ),
                  const SizedBox(height: 8),
                  FloatingActionButton(
                    mini: true,
                    heroTag: 'zoom_out',
                    child: const Icon(Icons.remove),
                    onPressed: () {
                      setState(() {
                        _scale = (_scale / 1.2).clamp(0.5, 2.0);
                      });
                    },
                  ),
                  const SizedBox(height: 8),
                  FloatingActionButton(
                    mini: true,
                    heroTag: 'reset',
                    child: const Icon(Icons.refresh),
                    onPressed: () {
                      setState(() {
                        _scale = 1.0;
                        _offset = Offset.zero;
                      });
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Builds the node widgets.
  List<Widget> _buildNodes() {
    return _nodes.map((node) {
      final position = node.metadata['position'] as Map<String, dynamic>;
      final isExpanded = widget.uiState.expandedNodeIds.contains(node.id);
      final isSelected = widget.uiState.selectedTaskId == node.id;
      
      return Positioned(
        left: position['x'] as double,
        top: position['y'] as double,
        child: GraphNode(
          task: node,
          isExpanded: isExpanded,
          isSelected: isSelected,
          onTap: () => _handleNodeTap(node.id),
          onExpand: () => _handleNodeExpand(node.id),
          onCompress: () => _handleNodeCompress(node.id),
        ),
      );
    }).toList();
  }

  /// Builds the edge widgets.
  List<Widget> _buildEdges() {
    final hierarchicalEdges = _hierarchicalEdges.map((edge) {
      final parentNode = _nodes.firstWhere((n) => n.id == edge.parentId);
      final childNode = _nodes.firstWhere((n) => n.id == edge.childId);
      
      final parentPos = parentNode.metadata['position'] as Map<String, dynamic>;
      final childPos = childNode.metadata['position'] as Map<String, dynamic>;
      
      return GraphEdge(
        startX: parentPos['x'] as double,
        startY: parentPos['y'] as double,
        endX: childPos['x'] as double,
        endY: childPos['y'] as double,
        type: 'hierarchical',
      );
    }).toList();
    
    final dependencyEdges = _dependencyEdges.map((edge) {
      final sourceNode = _nodes.firstWhere((n) => n.id == edge.sourceId);
      final targetNode = _nodes.firstWhere((n) => n.id == edge.targetId);
      
      final sourcePos = sourceNode.metadata['position'] as Map<String, dynamic>;
      final targetPos = targetNode.metadata['position'] as Map<String, dynamic>;
      
      return GraphEdge(
        startX: (sourcePos['x'] as double) + 40, // Offset to connect from right side
        startY: (sourcePos['y'] as double) + 20, // Center vertically
        endX: targetPos['x'] as double,        // Connect to left side
        endY: (targetPos['y'] as double) + 20,   // Center vertically
        type: 'dependency',
        dependencyType: edge.type.toString().split('.').last.toLowerCase(),
      );
    }).toList();
    
    return [...hierarchicalEdges, ...dependencyEdges];
  }

  /// Builds the port widgets for cross-boundary references.
  List<Widget> _buildPorts() {
    return _crossBoundaryRefs.map((ref) {
      final node = _nodes.firstWhere((n) => n.id == ref.compressedNodeId);
      final position = node.metadata['position'] as Map<String, dynamic>;
      
      return GraphPort(
        x: (position['x'] as double) + ref.portPosition.x,
        y: (position['y'] as double) + ref.portPosition.y,
        direction: ref.direction.toString().split('.').last.toLowerCase(),
        referenceType: ref.referenceType.toString().split('.').last.toLowerCase(),
        onTap: () {
          // Handle port selection (navigate to reference)
        },
      );
    }).toList() as List<Widget>;
  }
}

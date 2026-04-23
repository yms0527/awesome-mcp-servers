/// Reference type enumeration.
enum ReferenceType { ORDERING, CAUSAL, RESOURCE, TEMPORAL }

/// Direction of reference.
enum ReferenceDirection { INBOUND, OUTBOUND }

/// Represents a point in 2D space.
class Point {
  final double x;
  final double y;

  Point(this.x, this.y);

  Map<String, dynamic> toJson() => {'x': x, 'y': y};

  factory Point.fromJson(Map<String, dynamic> json) {
    return Point(
      json['x'] as double,
      json['y'] as double,
    );
  }
}

/// Preserves references between tasks when parts of the graph are compressed.
///
/// Similar to symbolic links in a filesystem, these maintain relationships
/// between tasks inside a compressed subgraph and tasks outside it.
/// This is critical for scaling to complex planning problems while
/// maintaining a manageable visualization.
class CrossBoundaryReference {
  /// The compressed node containing internal tasks.
  final String compressedNodeId;

  /// The external node referenced.
  final String externalNodeId;

  /// Path to the internal node within the compressed subgraph.
  final List<String> internalNodePath;

  /// Type of reference.
  final ReferenceType referenceType;

  /// Whether reference points in or out of compressed node.
  final ReferenceDirection direction;

  /// Visual position of reference indicator.
  Point portPosition;

  CrossBoundaryReference({
    required this.compressedNodeId,
    required this.externalNodeId,
    required this.internalNodePath,
    required this.referenceType,
    required this.direction,
    required this.portPosition,
  });

  /// Converts cross boundary reference to JSON representation.
  Map<String, dynamic> toJson() {
    return {
      'compressedNodeId': compressedNodeId,
      'externalNodeId': externalNodeId,
      'internalNodePath': internalNodePath,
      'referenceType': referenceType.toString().split('.').last,
      'direction': direction.toString().split('.').last,
      'portPosition': portPosition.toJson(),
    };
  }

  /// Creates a CrossBoundaryReference from JSON representation.
  factory CrossBoundaryReference.fromJson(Map<String, dynamic> json) {
    return CrossBoundaryReference(
      compressedNodeId: json['compressedNodeId'] as String,
      externalNodeId: json['externalNodeId'] as String,
      internalNodePath: (json['internalNodePath'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      referenceType: ReferenceType.values.firstWhere(
        (e) => e.toString().split('.').last == json['referenceType'],
        orElse: () => ReferenceType.ORDERING,
      ),
      direction: ReferenceDirection.values.firstWhere(
        (e) => e.toString().split('.').last == json['direction'],
        orElse: () => ReferenceDirection.OUTBOUND,
      ),
      portPosition: Point.fromJson(json['portPosition'] as Map<String, dynamic>),
    );
  }
}

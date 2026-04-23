import 'package:flutter/material.dart';

/// Visual representation of a cross-boundary reference port.
///
/// Displays an indicator for a reference that crosses compression boundaries.
/// Visually indicates the direction and type of the reference.
class GraphPort extends StatelessWidget {
  /// X-coordinate of the port.
  final double x;

  /// Y-coordinate of the port.
  final double y;

  /// Whether the reference is inbound or outbound.
  final String direction;

  /// Type of reference.
  final String referenceType;

  /// Callback for when the port is tapped.
  final VoidCallback onTap;

  const GraphPort({
    Key? key,
    required this.x,
    required this.y,
    required this.direction,
    required this.referenceType,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final portSize = 12.0;
    final isInbound = direction == 'inbound';
    
    return Positioned(
      left: x - portSize / 2,
      top: y - portSize / 2,
      child: GestureDetector(
        onTap: onTap,
        child: Tooltip(
          message: '${isInbound ? 'Inbound' : 'Outbound'} ${_formatReferenceType(referenceType)} reference',
          child: Container(
            width: portSize,
            height: portSize,
            decoration: BoxDecoration(
              color: _getReferenceTypeColor(referenceType),
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white,
                width: 1.0,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 2,
                  offset: const Offset(1, 1),
                ),
              ],
            ),
            child: Center(
              child: Icon(
                isInbound ? Icons.arrow_downward : Icons.arrow_upward,
                size: 8,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// Gets the color for the reference type.
  Color _getReferenceTypeColor(String type) {
    switch (type) {
      case 'ordering':
        return Colors.green[700]!;
      case 'causal':
        return Colors.red[700]!;
      case 'resource':
        return Colors.purple[700]!;
      case 'temporal':
        return Colors.blue[700]!;
      default:
        return Colors.grey[800]!;
    }
  }

  /// Formats the reference type for display.
  String _formatReferenceType(String type) {
    return type.substring(0, 1).toUpperCase() + type.substring(1);
  }
}

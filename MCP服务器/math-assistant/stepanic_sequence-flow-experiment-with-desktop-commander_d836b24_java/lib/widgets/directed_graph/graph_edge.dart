import 'package:flutter/material.dart';
import 'dart:math' as math;

/// Visual representation of an edge in the graph.
///
/// Draws a line between two nodes with appropriate styling based on the edge type.
/// Supports both hierarchical relationships and dependencies.
class GraphEdge extends StatelessWidget {
  /// X-coordinate of the start point.
  final double startX;

  /// Y-coordinate of the start point.
  final double startY;

  /// X-coordinate of the end point.
  final double endX;

  /// Y-coordinate of the end point.
  final double endY;

  /// Type of edge ('hierarchical' or 'dependency').
  final String type;

  /// Specific dependency type (for dependency edges).
  final String? dependencyType;

  const GraphEdge({
    Key? key,
    required this.startX,
    required this.startY,
    required this.endX,
    required this.endY,
    required this.type,
    this.dependencyType,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _EdgePainter(
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        type: type,
        dependencyType: dependencyType,
        theme: Theme.of(context),
      ),
      size: Size(
        (endX - startX).abs() + 10,
        (endY - startY).abs() + 10,
      ),
    );
  }
}

/// Custom painter for drawing graph edges.
class _EdgePainter extends CustomPainter {
  final double startX;
  final double startY;
  final double endX;
  final double endY;
  final String type;
  final String? dependencyType;
  final ThemeData theme;

  _EdgePainter({
    required this.startX,
    required this.startY,
    required this.endX,
    required this.endY,
    required this.type,
    this.dependencyType,
    required this.theme,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..strokeWidth = type == 'hierarchical' ? 2.0 : 1.5
      ..style = PaintingStyle.stroke;

    // Set color based on edge type
    if (type == 'hierarchical') {
      paint.color = Colors.grey[600]!;
    } else if (type == 'dependency') {
      switch (dependencyType) {
        case 'ordering':
          paint.color = Colors.green[700]!;
          break;
        case 'causal':
          paint.color = Colors.red[700]!;
          break;
        case 'resource':
          paint.color = Colors.purple[700]!;
          break;
        case 'temporal':
          paint.color = Colors.blue[700]!;
          break;
        default:
          paint.color = Colors.black;
          break;
      }
    }

    // Calculate control points for the path
    final path = Path();
    
    // Starting point
    final startPoint = Offset(startX, startY);
    
    // Ending point
    final endPoint = Offset(endX, endY);
    
    // For hierarchical edges, use a simpler Bezier curve
    if (type == 'hierarchical') {
      final midY = (startY + endY) / 2;
      path.moveTo(startX, startY);
      path.cubicTo(
        startX, midY,
        endX, midY,
        endX, endY,
      );
    } else {
      // For dependency edges, use a more horizontal curve
      final controlOffset = (endX - startX) * 0.4;
      path.moveTo(startX, startY);
      path.cubicTo(
        startX + controlOffset, startY,
        endX - controlOffset, endY,
        endX, endY,
      );
    }
    
    // Draw the path
    canvas.drawPath(path, paint);
    
    // Draw arrowhead for all edges
    _drawArrowhead(canvas, path, paint);
    
    // Add label for dependency type
    if (type == 'dependency' && dependencyType != null) {
      _drawLabel(canvas, dependencyType!);
    }
  }

  /// Draws an arrowhead at the end of the path.
  void _drawArrowhead(Canvas canvas, Path path, Paint paint) {
    // Create a new paint for the arrowhead
    final arrowPaint = Paint()
      ..color = paint.color
      ..style = PaintingStyle.fill;
    
    // Calculate the angle of the line at the endpoint
    final pathMetrics = path.computeMetrics().first;
    final tangent = pathMetrics.getTangentForOffset(pathMetrics.length)!;
    
    // Create the arrowhead path
    final arrowPath = Path();
    final tipPoint = tangent.position;
    final angle = math.atan2(tangent.vector.dy, tangent.vector.dx);
    
    // Arrow dimensions
    const arrowLength = 10.0;
    const arrowWidth = 6.0;
    
    // Calculate arrow points
    final backPoint = Offset(
      tipPoint.dx - arrowLength * math.cos(angle),
      tipPoint.dy - arrowLength * math.sin(angle),
    );
    final leftPoint = Offset(
      backPoint.dx - arrowWidth * math.sin(angle),
      backPoint.dy + arrowWidth * math.cos(angle),
    );
    final rightPoint = Offset(
      backPoint.dx + arrowWidth * math.sin(angle),
      backPoint.dy - arrowWidth * math.cos(angle),
    );
    
    // Draw the arrowhead
    arrowPath.moveTo(tipPoint.dx, tipPoint.dy);
    arrowPath.lineTo(leftPoint.dx, leftPoint.dy);
    arrowPath.lineTo(rightPoint.dx, rightPoint.dy);
    arrowPath.close();
    
    canvas.drawPath(arrowPath, arrowPaint);
  }

  /// Draws a label for the dependency type.
  void _drawLabel(Canvas canvas, String label) {
    // Position for the label
    final midX = (startX + endX) / 2;
    final midY = (startY + endY) / 2;
    
    // Create a text painter
    final textSpan = TextSpan(
      text: label,
      style: TextStyle(
        color: Colors.grey[800],
        fontSize: 10,
        fontWeight: FontWeight.bold,
      ),
    );
    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    
    // Background for the label
    final bgRect = Rect.fromCenter(
      center: Offset(midX, midY),
      width: textPainter.width + 8,
      height: textPainter.height + 4,
    );
    canvas.drawRect(
      bgRect,
      Paint()..color = Colors.white.withOpacity(0.8),
    );
    
    // Draw the text
    textPainter.paint(
      canvas,
      Offset(
        midX - textPainter.width / 2,
        midY - textPainter.height / 2,
      ),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

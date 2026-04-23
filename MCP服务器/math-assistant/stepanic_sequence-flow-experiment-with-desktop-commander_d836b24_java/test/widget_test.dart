import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sequence_flow/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const SequenceFlowApp());

    // Verify that the app starts without crashing
    expect(find.text('Sequence Flow - HTN Planning System'), findsOneWidget);
  });
}

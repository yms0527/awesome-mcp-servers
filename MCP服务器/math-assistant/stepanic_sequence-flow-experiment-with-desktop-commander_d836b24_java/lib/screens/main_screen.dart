import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/three_column_layout.dart';
import '../models/state/ui_state_manager.dart';

/// Main screen of the HTN Planning application.
///
/// This is the entry point of the application UI.
class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sequence Flow - HTN Planning System'),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline),
            onPressed: _showHelp,
            tooltip: 'Help',
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: _showSettings,
            tooltip: 'Settings',
          ),
        ],
      ),
      body: Consumer<UIStateManager>(
        builder: (context, uiStateManager, _) {
          return ThreeColumnLayout(
            uiStateManager: uiStateManager,
          );
        },
      ),
    );
  }

  /// Shows the help dialog.
  void _showHelp() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Help'),
        content: const SingleChildScrollView(
          child: Text(
            'This is the HTN Planning System, designed to help you model complex planning problems '
            'through a guided AI conversation.\n\n'
            'The interface is divided into three columns:\n'
            '1. AI Chat - For conversation with the AI planning assistant\n'
            '2. Directed Graph - Visualization of your planning tasks\n'
            '3. Task List - Hierarchical view of all tasks\n\n'
            'Start by describing your planning problem to the AI assistant, and it will guide you '
            'through the process of modeling and solving it.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  /// Shows the settings dialog.
  void _showSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Settings'),
        content: const SingleChildScrollView(
          child: Text(
            'Settings will be implemented in a future version.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}

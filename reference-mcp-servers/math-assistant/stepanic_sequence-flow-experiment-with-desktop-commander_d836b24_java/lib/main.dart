import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'models/entities/index.dart';
import 'models/state/ui_state_manager.dart';
import 'screens/main_screen.dart';
import 'services/index.dart';

void main() {
  // Ensure that Flutter widget bindings are initialized
  WidgetsFlutterBinding.ensureInitialized();
  
  // Run our application
  runApp(const SequenceFlowApp());
}

/// The root application widget.
class SequenceFlowApp extends StatelessWidget {
  const SequenceFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Provide service instances
        Provider<LLMService>(
          create: (_) => LLMService(),
        ),
        Provider<PersistenceService>(
          create: (_) => PersistenceService(),
        ),
        
        // Provide UI state manager
        ChangeNotifierProvider<UIStateManager>(
          create: (_) => UIStateManager(
            initialState: UIState(
              conversationId: 'default',
              currentView: 'all',
            ),
          ),
        ),
      ],
      child: MaterialApp(
        title: 'Sequence Flow - HTN Planning System',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.indigo,
            brightness: Brightness.light,
          ),
          useMaterial3: true,
          visualDensity: VisualDensity.adaptivePlatformDensity,
          textTheme: const TextTheme(
            headlineMedium: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 24,
            ),
            bodyLarge: TextStyle(fontSize: 16),
            bodyMedium: TextStyle(fontSize: 14),
          ),
        ),
        darkTheme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.indigo,
            brightness: Brightness.dark,
          ),
          useMaterial3: true,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        themeMode: ThemeMode.light,
        home: const MainScreen(),
      ),
    );
  }
}

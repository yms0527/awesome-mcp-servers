import 'package:uuid/uuid.dart';

/// Utility class for generating unique identifiers
class IdGenerator {
  static final _uuid = Uuid();
  
  /// Generates a new unique ID
  static String generateId() {
    return _uuid.v4();
  }
}

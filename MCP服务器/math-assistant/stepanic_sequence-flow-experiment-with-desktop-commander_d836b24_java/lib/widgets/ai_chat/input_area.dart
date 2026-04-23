import 'package:flutter/material.dart';

/// Text input area for user to respond to questions.
///
/// Includes send button and optional text formatting controls.
class InputArea extends StatefulWidget {
  /// Hint text when empty.
  final String placeholder;

  /// Callback when user submits a response.
  final Function(String) onSubmit;

  const InputArea({
    Key? key,
    required this.onSubmit,
    this.placeholder = 'Type your message...',
  }) : super(key: key);

  @override
  State<InputArea> createState() => _InputAreaState();
}

class _InputAreaState extends State<InputArea> {
  final TextEditingController _controller = TextEditingController();
  bool _showFormatting = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// Submits the current message.
  void _submitMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    
    widget.onSubmit(text);
    _controller.clear();
  }

  /// Toggles the formatting toolbar.
  void _toggleFormatting() {
    setState(() {
      _showFormatting = !_showFormatting;
    });
  }

  /// Inserts formatting at the current cursor position.
  void _insertFormatting(String prefix, String suffix) {
    final text = _controller.text;
    final selection = _controller.selection;
    
    final newText = text.replaceRange(
      selection.start,
      selection.end,
      '$prefix${text.substring(selection.start, selection.end)}$suffix',
    );
    
    _controller.value = TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(
        offset: selection.baseOffset + prefix.length + (selection.extentOffset - selection.baseOffset) + suffix.length,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Optional formatting toolbar
          if (_showFormatting)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  IconButton(
                    icon: const Icon(Icons.format_bold),
                    tooltip: 'Bold',
                    onPressed: () => _insertFormatting('**', '**'),
                  ),
                  IconButton(
                    icon: const Icon(Icons.format_italic),
                    tooltip: 'Italic',
                    onPressed: () => _insertFormatting('*', '*'),
                  ),
                  IconButton(
                    icon: const Icon(Icons.code),
                    tooltip: 'Code',
                    onPressed: () => _insertFormatting('`', '`'),
                  ),
                  IconButton(
                    icon: const Icon(Icons.format_list_bulleted),
                    tooltip: 'Bullet List',
                    onPressed: () => _insertFormatting('\n- ', ''),
                  ),
                  IconButton(
                    icon: const Icon(Icons.format_list_numbered),
                    tooltip: 'Numbered List',
                    onPressed: () => _insertFormatting('\n1. ', ''),
                  ),
                ],
              ),
            ),
          
          // Input field and send button
          Row(
            children: [
              IconButton(
                icon: Icon(
                  _showFormatting ? Icons.keyboard_arrow_down : Icons.text_format,
                ),
                tooltip: _showFormatting ? 'Hide formatting' : 'Show formatting',
                onPressed: _toggleFormatting,
              ),
              Expanded(
                child: TextField(
                  controller: _controller,
                  decoration: InputDecoration(
                    hintText: widget.placeholder,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24.0),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: Theme.of(context).colorScheme.surface,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                      vertical: 8.0,
                    ),
                  ),
                  maxLines: 5,
                  minLines: 1,
                  textInputAction: TextInputAction.newline,
                  keyboardType: TextInputType.multiline,
                  onSubmitted: (value) {
                    if (value.trim().isNotEmpty) {
                      _submitMessage();
                    }
                  },
                ),
              ),
              IconButton(
                icon: const Icon(Icons.send),
                tooltip: 'Send',
                onPressed: _submitMessage,
                color: Theme.of(context).colorScheme.primary,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

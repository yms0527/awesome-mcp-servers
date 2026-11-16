# WhatsApp Python Automation

This is a Python-based WhatsApp automation tool that allows you to send messages programmatically using WhatsApp Web's interface.

## Features

- Send messages to individual contacts or groups
- Easy to set up and use
- Uses Python for automation
- Works with WhatsApp Web

## Prerequisites

- Python 3.6 or higher
- Go (version 1.16 or higher)
- Chrome/Firefox browser
- Active WhatsApp account
- Internet connection

### Windows-Specific Requirements

For Windows users, additional setup is required:

1. **Install Go**:
   - Download Go from the [official website](https://golang.org/dl/)
   - Run the installer
   - Add Go to your system PATH if not done automatically
   - Verify installation by running `go version` in Command Prompt

2. **Enable CGO**:
   - CGO is required for the WhatsApp bridge to work properly
   - Open Command Prompt and run: `go env -w CGO_ENABLED=1`

3. **Install C Compiler**:
   - Download and install [MSYS2](https://www.msys2.org/)
   - Open MSYS2 and run: `pacman -S mingw-w64-x86_64-gcc`
   - Add `C:\msys64\mingw64\bin` to your system PATH

## Installation

1. Clone this repository:
```bash
git clone [your-repository-url]
cd whatsapp-python
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Navigate to the project directory:
```bash
cd whatsapp-bridge
```

2. Run the WhatsApp bridge:
```bash
go run main.go
#this will start whatsapp mcp server
```

3. When running for the first time, you'll need to:
   - Scan the QR code with your WhatsApp mobile app
   - Wait for the authentication process to complete
   - Keep your phone connected to the internet

4. To send a message, use the following format:
```python
python whatsapp_message.py
#This will run ai with our mcp connection
send message to "recipient_name" "your message"

eg: send message to chau say hi  /#remember to add contact manually to json so it will load it
```

## How It Works

The application works by:
1. Automating a web browser session
2. Connecting to WhatsApp Web
3. Authenticating via QR code (first time only)
4. Locating the recipient in your contacts
5. Sending the specified message using ollam

## Important Notes

- Keep your WhatsApp phone app connected to the internet
- Don't close the server in terminal while sending messages
- Make sure the recipient is in your WhatsApp contacts
- The session needs to be re-authenticated periodically like 20 days
- For Windows users, ensure CGO is enabled and C compiler is properly configured

## Troubleshooting

If you encounter issues:
1. Ensure you have a stable internet connection
2. Verify that your WhatsApp account is active
3. Make sure the recipient's name matches exactly as it appears in your contacts
4. Try re-running the script if authentication fails

### Windows-Specific Issues

If you encounter errors like:
- `Binary was compiled with 'CGO_ENABLED=0'`: Make sure CGO is enabled
- `gcc: command not found`: Verify MSYS2 installation and PATH
- `missing go.sum entry`: Run `go mod tidy` in the whatsapp-bridge directory

## Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational purposes only. Please use responsibly and in accordance with WhatsApp's terms of service.

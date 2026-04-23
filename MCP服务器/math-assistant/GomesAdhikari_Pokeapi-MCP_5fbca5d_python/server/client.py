import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from mcp_use import MCPAgent, MCPClient

async def run_memory_chat():
    """Run a chat using MCPAgent's built-in conversation memory."""
    # Load environment variables for API keys
    load_dotenv()
    
    # Ensure GROQ_API_KEY is set
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("❌ GROQ_API_KEY not found in environment variables")
        return
    
    os.environ["GROQ_API_KEY"] = groq_api_key
    print(f"✅ GROQ API Key loaded: {groq_api_key[:10]}...")

    # Config file path - use forward slashes or Path for cross-platform compatibility
    config_file = Path("server/pokemon.json")
    
    # Check if config file exists
    if not config_file.exists():
        print(f"❌ Config file not found: {config_file}")
        print("Please check the path to your configuration file.")
        return

    print("Initializing chat...")

    client = None
    try:
        # Create MCP client and agent with memory enabled
        client = MCPClient.from_config_file(str(config_file))
        
        # Test connection before proceeding
        print("Testing MCP client connection...")
        
        llm = ChatGroq(model="qwen-qwq-32b")

        # Create agent with memory_enabled=True
        agent = MCPAgent(
            llm=llm,
            client=client,
            max_steps=15,
            memory_enabled=True,  # Enable built-in conversation memory
        )

        print("\n===== Interactive MCP Chat =====")
        print("Type 'exit' or 'quit' to end the conversation")
        print("Type 'clear' to clear conversation history")
        print("==================================\n")

        # Main chat loop
        while True:
            try:
                # Get user input
                user_input = input("\nYou: ").strip()

                # Check for exit command
                if user_input.lower() in ["exit", "quit"]:
                    print("Ending conversation...")
                    break

                # Check for clear history command
                if user_input.lower() == "clear":
                    agent.clear_conversation_history()
                    print("Conversation history cleared.")
                    continue
                
                # Skip empty input
                if not user_input:
                    continue

                # Get response from agent
                print("\nAssistant: ", end="", flush=True)

                # Run the agent with the user input (memory handling is automatic)
                response = await agent.run(user_input)
                print(response)

            except KeyboardInterrupt:
                print("\n\nInterrupted by user. Exiting...")
                break
            except Exception as e:
                print(f"\n❌ Error during conversation: {e}")
                print("Continuing...")

    except Exception as e:
        print(f"❌ Error initializing MCP client: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check if the Pokemon API server is running")
        print("2. Verify the server path in the config file")
        print("3. Ensure all dependencies are installed")
        
    finally:
        # Clean up
        if client and hasattr(client, 'sessions') and client.sessions:
            print("Closing MCP sessions...")
            try:
                await client.close_all_sessions()
            except Exception as e:
                print(f"Warning: Error closing sessions: {e}")


async def test_server_connection():
    """Test if the MCP server can be started independently."""
    config_file = Path("server/pokemon.json")
    
    if not config_file.exists():
        print(f"❌ Config file not found: {config_file}")
        return False
        
    try:
        client = MCPClient.from_config_file(str(config_file))
        print("✅ MCP Client created successfully")
        
        # Try to close cleanly
        if hasattr(client, 'sessions') and client.sessions:
            await client.close_all_sessions()
        return True
        
    except Exception as e:
        print(f"❌ Error testing server connection: {e}")
        return False


if __name__ == "__main__":
    print("Testing server connection first...")
    
    # Test connection before starting chat
    if asyncio.run(test_server_connection()):
        print("✅ Server connection test passed. Starting chat...")
        asyncio.run(run_memory_chat())
    else:
        print("❌ Server connection test failed. Please check your setup.")
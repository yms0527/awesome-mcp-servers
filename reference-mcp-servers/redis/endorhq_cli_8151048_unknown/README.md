# Endor

Endor provides instant, private, sandboxed environments for your favorite services anywhere Node is available. Run MariaDB, PostgreSQL and many more servers securely and in just a few seconds. Nothing extra to install, everything runs locally. Perfect for AI agents and humans in a hurry.

Each service will run in an ephemeral, isolated VM that only exposes the application ports. When you are done, you can exit Endor with CTRL+C and everything is gone without leaving a trace in your system.

MCP mode allows the services to be launched and used from AI tools like agents and IDEs. Your agents can now securely and safely launch database servers or KV stores as part of their capabilities!

An experimental full-networking mode can be optionally enabled, allowing you to run a fully-featured Alpine Linux machine.

Need a MariaDB database? Just type `endor run mariadb`. Claude Code wants to run a Valkey instance? Just run `endor mcp`.

**Learn more in the [official documentation](https://docs.endor.dev/cli/overview/)**.

## Get started

Install Endor:

```sh
npm install -g @endorhq/cli
```

Run your first service:

```sh
endor run mariadb
```

You can also run the service without installing the CLI with `npx`:

```sh
npx -y @endorhq/cli run mariadb
```

## Supported applications

- Alpine
- MariaDB
- Memcached
- Redis
- Postgres
- RabbitMQ
- Valkey

## Connect to your AI agents

Endor connects to your AI agents using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction). You can run it directly using `npx`:

```sh
npx -y @endorhq/cli mcp
```

Follow these guides to configure your favorite agent tools:

- [Claude Code](https://docs.endor.dev/mcp/claude-code/)
- [Goose CLI](https://docs.endor.dev/mcp/goose/)
- [Cursor](https://docs.endor.dev/mcp/cursor/)
- [VSCode](https://docs.endor.dev/mcp/vscode/)
- [Windsurf](https://docs.endor.dev/mcp/windsurf/)

## License

By using Endor, you accept our [End-User License Agreement (EULA)](https://endor.dev/eula).

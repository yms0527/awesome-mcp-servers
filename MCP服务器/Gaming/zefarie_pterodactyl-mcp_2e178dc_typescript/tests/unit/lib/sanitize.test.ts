import {
  checkCommandSafety,
  escapeHtml,
  filterSensitiveFields,
  maskEnvironmentVariables,
  sanitizeCommand,
} from "../../../src/lib/sanitize.js";

describe("sanitizeCommand", () => {
  it("should return the command trimmed", () => {
    expect(sanitizeCommand("  say hello  ")).toBe("say hello");
  });

  it("should remove null bytes from command", () => {
    expect(sanitizeCommand("say\x00hello")).toBe("sayhello");
  });

  it("should remove multiple null bytes", () => {
    expect(sanitizeCommand("\x00say\x00\x00hello\x00")).toBe("sayhello");
  });

  it("should truncate command to 1000 characters", () => {
    const longCommand = "a".repeat(1500);
    expect(sanitizeCommand(longCommand).length).toBe(1000);
  });

  it("should handle empty string", () => {
    expect(sanitizeCommand("")).toBe("");
  });

  it("should handle whitespace-only string", () => {
    expect(sanitizeCommand("   ")).toBe("");
  });
});

describe("checkCommandSafety", () => {
  it("should return safe for normal commands", () => {
    const result = checkCommandSafety("say Hello World");
    expect(result.safe).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  it("should return safe for whitelist add", () => {
    const result = checkCommandSafety("whitelist add Player");
    expect(result.safe).toBe(true);
  });

  it("should warn about op command", () => {
    const result = checkCommandSafety("op Steve");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Grants operator (admin) privileges to a player");
  });

  it("should warn about deop command", () => {
    const result = checkCommandSafety("deop Steve");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Removes operator privileges from a player");
  });

  it("should warn about stop command", () => {
    const result = checkCommandSafety("stop");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Stops the server process");
  });

  it("should warn about ban command", () => {
    const result = checkCommandSafety("ban Player griefing");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Bans a player from the server");
  });

  it("should warn about shell metacharacters", () => {
    const result = checkCommandSafety("say hello; rm -rf /");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Contains shell metacharacters");
  });

  it("should warn about null bytes", () => {
    const result = checkCommandSafety("say\x00hello");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Contains null bytes");
  });

  it("should warn about whitelist off", () => {
    const result = checkCommandSafety("whitelist off");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Disables or clears the server whitelist");
  });

  it("should warn about save-off", () => {
    const result = checkCommandSafety("save-off");
    expect(result.safe).toBe(false);
    expect(result.warnings).toContain("Disables world auto-save");
  });

  it("should accumulate multiple warnings for compound dangerous commands", () => {
    const result = checkCommandSafety("op Steve; ban Player");
    expect(result.safe).toBe(false);
    expect(result.warnings.length).toBeGreaterThanOrEqual(3);
  });
});

describe("escapeHtml", () => {
  it("should escape ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("should escape angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;",
    );
  });

  it("should escape double quotes", () => {
    expect(escapeHtml('class="test"')).toBe("class=&quot;test&quot;");
  });

  it("should escape single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#x27;s");
  });

  it("should return plain text unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("should handle empty string", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("filterSensitiveFields", () => {
  it("should redact fields matching sensitive patterns", () => {
    const input = { name: "test", api_token: "secret123", password: "pass" };
    const result = filterSensitiveFields(input) as Record<string, unknown>;
    expect(result.name).toBe("test");
    expect(result.api_token).toBe("[REDACTED]");
    expect(result.password).toBe("[REDACTED]");
  });

  it("should redact nested sensitive fields", () => {
    const input = { user: { name: "test", daemon_token: "abc" } };
    const result = filterSensitiveFields(input) as Record<string, Record<string, unknown>>;
    expect(result.user.name).toBe("test");
    expect(result.user.daemon_token).toBe("[REDACTED]");
  });

  it("should handle arrays", () => {
    const input = [{ name: "a", secret: "val" }, { name: "b" }];
    const result = filterSensitiveFields(input) as Record<string, unknown>[];
    expect(result[0].secret).toBe("[REDACTED]");
    expect(result[1].name).toBe("b");
  });

  it("should return null and undefined as-is", () => {
    expect(filterSensitiveFields(null)).toBeNull();
    expect(filterSensitiveFields(undefined)).toBeUndefined();
  });

  it("should return primitives as-is", () => {
    expect(filterSensitiveFields("hello")).toBe("hello");
    expect(filterSensitiveFields(42)).toBe(42);
    expect(filterSensitiveFields(true)).toBe(true);
  });

  it("should redact additional fields", () => {
    const input = { name: "test", custom_field: "sensitive" };
    const result = filterSensitiveFields(input, ["custom_field"]) as Record<string, unknown>;
    expect(result.custom_field).toBe("[REDACTED]");
    expect(result.name).toBe("test");
  });

  it("should redact key field", () => {
    const input = { api_key: "ptla_secret" };
    const result = filterSensitiveFields(input) as Record<string, unknown>;
    expect(result.api_key).toBe("[REDACTED]");
  });
});

describe("maskEnvironmentVariables", () => {
  it("should mask sensitive environment variables", () => {
    const env = {
      SERVER_PORT: "25565",
      DB_PASSWORD: "secret123",
      API_KEY: "ptla_abc",
      JAVA_VERSION: "17",
    };
    const result = maskEnvironmentVariables(env);
    expect(result.SERVER_PORT).toBe("25565");
    expect(result.DB_PASSWORD).toBe("[REDACTED]");
    expect(result.API_KEY).toBe("[REDACTED]");
    expect(result.JAVA_VERSION).toBe("17");
  });

  it("should not mask non-sensitive variables", () => {
    const env = { SERVER_NAME: "Survival", MOTD: "Welcome" };
    const result = maskEnvironmentVariables(env);
    expect(result.SERVER_NAME).toBe("Survival");
    expect(result.MOTD).toBe("Welcome");
  });

  it("should handle empty env", () => {
    const result = maskEnvironmentVariables({});
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("should mask token variables", () => {
    const env = { DISCORD_TOKEN: "abc123" };
    const result = maskEnvironmentVariables(env);
    expect(result.DISCORD_TOKEN).toBe("[REDACTED]");
  });

  it("should mask auth variables", () => {
    const env = { AUTH_HEADER: "Bearer xyz" };
    const result = maskEnvironmentVariables(env);
    expect(result.AUTH_HEADER).toBe("[REDACTED]");
  });
});

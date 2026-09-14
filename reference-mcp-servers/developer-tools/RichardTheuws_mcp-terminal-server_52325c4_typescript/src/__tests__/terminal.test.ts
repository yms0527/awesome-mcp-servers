import { TerminalServer } from '../terminal';

describe('TerminalServer', () => {
  let terminal: TerminalServer;

  beforeEach(() => {
    terminal = new TerminalServer();
  });

  test('should execute basic command', async () => {
    const result = await terminal.executeCommand('echo', ['hello']);
    expect(result.stdout.trim()).toBe('hello');
    expect(result.exitCode).toBe(0);
  });

  test('should handle command errors', async () => {
    await expect(terminal.executeCommand('nonexistentcommand')).rejects.toThrow();
  });

  test('should respect timeout', async () => {
    await expect(
      terminal.executeCommand('sleep', ['2'], { timeout: 100 })
    ).rejects.toThrow('Command timed out');
  });

  test('should execute npm install', async () => {
    const result = await terminal.install('jest');
    expect(result.exitCode).toBe(0);
  });

  test('should execute npm scripts', async () => {
    const result = await terminal.runScript('test');
    expect(result.exitCode).toBe(0);
  });
});
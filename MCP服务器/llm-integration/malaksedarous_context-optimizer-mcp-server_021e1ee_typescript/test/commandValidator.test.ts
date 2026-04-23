import { CommandValidator } from '../src/security/commandValidator';

describe('CommandValidator', () => {
  describe('Interactive Commands', () => {
    test('should reject npm login commands', () => {
      const result = CommandValidator.validateCommand('npm login');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Interactive command detected');
      expect(result.error).toContain('npm login');
    });

    test('should reject git commit without message', () => {
      const result = CommandValidator.validateCommand('git commit');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Interactive command detected');
    });

    test('should allow git commit with message', () => {
      const result = CommandValidator.validateCommand('git commit -m "test commit"');
      expect(result.valid).toBe(true);
    });

    test('should reject SSH commands', () => {
      const result = CommandValidator.validateCommand('ssh user@server');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Interactive command detected');
    });

    test('should reject text editors', () => {
      const editors = ['vim file.txt', 'nano config.yml', 'emacs script.py'];
      editors.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Interactive command detected');
      });
    });

    test('should reject REPLs without specific files', () => {
      const repls = ['python', 'node', 'irb', 'rails console'];
      repls.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Interactive command detected');
      });
    });

    test('should allow python/node with specific files', () => {
      const validCommands = ['python script.py', 'node app.js'];
      validCommands.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(true);
      });
    });

    test('should reject manual pages', () => {
      const result = CommandValidator.validateCommand('man ls');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Interactive command detected');
    });
  });

  describe('Navigation Commands', () => {
    test('should reject cd commands', () => {
      const cdCommands = ['cd /home', 'CD Documents', 'cd ..'];
      cdCommands.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Navigation command detected');
        expect(result.error).toContain('workingDirectory');
      });
    });

    test('should reject pushd/popd commands', () => {
      const navCommands = ['pushd /tmp', 'popd'];
      navCommands.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Navigation command detected');
      });
    });

    test('should reject cd in command chains', () => {
      const chainCommands = [
        'ls && cd /tmp',
        'echo "test"; cd ..',
        'ls | cd /home'
      ];
      chainCommands.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Navigation command detected');
      });
    });
  });

  describe('Dangerous Commands', () => {
    test('should reject dangerous rm commands', () => {
      const dangerousRm = ['rm -rf /', 'rm -r /'];
      dangerousRm.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Dangerous command detected');
      });
    });

    test('should allow specific rm commands', () => {
      const safeRm = ['rm -rf /tmp/myfile', 'rm file.txt'];
      safeRm.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(true);
      });
    });

    test('should reject system modification commands', () => {
      const dangerous = [
        'mkfs /dev/sda1',
        'fdisk /dev/sda',
        'dd if=/dev/zero of=/dev/sda',
        'halt',
        'shutdown now',
        'reboot',
        'killall -9 nginx',
        'chmod 777 /',
        'chown root:root file'
      ];
      
      dangerous.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Dangerous command detected');
      });
    });
  });

  describe('Warnings', () => {
    test('should warn about sudo commands', () => {
      const result = CommandValidator.validateCommand('sudo apt update');
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Command contains sudo - ensure proper permissions are configured');
    });

    test('should warn about long sleep commands', () => {
      const result = CommandValidator.validateCommand('sleep 1000');
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Command contains long sleep - may timeout');
    });

    test('should not warn about short sleep commands', () => {
      const result = CommandValidator.validateCommand('sleep 5');
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeUndefined();
    });
  });

  describe('Valid Commands', () => {
    test('should allow safe commands', () => {
      const safeCommands = [
        'ls -la',
        'cat file.txt',
        'grep "pattern" file.txt',
        'find . -name "*.js"',
        'npm install',
        'npm test',
        'git status',
        'git log --oneline',
        'docker ps',
        'kubectl get pods',
        'ps aux',
        'df -h',
        'du -sh',
        'curl https://api.example.com',
        'wget https://example.com/file.zip'
      ];

      safeCommands.forEach(cmd => {
        const result = CommandValidator.validateCommand(cmd);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });
  });
});

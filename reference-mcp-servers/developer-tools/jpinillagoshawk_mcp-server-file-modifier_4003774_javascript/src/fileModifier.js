import fs from 'fs/promises';

export const fileModifier = async ({ action, filePath, target, newContent, lineNumber }) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    let modified;

    switch (action) {
      case 'add':
        if (lineNumber === undefined) lineNumber = lines.length;
        lines.splice(lineNumber, 0, newContent);
        modified = lines.join('\n');
        break;

      case 'replace':
        modified = content.replace(target, newContent);
        break;

      case 'delete':
        modified = lines.filter(line => !line.includes(target)).join('\n');
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    await fs.writeFile(filePath, modified, 'utf8');
    return { success: true, message: `File modified successfully: ${action}` };

  } catch (error) {
    return { success: false, error: error.message };
  }
};
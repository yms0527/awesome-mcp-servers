# MATLAB MCP Server 安装指南（针对AI助手）

本文档提供了安装MATLAB MCP服务器的详细步骤，专为AI助手（如Cline）设计。

## 前提条件

- 用户系统上已安装MATLAB
- 用户系统上已安装Node.js（v14或更高版本）

## 安装步骤

### 1. 获取服务器代码

有两种方式获取MATLAB MCP服务器代码：

#### 方式1：通过npm安装（推荐）

```bash
npm install -g matlab-mcp-server
```

安装完成后，服务器可执行文件将位于全局npm目录中。

#### 方式2：克隆GitHub仓库

```bash
git clone https://github.com/username/matlab-mcp-server.git
cd matlab-mcp-server
npm install
npm run build
```

### 2. 确定MATLAB可执行文件路径

这是最关键的步骤。用户需要提供MATLAB可执行文件的完整路径。

常见的MATLAB可执行文件路径：

- Windows: `C:\Program Files\MATLAB\R2023b\bin\matlab.exe`
- macOS: `/Applications/MATLAB_R2023b.app/bin/matlab`
- Linux: `/usr/local/MATLAB/R2023b/bin/matlab`

请注意，路径中的版本号（如R2023b）可能因用户安装的MATLAB版本而异。

可以通过以下方式帮助用户找到MATLAB可执行文件路径：

1. 在Windows上，可以右键点击MATLAB快捷方式，选择"属性"，查看"目标"字段
2. 在macOS上，可以使用`which matlab`命令
3. 在Linux上，可以使用`which matlab`或`whereis matlab`命令

### 3. 配置Claude使用服务器

#### 对于Claude桌面应用

编辑Claude配置文件：

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

添加以下配置（注意替换路径）：

```json
{
  "mcpServers": {
    "matlab-server": {
      "command": "node",
      "args": ["/path/to/matlab-server/build/index.js"],
      "env": {
        "MATLAB_PATH": "/path/to/matlab/executable"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### 对于Cline VSCode扩展

编辑Cline MCP设置文件：

- Windows: `C:\Users\<用户名>\AppData\Roaming\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

添加与上面相同的配置。

### 4. 验证安装

重启Claude或Cline后，可以通过以下方式验证安装：

1. 请求MATLAB文档：`请显示MATLAB入门指南`
2. 执行简单的MATLAB代码：`请使用MATLAB计算1+1`

如果一切正常，你应该能够看到相应的响应。

## 故障排除

### 常见问题

1. **找不到MATLAB可执行文件**
   - 确保MATLAB_PATH环境变量指向正确的MATLAB可执行文件路径
   - 确保路径中的反斜杠（在Windows上）被正确转义

2. **执行MATLAB代码时出错**
   - 确保MATLAB许可证有效
   - 检查MATLAB是否可以在命令行中正常启动

3. **服务器未显示在可用工具列表中**
   - 检查配置文件格式是否正确
   - 确保服务器路径正确
   - 重启Claude或VSCode

如有其他问题，请参考GitHub仓库中的问题跟踪器。

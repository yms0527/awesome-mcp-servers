# Java Learning: ServletContext and JVM Concepts

## ServletContext Interface
ServletContext 是 Jakarta EE（原 Java EE）中的一个核心接口，它代表了整个 Web 应用程序的上下文环境。每个 Web 应用程序只有一个 ServletContext 实例，所有的 Servlet 都共享这个实例。

### 主要功能和特点

1. 应用程序级别的初始化参数
```java
// 获取初始化参数
String value = servletContext.getInitParameter("paramName");
// 获取所有初始化参数名称
Enumeration<String> paramNames = servletContext.getInitParameterNames();
```

2. 资源访问
```java
// 获取资源文件
InputStream is = servletContext.getResourceAsStream("/WEB-INF/config.xml");
// 获取资源的真实路径
String realPath = servletContext.getRealPath("/WEB-INF/classes");
```

3. 属性管理（应用程序范围的共享数据）
```java
// 设置属性
servletContext.setAttribute("userCount", 100);
// 获取属性
Integer count = (Integer) servletContext.getAttribute("userCount");
// 移除属性
servletContext.removeAttribute("userCount");
```

### 使用场景
1. 应用程序级别的配置管理
2. 共享数据存储
3. 资源文件访问
4. 动态 Servlet 注册
5. 应用程序级别的日志记录
6. 获取 Web 应用程序的各种路径信息

## ServletContext vs Servlet Container

ServletContext 不是 servlet 容器。它们的区别如下：

### Servlet 容器（比如 Tomcat）：
1. 是一个完整的运行时环境
2. 负责管理整个 Web 应用的生命周期
3. 处理请求分发
4. 管理 Servlet 实例
5. 提供线程池等底层服务

### ServletContext：
1. 只是一个接口，是 Servlet 与容器通信的窗口
2. 代表了 Web 应用的上下文环境
3. 提供了访问容器功能的方法

## JVM 相关概念

### JVM 定义
JVM（Java Virtual Machine）是一个规范，它定义了一个虚拟计算机的规范，包括：
1. 指令集
2. 内存模型
3. 垃圾回收
4. 多线程等特性

### JVM 实例
- JVM 是规范
- 运行的是 JVM 实现的实例（比如 HotSpot VM 的实例）
- 每次运行 Java 程序都会启动一个新的 JVM 实例

### Web 应用和 JVM 实例
```
电脑
└── JDK8（包含 JVM 规范的实现）
    ├── Tomcat实例1（运行的 JVM 实例）
    │   ├── WebApp1
    │   └── WebApp2
    └── Tomcat实例2（另一个运行的 JVM 实例）
        └── WebApp3
```

### 运行独立的 Java 程序
当运行一个 Java 类的 main 方法时：
1. java.exe（Windows）或 java（Unix/Linux）命令会被执行
2. 启动一个新的 JVM 实例
3. 程序在这个新的 JVM 实例中运行
4. main 方法执行完毕后，JVM 实例终止
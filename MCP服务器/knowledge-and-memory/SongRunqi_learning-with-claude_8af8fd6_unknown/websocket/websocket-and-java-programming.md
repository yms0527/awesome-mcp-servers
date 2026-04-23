# WebSocket、GitHub与Java编程讨论

## WebSocket与STOMP协议

### WebSocket基础
- WebSocket是应用层协议，基于TCP
- 提供全双工通信机制
- 不必须使用STOMP

### STOMP协议
- 构建在WebSocket之上的消息传递协议
- 提供更高级的消息传递语义
- 定义了特定的消息格式和命令

### Spring Boot中的WebSocket配置
```java
public void registerStompEndpoints(StompEndpointRegistry registry) {
    // 注册STOMP端点，客户端需要通过这个端点进行连接
    registry.addEndpoint("/ws").withSockJS();
}
```

### STOMP客户端连接
```javascript
stompClient.connect(
    {},                 // 连接headers，可以传入认证信息等
    onConnected,        // 连接成功的回调函数 
    onError            // 连接错误的回调函数
);
```

## GitHub协作

### Pull Request(PR)工作流程
1. Fork项目
2. 克隆到本地
3. 创建新分支修改
4. 推送到Fork
5. 创建Pull Request

### PR最佳实践
- 描述清晰
- 代码质量好
- 及时回应审查意见
- 解决冲突

## 前端开发

### 全局消息提示
```javascript
window.$message.success('操作执行中，请稍后...')
```

## Java编程技巧

### List转Map
```java
List<User> userList = new ArrayList<>();
Map<Long, User> userMap = userList.stream()
    .collect(Collectors.toMap(User::getId, user -> user));
```

### Stream操作
在forEach中使用return代替continue：
```java
list.forEach(item -> {
    if(item == null) {
        return;  // 相当于continue
    }
    // 处理逻辑
});
```

### AtomicInteger使用
```java
public class Counter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();
    }
    
    public int getCount() {
        return count.get();
    }
}
```

AtomicInteger主要用于解决并发场景下的原子性问题，提供了线程安全的整数操作。

优势：
1. 保证原子性
2. 无需加锁
3. 性能好
4. 线程安全
5. 支持CAS操作
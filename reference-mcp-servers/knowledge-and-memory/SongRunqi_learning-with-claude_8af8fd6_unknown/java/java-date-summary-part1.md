# Java Date, MySQL时间存储和UTC基础概念总结（第一部分）

## 1. Java Date对象中的long值

### 问题起源
创建Date对象时有一个long值，不理解这个值的含义

### 详细解答
- long值代表自Unix纪元（1970年1月1日 00:00:00 UTC）以来的毫秒数
- 可以通过Date类的getTime()方法获取这个值

### 代码示例
```java
Date currentDate = new Date();
long milliseconds = currentDate.getTime();
System.out.println("Milliseconds since epoch: " + milliseconds);
```

### 主要特点
- Unix纪元作为标准参考点
- 精确到毫秒
- 时区无关（UTC）
- 使用long类型存储，范围广
- 便于日期计算

## 2. Timestamp概念

### 问题延伸
这个long值是否就是timestamp

### 详细解答
- 是的，这个值就是常说的"timestamp"或"Unix timestamp"
- 代表特定时间点的数值表示
- 在Java Date中使用毫秒，而标准Unix timestamp使用秒

### 应用场景
- 数据库时间存储
- HTTP头部
- 文件系统
- 日志记录

### Java 8改进
```java
Instant now = Instant.now();
long epochSeconds = now.getEpochSecond(); // Unix timestamp（秒）
long epochMillis = now.toEpochMilli();   // Java风格timestamp（毫秒）
```

## 3. MySQL的日期类型

### 问题展开
MySQL中DATE和TIMESTAMP类型与long值的区别

### MySQL DATE类型
- 格式：'YYYY-MM-DD'
- 范围：'1000-01-01' 到 '9999-12-31'
- 存储：3字节
- 适用：仅需要日期的场景

### MySQL TIMESTAMP类型
- 格式：'YYYY-MM-DD HH:MM:SS'
- 范围：1970-01-01 00:00:01' UTC 到 '2038-01-19 03:14:07' UTC
- 存储：4字节
- 特点：
  - 内部以UTC存储
  - 可自动更新
  - 显示时转换为当前时区

### 实际应用示例
```sql
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(255),
  event_date DATE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  unix_timestamp BIGINT
);

-- 插入数据
INSERT INTO events (event_name, event_date, unix_timestamp) 
VALUES ('Conference', '2024-09-15', UNIX_TIMESTAMP('2024-09-15'));

-- 查询
SELECT event_name, event_date, last_updated, 
       unix_timestamp, FROM_UNIXTIME(unix_timestamp) 
FROM events;
```

### 类型转换
```sql
-- MySQL转Unix timestamp
SELECT UNIX_TIMESTAMP('2024-06-04 10:30:00');

-- Unix timestamp转MySQL日期时间
SELECT FROM_UNIXTIME(1717171717);
```

### 选择建议
- DATE：只关心日期时使用
- TIMESTAMP：需要时间戳和自动更新时使用
- Unix Timestamp（BIGINT）：需要跨系统或大范围时间计算时使用
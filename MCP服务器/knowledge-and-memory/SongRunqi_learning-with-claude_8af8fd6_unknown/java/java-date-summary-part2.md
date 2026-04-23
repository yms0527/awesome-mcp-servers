# Java时间处理最佳实践与深入理解（第二部分）

## 1. java.sql.Date vs java.util.Date的讨论

### 背景和问题
- java.sql.Date使用中遇到问题，切换到java.util.Date后解决
- 是否真的需要使用java.sql.Date

### java.sql日期类型的历史
- java.sql.Date, Time, Timestamp在早期Java版本引入
- 目的是为了更好地匹配SQL数据库类型
- java.sql.Date只包含日期部分
- java.sql.Timestamp提供纳秒精度

### 存在的问题
- 继承自java.util.Date，继承了其设计缺陷
- java.sql.Date忽略时间部分，容易引起困惑
- 时区处理问题
- 在java.util和java.sql类型之间转换可能引入bug

### 实际应用建议
```java
// JDBC足够智能处理java.util.Date
java.util.Date utilDate = new java.util.Date();
String sql = "INSERT INTO events (event_date, event_timestamp) VALUES (?, ?)";
try (PreparedStatement stmt = conn.prepareStatement(sql)) {
    stmt.setObject(1, utilDate);
    stmt.setObject(2, utilDate);
    stmt.executeUpdate();
}
```

## 2. UTC（协调世界时）详解

### UTC基本概念
- 世界主要时间标准
- 基于原子钟，由全球300多个原子钟共同维护
- 精确度：约一亿年才会差一秒

### UTC在计算机系统中的应用
1. 作为时间戳基准
   - Unix纪元定义：1970年1月1日 00:00:00 UTC
   - Java和MySQL的时间戳都基于此

2. 数据库应用
   - MySQL的TIMESTAMP内部存储使用UTC
   - 查询时自动转换为服务器时区

3. 编程实践
```java
// Java 8中的UTC时间处理
ZonedDateTime.now(ZoneOffset.UTC)  // 获取当前UTC时间
Instant.now()  // 获取UTC时间戳
```

### 时区与UTC的关系
- 时区表示为UTC的偏移量
  - 纽约(EDT): UTC-4
  - 伦敦(BST): UTC+1
  - 东京(JST): UTC+9

## 3. java.util.Date vs LocalDateTime深入对比

### 基本特征对比

| 特性 | java.util.Date | LocalDateTime |
|------|----------------|---------------|
| 包装位置 | java.util | java.time |
| 引入时间 | JDK 1.0 (1996) | Java 8 (2014) |
| 可变性 | 可变 | 不可变 |
| 线程安全 | 否 | 是 |
| 时区处理 | 差 | 优秀 |
| 精度 | 毫秒 | 纳秒 |

### 代码示例对比

1. 创建日期时间
```java
// java.util.Date
Date legacyDate = new Date();
Date specificLegacyDate = new Date(2024 - 1900, 5, 4); // 注意年份需要减1900！

// LocalDateTime
LocalDateTime modern = LocalDateTime.now();
LocalDateTime specificModern = LocalDateTime.of(2024, 6, 4, 10, 30);
```

2. 日期操作
```java
// java.util.Date - 易出错的修改
Date date = new Date();
date.setTime(date.getTime() + 86400000); // 增加一天

// LocalDateTime - 清晰的不可变操作
LocalDateTime now = LocalDateTime.now();
LocalDateTime tomorrow = now.plusDays(1);
LocalDateTime nextWeek = now.plusWeeks(1);
```

3. 格式化
```java
// java.util.Date - 使用SimpleDateFormat（非线程安全）
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
String legacyFormatted = sdf.format(new Date());

// LocalDateTime - 内置格式化器（线程安全）
String modernFormatted = LocalDateTime.now()
    .format(DateTimeFormatter.ISO_DATE_TIME);
```

### 最佳实践建议

1. 新代码选择：
   - 优先使用java.time包下的类
   - LocalDate：纯日期
   - LocalDateTime：日期时间
   - Instant：时间戳
   - ZonedDateTime：带时区的日期时间

2. 遍留代码处理：
   - 如果必须使用旧API，优先选择java.util.Date
   - 考虑逐步迁移到新API
   - 使用适配器模式处理新旧API转换

3. 数据库交互：
   - 使用PreparedStatement自动处理类型转换
   - 考虑存储UTC时间戳避免时区问题
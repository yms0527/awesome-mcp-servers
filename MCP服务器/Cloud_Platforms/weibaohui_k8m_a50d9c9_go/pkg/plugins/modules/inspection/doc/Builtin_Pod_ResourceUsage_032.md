# Pod 资源用量检查

## 介绍

检查指定 Pod 的资源用量情况，包括 CPU 和内存的请求、限制、实时用量等信息

## 信息

- ScriptCode: Builtin_Pod_ResourceUsage_032
- Kind: Pod
- Group: 
- Version: v1
- TimeoutSeconds: 90

## 代码

```lua

			-- =============================
-- 🧩 Pod 资源用量检查脚本（JSON格式输出 + 比例修正）
-- =============================

-- 请修改以下变量为您要检查的 Pod 信息
local podName = "k8m-c6dccfb-qm7cp"  -- 要检查的 Pod 名称
local podNamespace = "k8m"           -- Pod 所在的命名空间

-- =============================
-- 可配置的告警阈值
-- =============================
-- 
-- 配置说明：
-- - cpuThreshold: CPU 使用率告警阈值，取值范围 0.0-1.0（例如：0.8 表示 80%）
-- - memoryThreshold: 内存使用率告警阈值，取值范围 0.0-1.0（例如：0.9 表示 90%）
-- 
-- 建议值：
-- - 生产环境：CPU 0.7-0.8，内存 0.8-0.9
-- - 测试环境：CPU 0.8-0.9，内存 0.9-0.95
-- - 开发环境：可适当放宽至 CPU 0.9，内存 0.95
local cpuThreshold = 0.8    -- CPU 使用率告警阈值（80%）
local memoryThreshold = 0.9 -- 内存使用率告警阈值（90%）

-- =============================
-- 工具函数
-- =============================

-- 将 Lua table 转为美化 JSON 字符串
local function to_json(tbl, indent)
    indent = indent or 0
    local padding = string.rep("  ", indent)
    if type(tbl) ~= "table" then
        if type(tbl) == "string" then
            return string.format("%q", tbl)
        else
            return tostring(tbl)
        end
    end
    local lines = {"{"}
    for k, v in pairs(tbl) do
        local key = string.format("%q", tostring(k))
        local val = to_json(v, indent + 1)
        local comma = (next(tbl, k) ~= nil) and "," or ""
        table.insert(lines, string.rep("  ", indent + 1) .. key .. ": " .. val .. comma)
    end
    table.insert(lines, padding .. "}")
    return table.concat(lines, "\n")
end

-- 字节换算为人类可读单位
local function human_bytes(n)
    if type(n) ~= "number" then return tostring(n) end
    local units = {"B", "KiB", "MiB", "GiB", "TiB"}
    local i = 1
    while n >= 1024 and i < #units do
        n = n / 1024
        i = i + 1
    end
    return string.format("%.2f %s", n, units[i])
end

-- 获取 allocatable.memory 的值
local function get_allocatable_memory(r)
    if not r then return nil end
    if r.memory and r.memory.allocatable then
        return tonumber(r.memory.allocatable)
    end
    if r.allocatable and r.allocatable.memory then
        return tonumber(r.allocatable.memory)
    end
    return nil
end

-- =============================
-- 获取 Pod 资源用量
-- =============================

local resourceUsage, err = kubectl:GVK("", "v1", "Pod"):Namespace(podNamespace):Name(podName):GetPodResourceUsage()
if err then
    print("获取 Pod 资源用量失败: " .. tostring(err))
    return
end

if not resourceUsage then
    print("Pod " .. podNamespace .. "/" .. podName .. " 资源用量信息为空")
    return
end

print("=== Pod 资源用量原始数据（JSON 格式） ===")
print(to_json(resourceUsage))

print("\n=== Pod 资源用量检查结果 ===")
print("Pod: " .. podNamespace .. "/" .. podName)

-- =============================
-- CPU 检查
-- =============================
if resourceUsage.cpu then
    print("\n--- CPU 资源 ---")
    if resourceUsage.cpu.requests then
        print("CPU 请求量: " .. tostring(resourceUsage.cpu.requests))
    end
    if resourceUsage.cpu.limits then
        print("CPU 限制量: " .. tostring(resourceUsage.cpu.limits))
    end
    if resourceUsage.cpu.realtime then
        print("CPU 实时用量: " .. tostring(resourceUsage.cpu.realtime))
    elseif resourceUsage.realtime and resourceUsage.realtime.cpu then
        print("CPU 实时用量: " .. tostring(resourceUsage.realtime.cpu))
    end
    if resourceUsage.cpu.allocatable then
        print("CPU 可分配量: " .. tostring(resourceUsage.cpu.allocatable))
    elseif resourceUsage.allocatable and resourceUsage.allocatable.cpu then
        print("CPU 可分配量: " .. tostring(resourceUsage.allocatable.cpu))
    end

    local cpuUsage = nil
    if resourceUsage.cpu.usageFractions then
        cpuUsage = tonumber(resourceUsage.cpu.usageFractions)
    elseif resourceUsage.usageFractions and resourceUsage.usageFractions.cpu and resourceUsage.usageFractions.cpu.realtimeFraction then
        cpuUsage = tonumber(resourceUsage.usageFractions.cpu.realtimeFraction)
    end

    if cpuUsage then
        if cpuUsage > 1 then
            print(string.format("CPU 使用率 (原始): %.2f%%", cpuUsage))
            cpuUsage = cpuUsage / 100
        end
        print(string.format("CPU 使用率: %.2f%%", cpuUsage * 100))
        if cpuUsage > cpuThreshold then
            check_event("警告", "Pod " .. podNamespace .. "/" .. podName .. " CPU 使用率过高: " .. string.format("%.2f%%", cpuUsage * 100), {namespace=podNamespace, name=podName, cpuUsage=cpuUsage})
        end
    end
end

-- =============================
-- 内存检查（修正版）
-- =============================
if resourceUsage.memory or resourceUsage.allocatable then
    print("\n--- 内存资源 ---")

    local memRealtime = nil
    if resourceUsage.memory and resourceUsage.memory.realtime then
        memRealtime = tonumber(resourceUsage.memory.realtime)
    elseif resourceUsage.realtime and resourceUsage.realtime.memory then
        memRealtime = tonumber(resourceUsage.realtime.memory)
    end

    local memAllocatable = get_allocatable_memory(resourceUsage)
    local memRequests = resourceUsage.memory and resourceUsage.memory.requests or nil
    local memLimits = resourceUsage.memory and resourceUsage.memory.limits or nil

    print("内存请求量: " .. tostring(memRequests or "(未设置)"))
    print("内存限制量: " .. tostring(memLimits or "(未设置)"))

    if memRealtime then
        print("内存实时用量: " .. human_bytes(memRealtime))
    else
        print("内存实时用量: (无数据)")
    end

    if memAllocatable then
        print("内存可分配量: " .. human_bytes(memAllocatable))
    else
        print("内存可分配量: (无数据)")
    end

    -- 重新计算 fraction
    local recomputedFraction = nil
    if memRealtime and memAllocatable and memAllocatable > 0 then
        recomputedFraction = memRealtime / memAllocatable
    end

    if recomputedFraction then
        print(string.format("内存使用率: %.2f%%", recomputedFraction * 100))
        if recomputedFraction > memoryThreshold then
            check_event("警告", "Pod " .. podNamespace .. "/" .. podName .. " 内存使用率过高: " .. string.format("%.2f%%", recomputedFraction * 100), {namespace=podNamespace, name=podName, memoryUsage=recomputedFraction})
        end
    else
        local rawUF = nil
        if resourceUsage.usageFractions and resourceUsage.usageFractions.memory and resourceUsage.usageFractions.memory.realtimeFraction then
            rawUF = tonumber(resourceUsage.usageFractions.memory.realtimeFraction)
        end
        if rawUF then
            if rawUF > 1 then
                print(string.format("内存使用率 (来源 usageFractions): %.2f%% (已推测为百分比)", rawUF))
                rawUF = rawUF / 100
            else
                print(string.format("内存使用率: %.2f%%", rawUF * 100))
            end
            if rawUF > memoryThreshold then
                check_event("警告", "Pod " .. podNamespace .. "/" .. podName .. " 内存使用率过高: " .. string.format("%.2f%%", rawUF * 100), {namespace=podNamespace, name=podName, memoryUsage=rawUF})
            end
        else
            print("内存使用率: (无法计算 —— 缺少数据)")
        end
    end
end

-- =============================
-- 检查 requests / limits 配置
-- =============================
local hasRequests = (resourceUsage.cpu and resourceUsage.cpu.requests) or (resourceUsage.memory and resourceUsage.memory.requests)
local hasLimits = (resourceUsage.cpu and resourceUsage.cpu.limits) or (resourceUsage.memory and resourceUsage.memory.limits)

if not hasRequests then
    check_event("失败", "Pod " .. podNamespace .. "/" .. podName .. " 未配置资源请求量 (requests)", {namespace=podNamespace, name=podName})
end

if not hasLimits then
    check_event("失败", "Pod " .. podNamespace .. "/" .. podName .. " 未配置资源限制量 (limits)", {namespace=podNamespace, name=podName})
end

print("\n✅ Pod 资源用量检查完成")

		
```

#!/usr/bin/env python3
"""
Playwright MCP Server 使用示例

本示例展示如何通过MCP协议使用Playwright进行网页自动化操作
"""

import asyncio
from mcp_playwright.server import mcp

async def example_web_automation():
    """
    网页自动化示例

    演示如何使用Playwright MCP工具进行基础网页操作
    """
    print("🚀 开始Playwright MCP示例...")

    # 1. 启动浏览器
    print("\n📱 启动浏览器...")
    result = await mcp.call_tool("launch_browser", {
        "browser_type": "chromium",
        "headless": False,
        "viewport_width": 1280,
        "viewport_height": 720
    })
    print(f"   结果: {result}")

    # 2. 导航到测试页面
    print("\n🌐 导航到测试页面...")
    result = await mcp.call_tool("navigate_to_url", {
        "url": "https://example.com",
        "wait_until": "domcontentloaded"
    })
    print(f"   结果: {result}")

    # 3. 获取页面标题
    print("\n📄 获取页面标题...")
    result = await mcp.call_tool("get_page_title", {})
    print(f"   页面标题: {result}")

    # 4. 获取页面URL
    print("\n🔗 获取当前URL...")
    result = await mcp.call_tool("get_page_url", {})
    print(f"   当前URL: {result}")

    # 5. 执行JavaScript获取页面信息
    print("\n⚡ 执行JavaScript...")
    result = await mcp.call_tool("execute_javascript", {
        "code": "return {title: document.title, url: window.location.href, readyState: document.readyState}"
    })
    print(f"   JavaScript结果: {result}")

    # 6. 截图
    print("\n📸 截取页面截图...")
    result = await mcp.call_tool("take_screenshot", {
        "path": "example_screenshot.png",
        "full_page": True
    })
    print(f"   截图结果: {result}")

    # 7. 检查浏览器状态
    print("\n🔍 检查浏览器状态...")
    status = mcp.get_resource("browser://status")
    print(f"   浏览器状态: {status}")

    # 8. 获取当前页面信息
    print("\n📋 获取页面信息...")
    page_info = mcp.get_resource("page://current")
    print(f"   页面信息: {page_info}")

    # 9. 关闭浏览器
    print("\n🔚 关闭浏览器...")
    result = await mcp.call_tool("close_browser", {})
    print(f"   关闭结果: {result}")

    print("\n✅ 示例完成!")

async def example_form_interaction():
    """
    表单交互示例

    演示如何与网页表单进行交互
    """
    print("\n🚀 开始表单交互示例...")

    # 启动浏览器
    await mcp.call_tool("launch_browser", {
        "browser_type": "chromium",
        "headless": False
    })

    # 导航到示例表单页面
    await mcp.call_tool("navigate_to_url", {
        "url": "https://httpbin.org/forms/post"
    })

    # 填写表单
    print("📝 填写表单字段...")

    # 填写文本输入框
    await mcp.call_tool("fill_input", {
        "selector": "input[name='custname']",
        "text": "测试用户"
    })

    await mcp.call_tool("fill_input", {
        "selector": "input[name='custtel']",
        "text": "1234567890"
    })

    await mcp.call_tool("fill_input", {
        "selector": "input[name='custemail']",
        "text": "test@example.com"
    })

    await mcp.call_tool("fill_input", {
        "selector": "textarea[name='comments']",
        "text": "这是一个测试评论"
    })

    print("📸 截图查看填写结果...")
    await mcp.call_tool("take_screenshot", {
        "path": "form_filled.png"
    })

    # 提交表单
    print("📤 提交表单...")
    await mcp.call_tool("click_element", {
        "selector": "input[type='submit']"
    })

    # 等待页面加载并截图
    await asyncio.sleep(2)
    await mcp.call_tool("take_screenshot", {
        "path": "form_submitted.png"
    })

    # 关闭浏览器
    await mcp.call_tool("close_browser", {})
    print("✅ 表单交互示例完成!")

async def example_dynamic_content():
    """
    动态内容处理示例

    演示如何处理动态加载的内容
    """
    print("\n🚀 开始动态内容示例...")

    # 启动浏览器
    await mcp.call_tool("launch_browser", {
        "browser_type": "chromium",
        "headless": False
    })

    # 导航到包含动态内容的页面
    await mcp.call_tool("navigate_to_url", {
        "url": "https://httpbin.org/delay/3"
    })

    print("⏳ 等待页面内容加载...")

    # 等待特定元素出现
    result = await mcp.call_tool("wait_for_selector", {
        "selector": "pre",
        "timeout": 10000,
        "state": "visible"
    })
    print(f"   等待结果: {result}")

    # 获取动态加载的内容
    content = await mcp.call_tool("get_text_content", {
        "selector": "pre"
    })
    print(f"   页面内容: {content}")

    # 关闭浏览器
    await mcp.call_tool("close_browser", {})
    print("✅ 动态内容示例完成!")

if __name__ == "__main__":
    print("🎯 Playwright MCP Server 使用示例")
    print("=" * 50)

    # 运行基础示例
    asyncio.run(example_web_automation())

    # 运行表单交互示例
    asyncio.run(example_form_interaction())

    # 运行动态内容示例
    asyncio.run(example_dynamic_content())

    print("\n🎉 所有示例运行完成!")
    print("📁 查看生成的截图文件：")
    print("   - example_screenshot.png")
    print("   - form_filled.png")
    print("   - form_submitted.png")

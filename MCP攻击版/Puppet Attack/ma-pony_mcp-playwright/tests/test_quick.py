#!/usr/bin/env python3
"""
快速测试脚本 - 验证 Playwright MCP Server 核心功能

这个脚本测试核心组件是否正常工作，不需要完整的MCP客户端
"""

import asyncio
import logging
from mcp_playwright.core.browser_manager import BrowserManager
from mcp_playwright.tools.browser_tools import BrowserTools

# 设置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_core_functionality():
    """测试核心功能"""
    logger.info("🚀 开始测试 Playwright MCP Server 核心功能...")

    try:
        # 测试浏览器管理器
        logger.info("📋 测试 BrowserManager...")
        browser_manager = BrowserManager(
            browser_type="chromium",
            headless=True,
            max_sessions=5,
            default_viewport={"width": 1280, "height": 720},
            default_timeout=30000
        )

        # 初始化浏览器管理器
        await browser_manager.initialize()
        logger.info("✅ BrowserManager 初始化成功")

        # 测试会话创建
        session = await browser_manager.create_session()
        logger.info(f"✅ 会话创建成功: {session.session_id}")

        # 测试导航
        await session.navigate("https://example.com")
        logger.info("✅ 页面导航成功")

        # 测试截图
        screenshot_bytes = await session.take_screenshot()
        logger.info(f"✅ 截图成功: {len(screenshot_bytes)} bytes")

        # 测试浏览器工具
        logger.info("📋 测试 BrowserTools...")
        browser_tools = BrowserTools(browser_manager)

        # 测试会话状态
        status = browser_tools.get_session_status()
        logger.info(f"✅ 会话状态: {status}")

        # 测试健康检查
        health = await browser_manager.health_check()
        logger.info(f"✅ 健康检查: {health}")

        # 清理资源
        await browser_manager.cleanup()
        logger.info("✅ 资源清理完成")

        logger.info("🎉 所有测试通过！")
        return True

    except Exception as e:
        logger.error(f"❌ 测试失败: {e}")
        # 确保清理资源
        try:
            if 'browser_manager' in locals():
                await browser_manager.cleanup()
        except Exception as cleanup_error:
            logger.error(f"清理资源时出错: {cleanup_error}")
        return False


async def test_error_handling():
    """测试错误处理"""
    logger.info("🛡️ 测试错误处理...")

    try:
        browser_manager = BrowserManager()
        browser_tools = BrowserTools(browser_manager)

        # 测试未初始化会话的错误处理
        try:
            await browser_tools.navigate_to_url("https://example.com")
            logger.error("❌ 应该抛出错误但没有")
            return False
        except RuntimeError as e:
            logger.info(f"✅ 正确捕获错误: {e}")

        # 测试超限会话创建
        browser_manager.max_sessions = 1
        await browser_manager.initialize()

        session1 = await browser_manager.create_session()
        logger.info("✅ 第一个会话创建成功")

        try:
            session2 = await browser_manager.create_session()
            logger.error("❌ 应该达到会话限制但没有")
            return False
        except RuntimeError as e:
            logger.info(f"✅ 正确处理会话限制: {e}")

        await browser_manager.cleanup()
        logger.info("✅ 错误处理测试通过")
        return True

    except Exception as e:
        logger.error(f"❌ 错误处理测试失败: {e}")
        return False


async def main():
    """主测试函数"""
    logger.info("🎯 开始 Playwright MCP Server 快速测试")

    # 运行核心功能测试
    core_test_passed = await test_core_functionality()

    # 运行错误处理测试
    error_test_passed = await test_error_handling()

    # 总结结果
    if core_test_passed and error_test_passed:
        logger.info("🎉 所有测试通过！Playwright MCP Server 工作正常。")
        return 0
    else:
        logger.error("❌ 部分测试失败。请检查错误信息。")
        return 1


if __name__ == "__main__":
    import sys
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

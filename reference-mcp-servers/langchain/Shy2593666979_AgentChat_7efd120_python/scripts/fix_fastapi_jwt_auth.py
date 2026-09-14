#!/usr/bin/env python3
"""
修复 fastapi-jwt-auth 与 Pydantic 2 兼容性的脚本
通过 pydantic 包路径定位 fastapi_jwt_auth

使用方法:
    python fix_fastapi_jwt_auth.py
"""

import sys
from pathlib import Path
from datetime import datetime

# Pydantic 2 兼容的配置文件内容
FIXED_CONFIG_CONTENT = '''
from datetime import timedelta
from typing import Optional, Union, Sequence, List
from pydantic import (
    BaseModel,
    validator,
    StrictBool,
    StrictInt,
    StrictStr
)

class LoadConfig(BaseModel):
    authjwt_token_location: Optional[List[StrictStr]] = ['headers']
    authjwt_secret_key: Optional[StrictStr] = None
    authjwt_public_key: Optional[StrictStr] = None
    authjwt_private_key: Optional[StrictStr] = None
    authjwt_algorithm: Optional[StrictStr] = "HS256"
    authjwt_decode_algorithms: Optional[List[StrictStr]] = None
    authjwt_decode_leeway: Optional[Union[StrictInt,timedelta]] = 0
    authjwt_encode_issuer: Optional[StrictStr] = None
    authjwt_decode_issuer: Optional[StrictStr] = None
    authjwt_decode_audience: Optional[Union[StrictStr,Sequence[StrictStr]]] = None
    authjwt_denylist_enabled: Optional[StrictBool] = False
    authjwt_denylist_token_checks: Optional[List[StrictStr]] = ['access','refresh']
    authjwt_header_name: Optional[StrictStr] = "Authorization"
    authjwt_header_type: Optional[StrictStr] = "Bearer"
    authjwt_access_token_expires: Optional[Union[StrictBool,StrictInt,timedelta]] = timedelta(minutes=15)
    authjwt_refresh_token_expires: Optional[Union[StrictBool,StrictInt,timedelta]] = timedelta(days=30)
    # # option for create cookies
    authjwt_access_cookie_key: Optional[StrictStr] = "access_token_cookie"
    authjwt_refresh_cookie_key: Optional[StrictStr] = "refresh_token_cookie"
    authjwt_access_cookie_path: Optional[StrictStr] = "/"
    authjwt_refresh_cookie_path: Optional[StrictStr] = "/"
    authjwt_cookie_max_age: Optional[StrictInt] = None
    authjwt_cookie_domain: Optional[StrictStr] = None
    authjwt_cookie_secure: Optional[StrictBool] = False
    authjwt_cookie_samesite: Optional[StrictStr] = None
    # # option for double submit csrf protection
    authjwt_cookie_csrf_protect: Optional[StrictBool] = True
    authjwt_access_csrf_cookie_key: Optional[StrictStr] = "csrf_access_token"
    authjwt_refresh_csrf_cookie_key: Optional[StrictStr] = "csrf_refresh_token"
    authjwt_access_csrf_cookie_path: Optional[StrictStr] = "/"
    authjwt_refresh_csrf_cookie_path: Optional[StrictStr] = "/"
    authjwt_access_csrf_header_name: Optional[StrictStr] = "X-CSRF-Token"
    authjwt_refresh_csrf_header_name: Optional[StrictStr] = "X-CSRF-Token"
    authjwt_csrf_methods: Optional[List[StrictStr]] = ['POST','PUT','PATCH','DELETE']

    @validator('authjwt_access_token_expires')
    def validate_access_token_expires(cls, v):
        if v is True:
            raise ValueError("The 'authjwt_access_token_expires' only accept value False (bool)")
        return v

    @validator('authjwt_refresh_token_expires')
    def validate_refresh_token_expires(cls, v):
        if v is True:
            raise ValueError("The 'authjwt_refresh_token_expires' only accept value False (bool)")
        return v

    @validator('authjwt_denylist_token_checks', each_item=True)
    def validate_denylist_token_checks(cls, v):
        if v not in ['access','refresh']:
            raise ValueError("The 'authjwt_denylist_token_checks' must be between 'access' or 'refresh'")
        return v

    @validator('authjwt_token_location', each_item=True)
    def validate_token_location(cls, v):
        if v not in ['headers','cookies']:
            raise ValueError("The 'authjwt_token_location' must be between 'headers' or 'cookies'")
        return v

    @validator('authjwt_cookie_samesite')
    def validate_cookie_samesite(cls, v):
        if v not in ['strict','lax','none']:
            raise ValueError("The 'authjwt_cookie_samesite' must be between 'strict', 'lax', 'none'")
        return v

    @validator('authjwt_csrf_methods', each_item=True)
    def validate_csrf_methods(cls, v):
        if v.upper() not in ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"]:
            raise ValueError("The 'authjwt_csrf_methods' must be between http request methods")
        return v.upper()

    class Config:
        str_min_length = 1
        str_strip_whitespace = True
'''


def main():
    print("🔧 FastAPI-JWT-Auth Pydantic 2 兼容性修复工具")
    print("=" * 50)

    try:
        # 通过 pydantic 定位 site-packages 目录
        import pydantic
        pydantic_path = Path(pydantic.__file__).parent
        site_packages = pydantic_path.parent

        print(f"📍 Pydantic 路径: {pydantic_path}")
        print(f"📦 Site-packages: {site_packages}")

        # 构造 fastapi_jwt_auth 配置文件路径
        config_file = site_packages / "fastapi_jwt_auth" / "config.py"

        print(f"🎯 目标配置文件: {config_file}")

        # 检查文件是否存在
        if not config_file.exists():
            print("❌ fastapi-jwt-auth 配置文件不存在")
            print("💡 请确保已安装 fastapi-jwt-auth: pip install fastapi-jwt-auth")
            return 1

        # 检查 fastapi_jwt_auth 目录
        fastapi_jwt_dir = config_file.parent
        if not fastapi_jwt_dir.exists():
            print("❌ fastapi_jwt_auth 目录不存在")
            return 1

        # 备份原文件
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = config_file.with_suffix(f'.py.backup.{timestamp}')

        try:
            import shutil
            shutil.copy2(config_file, backup_file)
            print(f"💾 已备份原文件: {backup_file.name}")
        except Exception as e:
            print(f"⚠️  备份失败，但继续修复: {e}")

        # 检查当前内容
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                current_content = f.read()

            # 简单检查是否已经修复
            if 'StrictBool' in current_content and '@validator(' in current_content:
                print("✅ 配置文件可能已经兼容 Pydantic 2")
                print("🔄 强制更新以确保完全兼容...")
        except:
            pass

        # 写入修复后的内容
        try:
            with open(config_file, 'w', encoding='utf-8') as f:
                f.write(FIXED_CONFIG_CONTENT)
            print("✅ 配置文件修复完成！")
        except Exception as e:
            print(f"❌ 写入文件失败: {e}")
            return 1

        # 验证修复
        print("🔍 验证修复结果...")
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                new_content = f.read()

            if 'StrictBool' in new_content and 'LoadConfig' in new_content:
                print("✅ 验证成功：配置文件已更新为 Pydantic 2 兼容版本")
            else:
                print("⚠️  验证警告：文件内容可能不完整")

        except Exception as e:
            print(f"⚠️  验证失败: {e}")

        print("\n🎉 修复完成！")
        print("💡 现在可以正常使用 fastapi-jwt-auth 了")
        print(f"💡 如需恢复原文件，请将 {backup_file.name} 重命名为 config.py")

        return 0

    except ImportError:
        print("❌ 无法导入 pydantic")
        print("💡 请确保已安装 pydantic: pip install pydantic")
        return 1
    except Exception as e:
        print(f"❌ 发生错误: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
#!/usr/bin/env python3
import os
import sys

import redis


def main():
    try:
        r = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=int(os.getenv('REDIS_DB', 0)),
            socket_connect_timeout=5
        )
        r.ping()
        print("✅ Redis connection successful")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

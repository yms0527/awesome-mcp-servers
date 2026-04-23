import pytest
import httpx
import asyncio
from parameterized import parameterized

# 添加pytest配置
def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "asyncio: mark test as asyncio coroutine"
    )

BASE_URL = "http://localhost:8000"

@pytest.fixture(scope="session")
def event_loop():
    """修复事件循环问题"""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.mark.asyncio
@parameterized.expand([
    (5, 3, 8),
    (10, 20, 30),
    (-1, 1, 0),
])
async def test_add_get(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/add/{a}/{b}")
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (5, 3, 2),
    (10, 20, -10),
    (-1, 1, -2),
])
async def test_subtract_get(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/subtract/{a}/{b}")
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (5, 3, 15),
    (10, 20, 200),
    (-1, 1, -1),
])
async def test_multiply_get(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/multiply/{a}/{b}")
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (6, 3, 2),
    (10, 2, 5),
    (-4, 2, -2),
])
async def test_divide_get(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/divide/{a}/{b}")
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (6, 0),
    (10, 0),
    (-4, 0),
])
async def test_divide_by_zero_get(a, b):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/divide/{a}/{b}")
        assert response.status_code == 200
        assert response.json() == {"error": "除数不能为零"}

@pytest.mark.asyncio
@parameterized.expand([
    (5, 3, 8),
    (10, 20, 30),
    (-1, 1, 0),
])
async def test_add_post(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/add",
            json={"a": a, "b": b}
        )
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (5, 3, 2),
    (10, 20, -10),
    (-1, 1, -2),
])
async def test_subtract_post(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/subtract",
            json={"a": a, "b": b}
        )
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (5, 3, 15),
    (10, 20, 200),
    (-1, 1, -1),
])
async def test_multiply_post(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/multiply",
            json={"a": a, "b": b}
        )
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (6, 3, 2),
    (10, 2, 5),
    (-4, 2, -2),
])
async def test_divide_post(a, b, expected):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/divide",
            json={"a": a, "b": b}
        )
        assert response.status_code == 200
        assert response.json() == {"result": expected}

@pytest.mark.asyncio
@parameterized.expand([
    (6, 0),
    (10, 0),
    (-4, 0),
])
async def test_divide_by_zero_post(a, b):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/divide",
            json={"a": a, "b": b}
        )
        assert response.status_code == 200
        assert response.json() == {"error": "除数不能为零"}
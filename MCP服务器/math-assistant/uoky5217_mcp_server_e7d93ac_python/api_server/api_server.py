from fastapi import FastAPI
import asyncio
from pydantic import BaseModel

# 定义请求体模型
class Numbers(BaseModel):
    a: int
    b: int

app = FastAPI()

@app.get("/add/{a}/{b}")
async def add(a: int, b: int):
    """
    此函数用于计算两个整数的和
    :param a: 第一个整数
    :param b: 第二个整数
    :return: 两个整数的和
    """
    return {"result": a + b}

@app.get("/subtract/{a}/{b}")
async def subtract(a: int, b: int):
    """
    此函数用于计算两个整数的差
    :param a: 被减数
    :param b: 减数
    :return: 两个整数的差
    """
    return {"result": a - b}

@app.get("/multiply/{a}/{b}")
async def multiply(a: int, b: int):
    """
    此函数用于计算两个整数的积
    :param a: 第一个整数
    :param b: 第二个整数
    :return: 两个整数的积
    """
    return {"result": a * b}

@app.get("/divide/{a}/{b}")
async def divide(a: int, b: int):
    """
    此函数用于计算两个整数的商
    :param a: 被除数
    :param b: 除数
    :return: 两个整数的商
    """
    if b == 0:
        return {"error": "除数不能为零"}
    return {"result": a / b}

@app.post("/add")
async def add_post(numbers: Numbers):
    """
    此函数用于通过 POST 请求计算两个整数的和
    :param numbers: 包含两个整数 a 和 b 的请求体
    :return: 两个整数的和
    """
    return {"result": numbers.a + numbers.b}

@app.post("/subtract")
async def subtract_post(numbers: Numbers):
    """
    此函数用于通过 POST 请求计算两个整数的差
    :param numbers: 包含两个整数 a 和 b 的请求体
    :return: 两个整数的差
    """
    return {"result": numbers.a - numbers.b}

@app.post("/multiply")
async def multiply_post(numbers: Numbers):
    """
    此函数用于通过 POST 请求计算两个整数的积
    :param numbers: 包含两个整数 a 和 b 的请求体
    :return: 两个整数的积
    """
    return {"result": numbers.a * numbers.b}

@app.post("/divide")
async def divide_post(numbers: Numbers):
    """
    此函数用于通过 POST 请求计算两个整数的商
    :param numbers: 包含两个整数 a 和 b 的请求体
    :return: 两个整数的商，如果除数为零则返回错误信息
    """
    if numbers.b == 0:
        return {"error": "除数不能为零"}
    return {"result": numbers.a / numbers.b}
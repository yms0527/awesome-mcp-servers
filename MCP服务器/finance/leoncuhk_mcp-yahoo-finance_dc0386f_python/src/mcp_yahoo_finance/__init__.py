from . import server


def main():
    import asyncio

    asyncio.run(server.serve())


if __name__ == "__main__":
    main()

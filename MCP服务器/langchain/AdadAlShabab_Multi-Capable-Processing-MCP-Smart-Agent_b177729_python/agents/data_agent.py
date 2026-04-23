from tools.weather_tool import WeatherTool

class DataAgent:
    def __init__(self):
        self.weather_tool = WeatherTool()

    def get_weather(self, location):
        weather_info = self.weather_tool.fetch_weather(location)
        return weather_info

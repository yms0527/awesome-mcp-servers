from AlgorithmImports import *


class BacktestInitTestAlgorithm(QCAlgorithm):

    def initialize(self):
        self.add_equity('SPY', Resolution.DAY)

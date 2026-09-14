class SummaryAgent:
    def summarize(self, text):
        summary = text[:100] + "..."
        return summary

# GraphMemory-IDE Dashboard

A real-time analytics dashboard for monitoring GraphMemory-IDE system performance, built with Streamlit and FastAPI.

## Features

- 📊 **Real-time Analytics**: Live system performance metrics
- 🧠 **Memory Insights**: Memory distribution and growth tracking  
- 🔗 **Graph Metrics**: Network topology and connectivity analysis
- 🔄 **Live Updates**: Auto-refreshing data streams using Streamlit fragments
- 🔐 **Authentication**: JWT-based login system
- 📱 **Responsive Design**: Mobile-friendly interface

## Quick Start

### Prerequisites

- Python 3.11+
- FastAPI server running on port 8000 (from Phase 1)
- Required dependencies (see requirements.txt)

### Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the dashboard:**
   ```bash
   streamlit run streamlit_app.py
   ```

3. **Access the dashboard:**
   Open your browser to `http://localhost:8501`

### Default Login

Use the same credentials configured for your FastAPI backend.

## Architecture

```
dashboard/
├── streamlit_app.py          # Main application entry point
├── .streamlit/
│   └── config.toml          # Streamlit configuration
├── components/              # Reusable UI components
│   ├── auth.py             # Authentication components
│   ├── metrics.py          # Metrics display components
│   ├── charts.py           # Chart visualization components
│   └── layout.py           # Layout and navigation components
├── utils/                   # Utility functions
│   ├── api_client.py       # FastAPI SSE client
│   ├── chart_configs.py    # ECharts configuration generators
│   └── auth_utils.py       # Authentication utilities
└── assets/                  # Static assets
    └── styles.css          # Custom CSS styling
```

## Real-time Features

### Streamlit Fragments
The dashboard uses Streamlit's `@st.fragment(run_every=seconds)` decorator for real-time updates:

- **Analytics metrics**: Updates every 2 seconds
- **Memory metrics**: Updates every 5 seconds  
- **Graph metrics**: Updates every 3 seconds
- **Charts**: Auto-refresh with data streams

### Streaming Controls
- **Start/Stop**: Control real-time streaming from the sidebar
- **Refresh Rate**: Configurable update frequency
- **Status Indicator**: Live streaming status display

## Components

### Authentication (`components/auth.py`)
- JWT-based login form
- Session state management
- Token validation and refresh
- User information display

### Metrics (`components/metrics.py`)
- Real-time system performance metrics
- Memory distribution and growth tracking
- Graph topology statistics
- Health score calculation

### Charts (`components/charts.py`)
- Apache ECharts integration via streamlit-echarts
- Fallback to native Streamlit charts
- Real-time data visualization
- Interactive chart controls

### Layout (`components/layout.py`)
- Responsive page configuration
- Sidebar navigation and controls
- System status monitoring
- Custom CSS loading

## API Integration

The dashboard connects to FastAPI endpoints:

- `GET /dashboard/latest` - Fetch latest data
- `GET /dashboard/status` - Server status and connection info
- `POST /auth/token` - User authentication

## Configuration

### Streamlit Config (`.streamlit/config.toml`)
- Custom theme colors
- Server settings
- Browser configuration

### Environment Variables
- `FASTAPI_URL` - FastAPI server URL (default: http://localhost:8000)
- `LOG_LEVEL` - Logging level (default: INFO)

## Troubleshooting

### Common Issues

1. **Connection Error**
   - Ensure FastAPI server is running on port 8000
   - Check network connectivity
   - Verify authentication credentials

2. **Import Errors**
   - Install all dependencies: `pip install -r requirements.txt`
   - Check Python version compatibility

3. **Chart Display Issues**
   - Install streamlit-echarts: `pip install streamlit-echarts`
   - Fallback charts will be used if ECharts unavailable

4. **Authentication Problems**
   - Verify FastAPI auth endpoints are working
   - Check JWT token configuration
   - Clear browser cache/session state

### Debug Mode

Run with debug logging:
```bash
LOG_LEVEL=DEBUG streamlit run streamlit_app.py
```

## Development

### Adding New Components

1. Create component in `components/` directory
2. Add utility functions to `utils/` if needed
3. Import and use in `streamlit_app.py`
4. Update this README

### Custom Styling

Modify `assets/styles.css` for custom styling. The CSS is automatically loaded by the layout component.

## Dependencies

- **streamlit**: Web app framework
- **streamlit-echarts**: Apache ECharts integration
- **requests**: HTTP client for API calls
- **PyJWT**: JWT token handling
- **pandas**: Data manipulation
- **numpy**: Numerical operations

## License

Part of the GraphMemory-IDE project. See main project LICENSE file. 
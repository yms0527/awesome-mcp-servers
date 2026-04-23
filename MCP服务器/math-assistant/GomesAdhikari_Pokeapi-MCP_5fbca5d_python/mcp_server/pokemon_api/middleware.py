import logging
import time

logger = logging.getLogger("api_logger")

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def safe_get_body(request):
    try:
        return request.body.decode('utf-8', 'ignore')
    except Exception:
        return '[unavailable after read]'

class APILoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = None
        client_ip = get_client_ip(request)
        payload = safe_get_body(request)
        try:
            response = self.get_response(request)
            duration = time.time() - start_time
            logger.info(
                f"[API] {request.method} {request.path} | Status: {getattr(response, 'status_code', 'N/A')} | Time: {duration:.3f}s | IP: {client_ip} | Payload: {payload}"
            )
            return response
        except Exception as e:
            duration = time.time() - start_time
            logger.error(
                f"[API ERROR] {request.method} {request.path} | Exception: {str(e)} | Time: {duration:.3f}s | IP: {client_ip} | Payload: {payload}"
            )
            raise 
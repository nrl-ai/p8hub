from p8hub.core.app_manager import AppManager
from p8hub.core.service_manager import ServiceManager

app_manager = AppManager()
service_manager = ServiceManager(app_manager)

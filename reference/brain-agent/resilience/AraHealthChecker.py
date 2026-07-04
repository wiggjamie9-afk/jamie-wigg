from bus.JoService import Service


class AraHealthChecker(Service):
    """Stub service (auto-generated). Accepts any keyword args and exposes
    start()/stop(). Replace with a real implementation as needed."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def set_services(self, services):
        self.services = list(services)
        self.log.info("set_services: %d services registered", len(self.services))


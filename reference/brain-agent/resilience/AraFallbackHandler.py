from bus.JoService import Service


class AraFallbackHandler(Service):
    """Stub service (auto-generated). Accepts any keyword args and exposes
    start()/stop(). Replace with a real implementation as needed."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def set_restart_map(self, restart_map):
        self.restart_map = dict(restart_map)
        self.log.info("set_restart_map: %d restartable services", len(self.restart_map))


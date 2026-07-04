from bus.JoLogger import get_logger


class JoBus:
    """Minimal in-memory pub/sub message bus."""

    def __init__(self):
        self.log = get_logger("JoBus")
        self._subs = {}

    def subscribe(self, topic, fn):
        self._subs.setdefault(topic, []).append(fn)

    def publish(self, topic, payload=None):
        for fn in self._subs.get(topic, []):
            fn(payload)

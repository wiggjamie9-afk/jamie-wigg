from bus.JoLogger import get_logger


class Service:
    """Base class for all Brain services. Stores kwargs as attributes and
    provides no-op start()/stop() lifecycle hooks that log their transitions."""

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)
        self.log = get_logger(self.__class__.__name__)
        self._running = False

    def start(self):
        self._running = True
        self.log.info("start()")

    def stop(self):
        self._running = False
        self.log.info("stop()")

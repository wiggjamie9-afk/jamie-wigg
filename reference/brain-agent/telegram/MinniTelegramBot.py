from bus.JoService import Service


class MiniTelegramBot(Service):
    """Stub service (auto-generated). Accepts any keyword args and exposes
    start()/stop(). Replace with a real implementation as needed."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def send_message(self, text):
        self.log.info("send_message: %s", text)
        print("[telegram] " + str(text))


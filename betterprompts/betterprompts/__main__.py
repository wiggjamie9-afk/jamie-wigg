import sys
from .config import get_config, parse_cli_args
from .app import create_app


def main():
    args = parse_cli_args()
    config = get_config()

    if args.host:
        config.set_session_host(args.host)
    if args.port:
        config.set_session_port(args.port)

    app = create_app()
    host = config.session_host or config.betterprompts_host or "127.0.0.1"
    port = config.session_port or config.betterprompts_port or 7860

    print(f"🚀 BetterPrompts running at http://{host}:{port}")
    app.launch(server_name=host, server_port=port, share=False)


if __name__ == "__main__":
    main()

import pytest
import sys
from unittest.mock import Mock, patch, MagicMock
from betterprompts.config import parse_cli_args


class TestCLIArgumentParsing:
    def test_parse_host_argument(self):
        args = parse_cli_args(["--host", "0.0.0.0"])
        assert args.host == "0.0.0.0"

    def test_parse_port_argument(self):
        args = parse_cli_args(["--port", "8080"])
        assert args.port == 8080

    def test_parse_both_arguments(self):
        args = parse_cli_args(["--host", "localhost", "--port", "3000"])
        assert args.host == "localhost"
        assert args.port == 3000

    def test_parse_no_arguments(self):
        args = parse_cli_args([])
        assert args.host is None
        assert args.port is None

    def test_parse_port_as_integer(self):
        args = parse_cli_args(["--port", "5000"])
        assert isinstance(args.port, int)
        assert args.port == 5000

    def test_parse_invalid_port_raises_error(self):
        with pytest.raises(SystemExit):
            parse_cli_args(["--port", "not_a_number"])

    def test_parse_help_flag(self):
        with pytest.raises(SystemExit):
            parse_cli_args(["--help"])


class TestCLIParsing:
    def test_localhost_host(self):
        args = parse_cli_args(["--host", "127.0.0.1"])
        assert args.host == "127.0.0.1"

    def test_all_interfaces_host(self):
        args = parse_cli_args(["--host", "0.0.0.0"])
        assert args.host == "0.0.0.0"

    def test_named_host(self):
        args = parse_cli_args(["--host", "example.com"])
        assert args.host == "example.com"

    def test_port_range_min(self):
        args = parse_cli_args(["--port", "1"])
        assert args.port == 1

    def test_port_range_max(self):
        args = parse_cli_args(["--port", "65535"])
        assert args.port == 65535


class TestMainEntryPoint:
    def test_main_function_exists(self):
        from betterprompts.__main__ import main
        assert callable(main)

    def test_main_with_no_arguments(self):
        with patch("betterprompts.__main__.parse_cli_args") as mock_parse:
            with patch("betterprompts.__main__.get_config") as mock_config:
                with patch("betterprompts.__main__.create_app") as mock_create:
                    mock_parse.return_value = Mock(host=None, port=None)
                    mock_config_obj = Mock(
                        session_host=None,
                        session_port=None,
                        betterprompts_host="127.0.0.1",
                        betterprompts_port=7860,
                    )
                    mock_config.return_value = mock_config_obj
                    mock_app = Mock()
                    mock_create.return_value = mock_app
                    # Don't actually launch the app
                    mock_app.launch.side_effect = KeyboardInterrupt()

                    from betterprompts.__main__ import main
                    with pytest.raises(KeyboardInterrupt):
                        main()

    def test_main_with_host_port_arguments(self):
        with patch("betterprompts.__main__.parse_cli_args") as mock_parse:
            with patch("betterprompts.__main__.get_config") as mock_config:
                with patch("betterprompts.__main__.create_app") as mock_create:
                    mock_parse.return_value = Mock(host="0.0.0.0", port=5000)
                    mock_config_obj = Mock()
                    mock_config.return_value = mock_config_obj
                    mock_app = Mock()
                    mock_create.return_value = mock_app
                    mock_app.launch.side_effect = KeyboardInterrupt()

                    from betterprompts.__main__ import main
                    with pytest.raises(KeyboardInterrupt):
                        main()

                    # Verify set_session methods were called
                    mock_config_obj.set_session_host.assert_called_once_with("0.0.0.0")
                    mock_config_obj.set_session_port.assert_called_once_with(5000)

    def test_main_creates_app(self):
        with patch("betterprompts.__main__.parse_cli_args") as mock_parse:
            with patch("betterprompts.__main__.get_config") as mock_config:
                with patch("betterprompts.__main__.create_app") as mock_create:
                    mock_parse.return_value = Mock(host=None, port=None)
                    mock_config_obj = Mock(
                        session_host=None,
                        session_port=None,
                        betterprompts_host="127.0.0.1",
                        betterprompts_port=7860,
                    )
                    mock_config.return_value = mock_config_obj
                    mock_app = Mock()
                    mock_create.return_value = mock_app
                    mock_app.launch.side_effect = KeyboardInterrupt()

                    from betterprompts.__main__ import main
                    with pytest.raises(KeyboardInterrupt):
                        main()

                    mock_create.assert_called_once()

    def test_main_launches_app(self):
        with patch("betterprompts.__main__.parse_cli_args") as mock_parse:
            with patch("betterprompts.__main__.get_config") as mock_config:
                with patch("betterprompts.__main__.create_app") as mock_create:
                    mock_parse.return_value = Mock(host=None, port=None)
                    mock_config_obj = Mock(
                        session_host=None,
                        session_port=None,
                        betterprompts_host="127.0.0.1",
                        betterprompts_port=7860,
                    )
                    mock_config.return_value = mock_config_obj
                    mock_app = Mock()
                    mock_create.return_value = mock_app
                    mock_app.launch.side_effect = KeyboardInterrupt()

                    from betterprompts.__main__ import main
                    with pytest.raises(KeyboardInterrupt):
                        main()

                    mock_app.launch.assert_called_once()


class TestMainDefaultValues:
    def test_main_uses_config_host_if_no_cli_arg(self):
        with patch("betterprompts.__main__.parse_cli_args") as mock_parse:
            with patch("betterprompts.__main__.get_config") as mock_config:
                with patch("betterprompts.__main__.create_app") as mock_create:
                    mock_parse.return_value = Mock(host=None, port=None)
                    mock_config_obj = Mock(
                        session_host=None,
                        session_port=None,
                        betterprompts_host="192.168.1.1",
                        betterprompts_port=7860,
                    )
                    mock_config.return_value = mock_config_obj
                    mock_app = Mock()
                    mock_create.return_value = mock_app
                    mock_app.launch.side_effect = KeyboardInterrupt()

                    from betterprompts.__main__ import main
                    with pytest.raises(KeyboardInterrupt):
                        main()

                    # Verify launch was called with config host
                    call_kwargs = mock_app.launch.call_args[1]
                    assert call_kwargs["server_name"] == "192.168.1.1"

    def test_main_uses_default_host_if_config_host_none(self):
        with patch("betterprompts.__main__.parse_cli_args") as mock_parse:
            with patch("betterprompts.__main__.get_config") as mock_config:
                with patch("betterprompts.__main__.create_app") as mock_create:
                    mock_parse.return_value = Mock(host=None, port=None)
                    mock_config_obj = Mock(
                        session_host=None,
                        session_port=None,
                        betterprompts_host=None,
                        betterprompts_port=7860,
                    )
                    mock_config.return_value = mock_config_obj
                    mock_app = Mock()
                    mock_create.return_value = mock_app
                    mock_app.launch.side_effect = KeyboardInterrupt()

                    from betterprompts.__main__ import main
                    with pytest.raises(KeyboardInterrupt):
                        main()

                    # Verify launch uses fallback default
                    call_kwargs = mock_app.launch.call_args[1]
                    assert call_kwargs["server_name"] == "127.0.0.1"

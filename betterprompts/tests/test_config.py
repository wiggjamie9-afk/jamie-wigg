import os
import pytest
from pathlib import Path
from betterprompts.config import Config, get_config


@pytest.fixture
def reset_config():
    from betterprompts import config as config_module
    original = config_module._global_config
    config_module._global_config = None
    yield
    config_module._global_config = original


class TestConfigDefaults:
    def test_default_host(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        assert cfg.betterprompts_host == "127.0.0.1"

    def test_default_port(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        assert cfg.betterprompts_port == 7860

    def test_default_gemini_model(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        assert cfg.gemini_model == "gemini-2.5-flash-lite"

    def test_default_groq_model(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        assert cfg.groq_model == "llama-3.3-70b-versatile"


class TestConfigEnvLoading:
    def test_load_gemini_api_key(self, monkeypatch, tmp_path):
        env_file = tmp_path / ".env"
        env_file.write_text("GEMINI_API_KEY=test_gemini_key\n")
        cfg = Config(env_file=env_file)
        assert cfg.gemini_api_key == "test_gemini_key"

    def test_load_groq_api_key(self, monkeypatch, tmp_path):
        env_file = tmp_path / ".env"
        env_file.write_text("GROQ_API_KEY=test_groq_key\n")
        cfg = Config(env_file=env_file)
        assert cfg.groq_api_key == "test_groq_key"

    def test_load_custom_models(self, tmp_path):
        env_file = tmp_path / ".env"
        env_file.write_text(
            "GEMINI_MODEL=gemini-custom\nGROQ_MODEL=llama-custom\n"
        )
        cfg = Config(env_file=env_file)
        assert cfg.gemini_model == "gemini-custom"
        assert cfg.groq_model == "llama-custom"

    def test_load_custom_host_port(self, tmp_path):
        env_file = tmp_path / ".env"
        env_file.write_text("BETTERPROMPTS_HOST=0.0.0.0\nBETTERPROMPTS_PORT=8080\n")
        cfg = Config(env_file=env_file)
        assert cfg.betterprompts_host == "0.0.0.0"
        assert cfg.betterprompts_port == 8080


class TestConfigSessionOverrides:
    def test_set_session_gemini_key(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        cfg.set_session_gemini_key("session_key")
        assert cfg.gemini_api_key == "session_key"

    def test_set_session_groq_key(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        cfg.set_session_groq_key("session_key")
        assert cfg.groq_api_key == "session_key"

    def test_set_session_models(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        cfg.set_session_gemini_model("gemini-pro")
        cfg.set_session_groq_model("llama-70b")
        assert cfg.gemini_model == "gemini-pro"
        assert cfg.groq_model == "llama-70b"

    def test_set_session_host_port(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        cfg.set_session_host("0.0.0.0")
        cfg.set_session_port(3000)
        assert cfg.session_host == "0.0.0.0"
        assert cfg.session_port == 3000


class TestConfigGlobal:
    def test_get_config_singleton(self, reset_config):
        cfg1 = get_config()
        cfg2 = get_config()
        assert cfg1 is cfg2


class TestConfigCLIParsing:
    def test_parse_host_port_args(self):
        from betterprompts.config import parse_cli_args
        args = parse_cli_args(["--host", "0.0.0.0", "--port", "5000"])
        assert args.host == "0.0.0.0"
        assert args.port == 5000

    def test_parse_no_args(self):
        from betterprompts.config import parse_cli_args
        args = parse_cli_args([])
        assert args.host is None
        assert args.port is None

    def test_parse_host_only(self):
        from betterprompts.config import parse_cli_args
        args = parse_cli_args(["--host", "localhost"])
        assert args.host == "localhost"
        assert args.port is None

    def test_parse_port_only(self):
        from betterprompts.config import parse_cli_args
        args = parse_cli_args(["--port", "3000"])
        assert args.host is None
        assert args.port == 3000


class TestConfigDebugFlag:
    def test_debug_false_by_default(self):
        cfg = Config(env_file=Path(__file__).parent / "fixtures" / ".env.empty")
        assert cfg.debug is False

    def test_debug_from_env(self, tmp_path):
        env_file = tmp_path / ".env"
        env_file.write_text("DEBUG=true\n")
        cfg = Config(env_file=env_file)
        assert cfg.debug is True

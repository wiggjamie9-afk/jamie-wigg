from typing import Protocol


class ProviderError(Exception):
    pass


class RateLimitError(ProviderError):
    pass


class Provider(Protocol):
    def improve(self, system: str, user: str) -> str:
        """Improve a prompt using the provider's API.

        Args:
            system: System prompt
            user: User prompt to improve

        Returns:
            Improved prompt

        Raises:
            ProviderError: If the provider API encounters an error
            RateLimitError: If the provider rate limit is exceeded
        """
        ...

"""Utility functions for stock analysis and data processing"""

from typing import List, Dict, Optional
from datetime import datetime
import statistics

def calculate_moving_average(prices: List[float], period: int) -> float:
    """
    Calculate simple moving average

    Args:
        prices: List of prices
        period: Period for moving average

    Returns:
        Moving average value
    """
    if not prices or period > len(prices):
        return 0.0

    return sum(prices[-period:]) / period

def calculate_sma(prices: List[float], period: int) -> List[float]:
    """
    Calculate Simple Moving Average for all points

    Args:
        prices: List of prices
        period: Period for moving average

    Returns:
        List of moving averages
    """
    sma = []
    for i in range(len(prices)):
        if i < period - 1:
            sma.append(None)
        else:
            avg = sum(prices[i-period+1:i+1]) / period
            sma.append(avg)

    return sma

def calculate_ema(prices: List[float], period: int) -> List[float]:
    """
    Calculate Exponential Moving Average

    Args:
        prices: List of prices
        period: Period for EMA

    Returns:
        List of EMA values
    """
    if not prices or period > len(prices):
        return []

    ema = []
    multiplier = 2 / (period + 1)

    # Start with SMA
    sma = sum(prices[:period]) / period
    ema.append(sma)

    # Calculate EMA for remaining prices
    for price in prices[period:]:
        ema_val = (price - ema[-1]) * multiplier + ema[-1]
        ema.append(ema_val)

    return ema

def calculate_momentum(prices: List[float], period: int = 1) -> float:
    """
    Calculate momentum (price change percentage)

    Args:
        prices: List of prices
        period: Period for momentum calculation

    Returns:
        Momentum percentage
    """
    if not prices or len(prices) < period + 1:
        return 0.0

    if prices[-period-1] == 0:
        return 0.0

    return ((prices[-1] - prices[-period-1]) / prices[-period-1]) * 100

def calculate_rsi(prices: List[float], period: int = 14) -> float:
    """
    Calculate Relative Strength Index

    Args:
        prices: List of prices
        period: Period for RSI (default 14)

    Returns:
        RSI value (0-100)
    """
    if not prices or len(prices) < period + 1:
        return 50.0

    gains = []
    losses = []

    for i in range(1, len(prices)):
        change = prices[i] - prices[i-1]
        if change > 0:
            gains.append(change)
            losses.append(0)
        else:
            gains.append(0)
            losses.append(abs(change))

    avg_gain = sum(gains[-period:]) / period if gains else 0
    avg_loss = sum(losses[-period:]) / period if losses else 0

    if avg_loss == 0:
        return 100.0 if avg_gain > 0 else 50.0

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi

def calculate_volatility(prices: List[float], period: int = 20) -> float:
    """
    Calculate historical volatility (standard deviation)

    Args:
        prices: List of prices
        period: Period for volatility calculation

    Returns:
        Volatility as percentage
    """
    if not prices or len(prices) < period:
        return 0.0

    recent_prices = prices[-period:]

    if len(recent_prices) < 2:
        return 0.0

    returns = []
    for i in range(1, len(recent_prices)):
        if recent_prices[i-1] != 0:
            ret = (recent_prices[i] - recent_prices[i-1]) / recent_prices[i-1]
            returns.append(ret)

    if not returns:
        return 0.0

    std_dev = statistics.stdev(returns)
    volatility = std_dev * (252 ** 0.5) * 100  # Annualized

    return volatility

def calculate_macd(prices: List[float]) -> Dict[str, Optional[float]]:
    """
    Calculate MACD (Moving Average Convergence Divergence)

    Args:
        prices: List of prices

    Returns:
        Dictionary with MACD, Signal, and Histogram
    """
    if not prices or len(prices) < 26:
        return {"macd": None, "signal": None, "histogram": None}

    ema12 = calculate_ema(prices, 12)
    ema26 = calculate_ema(prices, 26)

    if len(ema12) < 1 or len(ema26) < 1:
        return {"macd": None, "signal": None, "histogram": None}

    # Use the last values
    macd = ema12[-1] - ema26[-1]

    # Calculate signal line (9-period EMA of MACD)
    macd_values = []
    for i in range(len(ema12)):
        if i < len(ema26):
            macd_val = ema12[i] - ema26[i]
            macd_values.append(macd_val)

    signal_ema = calculate_ema(macd_values, 9)
    signal = signal_ema[-1] if signal_ema else None

    histogram = macd - signal if signal else None

    return {
        "macd": round(macd, 4) if macd else None,
        "signal": round(signal, 4) if signal else None,
        "histogram": round(histogram, 4) if histogram else None
    }

def calculate_bollinger_bands(prices: List[float], period: int = 20, std_dev: int = 2) -> Dict[str, Optional[float]]:
    """
    Calculate Bollinger Bands

    Args:
        prices: List of prices
        period: Period for moving average
        std_dev: Number of standard deviations

    Returns:
        Dictionary with upper, middle, and lower bands
    """
    if not prices or len(prices) < period:
        return {"upper": None, "middle": None, "lower": None}

    middle = calculate_moving_average(prices, period)

    recent = prices[-period:]
    variance = sum((x - middle) ** 2 for x in recent) / period
    std = variance ** 0.5

    upper = middle + (std * std_dev)
    lower = middle - (std * std_dev)

    return {
        "upper": round(upper, 2),
        "middle": round(middle, 2),
        "lower": round(lower, 2)
    }

def generate_signal(rsi: float, macd: Dict, volatility: float, momentum: float) -> Dict[str, any]:
    """
    Generate trading signal based on multiple indicators

    Args:
        rsi: RSI value
        macd: MACD data
        volatility: Volatility percentage
        momentum: Momentum percentage

    Returns:
        Signal analysis dictionary
    """
    signals = []
    confidence = 0.5

    # RSI signals
    if rsi > 70:
        signals.append("Overbought (RSI > 70)")
        confidence -= 0.15
    elif rsi < 30:
        signals.append("Oversold (RSI < 30)")
        confidence += 0.15

    # MACD signals
    if macd["histogram"] and macd["histogram"] > 0:
        signals.append("MACD bullish crossover")
        confidence += 0.1
    elif macd["histogram"] and macd["histogram"] < 0:
        signals.append("MACD bearish crossover")
        confidence -= 0.1

    # Momentum signals
    if momentum > 5:
        signals.append("Strong positive momentum")
        confidence += 0.1
    elif momentum < -5:
        signals.append("Strong negative momentum")
        confidence -= 0.1

    # Volatility consideration
    if volatility > 40:
        signals.append("High volatility")
        confidence *= 0.8

    return {
        "signals": signals,
        "confidence": max(0.0, min(1.0, confidence))
    }

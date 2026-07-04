# Flow — reinforcement-learning trading module (reference)

High-frequency algorithmic-trading module that uses machine learning to self-regulate
and self-optimize for return. A stack of financial indicators feeds a **Q-learning**
agent that chooses an action at each step of the quote stream.

- **Scopes** — samplings of the time-series quotes to discover trends across any time
  interval. A **Supervisor** keeps at least one **Agent** per scope looking for a
  profitable trade.
- Ships trading CAD/USD from Jan-2016 quotes. A fork wired to a broker practice
  account reportedly turns a profit before spread.

> ⚠️ **Reference only** — external repo, not vendored here and not runnable in this
> static-site repo/sandbox. Nothing about this is financial advice.

## Install / run (on your own machine)

```bash
git clone https://github.com/yazanobeidi/flow.git && cd flow
virtualenv env && source env/bin/activate && pip install -r requirements.txt

# live-stream transactions (2nd terminal)
tail -f -n 40 logs/bankroll.log
# run the simulation (1st terminal)
python python/executive.py
```

**Authors:** Yazan Obeidi, Matthew Robichaud · contributor: Michael Broughton.
© 2016 Yazan Obeidi. Source: https://github.com/yazanobeidi/flow

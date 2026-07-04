# Make the Machine Talk Back

Coding feels like magic when the loop between *doing* and *seeing* is fast, and like
punishment when it's slow. Your job as a beginner is to make that loop as tight as
possible.

## Print early, print often

The humble print statement is the campfire of debugging: primitive, reliable, and
warm when you're lost in the dark.

```python
total = 0
for price in [4, 9, 2, 15]:
    total = total + price
    print("running total:", total)   # <- watch it climb
print("final:", total)
```

You don't have to *reason* about whether the loop works. You can just **watch** it.
Seeing beats guessing.

## Shorten the distance

A good feedback loop has three properties:

- **Fast** — measured in seconds, not minutes.
- **Visible** — you can see the result without hunting for it.
- **Cheap to repeat** — trying again costs almost nothing.

When a loop is slow, fix the loop *before* you fix the code. A tool that answers in
one second is worth more than a clever technique that answers in five minutes.

## The rubber duck

When you're stuck and there's no one to ask, explain the problem out loud to an
inanimate object — the classic being a rubber duck on your desk.

> Half the time, you solve the bug in the middle of the sentence, because saying it
> slowly forces you to notice the thing you'd been skipping over.

That, too, is a feedback loop — just with your own brain as the machine.

Next: why finishing something ugly beats planning something perfect.

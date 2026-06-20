# From Zero to Hero with LLMs — Learning Guide

> **Vendored reference.** This is a curated learning guide by **Louis Bouchard**
> (["From Zero to Hero with LLMs"](https://www.louisbouchard.ai/from-zero-to-hero-with-llms/),
> repo: [louisfb01](https://github.com/louisfb01)). Kept here as a reference for
> anyone on the project ramping up on LLMs. Content is reproduced as shared;
> some links are the author's affiliate links. For the latest version, see the
> original. Not project-specific — see `CLAUDE.md` for repo conventions.

A complete guide to start and improve your LLM skills without an advanced
background in the field, and stay up-to-date with the latest news and
state-of-the-art techniques.

If you have **0** programming or AI knowledge, first follow the author's
[start-machine-learning guide](https://github.com/louisfb01/start-machine-learning)
(focus on the Python section), then come back here.

There is no strict order — a classic path is top to bottom. Skip books or
courses that don't suit you. All resources are free except some courses/books
(recommended but optional). Repetition is the key to learning.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Start with short YouTube video introductions](#youtube-videos)
- [LLM Books and articles (for readers)](#books-and-articles)
- [Follow online courses](#online-courses)
- [Practice, practice, and practice!](#practice)
- [Prompting](#prompting)
- [Retrieval Augmented Generation (RAG) and fine-tuning](#rag)
- [More resources (communities, news, and more)](#more-resources)
- [How to find a machine learning job](#find-a-job)
- [AI Ethics](#ai-ethics)
- [Learn more and do more with LLMs](#do-more)

## Prerequisites<a name="prerequisites"></a>

If you have 0 programming or AI knowledge, follow the
[start-machine-learning guide](https://github.com/louisfb01/start-machine-learning)
(mostly the Python section). If you're already somewhat familiar with Python and
AI, happy learning.

## Start with short YouTube video introductions<a name="youtube-videos"></a>

The best way to start from nothing — short intros to the terms you need.

- **Understanding the terminology**
  - [Mastering AI Jargon — Your Guide to OpenAI & LLM Terms (Louis Bouchard)](https://youtu.be/q4G6X09NEu4)
- **Understanding Transformers and LLMs (the models behind ChatGPT)**
  - [Foundational Knowledge for LLMs and building on top of LLMs](https://youtu.be/R5_udqy1L4s) — 2 free 2-hour sessions
  - [Intro to Large Language Models](https://youtu.be/zjkBMFhNj_g) — 1-hour talk by Andrej Karpathy
  - [Natural Language Processing and Large Language Models](https://www.youtube.com/playlist?list=PLs8w1Cdi-zvYskDS2icIItfZgxclApVLv) — attention, tokens, embeddings, by Luis Serrano
  - [What are Transformer Models and how do they work?](https://youtu.be/qaWMOYf4ri8) — Luis Serrano
  - [The Illustrated Word2vec — A Gentle Intro to Word Embeddings](https://youtu.be/ISPId9Lhc1g) — Jay Alammar
  - [A Hackers' Guide to Language Models](https://www.youtube.com/watch?v=jkrNMKz9pWU) — Jeremy Howard (fast.ai)
  - [Let's build GPT: from scratch, in code, spelled out](https://www.youtube.com/watch?v=kCc8FmEb1nY) — Andrej Karpathy

**Podcasts** are an easy way to keep learning in spare time:
[Lex Fridman](https://open.spotify.com/show/2MAi0BvDc6GTFvKFPXnkCL),
[Machine Learning Street Talk](https://open.spotify.com/show/02e6PZeIOdpmBGT9THuzwR),
[Louis Bouchard Podcast](https://open.spotify.com/show/4rKRJXaXlClkDyInjHkxq3),
and [ThursdAI](https://thursdai.news/).

**Free YouTube courses worth following:**
- [Train & Fine-Tune LLMs for Production (Activeloop, Towards AI & Intel Disruptor)](https://youtube.com/playlist?list=PLO4GrDnQanVcPlQUBuMd_pwRkILfc463G)
- [Create a Large Language Model from Scratch with Python (freeCodeCamp)](https://youtu.be/UU1WVnMk4E8)
- [LLM University (LLMU) from Cohere](https://www.youtube.com/watch?v=uV1H6E8y_Sg&list=PLLalUvky4CLIpL4PkbTyf9DeXxJaZzEgU)
- [The Attention Mechanism in Large Language Models (Luis Serrano)](https://www.youtube.com/watch?v=OxCpWwDCDFQ&list=PLs8w1Cdi-zva4fwKkl9EK13siFvL9Wewf)

## LLM Books and articles (for readers)<a name="books-and-articles"></a>

- [Building LLMs for Production (Towards AI)](https://amzn.to/4bqYU9b) — prompt engineering, fine-tuning, RAG ([e-book](https://academy.towardsai.net/courses/buildingllmsforproduction?ref=1f9b29))
- [The LLM Engineer's Handbook](https://www.packtpub.com/en-us/product/llm-engineers-handbook-9781836200079) — data prep, RAG, fine-tuning
- [The Illustrated Transformer (Jay Alammar)](https://jalammar.github.io/illustrated-transformer/)
- [A Practical Introduction to LLMs (Shawhin Talebi)](https://towardsdatascience.com/a-practical-introduction-to-llms-65194dda1148)
- [Medium — Towards AI](https://pub.towardsai.net/) / [Towards Data Science](https://towardsdatascience.com/)
- [Reading lists for new MILA students](https://docs.google.com/document/d/1IXF3h0RU5zz4ukmTrVKVotPQypChscNGf5k6E25HGvA/edit)
- [A complete roadmap to master NLP](https://www.analyticsvidhya.com/blog/2022/01/roadmap-to-master-nlp-in-2022/)
- [NLTK Book (free)](https://www.nltk.org/book/)
- [The Annotated Transformer (Harvard)](https://nlp.seas.harvard.edu/2018/04/03/attention.html)

## Follow online courses<a name="online-courses"></a>

- [Generative AI with Large Language Models](https://imp.i384100.net/R5WzQR) — Paid
- [NLP Specialization by deeplearning.ai (Coursera)](https://coursera.pxf.io/P0vO9e) — Paid
- [Gradio Course (freeCodeCamp)](https://youtu.be/RiCQzBluTxU) — Free
- [Train & Fine-Tune LLMs for Production (Activeloop)](https://learn.activeloop.ai/courses/llms/) — Free
- [LLM University by Cohere](https://docs.cohere.com/docs/llmu) — Free
- [From Beginners to Advanced LLM Developer (Towards AI)](https://academy.towardsai.net/courses/beginner-to-advanced-llm-dev?ref=1f9b29)
- [NLP Nano Degree](https://imp.i115008.net/jW4K60) — Paid
- [Introduction to LLMs with Google Cloud](https://imp.i115008.net/eKbDLD) — Paid
- [Train, fine-tune and use LLMs (Weights & Biases)](https://www.wandb.courses/pages/w-b-courses) — Free
- [Large Language Models with Semantic Search (deeplearning.ai + Cohere)](https://www.deeplearning.ai/short-courses/large-language-models-semantic-search/) — Free

## Practice, practice, and practice!<a name="practice"></a>

Practice is the most important thing. Try to build something yourself; if that's
intimidating, follow one or two **applied** courses and adapt their code into
your own project, using ChatGPT / GitHub Copilot as a code assistant.

Applied resources:
- [fasttext supervised tutorial](https://fasttext.cc/docs/en/supervised-tutorial.html) — quick text classification / word vectors
- [Hugging Face course](https://huggingface.co/course/chapter1/1) — modern NLP models
- [LangChain & Vector Databases in Production (Activeloop)](https://learn.activeloop.ai/courses/langchain/) — Free
- [Training & Fine-Tuning LLMs for Production (Activeloop)](https://learn.activeloop.ai/courses/llms/) — Free
- [The Real-World ML Tutorial & Community](https://realworldmachinelearning.carrd.co/) — Paid

The best way to learn is to build something. Most providers (OpenAI, LangChain,
Activeloop, Cohere, W&B…) have great tutorials to get you started.

## Prompting<a name="prompting"></a>

- [What is Prompting? Talking with AI Models](https://youtu.be/pZsJbYIFCCw) — Free
- [ChatGPT Prompt Engineering for Developers](https://imp.i384100.net/rQBVMy) — Paid
- [Learn Prompting](https://learnprompting.org/) — Free, all you need for prompting
- [Techniques to improve reliability (OpenAI Cookbook)](https://github.com/openai/openai-cookbook/blob/main/articles/techniques_to_improve_reliability.md)

## Retrieval Augmented Generation (RAG) and fine-tuning<a name="rag"></a>

- [A Survey of Techniques for Maximizing LLM Performance (OpenAI)](https://youtu.be/ahnGLM-RC1Y) — when to use prompting, RAG, or fine-tuning
- [RAG vs Fine-Tuning vs Deep Memory vs training from scratch](https://youtu.be/pHv9SsE4Mb4)
- [Building a Q&A Chatbot using GPT and embeddings (Jeremy Pinto)](https://youtu.be/LB5g-AhfPG8)
- [Build an AI that answers questions about your website (OpenAI)](https://platform.openai.com/docs/tutorials/web-qa-embeddings/how-to-build-an-ai-that-can-answer-questions-about-your-website)
- [From Beginners to Advanced LLM Developer (Towards AI)](https://academy.towardsai.net/courses/beginner-to-advanced-llm-dev?ref=1f9b29)
- [How to Build a RAG-based ChatGPT Web App](https://youtu.be/7ytyK6u3aAk)
- [Train and Deploy a Real-Time Financial Advisor (hands-on-llms)](https://github.com/iusztinpaul/hands-on-llms)
- [RAG for Production with LangChain & LlamaIndex (Activeloop)](https://learn.activeloop.ai/courses/rag)

## More Resources<a name="more-resources"></a>

**Communities:**
- [Learn AI Together Discord](https://discord.gg/learnaitogether)
- [Towards AI Discord](https://ws.towardsai.net/discord)
- [Learn Prompting Discord](https://discord.gg/learn-prompting-1046228027434086460)
- Reddit: [r/artificial](https://www.reddit.com/r/artificial/), [r/MachineLearning](https://www.reddit.com/r/MachineLearning/), [r/DeepLearningPapers](https://www.reddit.com/r/DeepLearningPapers/), [r/computervision](https://www.reddit.com/r/computervision/), [r/learnmachinelearning](https://www.reddit.com/r/learnmachinelearning/), [r/ArtificialInteligence](https://www.reddit.com/r/ArtificialInteligence/)

**News & channels:**
- YouTube: [Louis Bouchard](https://www.youtube.com/channel/UCUzGQrN-lyyc0BWTYoJM_Sg), [Two Minute Papers](https://www.youtube.com/user/keeroyz), [bycloud](https://www.youtube.com/channel/UCgfe2ooZD3VJPB6aJAnuQng)
- Newsletters: [Synced](https://syncedreview.com/), [Inside AI](https://inside.com/ai), [AI Weekly](http://aiweekly.co/), [AI Ethics Weekly](https://lighthouse3.com/newsletter/), [Louis Bouchard Weekly](https://louisbouchard.substack.com/), [ThursdAI](https://sub.thursdai.news/), [Towards AI](https://towardsai.net/ai/newsletter), [The Batch (deeplearning.ai)](https://www.deeplearning.ai/the-batch/)
- Medium publications: [Towards Data Science](https://towardsdatascience.com/), [Towards AI](https://medium.com/towards-artificial-intelligence), [OneZero](https://onezero.medium.com/)

## Find a machine learning job<a name="find-a-job"></a>

- [Interview tips and prep](https://www.louisbouchard.ai/learnai/#how-to-find-a-job)
- [Interview series with experts (NVIDIA, Zoox, D-ID, …)](https://youtube.com/playlist?list=PLO4GrDnQanVfrRIuIT_1rlLLTgQJdfXmS)

## AI Ethics<a name="ai-ethics"></a>

- [What are Ethics and Why do they Matter? — ML Edition (Rachel Thomas)](https://www.youtube.com/watch?v=F0cxzESR7ec&list=PLtmWHNX-gukIU6V33Bc8eP8OD41I4GywR)
- [AI4People — An Ethical Framework for a Good AI Society (Floridi et al., 2018)](https://link.springer.com/content/pdf/10.1007/s11023-018-9482-5.pdf)
- [Ethics guidelines for trustworthy AI (European Commission)](https://wayback.archive-it.org/12090/20210728013426/https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai)
- [An Introduction to Ethics in Robotics and AI (free e-book)](https://link.springer.com/book/10.1007/978-3-030-51110-4)

## Learn more and do more with LLMs<a name="do-more"></a>

ChatGPT, Claude, Bing, etc. are powerful **tools** — not human replacements. Use
them as assistants for coding and for learning unfamiliar platforms (AWS, GCP,
VMs, SSH, …), but double-check important answers. Don't be overly dependent on a
single provider; there will always be others competing for the best LLM.

---

*Guide by Louis Bouchard. Tag [@Whats_AI](https://twitter.com/Whats_AI) /
[Louis Bouchard](https://www.linkedin.com/in/whats-ai/) if you share it. Support
the author via [Sponsor](https://github.com/sponsors/louisfb01) or
[Patreon](https://www.patreon.com/whatsai).*

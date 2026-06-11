---
name: r-programming-resources
description: Comprehensive R programming reference guide with 500+ curated resources. Categories: fundamentals, visualization (ggplot2), machine learning, NLP, packages, deep learning, shiny apps, data science workflows, and domain-specific applications (finance, sports, GIS). Links to tutorials, documentation, books, conferences, and best practices from the R community.
metadata:
  tags: r-programming, data-science, packages, learning-resources, references, visualization, machine-learning, nlp, shiny, ggplot2
---

## When to use

User asks for:
- "Where do I learn R programming?"
- "What R packages do I need for X?"
- "Show me visualization examples in ggplot2"
- "How do I build a Shiny app?"
- "Best practices for machine learning in R"
- "R NLP and text mining resources"

Perfect for:
- Learning R from beginner to advanced
- Finding the right package for a task
- Exploring visualization techniques
- Understanding community best practices
- Discovering domain-specific applications

## Quick Navigation

### Beginner Start Here
- **Learning**: R for Data Science, R4Tistory tutorials, DataCamp courses
- **Visualization**: ggplot2 tutorials, BBC R cookbook
- **Packages**: tidyverse (data wrangling), ggplot2 (graphics), base R

### Core Skills
1. **Data Manipulation**: dplyr, data.table, tidyr
2. **Visualization**: ggplot2, plotly, ggvis
3. **Statistical Analysis**: base stats, tidyverse approach
4. **Machine Learning**: caret, mlr, tidymodels
5. **Reproducibility**: R Markdown, Shiny, git/GitHub

---

## Learning Resources

### Free Online Books & Guides
- **R for Data Science** - tidyverse approach (r4ds.had.co.nz)
- **Advanced R** - Hadley Wickham's deep dive (adv-r.had.co.nz)
- **Forecasting: Principles and Practice** - time series (otexts.com/fpp3)
- **Text Mining with R** - tidytext approach (tidytextmining.com)
- **Introduction to Statistical Learning** - classic ML reference (usc.edu/~gareth/ISL)
- **Data Visualization: A Practical Introduction** - Socviz.co
- **Bookdown** - writing reproducible books in R (bookdown.org)

### Online Courses
- **Coursera**: Johns Hopkins Data Science Specialization
- **DataCamp**: Interactive R courses (paid)
- **YouTube**: Simplilearn, 에이림 인공지능, 웹에서 하는 R통계
- **Coursera edX**: Sabermetrics 101 (baseball analytics)

### Korean Resources
- **웹에서 하는 R통계** - browser-based R (web-r.org)
- **숨은원리 데이터사이언스** - comprehensive tutorials (ds.sumeun.org)
- **R Café & Bloter 데이블로터** - series on data journalism
- **R 핵심 강의** - YouTube series (다양한 채널)

---

## Core Packages by Task

### Data Wrangling
| Package | Purpose | Key Functions |
|---------|---------|---|
| **dplyr** | Data manipulation | select, filter, mutate, summarize, arrange |
| **data.table** | High-performance wrangling | 0.3s vs 8s for large datasets |
| **tidyr** | Data reshaping | pivot_wider, pivot_longer, separate |
| **readr** | Data import | read_csv, guess_encoding |

### Visualization
| Package | Use Case | Strength |
|---------|----------|----------|
| **ggplot2** | Static graphics | Grammar of graphics, publication quality |
| **plotly** | Interactive plots | hover, zoom, web-ready |
| **ggvis** | Interactive ggplot2 | Reactive shiny-based |
| **rayshader** | 3D maps/data | Stunning 3D renderings |
| **ggplotAssist** | GUI ggplot builder | Point-and-click plotting |

### Machine Learning
- **caret** — unified interface for 200+ models
- **tidymodels** — tidy ML workflow (modern approach)
- **ranger** — fast random forests
- **xgboost** — gradient boosting
- **keras/tensorflow** — deep learning
- **mlr3** — machine learning registry

### Statistics & Analysis
- **base** (built-in) — lm(), glm(), anova()
- **Bayesian**: rstan, brms, bayesplot
- **Causal inference**: CausalImpact
- **Survival analysis**: survival package
- **Time series**: forecast, ts, xts

### Deep Learning & AI
- **keras** — neural networks (TensorFlow backend)
- **torch** — PyTorch-like interface for R
- **tensorflow** — direct TensorFlow access
- **reticulate** — R ↔ Python bridge

---

## Visualization Deep Dive

### ggplot2 Ecosystem
**Core ggplot2 Learning**:
- Syntax: `ggplot(data) + geom_*() + scale_*() + theme_*()`
- Top 50 visualizations: r-statistics.co/Top50-Ggplot2-Visualizations
- STHDA guide: sthda.com/english/wiki/be-awesome-in-ggplot2

**ggplot2 Extensions**:
- **ggside** — add marginal plots to sides
- **gganimate** — animated transitions
- **esquisse** — point-and-click plot builder (RStudio add-in)
- **ggplotAssist** — visual grammar helper
- **latex2exp** — LaTeX math in plots
- **ragg** — modern text rendering

**Color & Themes**:
- **colorspace** — perceptually uniform palettes
- **bbplot** — BBC-style graphics
- **ggthemes** — pre-built themes
- Color guide: be-favorite.github.io/coloring_guide

**Geographic Visualization**:
- **sf** — simple features for GIS
- **ggmap** — basemap + ggplot2
- **leaflet** — interactive maps
- **rnaturalearth** — Natural Earth map data

### Interactive Visualization
- **plotly** — web-based, hover/zoom/click
- **shiny** — full web app framework
- **htmlwidgets** — embed JS visualizations
- **rmarkdown** — embed interactive plots in documents

---

## Shiny (Web Applications)

### Getting Started
1. **Basic structure**: ui + server + shinyApp()
2. **Reactivity**: reactive(), observe(), eventReactive()
3. **Layouts**: fluidPage, sidebarLayout, navbarPage
4. **Inputs/outputs**: selectInput, sliderInput, plotOutput, tableOutput

### Resources
- **Official**: shiny.rstudio.com/tutorial + reference
- **Advanced**: Shiny modules for reusable components
- **Dashboard**: shinydashboard, bs4Dash, bslib (modern Bootstrap 5)
- **Mobile**: shinyMobile (iOS-style apps)
- **Examples**: shiny-apps/ repos from RStudio

### Deployment
- **ShinyApps.io** — cloud hosting (rstudio.com)
- **Shiny Server** — self-hosted (open source or pro)
- **Docker** — containerized shiny apps
- **GitHub Pages** — static content only (use flexdashboard)

---

## Machine Learning Workflow

### End-to-End Example

```r
# 1. Data exploration (exploratory data analysis)
library(tidyverse)
data %>% summary()
data %>% ggplot(aes(x, y)) + geom_point()

# 2. Preprocessing (caret or tidymodels)
library(caret)
set.seed(123)
trainIndex <- createDataPartition(y, p=0.8, list=FALSE)
train <- data[trainIndex,]
test <- data[-trainIndex,]

# 3. Model training
ctrl <- trainControl(method="cv", number=5)
model <- train(y ~ ., data=train, method="rf", trControl=ctrl)

# 4. Evaluation
pred <- predict(model, test)
confusionMatrix(pred, test$y)

# 5. Visualization (feature importance, ROC curves, etc.)
varImp(model) %>% plot()
```

### Model Interpretability
- **SHAP values**: explainer packages (shapr, shapley)
- **Partial dependence**: pdp, vip
- **LIME**: local interpretable model-agnostic explanations
- **modelStudio** — interactive explanations

---

## NLP & Text Mining

### Korean Text Processing
- **KoNLP** — Korean morphological analyzer
- **RmecabKo** — MeCab-based tokenization
- **DNH4** — Naver/Daum comment crawling
- **N2H4** — Naver news collection

### English Text Mining
- **tidytext** — tidy text format (ggplot2 compatible)
- **tm** — classic text mining package
- **rvest** — web scraping HTML
- **rtweet** — Twitter API access

### Advanced NLP
- **word2vec**, **GloVe** — word embeddings
- **fastText** — subword embeddings
- **keras** with LSTM — sequence models
- **transformers** via reticulate — BERT, GPT

---

## Domain-Specific Applications

### Finance & Investing
- **quantmod** — technical analysis
- **tidyquant** — quantitative finance with tidyverse
- **PerformanceAnalytics** — portfolio performance
- **tqk** — Korean stock market data
- **xts, zoo** — time series objects

### Sports Analytics
- **Lahman** — baseball statistics
- **sab-R-metrics** — sabermetrics functions
- **football** packages — sports data

### Real Estate & GIS
- **sf** — spatial analysis
- **rtmolitr** — Korean real estate data (부동산 매매)
- **ggmap** — location mapping
- **spatial** packages — geographic analysis

### Bioinformatics
- **Bioconductor** — genomics ecosystem
- **ggbio** — genomic data visualization
- **tidybiology** — tidy genomics workflows

### Time Series & Forecasting
- **forecast** — ARIMA, exponential smoothing
- **fpp2/fpp3** — Hyndman's forecasting course
- **prophet** (via reticulate) — Facebook's forecasting
- **timetk** — time series features

---

## Best Practices & Workflow

### Code Quality
- **Google R Style Guide** — naming, formatting conventions
- **lintr** — code linting
- **styler** — automatic code formatting
- **roxygen2** — documentation from code comments

### Reproducibility
- **rmarkdown** — dynamic documents
- **Distill** — scientific publishing format
- **targets** — pipeline management (drake alternative)
- **renv** — dependency management

### Performance & Optimization
- **microbenchmark** — timing code
- **profvis** — CPU profiling
- **data.table** — 0.3s vs 8s for large data
- **fst** — fast serialization

### Package Development
- **usethis** — package scaffolding
- **devtools** — development tools
- **testthat** — unit testing framework
- **pkgdown** — auto-generated package sites

---

## Advanced Topics

### Parallel Computing
- **future** — asynchronous programming
- **parallel** — base R parallelization
- **furrr** — purrr + future
- **sparklyr** — Spark from R

### Cloud & Docker
- **RStudio Cloud** — browser-based RStudio
- **rocker** — Docker images with R
- **plumber** — REST APIs from R functions
- **shinyapps.io** — hosted Shiny apps

### Interop with Python
- **reticulate** — call Python from R
- **rpy2** — call R from Python
- **keras** — TensorFlow models
- **tensorflow** — direct TensorFlow access

### Bayesian Methods
- **rstan**, **brms** — Hamiltonian MCMC
- **bayesplot** — Bayesian visualization
- **tidybayes** — tidy Bayesian workflows

---

## Tools & IDEs

### RStudio
- **RStudio Desktop** — local IDE
- **RStudio Server** — browser-based (AWS, Docker)
- **RStudio Cloud** — cloud-based (free tier)
- **Add-ins**: esquisse (plotting), regexplain (regex), etc.

### Alternative IDEs
- **VS Code with R** — lightweight editor
- **Jupyter** — Jupyter notebooks with R kernel
- **Emacs/ESS** — powerful for advanced users

### Version Control
- **git** — version control system
- **GitHub** — collaboration platform
- **RStudio + git** — seamless integration
- **usethis** — git/GitHub helpers

---

## Community & Events

### Conferences
- **rstudio::conf** — annual RStudio conference
- **useR!** — international R user conference
- **RUCK** (Korean) — R User Conference Korea
- **Seoul R Meetup** — monthly meetups
- **Data Conference** — regional events

### Online Communities
- **Stack Overflow** — #r tag for Q&A
- **r/datascience** — Reddit community
- **RStudio Community** — official forums
- **R-bloggers** — blog aggregator

### Learning Communities
- **R4DS Online Learning Community** — book club style
- **TidyTuesday** — weekly data viz challenge
- **Kaggle** — competitions + datasets
- **DataCamp** — interactive courses

---

## Quick Reference Checklists

### Starting a New R Project
- [ ] Create RStudio project
- [ ] Initialize git repository
- [ ] Create project structure (R/, data/, output/)
- [ ] Set up .Rprofile for paths
- [ ] Create README.md
- [ ] List dependencies in requirements.txt or use renv

### Building a Data Analysis
- [ ] Load and explore data (tidyverse)
- [ ] Visualize distributions and relationships (ggplot2)
- [ ] Handle missing data
- [ ] Feature engineering
- [ ] Fit models (caret or tidymodels)
- [ ] Evaluate and compare models
- [ ] Generate report (R Markdown)

### Publishing R Work
- [ ] Write R Markdown / Distill
- [ ] Add code comments and docstrings
- [ ] Create pkgdown site if it's a package
- [ ] Push to GitHub with README
- [ ] Share on r-bloggers or RStudio Community

---

## Resource Organization by Skill Level

### Beginner (0-3 months)
Start with: R for Data Science, basic tidyverse, ggplot2 tutorial, YouTube channels

### Intermediate (3-12 months)
Add: Statistical testing, machine learning basics, Shiny fundamentals, package development

### Advanced (12+ months)
Explore: Bayesian methods, performance optimization, cloud deployment, specialized domains

---

## Summary

R has a rich ecosystem with **500+ resources** covering:
- ✅ Learning from beginner to expert
- ✅ 50+ visualization techniques
- ✅ Machine learning frameworks
- ✅ Web app development (Shiny)
- ✅ Text analysis and NLP
- ✅ Geographic/spatial analysis
- ✅ Finance, sports, and domain-specific applications
- ✅ Reproducible research workflows
- ✅ Professional package development

**Best practice**: Start with tidyverse (dplyr + ggplot2), then expand to specialized packages based on your domain.

**Time to productivity**: 2-4 weeks for basic data analysis, 3-6 months for professional data science work.


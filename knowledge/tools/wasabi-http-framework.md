# Wasabi: Kotlin HTTP Framework (Archived → Ktor)

Lightweight HTTP framework for the JVM, built with Kotlin. Combines Kotlin's expressiveness, Netty's performance, and an Express.js/Sinatra-inspired routing API.

## ⚠️ Status: Merged into Ktor — Use Ktor Instead

**Wasabi is no longer actively developed.** The core team (@swishy, @hhariri) merged efforts with **[Ktor](https://github.com/kotlin/ktor)** (JetBrains' official Kotlin HTTP framework). Ktor was significantly *influenced by* Wasabi and shares the same goals, so migration is straightforward.

- **For new Kotlin HTTP services → use Ktor**, not Wasabi.
- Wasabi was explicitly "in development… not ready for production" even at its peak.
- This doc is kept for **reference** (the API design is genuinely instructive, and Ktor inherits much of it).

Community: Kotlin Slack (kotlinlang.slack.com). License: Apache 2.0.

## What It Is / Isn't

| | |
|---|---|
| **Is** | An HTTP framework for back-end services / HTTP APIs |
| **Is not** | An MVC framework (no view engine/templating — pair with Angular/Ember, or use [Kara](http://www.karaframework.com) for MVC) |
| **Is not** | A REST framework (provides resource-oriented features but doesn't claim REST) |

## Hello World

```kotlin
var server = AppServer()
server.get("/", { response.send("Hello World!") })
server.start()
```

## Core Concepts

### AppServer
Each app = one `AppServer` with a routing table. Supports GET, POST, PUT, DELETE, OPTIONS, HEAD.

```kotlin
var server = AppServer()
server.get("/customers", { /* ... */ })
server.post("/customer", { /* ... */ })
server.start()
```

### Route Handlers (chainable)
Every request runs through one or more handlers. Call `next()` to continue the chain. Each handler is an extension function on `RouteHandler`, so `request`/`response` are in scope implicitly.

```kotlin
server.get("/",
  {
    val log = Log()
    log.info("URI requested is ${request.uri}")
    next()
  },
  { response.send("Hello World!") }
)
```

Verb signature:
```kotlin
fun get(path: String, vararg handlers: RouteHandler.() -> Unit) {
  addRoute(HttpMethod.GET, path, *handlers)
}
```

### Parameters

```kotlin
// Route params  /customer/:id
server.get("/customer/:id", { val id = request.routeParams["id"] })

// Query params  /customer?name=Joe
server.get("/customer", { val name = request.queryParams["name"] })

// Form params (POST body)
server.post("/customer", { val name = request.bodyParams["name"] })
```

### Handler Organization (preferred: routing-table style)

```kotlin
// CustomerRouteHandlers.kt — top-level functions, no class needed
val getCustomers = routeHandler { response.send(customers) }
val getCustomerById = routeHandler { /* ... */ }

// Wire-up reads like a routing table
appServer.get("/customer", getCustomers)
```

`routeHandler { }` is sugar for `val x: RouteHandler.() -> Unit = { }`. Class grouping is possible via companion objects but top-level functions are idiomatic.

## Interceptors (not "middleware")

Intercept requests; return `true` to continue, `false` to stop. Registered with a path (`*` = all routes) and a position.

```kotlin
interface Interceptor {
  fun intercept(request: Request, response: Response): Boolean
}

server.interceptor(MyInterceptor(), path, position)

enum class InterceptOn { PreRequest, PreExecution, PostExecution, PostRequest, Error }
```

**Built-in interceptors:**
- `BasicAuthenticationInterceptor` — basic auth
- `ContentNegotiationInterceptor` — automatic content negotiation
- `FavIconInterceptor` — favicon
- `StaticFileInterceptor` — serve static files
- `LoggingInterceptor` — logging
- `FileBasedErrorInterceptor` — convention-based error pages (e.g. `404.html`)
- `SessionManagementInterceptor` — sessions

Many add descriptive extension methods:
```kotlin
server.negotiateContent()
server.serveStaticFilesFromFolder("/public")
```

## Content Negotiation

Enabled by default. Two interceptors:
- **ContentNegotiationParserInterceptor** — sources beyond Accept headers (query field, extension)
- **ContentNegotiationInterceptor** — picks the serializer

```kotlin
// Priority follows call order: query param → extension → accept header
server.parseContentNegotiationHeaders {
    onQueryParameter("format")  // defaults to "format"
    onExtension()               // json→application/json, xml→application/xml
    onAcceptHeader()
}

// Automatic: just send an object, Wasabi serializes per negotiation
server.get("/customer/:id", {
  val customer = getCustomerById(request.params["id"])
  response.send(customer)
})

// Manual override
server.get("/customer/:id", {
  val customer = getCustomerById(request.params["id"])
  response.negotiate(
    "text/html"        with { send("Joe Smith") },
    "application/json"  with { send(customer) }
  )
})
```

`negotiate(vararg negotiations: Pair<String, Response.() -> Unit>)` — extension on `Response`, so `send` is callable directly.

### Serializers
Ships with JSON (XML TODO). Each takes regex media-type patterns:
```kotlin
class JsonSerializer(): Serializer("application/json", "application/vnd\\.\\w*\\+json")
```

## CORS

```kotlin
// All routes/verbs/origins
server.enableCORSGlobally()
// Or fine-grained
server.enablesCORS(/* ...CORSEntry... */)

class CORSEntry(
  val path: String = "*",
  val origins: String = "*",
  val methods: String = "GET, POST, PUT, DELETE",
  val headers: String = "Origin, X-Requested-With, Content-Type, Accept",
  val credentials: String = "",
  val preflightMaxAge: String = ""
)
```

## Auto OPTIONS
```kotlin
server.enableAutoOptions()  // or AppConfiguration.enableAutoOptions
```

## Exception Handlers (by type)
```kotlin
appServer.exception(MyKewlException::class, {
  response.setStatus(418, "My brew is not as strong as yours!")
  response.send("Out of beans: ${exception.message}")
})
```
Handler receives `request`, `response`, and `exception`.

## WebSocket Support (initial)
Auto handshake + socket upgrade. Multiple channels per server, one handler per channel.

```kotlin
// Direct reply
appServer.channel("/foo", {
  if (frame is TextWebSocketFrame) {
    val t = frame as TextWebSocketFrame
    respond(ctx!!.channel(), TextWebSocketFrame(t.text().toUpperCase()))
  }
})

// Broadcast within channel
appServer.channel("/foo", {
  if (frame is TextWebSocketFrame) {
    val t = frame as TextWebSocketFrame
    broadcast(TextWebSocketFrame(t.text().toUpperCase()))
  }
})

// Trigger broadcast from an HTTP route
appServer.post("/message", {
  val message = request.bodyParams["message"]
  broadcast("/foo", TextWebSocketFrame(message))
  response.send()
})
```

## Dependency (Gradle, historical)
```groovy
repositories {
    mavenCentral()
    maven { url 'https://dl.bintray.com/wasabifx/wasabifx/' }  // Bintray (now sunset)
}
```
Note: Bintray shut down in 2021, so resolving Wasabi artifacts may require a mirror — another reason to prefer Ktor.

## Relevance to This Ecosystem

This ecosystem is **TypeScript/Next.js/Python-first** (see CLAUDE.md): STARLIGHTMIX Studio is Next.js, Nucleus is Python Pydantic AI, Workers are JS. There's no JVM/Kotlin service today.

**If a JVM HTTP service ever becomes useful** (e.g., a high-throughput Netty-based API, or a WebSocket gateway for live RHYTHMIX features), reach for **Ktor** — it's the maintained successor, has the same ergonomic routing/interceptor model shown here, and integrates with the Kotlin toolchain. Wasabi's value now is as a design reference: its interceptor positions (`PreRequest`/`PreExecution`/`PostExecution`/`PostRequest`/`Error`) and content-negotiation-by-source (header/extension/query) are clean patterns worth borrowing even in TS frameworks.

## References

- **Wasabi (archived)**: github.com/wasabifx/wasabi
- **Ktor (successor — use this)**: https://github.com/kotlin/ktor
- **Kara (Kotlin MVC alternative)**: http://www.karaframework.com
- **License**: Apache 2.0

---

**Use Case for Ecosystem:** Reference only — Wasabi is archived and merged into Ktor. Documented for its instructive API design (chainable route handlers, typed interceptor positions, multi-source content negotiation). For any future JVM/Kotlin HTTP or WebSocket service in this ecosystem, use **Ktor**, not Wasabi.

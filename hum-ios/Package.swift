// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "HumApp",
    platforms: [.iOS(.v16), .macOS(.v13)],
    products: [
        .library(name: "HumApp", targets: ["HumApp"]),
    ],
    targets: [
        .target(name: "HumApp", path: "Sources/HumApp"),
        .testTarget(name: "HumAppTests", dependencies: ["HumApp"], path: "Tests/HumAppTests"),
    ]
)

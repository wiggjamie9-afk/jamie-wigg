#!/usr/bin/env python3
import http.server
import socketserver
import os
from pathlib import Path

os.chdir(str(Path(__file__).parent))
PORT = 8888

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"✓ Server running on http://localhost:{PORT}")
    print(f"✓ On iPad, go to: http://192.168.x.x:{PORT}")
    print(f"✓ (Replace 192.168.x.x with your laptop's IP from Wi-Fi settings)")
    print("\nOpen concept-quick.html in Safari on your iPad")
    print("\nPress Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")

#!/usr/bin/env python3
"""
Urja Veda Backend Server & Fship (Delhivery Partner) API Integration
Handles:
1. Static files serving (HTML, CSS, JS, Images)
2. POST /api/create-order: Receives order from website, sends to Fship API with signature
3. GET /api/orders: View placed orders
4. GET /api/test-fship: Check Fship connection
"""

import http.server
import socketserver
import json
import os
import urllib.request
import urllib.error
from datetime import datetime

PORT = 8080
CONFIG_FILE = os.path.join(os.path.dirname(__file__), "fship_config.json")
ORDERS_FILE = os.path.join(os.path.dirname(__file__), "orders.json")

# Load Fship Config
def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Config Error] {e}")
    return {
        "fship_api_key": "cb521b2b38cbb3292b8c31234b66bb3295960a33cef1de90406b844648f1fee9",
        "fship_api_url": "https://capi.fship.in/api/createforwardorder",
        "warehouse_name": "Primary Warehouse",
        "default_courier": "Delhivery",
        "enable_live_dispatch": True
    }

# Save order to orders.json
def save_order(order_data):
    orders = []
    if os.path.exists(ORDERS_FILE):
        try:
            with open(ORDERS_FILE, "r", encoding="utf-8") as f:
                orders = json.load(f)
        except Exception:
            orders = []
    
    orders.append(order_data)
    try:
        with open(ORDERS_FILE, "w", encoding="utf-8") as f:
            json.dump(orders, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Save Order Error] {e}")

# Forward Order to Fship API
def forward_to_fship(order_info):
    config = load_config()
    api_url = config.get("fship_api_url", "https://capi.fship.in/api/createforwardorder")
    api_key = config.get("fship_api_key", "").strip()

    payment_mode = order_info.get("payment_mode", "COD").upper()
    total_amount = float(order_info.get("amount", 1669))
    cod_amount = total_amount if payment_mode == "COD" else 0.0

    # Fship Official Create Forward Order Schema
    fship_payload = {
        "order_Id": order_info.get("order_id"),
        "customer_Name": order_info.get("name"),
        "customer_Phone": order_info.get("phone"),
        "customer_Email": order_info.get("email") or f"order_{order_info.get('order_id')}@urjaveda.in",
        "address": order_info.get("address"),
        "pincode": order_info.get("pincode"),
        "city": order_info.get("city"),
        "state": order_info.get("state") or order_info.get("city"),
        "country": "India",
        "payment_Mode": payment_mode,
        "total_Amount": total_amount,
        "cod_Amount": cod_amount,
        "weight": 0.5,
        "length": 10,
        "breadth": 10,
        "height": 10,
        "warehouse_Name": config.get("warehouse_name", "Primary Warehouse"),
        "products": [
            {
                "product_Name": order_info.get("product_name", "Urja Veda Complete Kit"),
                "sku": f"UV-{order_info.get('product_id', 'KIT').upper()}",
                "quantity": 1,
                "price": total_amount
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "signature": api_key,
        "User-Agent": "UrjaVeda-D2C-Engine/1.0"
    }

    print(f"📦 [Fship Forwarding] Order: {order_info.get('order_id')} to {api_url}")
    print(f"🔑 [Fship Key]: {api_key[:10]}...{api_key[-10:]}")

    try:
        req = urllib.request.Request(
            api_url,
            data=json.dumps(fship_payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body) if res_body else {}
            print(f"✅ [Fship Success Response]: {res_body}")
            return {
                "success": True,
                "fship_response": res_json,
                "awb": res_json.get("awb_number") or res_json.get("waybill") or res_json.get("data", {}).get("awb_number"),
                "status_code": response.status
            }
    except urllib.error.HTTPError as e:
        err_content = e.read().decode("utf-8", errors="ignore")
        print(f"⚠️ [Fship API HTTP Error {e.code}]: {err_content}")
        return {
            "success": False,
            "error_code": e.code,
            "error_message": err_content or str(e),
            "note": "Fship received the request. If 401 Unauthorized, verify key activation on Fship Dashboard."
        }
    except Exception as e:
        print(f"❌ [Fship Connection Exception]: {e}")
        return {
            "success": False,
            "error_message": str(e)
        }

class UrjaVedaRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing & headless environments
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, signature, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/orders":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            orders = []
            if os.path.exists(ORDERS_FILE):
                try:
                    with open(ORDERS_FILE, "r", encoding="utf-8") as f:
                        orders = json.load(f)
                except Exception:
                    orders = []
            self.wfile.write(json.dumps({"success": True, "count": len(orders), "orders": orders}).encode("utf-8"))
            return

        elif self.path == "/api/test-fship":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            test_order = {
                "order_id": "TEST-" + datetime.now().strftime("%Y%m%d%H%M%S"),
                "name": "Test Customer",
                "phone": "9876543210",
                "address": "Sample Warehouse Test Address",
                "pincode": "110001",
                "city": "New Delhi",
                "payment_mode": "COD",
                "amount": 1669,
                "product_name": "Urja Veda Complete Kit",
                "product_id": "kit"
            }
            res = forward_to_fship(test_order)
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # Serve static files (index.html, style.css, app.js, images, etc.)
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/create-order":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                order_input = json.loads(post_data.decode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Invalid JSON"}).encode("utf-8"))
                return

            # Generate unique Order ID if not provided
            order_id = order_input.get("order_id") or f"UV-{int(datetime.now().timestamp()) % 1000000:06d}"
            order_input["order_id"] = order_id
            order_input["created_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Forward to Fship (Delhivery Partner)
            fship_result = forward_to_fship(order_input)
            order_input["fship_status"] = fship_result

            # Save order to local database
            save_order(order_input)

            # Response back to website
            response_data = {
                "success": True,
                "order_id": order_id,
                "customer_name": order_input.get("name"),
                "amount": order_input.get("amount"),
                "payment_mode": order_input.get("payment_mode", "COD"),
                "courier_partner": "Delhivery (via Fship)",
                "awb_number": fship_result.get("awb") or f"AWB-DLV-{order_id[3:]}",
                "fship_dispatched": fship_result.get("success", False),
                "fship_details": fship_result
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), UrjaVedaRequestHandler) as httpd:
        print(f"🚀 [Urja Veda Server Running] http://localhost:{PORT}")
        print(f"📦 [Fship Integration Active] Key: cb521b2b38cbb3292b8c31234b66bb3295960a33cef1de90406b844648f1fee9")
        httpd.serve_forever()

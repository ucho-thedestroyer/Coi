import os
import time
import requests
import pandas as pd

# === Secure API Key Setup ===
API_KEY = os.getenv('API_KEY')
if not API_KEY:
    raise ValueError("Set your Coinalyze API_KEY in your environment.")

headers = {"api_key": API_KEY}

# === User Configuration ===
symbols = "BTCUSD_PERP.0"
interval = "15min"
to_ts = int(time.time())
from_ts = to_ts - 86400  # last 24 hours

BASE = "https://api.coinalyze.net/v1"

ENDPOINTS = {
    "ohlcv": f"{BASE}/ohlcv/history?symbols={symbols}&interval={interval}&from={from_ts}&to={to_ts}",
    "open_interest": f"{BASE}/open-interest/history?symbols={symbols}&interval={interval}&from={from_ts}&to={to_ts}&convert_to_usd=false",
    "acvd_futures": f"{BASE}/aggregated-cvd/history?symbols={symbols}&interval={interval}&from={from_ts}&to={to_ts}&type=futures",
    "acvd_spot": f"{BASE}/aggregated-cvd/history?symbols={symbols}&interval={interval}&from={from_ts}&to={to_ts}&type=spot",
    "vwap": f"{BASE}/vwap/history?symbols={symbols}&interval={interval}&from={from_ts}&to={to_ts}"
}

def fetch(name, url):
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"[✖] {name} failed ({r.status_code}): {r.text}")
        return None
    data = r.json().get(symbols)
    if not data or "data" not in data:
        print(f"[!] {name} returned no data for {symbols}")
        return None
    print(f"[✔] {name} returned {len(data['data'])} records")
    return pd.DataFrame(data["data"])

# Fetch data
oh = fetch("OHLCV", ENDPOINTS["ohlcv"])
oi = fetch("Open Interest", ENDPOINTS["open_interest"])
af = fetch("ACVD Futures", ENDPOINTS["acvd_futures"])
as_ = fetch("ACVD Spot", ENDPOINTS["acvd_spot"])
vw = fetch("VWAP", ENDPOINTS["vwap"])

# Merge datasets
if oh is not None:
    oh.columns = ["timestamp", "open", "high", "low", "close", "volume"]
    oh["timestamp"] = pd.to_datetime(oh["timestamp"], unit="s")

    def prep(df, name):
        if df is None:
            return None
        df.columns = ["timestamp", name]
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s")
        return df

    pieces = [prep(oi, "open_interest"), prep(af, "acvd_futures"),
              prep(as_, "acvd_spot"), prep(vw, "vwap")]

    for df in pieces:
        if df is not None:
            oh = oh.merge(df, on="timestamp", how="left")

    print("\n🧩 Merged Data (last 10 rows):")
    print(oh.tail(10))
    oh.to_csv("coinalyze_full.csv", index=False)
    print("\n✨ Saved to coinalyze_full.csv")

else:
    print("❌ OHLCV failed—cannot proceed.")

import requests
import pandas as pd

# === INSERT YOUR API KEY HERE (safely) ===
API_KEY = 'your_api_key_here'

# === CONFIGURATION ===
SYMBOL = 'BTCUSD.P'     # Perpetual futures pair
INTERVAL = '15m'        # Options: 1m, 5m, 15m, 1h, etc.

# === HEADERS ===
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

# === ENDPOINTS ===
BASE_URL = 'https://api.coinalyze.net/v1'

endpoints = {
    'ohlcv': f'{BASE_URL}/ohlcv?symbol={SYMBOL}&interval={INTERVAL}',
    'acvd_futures': f'{BASE_URL}/aggregated-cvd?symbol={SYMBOL}&interval={INTERVAL}&type=futures',
    'acvd_spot': f'{BASE_URL}/aggregated-cvd?symbol={SYMBOL}&interval={INTERVAL}&type=spot',
    'open_interest': f'{BASE_URL}/open-interest?symbol={SYMBOL}&interval={INTERVAL}',
    'vwap': f'{BASE_URL}/vwap?symbol={SYMBOL}&interval={INTERVAL}'
}

# === FUNCTION TO FETCH AND HANDLE DATA ===
def fetch_data(url, name):
    r = requests.get(url, headers=headers)
    if r.status_code == 200:
        print(f"[✓] {name} loaded.")
        return pd.DataFrame(r.json()['data'])
    else:
        print(f"[!] {name} failed: {r.status_code} - {r.text}")
        return None

# === FETCH ALL DATA ===
ohlcv_df       = fetch_data(endpoints['ohlcv'], 'OHLCV')
acvd_futures   = fetch_data(endpoints['acvd_futures'], 'ACVD Futures')
acvd_spot      = fetch_data(endpoints['acvd_spot'], 'ACVD Spot')
oi_df          = fetch_data(endpoints['open_interest'], 'Open Interest')
vwap_df        = fetch_data(endpoints['vwap'], 'VWAP')

# === PREPARE OHLCV BASE TABLE ===
if ohlcv_df is not None:
    ohlcv_df.columns = ['timestamp', 'open', 'high', 'low', 'close', 'volume']
    ohlcv_df['timestamp'] = pd.to_datetime(ohlcv_df['timestamp'], unit='s')

    # === Merge Extra Metrics on Timestamp ===
    def prepare(df, name):
        df.columns = ['timestamp', name]
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')
        return df

    for df, name in zip([acvd_futures, acvd_spot, oi_df, vwap_df], 
                        ['acvd_futures', 'acvd_spot', 'open_interest', 'vwap']):
        if df is not None:
            df_clean = prepare(df, name)
            ohlcv_df = ohlcv_df.merge(df_clean, on='timestamp', how='left')

    # === Show Last 10 Candles ===
    print("\n=== Last 10 Candles ===")
    print(ohlcv_df.tail(10))

    # === Optional: Save to CSV ===
    ohlcv_df.to_csv('btc_full_15m.csv', index=False)
else:
    print("❌ OHLCV fetch failed — no base data to merge into.")

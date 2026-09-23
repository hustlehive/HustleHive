import requests
import time

hustle_ids = [
    "6ab2297b49e08f291e44035a",
    "6ab2299f49e08f291e44035b",
    "6ab229a649e08f291e44035c",
    "6ab229af49e08f291e44035d",
    "6ab229b549e08f291e44035e",
    "6ab229bb49e08f291e44035f",
    "6ab229c149e08f291e440360",
    "6ab229c849e08f291e440361",
    "6ab229cd49e08f291e440362",
    "6ab229da49e08f291e440363",
    "6ab229e149e08f291e440364",
    "6ab229e749e08f291e440365",
    "6ab229ef49e08f291e440366",
    "6ab229f549e08f291e440367",
    "6ab229fb49e08f291e440368",
    "6ab22a0249e08f291e440369",
    "6ab22a0a49e08f291e44036a",
    "6ab22a0f49e08f291e44036b",
    "6ab22a1949e08f291e44036c",
    "6ab22a2249e08f291e44036d",
    "6ab22a2949e08f291e44036e",
    "6ab22a2e49e08f291e44036f",
    "6ab22a3549e08f291e440370",
    "6ab22a3b49e08f291e440371",
    "6ab22a4049e08f291e440372",
    "6ab22a4649e08f291e440373",
    "6ab22a4b49e08f291e440374",
    "6ab22a6949e08f291e440375",
    "6ab22a6f49e08f291e440376",
    "6ab22a7749e08f291e440377",
    "6ab22a7c49e08f291e440378",
    "6ab22a8249e08f291e440379",
    "6ab22a8849e08f291e44037a",
    "6ab22a8e49e08f291e44037b",
    "6ab22a9449e08f291e44037c",
    "6ab22a9a49e08f291e44037d",
    "6ab22aa149e08f291e44037e",
    "6ab22aa749e08f291e44037f",
    "6ab22acd49e08f291e440380",
    "6ab22ad549e08f291e440381",
    "6ab22adc49e08f291e440382",
    "6ab22ae349e08f291e440383",
    "6ab22aeb49e08f291e440384",
    "6ab22af249e08f291e440385",
    "6ab22af849e08f291e440386",
    "6ab22b0049e08f291e440387",
    "6ab22b0649e08f291e440388"
]

count = 0

URL = "http://localhost:5000/api/ai/test-hustle-vector"

TOKEN = "YOUR_AUTH_TOKEN"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNWJhY2MyNGUxM2U2YWJjYWIzMmI1MyIsImlhdCI6MTc5MDA0ODg3MCwiZXhwIjoxNzkyNjQwODcwfQ.EpbOK4JvTtgqElW3tX3cV0uzOg1hknClC_0dZOFqlUw"
}

for hustle_id in hustle_ids:
    body = {
        "hustleId": hustle_id
    }

    try:
        response = requests.post(
            URL,
            headers=headers,
            json=body
        )
        count+=1

        print(
            f"Hustle ID: {hustle_id} -> "
            f"status code: {response.status_code} -> "
            f"response: {response.text}"
            f"Count: {count}"
        )
        time.sleep(3)

    except requests.RequestException as e:
        print(f"{hustle_id} -> ERROR: {e}")
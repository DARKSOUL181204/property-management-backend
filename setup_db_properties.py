import requests
import time
import uuid

# Wait for backend to be up
for i in range(15):
    try:
        requests.get("http://localhost:8080/api/properties")
        break
    except:
        time.sleep(2)

properties = [
    {
        "name": "Sunset Paradise Villas",
        "propertyType": "RESIDENTIAL",
        "totalUnits": 50,
        "status": "AVAILABLE"
    },
    {
        "name": "Skyline Corporate Towers",
        "propertyType": "COMMERCIAL",
        "totalUnits": 200,
        "status": "AVAILABLE"
    },
    {
        "name": "Grand Avenue Mall",
        "propertyType": "COMMERCIAL",
        "totalUnits": 120,
        "status": "AVAILABLE"
    },
    {
        "name": "Green Valley Estates",
        "propertyType": "RESIDENTIAL",
        "totalUnits": 30,
        "status": "AVAILABLE"
    }
]

for p in properties:
    response = requests.post("http://localhost:8080/api/properties", json=p)
    print(f"Created {p['name']}: {response.status_code}")


import mysql.connector
try:
    conn = mysql.connector.connect(host="localhost", user="root", password="Divyansh@12", database="Property_Management")
    cursor = conn.cursor()
    cursor.execute("DESCRIBE property;")
    for row in cursor.fetchall():
        print(row)
    conn.close()
except Exception as e:
    print(e)

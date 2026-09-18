import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="Divyansh@12",
        database="Property_Management"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT email, password FROM user")
    users = cursor.fetchall()
    print("Users in DB:", users)
    conn.close()
except Exception as e:
    print(e)

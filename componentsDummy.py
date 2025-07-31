import sqlite3

components = [
    ("Resistor 1kΩ", 100, "1 kilo ohm, 1/4 watt"),
    ("Resistor 10kΩ", 150, "10 kilo ohm, 1/4 watt"),
    ("Resistor 220Ω", 200, "220 ohm for LED current limiting"),

    ("Capacitor 100nF", 120, "Ceramic capacitor"),
    ("Capacitor 10uF", 80, "Electrolytic capacitor"),
    ("Capacitor 470uF", 60, "Electrolytic capacitor for power filter"),

    ("IC 555 Timer", 40, "Popular timer IC"),
    ("IC 7400 NAND", 30, "Quad 2-input NAND gate"),
    ("IC ATmega328P", 10, "Microcontroller used in Arduino UNO"),

    ("Transistor BC547", 70, "NPN small signal transistor"),
    ("Transistor 2N2222", 50, "General-purpose NPN transistor"),
    ("MOSFET IRF540N", 35, "Power N-channel MOSFET"),

    ("Diode 1N4007", 100, "General-purpose rectifier diode"),
    ("Zener Diode 5.1V", 50, "Zener voltage regulator"),

    ("LED Red 5mm", 200, "Standard red LED"),
    ("LED Green 5mm", 180, "Standard green LED"),
    ("LED RGB", 40, "Common cathode RGB LED"),

    ("Jumper Wire Male-Male", 500, "40 pcs jumper wire"),
    ("Header Pin 40x1", 120, "Breakable male header"),
    ("Screw Terminal 2-pin", 60, "For power connection"),

    ("DHT11 Sensor", 20, "Temperature and humidity sensor"),
    ("IR Sensor Module", 25, "Obstacle detection sensor"),
    ("Ultrasonic HC-SR04", 15, "Distance measurement sensor"),

    ("9V Battery Clip", 30, "Connector for 9V battery"),
    ("DC Barrel Jack", 40, "2.1mm jack for power input"),
    ("LM7805 Regulator", 25, "5V linear voltage regulator"),

    ("Potentiometer 10k", 35, "Variable resistor"),
    ("Crystal 16MHz", 50, "Used for MCU clock"),
    ("Push Button", 150, "Tactile switch"),
    ("Breadboard Mini", 20, "170 points"),
]

conn = sqlite3.connect("backend/inventory.db")
cursor = conn.cursor()

for name, qty, desc in components:
    cursor.execute(
        "INSERT INTO components (name, quantity, description) VALUES (?, ?, ?)",
        (name, qty, desc)
    )

conn.commit()
conn.close()

print(f"{len(components)} components successfully inserted into the database.")

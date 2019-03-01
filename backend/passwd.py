#!/usr/bin/python3
import hashlib
from getpass import getpass

def encrypt_string(hash_string):
    sha_signature = hashlib.sha256(hash_string.encode()).hexdigest()
    return sha_signature

password = getpass("Enter a password: ")
properties = open("admin.properties", "w")
properties.write("passhash=" + encrypt_string(password).lower())
properties.close()

print("Password updated!")

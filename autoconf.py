#!/usr/bin/python3
import subprocess
from subprocess import CalledProcessError
import hashlib
import os
from getpass import getpass
import argparse

default_authorisation_url = "https://www.facebook.com/v3.2/dialog/oauth"
default_graph_url = "https://graph.facebook.com/v3.2/"

parser = argparse.ArgumentParser(description='Configure the Heroes in Conference server')
parser.add_argument('--clean', dest="clean", action='store_true',
        help='run a clean build')
parser.add_argument('--update-schema', dest='update_schema', action='store_true',
        help='update the database schema')
parser.add_argument('--mysql-host', metavar='HOST', dest='mysql_host', type=str,
        help="MySQL host", default="localhost")
parser.add_argument('--mysql-user', metavar='USER', dest='mysql_user', type=str, 
        help="MySQL username", default=None)
parser.add_argument('--database', metavar='DB', dest='database_name', type=str, 
        help="MySQL database name", default=None)
parser.add_argument('--oauth-url', metavar='URL', dest='oauth_url', type=str,
        help="the Facebook OAuth authorisation URL", default=default_authorisation_url)
parser.add_argument('--graph-api-url', metavar='URL', dest='graph_url', type=str,
        help="the Facebook graph API URL", default=default_graph_url)
parser.add_argument('--client-id', metavar='ID', dest='client_id', type=str,
        help="the Facebook OAuth client ID", default=None)
parser.add_argument('--update-password', dest='update_password', action='store_true', 
        help="update the administrator password")
args = parser.parse_args()

def encrypt_string(hash_string):
    sha_signature = hashlib.sha256(hash_string.encode()).hexdigest()
    return sha_signature

print("Updating server...")
subprocess.run(["git", "pull"])

os.chdir("./backend/")
if args.clean:
    subprocess.run(["mvn", "clean"])
subprocess.run(["mvn", "compile", "test"])

database_details_required = (args.mysql_user is not None
                            or args.database_name is not None
                            or args.update_schema 
                            or not os.path.isfile("database.properties")
                            or args.clean)

if args.database_name is None and database_details_required:
    args.database_name = input("Enter MySQL database name: ")

if args.mysql_user is None and database_details_required:
    args.mysql_user = input("Enter MySQL username: ")

if database_details_required:
    mysql_password = getpass("Enter password for MySQL user '" + args.mysql_user + "': ")

if database_details_required:
    database = open("database.properties", "w")
    database.write("driver=com.mysql.cj.jdbc.Driver\n")
    database.write("url=mysql://" + args.mysql_host + "\n")
    database.write("database=" + args.database_name + "\n")
    database.write("user=" + args.mysql_user + "\n")
    database.write("pass=" + mysql_password + "\n")
    database.close()

if args.update_schema or args.clean:
    print("Updating schema...")
    subprocess.run(["mysql", "-u", args.mysql_user, "-p" + mysql_password, args.database_name], 
            stdin=open('schema.sql'))
    print("Resetting achievements...")
    subprocess.run(["mysql", "-u", args.mysql_user, "-p" + mysql_password, args.database_name], 
            stdin=open('default.sql'))

if (not os.path.isfile("facebook.properties") 
        or args.oauth_url != default_authorisation_url 
        or args.graph_url != default_graph_url
        or args.client_id is not None
        or args.clean):
    facebook = open("facebook.properties", "w")
    facebook.write("authorisation_url=" + args.oauth_url + "\n")
    facebook.write("graph_url=" + args.graph_url + "\n")
    if args.client_id is None:
        args.client_id = input("Enter Facebook client ID: ")
    facebook.write("client_id=" + args.client_id + "\n")
    client_secret = getpass("Enter Facebook client secret: ")
    facebook.write("client_secret=" + client_secret + "\n")
    facebook.close

if (not os.path.isfile("admin.properties") 
        or args.update_password
        or args.clean):
    password = getpass("Enter a password for the admin panel: ")
    properties = open("admin.properties", "w")
    properties.write("passhash=" + encrypt_string(password).lower())
    properties.close()
    print("Password updated!")

print("Rebuilding server...")
subprocess.run(["mvn", "package"])

try:
    print("Attempting to kill server...")
    pids = subprocess.check_output(["pidof", "java"]).split()
    for pid in pids:
        subprocess.run(["kill", pid])
    print("Server killed!")
except CalledProcessError:
    print("Server not running!")

subprocess.run(["rm", "-rf", "static/admin/"])
if args.clean or args.update_schema:
    subprocess.run(["rm", "-rf", "static/"])
    subprocess.run(["mkdir", "static"])
    
os.chdir("../admin_panel/")
print("Rebuilding admin panel...")
subprocess.run(["yarn", "build"])
subprocess.run(["mv", "build", "../backend/static/admin"])
print("Admin panel rebuilt!")
os.chdir("../backend/")

print("Starting updated server...")
try:
    pid = os.fork()
    if pid == 0:
        with open("server.log", "w+") as log:
            subprocess.run(["java",
                "-jar",
                "target/backend-0.0.1-jar-with-dependencies.jar"],
                stdout=log, stderr=log)
    else:
        print("Server updated!")
except OSError:
    print("Failed to start server!")

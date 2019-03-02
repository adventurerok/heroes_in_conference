# Heroes in Conference

[![Build Status](https://travis-ci.com/groupkilo/heroes_in_conference.svg?branch=master)](https://travis-ci.com/groupkilo/heroes_in_conference)

# Usage

## Installation

To install the repository run:

```sh
git clone https://github.com/groupkilo/heroes_in_conference.git
```

## Server

### Requirements

- OpenJDK 8 (or equivalent)
- Maven
- MySQL
- Python 3

### Automatic Configuration

Running `autoconf.py` will automatically configure and run the server. The server will bind to port `4567` so a proxy must be set up if it is desired to be exposed on port `80`. A number of options for updating various parts of the server are available inside `autoconf.py`. To list them run `autoconf.py --help`.

### Manual Configuration

In order for the server to work correctly, you will need create three files in your `backend` directory. These are: `facebook.properties`, `database.properties`, and `admin.properties`. All commands shown in the following section assume you are already inside the `backend` directory.

#### `facebook.properties`

This file gives all the information for the server to make requests to Facebook's API. For the current version of the Facebook Graph API (v3.2 at the time of writing), the following is sufficient:

```
authorisation_url=https://www.facebook.com/v3.2/dialog/oauth
graph_url=https://graph.facebook.com/v3.2/
client_id={% your Facebook client ID %}
client_secret={% your Facebook client secret %}
```

To obtain a client ID and client secret, visit [the Facebook developer site](https://developers.facebook.com/) and create a new OAuth application.

Note that you will also have to configure your site domain and site redirect URLs to be `https://{% your domain %}/api/oauth/` and `https://{% your domain %}/api/oauth/callback/`.

#### `database.properties`

This file contains all the information the server needs to communicate with your MySQL database.

Before we can configure the database settings, we need to have a database set up. Assuming that you have already created an empty MySQL database, you should run the following:

```sh
mysql -u {% your MySQL username %} -p {% your MySQL database name %} < schema.sql
```

This will automatically configure your database to run our schema. Now you can create a `database.properties` file containing:

```
driver=com.mysql.cj.jdbc.Driver
url=mysql://{% the location of your MySQL server - typically localhost %}
database={% your MySQL datbase name%}
user={% your MySQL username %}
pass={% your MySQL password %}
```

#### `admin.properties`

This file contains a hash of the password for the administration panel.

```
passhash={% SHA-256 hash of admin password %}
```

### Launch

To launch the server simply run in the `backend` directory:

```sh
mvn compile exec:java
```

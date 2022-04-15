# Build & Setup on Ubuntu
Prerequisite: Java JDK version >= 1.8, nodejs lts v16

### Build backend
```
./gradlew build
```
Copy file `jsoneditor2-0.0.1.jar` in folder `build/libs/` to destination server 

### Install mongodb
Please follow the link `https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/` to install Mongodb.

### Install nginx
```
sudo apt install nginx
```

### Run backend as service
Let's use `screen` to run the app as service quickly
```bash
screen
```
```
java -jar jsoneditor2-0.0.1.jar
```

Press `Ctrl + A` then `D` to bring `screen` into background.
The application is now running on port `8080`.

### Configure Nginx as transparent proxy
Let's add an entry location to nginx's configuration as follow.

```
	location /api/ {
	        proxy_set_header X-Real-IP $remote_addr;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	        proxy_set_header Host $http_host;
	        proxy_set_header X-NginX-Proxy true;

        	proxy_cookie_path / "/; secure; HttpOnly; SameSite=none";

	        proxy_pass http://127.0.0.1:8080/api/;
        	proxy_redirect off;
	}

```

Done on backend.
### Build frondend
```
yarn build
```

### Setup frontend
Copy the content in folder build to destination folder, asume that is `/home/ubuntu/jsoneditor7`

Edit nginx's config to add root point to the destination folder

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /home/ubuntu/jsoneditor7;

	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}

	location /api/ {
	        proxy_set_header X-Real-IP $remote_addr;
        	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	        proxy_set_header Host $http_host;
	        proxy_set_header X-NginX-Proxy true;

        	proxy_cookie_path / "/; secure; HttpOnly; SameSite=none";

	        proxy_pass http://127.0.0.1:8080/api/;
        	proxy_redirect off;

	}

}


```

Reload nginx & access the app at the port 80

```
sudo nginx -s reload
```
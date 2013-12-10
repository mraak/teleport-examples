Teleport API provides all the bells and whistles for developers to create, test, and distribute multiuser apps and games. It is build on Meteor. Meteor is to Teleport what C is to Unix.

### 1) Make sure you have everything installed

Install node
http://nodejs.org/download/

Install meteor
curl https://install.meteor.com | /bin/sh

Install meteorite
npm install -g meteorite


### 2) Clone and run

```
git clone https://github.com/mraak/teleport-examples.git

cd teleport-examples/basic

./run
```

Open localhost:3000 in a browser, wait for the session to start, then copy the URL into the other browser. You need at least two browsers to test multi user apps.


### 3) Roll your own

```
cp -rf basic my-app-with-some-name

cd my-app-with-some-name

./run
```

Here you can make all the changes you want inside the client folder. More docs coming soon on how to use the API.


### 4) Deploy and distribute

```
meteor deploy devmeet-demo --settings settings.json
```
Your app is now published at my-app-with-some-name.meteor.com. You can pass this URL to friends and use it with them simultaneously. 


5) Run in Teleport

Running your app in Teleport will give you extra benefits of user accounts, video calling, session saving, and other nice things. More info coming soon.





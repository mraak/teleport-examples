Teleport API provides all the bells and whistles for developers to create, test, and distribute multiuser apps and games. It is built on Meteor. Meteor is to Teleport what C is to Unix.


<b>Live video consultancy and chat, book here and talk to committers<b>

[<img src="https://d15c0umzzp6r0p.cloudfront.net/static/images/widgets/blogo-b.png">](http://tport.to/alen-b)



### 1) Make sure you have everything installed

Install node

http://nodejs.org/download/

Install meteor
```
curl https://install.meteor.com | /bin/sh
```
Install meteorite
```
npm install -g meteorite
```

### 2) Clone and run

```
git clone https://github.com/mraak/teleport-examples.git

cd teleport-examples/basic

./run
```

Open localhost:3000 in a browser, wait for the session to start, then copy the URL into the other browser. You need at least two browsers to test multi user apps.

<b>Note the URL</b>, it has the <b>accessKey</b> appended, this is what groups the users into a session, or a "room". In code, you can always call accessKey() function to read it. All the users with the same URL will operate in the same session.

On occasion, you might want to update the meteorite packages, just in case.

```
mrt update
```


### 3) Roll your own

```
cp -rf basic my-app-with-some-name

cd my-app-with-some-name

./run
```

Here you can make all the changes you want inside the client folder. More docs coming soon on how to use the API.


### 4) Deploy and test

```
meteor deploy my-app-with-some-name --settings settings.json
```
Your app is now published at <b>my-app-with-some-name.meteor.com</b>. You can pass this URL to friends and use it with them simultaneously. For production deployment revert to point 5.


### 5) Run in Teleport, distribute

Running your app in Teleport will give you extra benefits of user accounts, video calling, session saving, and other nice things. More info coming soon. Start a session to get the flavor: www.tport.to





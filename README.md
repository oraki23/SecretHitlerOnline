# Secret Hitler Online

###### Introduction:
***
This Secret Hitler App is a simple companion app to play Secret Hitler with friends, while being each other at home.
There is no explanations of the rules, as you must know how to play. The only requirements is to be in a videoconference with your friends while playing.
This utility was designed and programmed during the COVID-19 crisis, as I wanted to play with my friends. Please note that this app is not longer developped, as it was a simple project.
If you want to play Secret Hitler Online, I highly recommend [secrethitler.io](http://secrethitler.io) 

This app uses [express](https://expressjs.com/), [node.js](https://nodejs.org/en/), [socket.io](https://socket.io)

To run the app, simply run 'node index.js' and the server will by default start on port 8000.
You will also have to change the line 112 (at the time of this writing) in the index.html file:
'socket = io('ws://localhost:8000');' -> you will have to put your host there.

###### Learning Opportunities
***
This project was majorly an opportunity for me to learn socket.io, as I never did this kind of programming before (what I did was majorly full-stack web 
without bi-directional interaction that is done with sockets). It was really easy to setup
and I would recommand everyone to use their desire to spend time with people as an opportunity
to start little projects that may, one day, change the lives of some people.

##### Why I stopped working on this project
***
The first goal for my project was to have an app to play Secret Hitler online on
mobile and desktop. I have achieved this goal with the current version, even
though it requires lots of manual input.

I could have upgraded it more, but I realized it won't do much, because some 
other versions, like [secrethitler.io](http://secrethitler.io) already exists, 
are free, and are easily usable.

##### Conclusion
***
I'm happy with what I have learned from this project, and I'm happy what it has
brought to me, and how it has allowed me and my friend to play a game we love.
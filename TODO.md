#12-20-16:
LO: POST method for setting tempTaret
*What are we going to change with the POST system?
  Obviously the tempTarget for now
#12-12-16:
LO:
*Get a POST system working for API
*Probably want to do some testing soon too.
#12-10-16:
*So, based on below, probably work on API before web GUI
*Move things to other files before it get's too messy
*I guess it's time to start working on a GUI: lcd or web first?
  Do we integrate API server with main back-end? If not, we would need
  a way to communicate between backends, and HTTP is a likely candidate so
  why not just do HTTP straight from here?
#12-7-16:
*Relay API for Node doesn't have a method to read relay status, need to track
  in application.
*Class or object for SYSTEM?
#11-29-16:
*Should a class or obj literal be used for system{} data?
  Depends if I want to do fancy function stuff like .heat.on(),
  Is there value in that method other than looking fancy?
  Could just use property with a getter() to run the function **I like this idea!**
#11-28-16:
*Continue on temp action method
#11-27-16:
*Start working as if relay-exp-addon works locally.
#11-27-16:
*Read working, start on relay changes based on temp.
#11-24-16:
*content.substr is not a function
#11-23-16:
*Just use promises to support Node 4.x
#11-19-16:
*Get running on Omega to test temp read functionality

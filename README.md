HTML5 & Javascript Pong Game
============================

This was a weekend project I used to learn about the canvas tag in HTML5 and also practice some basic game mechanics.
Some enhancement can be done, like creating a beatable AI and using local storage in order to keep track of stats between different gaming sessions.

GOALS
=====

The goals for this project were:

 * develop a pong game in html5 having two vertical bars, a ball and two bouncing walls at the bottom and at the top of the screen
 * the player bar must be controlled by the mouse
 * there should be a start screen to inform the scores and wait for an event to start the game
 * there should be an end screen to inform the winner, the scores and wait for an event to start the game
	
During the development of the game the mechanics were still unclear. With a trial and error strategy the mechanics became:
	
 * the game should run at aproximately 60 fps
 * the ball should be given a random direction at the beginning of a new game and a speed of factor 4
 * the ball direction shouldn't exceed 60 degrees in relation to the horizontal axis, avoiding directions that turn the 'point of collision' almost unpredictable for the player
 * the ball speed shouldn't exceed a factor of 10, otherwise the human player can't follow it properly
 * for collisions, the idea was to use the momentum conservation formula to predict the resulting speed and direction of the ball, but given the paddle's movement is independant from the ball movement even after a collision, an easier approach was used: invert horizontal speed; sum paddle speed with ball vertical speed; then use vector knowledge to extract module and angle out of horizontal and vertical speeds.

FILES
=====

The game files are organized as follows:

	pong.js                # all the game mechanics and control logic
	pong.unbeatable_ai.js  # makes player1 unbeatable by always following the ball precisely
	pong.mouse_control.js  # gives player2 the hability to control the bar with the mouse

FUTURE GOALS
============

 * improve gameplay:  		adjust speed factors according to current fps
 * improve graphics:  		use images that better represent the bars, the ball and the field of the game
 * improve mechanics: 		collision algorithm depending on which part of the bar the ball collided, changing the outcome accordingly
 * code:     		  		use OO concepts to decouple control logic and easily interchange AI logic
 * artificial intelligence: study common strategies and develop beatable AI strategies that are randomly selected at the beginning of a game session

LICENSE
=======

[MIT](http://en.wikipedia.org/wiki/MIT_License) license.
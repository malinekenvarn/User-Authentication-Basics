
The purpose of this project is to learn how authentication works and some of the libraries used for building it. I wanted to make an application where you have to register a user that can log in with an email and a password. When logged in, there is a button for logout. And the application also have functionality to know if the user on the client is logged in or not, if logged in and a request for login or register page is made, the server will redirect back to homepage.

The frontend part of this application is simply some form html, that's all I want to do for now.<br>
<br>
Some of the libraries to mention is passport that handles authentication requests, brypt that converts the user password to a hashed password safer to store in the database, and express session that stores session data. To logout, passport have a method to clear session, but to make it work with the html form on client, a library named method-override is used.<br>
<br>
In the future I want to add a function that only permits a number of login attempts and if all fail, the account will be locked. Then the user have to click a "forgot password" link.<br>
<br>
I have some comments in the code and those are for myself, this is my notes for my learning because this project is a study material for me.



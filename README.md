# Marketplace

Marketplace is a project made as a final project for Server-Side-Scripting Frameworks on spring semester of 2019  Metropolia University of Applied Sciences, Finland  
by    Mikhail Losev
## Deployed version for demo

**https://marketplacemilo.jelastic.metropolia.fi**

## Installation

You have to have NodeJS, MongoDB preinstalled to run and test it

**YOU HAVE TO CONFIGURE MongoDB MANUALLY**

If you're using MongoDB Atlas then just pass the link to it  at /config/keys at **MongoURI**

**Else**
If you use local MongoDB, find the link to your local database and paste the link as in the example above

It the **keys** files should look like that
```
module.exports = {
  MongoURI: 'mongodb://localhost:27017/EmployeeDB'
};

```

After downloading, write:



```bash
sudo npm i
npm run dev

````
**The server starts on port 3001**


## About a project

My idea was to make the application which is a shop, where you could be able to buy items(to be developed) and create your own items in the shop edit, view, delete, sell(to be developed)!

I designed the project so it would be accessible on all device resolution

Technologies used:

* **NodeJS**
* **ExpressJS**
* **Flash**
for error handling
* **Morgan** for request tracking
* **Multer**
for image upload
* **PassportJS**
for user authentication
* **EJS** for layouts
* **RESTful API**
* **BULMA** as a css framework for styling front-end
* **jQuery** for some easy DOM manipulation on front-end

## Folder structure
```
├── certificate
├── config
├── models
├── public
│   └── scripts
├── routes
├── uploads
└── views
    └── partials
```
* **certificate** 

Is where located the SSL certificates for https, you can generate your own as because I did not push that to repo
* **config**

Is where is store Local-strategy for PassportJS, password hashing authentification function and MongoDB link
* **models**

This is where mongoose models are described

I have two of them: User and Item
* **public**

Don't really locate anything there yet
* **routes**

Is where I do all the routing for the application
* **users**
* **items**

Are the RESTful routes, where all the Work with the Data happens

**POST, GET, DELETE** request and mongoose manipulations are there

You can easily implement them in your application and it will work guaranteed

* **index**
* **render**

Are front-end routes

* **uploads**

This is where I upload the images from the marketplace, and where from the backend gets them to display

* **views**

This is the views of the application

**Layout** is the main one, that has the body tag, all the other views are passed to it as the contents of the Layout's body
* **partials**

Is the way how I print errors into my login and register form

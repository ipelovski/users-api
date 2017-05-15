#### Users API

This simple project is an implementation of the following task: https://github.com/holidayextras/culture/blob/master/recruitment/developer-API-task.md

##### Installation
Clone the repo. Using a terminal go to the folder of the clone. Inside the folder run the following command:
```
yarn
```
The package manager used for the project is yarn and can be obtained here: https://yarnpkg.com/en/. It promises to fix the npm shortcomings when module versions become a problem.

##### Usage
To start the project type the following:
```
yarn start
```
To run the tests in the project type:
```
yarn test
```
To create a bundle of the client scripts for production:
```
yarn run bundle
```

##### Requirements
Node v. 7.10.0, Chrome 58 or Firefox 53

##### Description
The project is quite simple. Here is its structure:

##### API
The base url of the API is `/api/` and consists of several endpoints:
* `GET /api/users/` Returns all users stored in the system.
* `GET /api/users/search/:text` Searches for user objects containing `text` in their string fields. Returns the found users.
* `GET /api/users/:id` Returns the user with the specified id. If none is found the response has status 404.
* `POST /api/users/` Creates a new user with the data sent in the body of the request. Returns the newly created user.
* `POST /api/users/populate` Creates random users in the system.
* `PUT /api/users/:id` Updates the user with the specified id using the data sent in the body of the request. If no user has this id then the response has status 404.
* `DELETE /api/users/:id` Removes the user with the specified id. If no user has this id then the response has status 404.

##### Server part
The API is implemented in Node using Koa 2.x (http://koajs.com/) and its `async` implementation. The `async` functions turned to be a really great tool and made the task quite enjoyable and easy. The starting point of the server is `index.js` which loads the routes located in `/routes/` folder and starts a Koa server. The Koa server also serves static files which contain the UI for the API. The model of users is placed in `/data/` folder. The user objects are kept in memory and are lost upon a server restart. The model has validation rules implemented using ajv (http://epoberezkin.github.io/ajv/) library via json-schema (http://json-schema.org/). There are integration tests covering the API endpoints and are implemented using mocha (https://mochajs.org/) and chai (http://chaijs.com/). The tests are located in `/test/` folder. The configuration for the server is implemented using node-config (https://github.com/lorenwest/node-config) and is placed in `/config/` folder. There are a few simple helper modules which are placed inside `/lib/` folder.

##### Client part
The UI for this task is placed inside `/public/` folder. It represents a simple mithril (https://mithril.js.org/) application. This framework is simple and quite easier to learn compared to angular. It uses pure JavaScript API (called hyperscript) to define the DOM tree structure of its components allowing the developer to easily compose templates. Compared to the angular template language the hyperscript is simpler and more powerful. Mithril is not without quirks but its simplicity makes it easy to locate them and to work around them. The client data model for users is placed in `/public/js/user-repository.js`. The mithril components are located in `/public/js/components/` folder. There are a few presentational componets like `user-list` and `user-form` and a few container components like `users-view`, `add-user`, and `edit-user`. The starting point for the mithril application is `/public/js/index.js`. The HTML file that is served for each UI path is `/views/index.html`. It is processed before served to the client in order to insert some configuration bits. That's why it is placed inside `/views/` folder.
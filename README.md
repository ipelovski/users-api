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

##### Description
The project is quite simple. Here is its structure:

##### Server part
The API is implemented in Node (v 7.10.0) using Koa (v 2.2.0) (http://koajs.com/) and its `async` implementation. The `async` functions turned to be a really great tool and made the task quite enjoyable and easy. The starting point of the server is `index.js` which loads the routes located in `/routes/` folder and starts a Koa server. The Koa server also serves static files which contain the UI for the API. The model of users is placed in `/data/` folder. The user objects are kept in memory and are lost upon a server restart. The model has validation rules implemented using ajv (http://epoberezkin.github.io/ajv/) library via json-schema (http://json-schema.org/). There are integration tests covering the API endpoints and are implemented using mocha (https://mochajs.org/) and chai (http://chaijs.com/). The tests are located in `/test/` folder. The configuration for the server is implemented using node-config (https://github.com/lorenwest/node-config) and is placed in `/config/` folder. There are a few simple helper modules which are placed inside `/lib/` folder.

##### Client part
The UI for this task is placed inside `/public/` folder. It represents a simple mithril (https://mithril.js.org/) application. This framework is simple and quite easier to learn compared to angular. It uses pure JavaScript API (called hyperscript) to define the DOM tree structure of its components allowing the developer to easily compose templates. Compared to the angular template language the hyperscript is simpler and more powerful. Mithril is not without quirks but its simplicity makes it easy to locate them and to work around them. The client data model for users is placed in `/public/js/user-repository.js`. The mithril components are located in `/public/js/components/` folder. There are two presentational componets: `user-list` and `user-form` and three container components: `users-view`, `add-user`, and `edit-user`. The starting point for the mithril application is `/public/js/index.js`. The HTML file that is served for each UI path is `/views/index.html`. It is processed before served to the client in order to insert some configuration bits. That's why it is placed inside `/views/` folder.
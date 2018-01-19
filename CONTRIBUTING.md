# Contributing Guidelines

## General

* Contributions of all kinds (issues, ideas, proposals), not just code, are highly appreciated.
* Pull requests are welcome with the understanding that major changes will be carefully evaluated
and discussed, and may not always be accepted. Starting with a discussion is always best!
* All contributions including documentation, filenames and discussions should be written in English language.

## Issues

Our [issue tracker](https://github.com/datadotworld/tableau-connector/issues) can be used to report
issues and propose changes to the current or next version of the data.world Web Data Connector.

## Contribute Code

### Review Relevant Docs

* [Web Data Connector SDK](http://tableau.github.io/webdataconnector/)
* [data.world API](https://apidocs.data.world/)

### Set up machine

Install:

* NodeJS
* npm
* yarn

### Fork the Project

Fork the [project on Github](https://github.com/datadotworld/tableau-connector) and check out your copy.

```
git clone https://github.com/[YOUR_GITHUB_NAME]/tableau-connector.git
cd tableau-connector
git remote add upstream https://github.com/datadotworld/tableau-connector.git
```

### Run the connector

#### Define environment variable
Create a `.env` file with the following values:

```
REACT_APP_OAUTH_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_OAUTH_ROOT_URL=http://localhost:3000
REACT_APP_OAUTH_CLIENT_ID=tableau-native-dev
REACT_APP_OAUTH_CLIENT_SECRET=TMFBZbyBW6NrqGGcPyCDxUuGtNhQuWJf
```

#### Install dependencies:

```bash
yarn
```

#### Start the app:

```bash
yarn start
```

#### Run in Tableau:

 * Launch [Tableau](https://www.tableau.com/) or [Tableau Public](https://public.tableau.com/en-us/s/).

 * Select `Web Data Connector` under `Connect -> To a Server`.

 * Enter `http://localhost:3000/` in the `web data connector URL` field and press enter.

#### Run in a browser:

 * Open a browser and navigate to the following URL:

```bash
http://localhost:3000/?forceTableau=true

# NOTE: Add `forceTableau=true` to all app URL querystrings when in the browser
```

#### Run in Tableau Simulator
 * Clone the Web Data Connector git repository:
```bash
git clone https://github.com/tableau/webdataconnector.git
```
 * Change to the directory:
```bash
cd webdataconnector
```
 * Install dependencies with npm:
```bash
npm install --production
```

 * Start the test web server:
```bash
npm start
```

 * Open a browser and navigate to the following URL:
```bash
http://localhost:8888/Simulator/?src=http://localhost:3000/?forceTableau=true
```

 * Click the `Start Interactive Phase` button.

### App Flow

#### Authentication

The connector uses `data.world`'s [OAuth 2.0 flow for native applications](https://apidocs.data.world/v0/data-world-for-developers/oauth#native-applications-desktop-mobile-static-sites-other)

After determining it is running in a Tableau environment the app redirects to `https://data.world/oauth/authorize` supplying the following as query params:
 * client_id
 * redirect_uri
 * response_type
 * code_challenge_method
 * code_challenge

The user is asked to log in to `data.word` and authorize the application. If successful the app redirects to the provided `redirect_uri` with a `code` query param.

The app then makes a `POST` request to `https://data.world/oauth/access_token` providing the following in the body of the request:
 *  The `code` returned
 +  client_id,
 +  client_secret,
 +  grant_type,
 +  code_verifier

 If the `code_challenge` corresponds to the `code_verifier` and all other values are valid `data.world` responds with a token. 

 The app redirects the user to its homepage and saves the token for use in subsequesnt API requests.

#### Interactive phase

Users are presented with a text field where they are supposed to put in a valid dataset URL.

On submission the `tableau.submit()` function is called.

#### Gather data phase

This phase is initiated after `tableau.submit()` is called. Stages:

1. `getSchema` is called:
  * The SQL query `SELECT * FROM TableColumns` is run on the provided dataset using the `https://query.data.world/sql/{user}/{datset}` endpoint.
  * The response is parsed to return an array of objects each representing a table in the dataset. Each object contains:
    * `id`: The table name
    * `alias`: A friendly table name that can appear in Tableau
    * `columns`: Array of objects representing the columns in the table. Each object contains:
      * `id`: The column name
      * `alias`: A friendly column name
      * `dataType`: The column's data type
  * The returned array is passed to `getSchema`'s callback

2. `getData` is called by Tableau once for each table that has been selected by the end user. Stages:
  * The SQL query `SELECT * FROM {current table}` is run on the provided dataset using the `https://query.data.world/sql/{user}/{datset}` endpoint.
  * The response is parsed to return an array of objects each representing a row in the table. Each object contains the value of each of the table's columns in the row.
  * The returned array is passed as an argument to `getData`'s `table.appendRows` function.

### Create a Feature Branch

Make sure your fork is up-to-date and create a feature branch for your feature or bug fix.

```bash
git checkout master
git pull upstream master
git checkout -b my-feature-branch
```

### Write Tests

Try to write a test that reproduces the problem you're trying to fix or describes a feature that
you want to build. Add tests to [tests](tests).

We definitely appreciate pull requests that highlight or reproduce a problem, even without a fix.

### Run tests
```bash
yarn test
```

### Write Code

Implement your feature or bug fix.

Make sure that `yarn test` completes without errors.

### Write Documentation

Document any external behavior in the [README](README.md).

### Commit Changes

Make sure git knows your name and email address:

```bash
git config --global user.name "Your Name"
git config --global user.email "contributor@example.com"
```

Writing good commit logs is important. A commit log should describe what changed and why.

```bash
git add ...
git commit
```

### Push

```bash
git push origin my-feature-branch
```

### Make a Pull Request

Go to <https://github.com/[YOUR_GITHUB_NAME]/tableau-connector> and select your feature branch.
Click the 'Pull Request' button and fill out the form. Pull requests are usually reviewed within
a few days.

## Thank you!

Thank you in advance, for contributing to this project!

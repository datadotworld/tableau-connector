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

#### Install dependencies:

```bash
yarn
```

#### Start the app:

```bash
REACT_APP_OAUTH_REDIRECT_URI=https://dw-tableau-oauth.herokuapp.com/callback REACT_APP_OAUTH_CLIENT_ID=data-dot-world-tableau yarn start
```

#### Run in Tableau:

 * Launch [Tableau](https://www.tableau.com/) or [Tableau Public](https://public.tableau.com/en-us/s/).

 * Select `Web Data Connector` under `Connect -> To a Server`.

 * Enter `http://localhost:3000/` in the `web data connector URL` field and press enter.

#### Run in a browser:

 * Open a browser and navigate to the following URL:
```
http://localhost:3000/?forceTableau=true
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

### Run tests
```bash
yarn test
```

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

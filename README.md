# Oui.SNCF Train Bill Data Scraper

Oui.SNCF Train Bill Data Scraper
This Project if based on Node.js with Cheerio.

## Getting Started

These instructions below will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) installed with a package manager like [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

You can check it up by running this command in your console :

```
node -v
```

### Installing

To install all the packages needed by this project, you have to run an packager manager.

Run this command if you are using [NPM](https://www.npmjs.com/):

```
npm install
```

Or this command if you are using [Yarn](https://yarnpkg.com/):

```
yarn install
```

## Running locally the code.

To run the script locally please use this command:

```
npm start
```

This command will scrap the test.html file and convert it into a json file called test.json

```
node script.js
```


To see the html file in the browser you can run this command to clean it up:

```
awk '{gsub(/\\n/,"\n");gsub(/\\r/,"\r");gsub(/\\"/,"\"")}1' test.html > test_result.html
```

To compare the output file and the original result file you can run this command:

```
diff test.json  test-result.json
```

<!-- ## Contributing -->

<!-- ## Versioning -->

## Authors

* **Shengda Liu** - *Initial work* - [shengdaliu](https://github.com/shengdaliu)

## License

This project is not licenced.

<!-- ## Acknowledgments -->

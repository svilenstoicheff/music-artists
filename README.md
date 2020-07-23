# Project Description
This app performs an artist search on Last.fm and displays up to 20 relevant matches to your search terms. 

Selecting an artist in the left column performs a details search and displays a summary and a full bio, which can be toggled in and out of view. 

The "See top tracks" link triggers yet another search and displays up to 20 most popular tracks by the selected artist. 

# Implementation Notes
The app is built with Typescript and React. React is used sparingly, just for the main component, GetArtists.

For the artists list, I used elements of the Web Components standard - HTML templates and JavaScript template literals. The content and top tracks components are built with just HTML, CSS and JavaScript. 

The styling is pretty basic and it just accounts for layout and readability. 

# Improvement Suggestions

The subcomponents can be abstracted as separate React components, if React is a requirement. 

The API returns more data than displayed, so content can be added, such as images, number of listeners, etc. 

The styling leaves a lot to be desired and can be improved, for the purposes of esthetic presentation and content organization. 

# Technical Notes

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


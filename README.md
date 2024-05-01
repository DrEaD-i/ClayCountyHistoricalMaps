# Clay County Historical Maps Project

This project is an assignment for a K-State course. The task assigned is to create a website for Clay County Historical Museum where visitors may look up specific lots and historical ownership within an interactive map.

## Team

- Annie Aeschliman
- Gabriel Guillen
- Genessis Perez-Sorto :D
- Logan Bunch
- Sean Wing
- Teray Robinson

## Stack

- Vite
- React
- Tailwind

Deployed on GitHub Pages

Visit the running prototype at [https://logno-dev.github.io/ClayCountyHistoricalMaps/](https://logno-dev.github.io/ClayCountyHistoricalMaps/)

## Install

To run this site locally, you will need Node.js version 18 or greater. You will also need the environment variables to access the database (contact Logan Bunch for .env file).

Either fork and clone or simply clone this repository. Navigate to the cloned directory. Run:

```bash
npm install
```

then, assuming you've acquired the needed .env file, run:

```bash
npm run dev
```

While the that is running the site should be available locally at [http://localhost:5173/ClayCountyHistoricalMaps/](http://localhost:5173/ClayCountyHistoricalMaps/) and auto-refreshes when local files are updated/saved.

## Project Structure

This project is built on the Vite-React scaffolding. The injection point for React is a div with `id="root"` located in the `index.html` file in the top level directory. This file includes scripts that fix routing while the site is deployed on Github Pages since GitHub Pages does not natively support routed SPAs. There is also an imported script that acts as the main entry point for the React app located in the `src` directory called `main.jsx`. This file establishes routes and calls upon the `App.jsx` file. Then, in turn, the `App.jsx` injects the layout and top level CSS file.

Page components can be found in `src/pages`. Currently there is only a Home page, Map page, and Records page.

Reusable components such as the `TopNav.jsx` are found in `src/components`.

Currently the only utility is the bit of code that connects to the database. This can be found in `src/utils`.

Static assets are stored in `public` and dynamic assets are stored in `src/assets`.

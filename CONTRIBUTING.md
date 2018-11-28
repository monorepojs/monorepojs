# Contributing to

## Docs `/documentation`

We use [docusaurus](https://docusaurus.io/en/) to create our static documentation site. The docs site and resources can be found in `/documentation`.

- `documentation/docs`: contains all of the markdown files that are used for the website
- `documentation/website`: contains the static site code

### Run Locally

Follow the steps below to run the docs site locally.

1. From the root of this project `cd documentation/website`
2. If this is your first time, install the dependencies with `yarn`
3. Start the dev server `yarn start`
4. Go to [localhost:3000](http://localhost:3000)

### Add a new doc

Follow the steps below to add a new documentation category or page and add it to the sidebar navigation.

1. Create a new `.md` file in the `documentation/docs` directory and name it appropriately (ideally the same as your page title and unique).
2. Change the code below and add it to your documentation file:
```
---
id: gotchas
title: Gotchas
---
```
3. Update the `documentation/website/sidebars.json` file to add the new file to the navigation. Find the appropriate sidebar (most likely it's the `docs` sidebar) and add the `id` of the `.md` file you just created to the appropriate category.

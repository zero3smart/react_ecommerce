## Table of Contents
- [List of Commands](#list-of-commands)
  - [Mobile (/)](#mobile)
  - [Desktop (/desktop)](#desktop-desktop)
- [Deployment](#deployment)
- [Update Visual Filter SVG](#update-visual-filter-svg)
- [Docker Settings](#docker-settings)
- [Tips](#tips)

# List of Commands
## Mobile (/)

| Scripts                | Descriptions           |
| ------------------     |:-----------------------|
| yarn install           | install dependencies |
| yarn start             | Serve development server in specific port (default: 3002) |
| yarn build             | Build project |
| yarn analyze           | Run bundle size analyzer. Must build the project first. |
| yarn storybook         | Run storybook (port: 9009) |
| yarn test              | Run tests. add `--watch` for auto reload |

## Desktop (/desktop)

Note that mobile `/src` directory is also included in desktop module path. So you'll be able to access mobile code directly like `ui-kits/banners/FlatBanner`. Unfortunately, importing mobile code like that can be dangerous, since it can cause conflict when there is duplicated folder name, e.g: `/src/ui-kits/banners/` vs `/desktop/src/ui-kits/banners/`.

To avoid conflict and better imports readability, aliases were provided by using `yesplz@` prefix, e.g: `yesplz@ui-kits/banners/FlatBanner`. See `/desktop/src/products/index.js` for a referrence to avoid conflict between same module names.

| Scripts                | Descriptions           |
| ------------------     |:-----------------------|
| yarn install           | install dependencies |
| yarn start             | Serve development server in specific port (default: 3002) |
| yarn build             | Build project |


# Deployment
1. ssh to yesplz server.
2. Go to `~/yesplz_front/` directory.
3. `git pull` to get last code updates or change branch if necessary.
4. Run `docker-compose stop` to stop running containers (use `sudo` for non root users).
5. Run `docker-compose up -d --build` to start building the images (use `sudo` for non root users). To start container without building the image, run `docker-compose up -d`.

# Update Visual Filter SVG
1. Go to `/backend/webapp/assets`. You’ll find 2 different source folders, `svg` for visual filter with horizontal thumbnails and `svg-thumb-vertical` for visual filter with vertical thumbnails.
2. You can edit the svg parts. Note: The filters button won’t be merged, since it was moved to React component for reusability purpose.
3. To merge assets, run `python merge_svg_assets.py` (or with using `python3`) to produce `vf_bundle.svg` file (vf with horizontal thumbnails) and `python merge_svg_thumb_vertical_assets.py` to produce `vf_bundle_thumb_vertical.svg` (vf with vertical thumbnails).
4. Copy both files to `/public/svg/`, replace the files there.

# Docker Settings
- To update docker script, go to `/docker/` directory and modify `Dockerfile`. Docker compose file is located on root directory.
- There are environment variable configurations for mobile web (`/docker/.env`) and desktop web (`/docker/.env.desktop`). (PRODUCTION)
- You can also modify the nginx configuration at `/docker/nginx.conf` to change routing / redirect rules.

# Tips
Add these extension in your **chrome** browser to help with debugging:
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

For vscode users, please install [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) addons and add this to vscode user settings:
```
"eslint.options": {
    "configFile": ".eslintrc"
}
```

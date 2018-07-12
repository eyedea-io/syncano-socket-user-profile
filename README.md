# Syncano Socket for User Profile

[![Syncano Socket](https://img.shields.io/badge/syncano-socket-blue.svg)](https://syncano.io)
[![CircleCI branch](https://img.shields.io/circleci/project/github/eyedea-io/syncano-socket-user-profile/master.svg)](https://circleci.com/gh/eyedea-io/syncano-socket-user-profile/tree/master)
![Codecov branch](https://img.shields.io/codecov/c/github/eyedea-io/syncano-socket-user-profile/master.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dw/@eyedea-sockets/user-profile.svg)](https://www.npmjs.com/package/@eyedea-sockets/)
![license](https://img.shields.io/github/license/eyedea-io/syncano-socket-user-profile.svg)

Main Socket features:

* **user-profile/find** — search for a user by ID
* **user-profile/my** — get your own user data
* **user-profile/update** — update your user data
* **user-profile/remove-image** — remove avatar image
* **user-profile/update-image** — update avatar image

## Getting Started

Install package in your project:

```sh
cd my_project
npm install @syncano/cli --save-dev
npm install @eyedea-sockets/user-profile --save
npx s deploy
```

Use it:

```js
import Syncano from @syncano/client

const s = new Syncano(<instaneName>)

// Search for a user
const params = {
  id: 12345
}
const invitationStatus = await s.get('user-profile/find', params)
```

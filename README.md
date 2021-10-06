## Chat App

This browser-based chat client allows users to create accounts, login, and chat securely with each other in seperate channels. The UI, at least at the time of writing, is essentially just a simple wireframe as the emphasis, and indeed the motivation for the side-project, was to gain additional exposure to the number of backend implementations required in a modern online chat client, such as:

### Features

#### Authentication
During registration the user's password is encrypted with brcypt before being stored. On login the provided password is hashed and compared with the existing record. Salts are used in ecryption to prevent rainbow table attacks. Once authenticated, sessions are maintained via an access token stored as a cookie (Passport.js/Express-Session).

#### Authorization
Access control is maintained via the use of secured endpoints and redirects. Endpoints are register with authorization checking middleware that determines authentication status and access privilages.

#### Real-time messaging
Messages are retrieved via API call upon initial loading of a channel, however live conversation occurs via event-based messaging using web sockets (Socket.js) to broadcast messages to clients, manage channels, etc.

### Possible future features
* E2EE/Asymmetric encryption
* Group chats/channels

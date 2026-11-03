# Remote testing

The built-in public tunnel has been removed. Run `npm start` and use the LAN
address printed by the server to test on other devices on a trusted network.

For testing from other networks, run `npm run build` and deploy the contents of
`build` to a hosting service you control. The development server is not intended
to be exposed publicly.

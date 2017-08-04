### Graylog-Stats

An express router that exposes aa api to get stats from grayloy.

## Using it

The module is a router factory - just require it and call it with an options object, like this :

```
const app = require('express')();

app.use('/someRoute', require('../index')({
  username: 'foo',
  password: 'bar'
}));

app.listen('3000');

```   

Then you can just GET stuff, like this:

```
curl localhost:3000/someRoute/list
```

**Options**

The options object concerns how the router should communicate with the graylog server.

Key | Default
--- | ---
username | none
password | none
protocol | http
host | localhost
port | 9000

## Identification

Dashboards and widgets can be ideitified in the API by either their graylog id ( which may change ) or their title ( which should not ).

## API

Route | Function
--- | ---
**/list** | lists all dashboards |
**/list/[dashboardIdentifier]** | data concerning the identified dashboard
**/widget/[dashboardIdentifier]/[widgetIdentifier]** | data concerning the identified widget in the identified dashboard
**/widget/[dashboardIdentifier]** | data concerning all widgets in the identified dashboard

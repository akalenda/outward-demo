# Outward Demo

This is a simple [Koa.js](https://koajs.com) 
application being done as an exercise. 

Koa.js is a server-side framework for NodeJS. It is very 
light-weight, with most functionality being accomplished
through "middleware" (e.g. plugins, extensions, whatever 
you want to call it).

## Use cases

 1. When navigating to `/` (e.g. the root), display a "Hello world" notice
 2. When navigating to `/math`:
    - Prompts for input of the following binary operations:
        - addition
        - subtraction
        - multiplication
        - division
    - `POST` to server. (Arguably, this should be a `GET` since it does not
        change the server-side state, but this is being done as an exercise)
    - Server processes and replies to front-end
    - Front-end displays
 3. When navigating to `/auth`:
    - Demonstrates a secure authentication pattern
    - No database is in effect
    - It uses static credentials: `testUser:password1234`
    - This is a demonstration of secure authentication; the focus is on having good 
        practices in place to avoid leaking data
    -An appropriate success/failure message is displayed on the page when complete
    
## Running the app



```
TODO
```
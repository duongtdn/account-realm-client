" use strict"

const html = {

  sso ({targetOrigin, status, message, script}) {
    return `
    <!DOCTYPE html>
    <html>
    
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1,  shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        
        <title>Accounts</title>      
           
        <!-- <link rel="stylesheet" type="text/css" href="w3.css"> -->
        <!-- <link rel="stylesheet" href="font-awesome-4.6.3/css/font-awesome.min.css"> -->
    
        <style>
    
        </style>
    
        <script type="text/javascript" src="${script}" ></script>
    
      </head>
    
      <body>    
    
        <script>
          var targetOrigin = '${targetOrigin}'
          var status = '${status}'
          var message = '${JSON.stringify(message)}'
        </script>
    
      </body>
    
    </html>
    `
  },

  authenForm (endpoint) {
    return `
    <!DOCTYPE html>
    <html>
    
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1,  shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        
        <title>Accounts</title>      
           
        <link rel="stylesheet" type="text/css" href="https://www.w3schools.com/w3css/4/w3.css">
    
        <style>
    
        </style>
    
      </head>
    
      <body>    

        <h2> Create new account / login </h2>
    
        <form action="${endpoint}" class="w3-container" method="post">
          <p>
            <label> Username </label>
            <input class="w3-input " type="text" name="username" placeholder="Please enter username" />
          </p>
          <p>
            <label> Password </label>
            <input class="w3-input " type="password" name="password" placeholder="Please enter password" />
          </p>
          
          <input type="submit" value="Submit" class="w3-button w3-blue" />
        </form>
    
      </body>
    
    </html>
    `
  }

}

module.exports = html
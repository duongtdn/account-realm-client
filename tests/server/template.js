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

  authenForm (title, endpoint, {realm, app}, script) {
    return `
    <!DOCTYPE html>
    <html>
    
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1,  shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        
        <title>Accounts</title>      
           
        <link rel="stylesheet" type="text/css" href="https://www.w3schools.com/w3css/4/w3.css">

        <script type="text/javascript" src="${script}" ></script>
    
        <style>
    
        </style>
    
      </head>
    
      <body class="w3-container">    

        <header className="w3-container "> 
          <span onclick="xclose()" class="w3-button w3-right w3-red">&times;</span>
          <h2 class="w3-text-green" style="fontWeight: bold" > ${title} </h2>
        </header>
    
        <form action="${endpoint}" method="post">
          <p>
            <label> Username </label>
            <input class="w3-input w3-border" type="text" name="username" placeholder="Please enter username" />
          </p>
          <p>
            <label> Password </label>
            <input class="w3-input w3-border" type="password" name="password" placeholder="Please enter password" />
          </p>
          <input type="hidden" name="realm" value="${realm}" />
          <input type="hidden" name="app" value="${app}" />
          
          <input type="submit" value="Submit" class="w3-button w3-blue" />
        </form>
        
      </body>
    
    </html>
    `
  }

}

module.exports = html
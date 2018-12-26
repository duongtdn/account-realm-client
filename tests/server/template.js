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
  } 

}
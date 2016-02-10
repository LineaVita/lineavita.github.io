# Vita
Bring your own S3 storage life tracking system


File Structure

    /
    /places
    /posts
    /friends
    /files

# Objects
Post

    PostDateTime
    Text
    Location 
    Place
    FileCount
    FileIds
    Tags

Place
    
    _id
    Name
    Description
    Latitude
    Longitude


File

    Filename
    Uri



Location
    
    DateTime
    Latitude
    Longitude
    
    
Friend
    
    FirstName
    LastName
    Email
    Twitter
    PrimaryPhone
    SecondaryPhone    
    BirthDate
    



# Install
Installed Javascript Libraries

    bower install angular
    bower install angular-animate
    bower install angular-aria
    bower install angular-messages
    bower install angular-route
    bower install angular-material
    bower install aws-sdk-js
    bower install --save pouchdb
    bower install node-uuid
    bower install --save angular-pouchdb
    bower install angular-messages
    bower install pouchdb-find


#AWS SDK Configuration
To get replication to a AWS bucket you must set the following information into the configuration tab.

1. AWS Access Key
1. AWS Secret Key
1. AWS Region
1. AWS Bucket Name

The bucket must also be configured to allow cross domain transfers.  While you could host Vita out of a S3 Bucket I wouldn't recommend hosting it out of the same bucket as you are storing data to.

    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <CORSRule>
            <AllowedOrigin>*</AllowedOrigin>
            <AllowedMethod>GET</AllowedMethod>
            <AllowedMethod>PUT</AllowedMethod>
            <AllowedMethod>POST</AllowedMethod>
            <AllowedMethod>DELETE</AllowedMethod>
            <MaxAgeSeconds>3000</MaxAgeSeconds>
            <AllowedHeader>*</AllowedHeader>
        </CORSRule>
    </CORSConfiguration>




vitaApp.factory('PostService', ['uuid', 'pouchDB', '$q', 'broadcastService',
function(uuid, pouchDB, $q, broadcastService) {
  var postService = {};
  
  //Set variables
  postService.Broadcast = broadcastService;
  postService.uuid = uuid;
  postService.Ready = false;
    
  //Setup the database
  postService.db = pouchDB("postings");
  
  //Create Indexes
  var dateIndex = { index: { 
      name: "postDateTimeIndex",
      fields: ['PostDateTime'] 
    }
  };

  //Create an index for dates
  postService.db.createIndex(dateIndex)
  .then(function() {
    postService.Ready = true;
    postService.Broadcast.Send('PostServiceReady', null);
  });
  
  //New Post
  postService.NewPost = function() {
    var entry = {};
    
    entry.PostDateTime = Date.now();   
    entry.Text = "";
    entry.Location = null;
    entry.FileCount = 0;
    entry.Place = null;
    entry.FileIds = null;
           
    return entry;
  };
  
  //Save the post to the database
  postService.SavePost = function(entry) {
    var deferred = $q.defer();

    if (entry != null) {
      //if null then a new post
      if (entry._id == null) {
        entry._id = uuid.v4();

        postService.db.post(entry)
        .then(function(output) {
          postService.Broadcast.Send('PostSaved', entry);
          
          return deferred.resolve(output);
        });
      } else {
        //Try to load the post
        postService.GetPost(entry._id)
        .then(function(doc) {
          if (doc != null) {
            //found the post so pull the rev out of it and
            //put it on the post
            entry._rev = doc._rev;
            
            //Save the post to db
            postService.db.put(entry)
            .then(function(output) {
              postService.Broadcast.Send('PostSaved', entry);
              
              deferred.resolve(output);
            });
          } else {
            //not found so a new post
            postService.db.post(entry)
            .then(function(output) {
              postService.Broadcast.Send('PostSaved', entry);
              
              deferred.resolve(output);
            });
          }
        });   
      }
    }
    
    return deferred.promise;   
  };
  
  //Get a specific post from the database
  postService.GetPost = function(id) {
    var deferred = $q.defer();
    
    postService.db.get(id)
    .then(function(doc) {
      deferred.resolve(doc);
    })
    .catch(function (err) {
      deferred.resolve(null);         
    });
        
    return deferred.promise; 
  };
  
  //Returns posts for a recent period of time (90 days)
  postService.GetRecentPosts = function() {
    var deferred = $q.defer();
    
    var now = new Date();
    var start = new Date();
    start.setDate(start.getDate() - 90);
    
    postService.GetPostsSince(start)
    .then(function(posts) {
      deferred.resolve(posts);
    });
        
    return deferred.promise;  
  };
  
  //Returns posts in a time period
  postService.GetPostsInRange = function(startDate, endDate) {
    var deferred = $q.defer();
    
    postService.db.find({
      selector: {
        $and: [
          { DateTime: { $gte: startDate } },
          { DateTime: { $lte: endDate } }
        ],
        sort: [ {DateTime: 'desc'} ]    
      }
    })
    .then(function(posts) {
        //loop through and just return the actual posts.
        var output = [];
    
        if (posts != null && posts.docs != null) {
          for (i = 0, len = posts.docs.length; i < len; i++) { 
              output.push(posts.docs[i]);
          }
        }

        deferred.resolve(output);
    })
    .catch(function (err) {
      deferred.resolve(null);         
    });
    
    return deferred.promise; 
  } 
  
  postService.GetPostsSince = function(startDate) {
    var deferred = $q.defer();
    
    var select = {
      selector: { PostDateTime: { $gte: startDate.valueOf() } },
      sort: [ {PostDateTime: 'desc'} ]    
    };
    
    postService.db.find(select)
    .then(function(posts) {
        //loop through and just return the actual posts.
        var output = [];
    
        if (posts != null && posts.docs != null) {
          for (i = 0, len = posts.docs.length; i < len; i++) { 
              output.push(posts.docs[i]);
          }
        }

        deferred.resolve(output);
    })
    .catch(function (err) {
      deferred.resolve(null);         
    });
    
    return deferred.promise; 
  }  
   
  postService.GetPostDateString = function(postDateTime) {
    var d = new Date(postDateTime);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString()
  };
  
  postService.GetLocationString = function(location) {
    if (location != null) {
      return "Position (" + location.Latitude.toFixed(4) + ", " + location.Longitude.toFixed(4) + ")";
    }
  }
  
  postService.GetGoogleHref = function(location, api) {
    if (location != null) {
      return "https://www.google.com/maps/embed/v1/view?key=" + api + "&center=" +location.Latitude.toFixed(4) + "," + location.Longitude.toFixed(4)
    }      
  }
  
    postService.GetGoogleHref2 = function(location) {
    if (location != null) {
      return "https://www.google.com/maps/@" + location.Latitude.toFixed(4) + "," + location.Longitude.toFixed(4) + ",18z";
    }      
  }
  
  return postService;  
}]);
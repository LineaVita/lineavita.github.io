vitaApp.factory('awsService', ['$rootScope', '$q', '$mdToast', 'ConfigurationService', 'ToastService',
function($rootScope, $q, $mdToast, configService, toastService) {
  var awsService = {};
   
  awsService.Enabled = false;
  awsService.rootScope = $rootScope;
  awsService.ConfigService = configService;
  awsService.ToastService = toastService;
  awsService.S3 = {};
  
  //TODO load
  awsService.UseAws = true;
  awsService.ShowNotifications = false;
  awsService.Credentials = {};  
  awsService.Configuration = {};
    
  awsService.getConfig = function() {
    awsService.ConfigService.LoadConfiguration()
    .then(function(config) {
      if (config != null) {
        awsService.Configuration = config;
        awsService.UseAws = config.UseAWS;
        awsService.ShowNotifications = config.ShowAWSNotifications;
        
        awsService.ConfigureS3();        
      } else {
        awsService.UseAws = false;
      }            
    });    
  }
  
  awsService.ConfigureS3 = function() {
    if (awsService.Configuration.AWSKey != null && awsService.Configuration.AWSSecret != null) {
          awsService.Credentials = {
            accessKeyId: awsService.Configuration.AWSKey, 
            secretAccessKey: awsService.Configuration.AWSSecret };

          awsService.Enabled = true;
          //TODO mark as ready and deal with stuff that came in before ready.
          //Check in database for new records? 

          //TODO verify that we can list the bucket
    }
  }
  
  awsService.ListBucket = function(){
    var deferred = $q.defer();
    
    //TODO add code to list bucket
    
    return deferred.promise;
  }
  
  awsService.UploadFile = function(objectType, filename, filetype, file) {
    // Configure The S3 Object 
    AWS.config.update(awsService.Credentials);
    AWS.config.region = awsService.Configuration.AWSRegion;
    
    var bucket = new AWS.S3({ params: { Bucket: awsService.Configuration.AWSBucketName } });

    if (file) {
      var params = { Key: filename, ContentType: filetype, Body: file, ServerSideEncryption: 'AES256' };

      bucket.putObject(params, function(err, data) {
        if(err) {
          // There Was An Error With Your S3 Config
          alert(err.message);
          return false;
        }
        else {
          // Success!
          if (awsService.ShowNotifications) {
            awsService.ToastService.ShowToast('Uploaded ' + objectType + ' to aws')
          }          
        }
      })
      .on('httpUploadProgress',function(progress) {
            // Log Progress Information
            console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
       });
    }
    else {
      // No File Selected
      alert('No File Selected');
    }
  }
    
  awsService.SavePost = function(post) {
    if (awsService.Enabled) {
      if (post != null) {
        var filename = "posts/" + post._id + '.json';
        var filetype = "application/json";
        var body = JSON.stringify(post);

        awsService.UploadFile('post', filename, filetype, body);
      }
    }
  };
  
  awsService.SavePlace = function(place) {
    if (awsService.Enabled) {
      if (place != null) {
        var filename = "places/" + place._id + '.json';
        var filetype = "application/json";
        var body = JSON.stringify(place);

        awsService.UploadFile('place', filename, filetype, body);
      }
    }
  };
  
  awsService.SaveFile = function(fileId, extension, filetype, file) {
    if (awsService.Enabled) {
      if (file != null) {
        var filename = "files/" + fileId + '.' + extension;
        
        awsService.UploadFile('file', filename, filetype, file);
      }
    }
  };
  
  awsService.SaveFriend = function(friend) {
    if (awsService.Enabled) {
      if (friend != null) {
        var filename = "friends/" + friend._id + '.json';
        var filetype = "application/json";
        var body = JSON.stringify(friend);

        awsService.UploadFile('friend', filename, filetype, body);
      }    
    }
  };
  
  awsService.DeleteFriend = function(friend) {
   if (awsService.Enabled) {
      if (friend != null) {
        //TODO delete the file?  Or move it to deleted?
      }
    }    
  };
  
  awsService.DeletePost = function(post) {
   if (awsService.Enabled) {
      if (post != null) {
        //TODO delete the file?  Or move it to deleted?
      }
    }
  };
  
  awsService.DeleteFile = function(file) {
   if (awsService.Enabled) {
      if (file != null) {
        //TODO delete the file?  Or move it to deleted?
      }
    }
  };
  
  awsService.DeletePlace = function(place) {
   if (awsService.Enabled) {
      if (place != null) {
        //TODO delete the file?  Or move it to deleted?
      }
    }
  };
  
    
  $rootScope.$on('FriendSaved', function(event, friend){
    if (awsService.UseAws) {
      awsService.SaveFriend(friend);
    }    
  });
  
  $rootScope.$on('FriendDeleted', function(event, friend){
    if (awsService.UseAws) {
      awsService.DeleteFriend(friend);
    }    
  });
  
  $rootScope.$on('PlaceSaved', function(event, place){
    if (awsService.UseAws) {
      awsService.SavePlace(place);
    }    
  });
  
  $rootScope.$on('PlaceDeleted', function(event, place){
    if (awsService.UseAws) {
      awsService.DeletePlace(place);
    }    
  });
  
  $rootScope.$on('PostSaved', function(event, post){
    if (awsService.UseAws) {
      awsService.SavePost(post);
    }    
  });
  
  $rootScope.$on('PostDeleted', function(event, post){
    if (awsService.UseAws) {
      awsService.DeletePost(post);
    }    
  });
  
  $rootScope.$on('FileSaved', function(event, file){
    if (awsService.UseAws) {
      awsService.SaveFile(file.FileId, file.Extension, file.Filetype, file.File);
    }    
  });
  
  $rootScope.$on('FileDeleted', function(event, file){
    if (awsService.UseAws) {
      awsService.DeleteFile(file);
    }    
  });
  
  awsService.getConfig();
    
  // factory function body that constructs shinyNewServiceInstance
  return awsService;
}]);
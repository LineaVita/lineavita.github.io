vitaApp.factory('FileService', ['uuid', 'pouchDB', '$q', 'broadcastService',
function(uuid, pouchDB, $q, broadcastService) {
  var fileService = {};
  
  fileService.uuid = uuid;
  fileService.Broadcast = broadcastService;
  
  //Setup the database for friends
  fileService.db = pouchDB("files");
  
  //Create an index for dates
  fileService.db.createIndex({ index: { fields: ['LastModifiedDateTime'] } })  
  .then(function() {
    fileService.Ready = true;
    fileService.Broadcast.Send('FileServiceReady', null);
  });
  
  fileService.LoadFile = function(fileId) {
    var deferred = $q.defer();
    
    fileService.db.getAttachment('image', 'file')
    .then(function(blob) {
      deferred.resolve(blob);
    });
    
    return deferred.promise;
  }
  
  fileService.GetFile = function(fileId) {
    var deferred = $q.defer();
    
    fileService.db.getAttachment(fileId, 'file')
    .then(function(blob) {
      var url = URL.createObjectURL(blob);      
      deferred.resolve(url);
    });
    
    return deferred.promise;
  }  
  
  fileService.SaveFile = function (fileId, filename, filesize, file) {
    var deferred = $q.defer();
    
    fileService.db.put({
      _id: fileId,
      Filename: filename,
      FileSize: filesize,
      LastModifiedDateTime: Date.now(),
      _attachments: {
        "file": {
          type: file.type,
          data: file
        }
      }
    }).then(function () {
      var re = /(?:\.([^.]+))?$/;
      var extension = re.exec(filename)[1]; 
      
      var broadcastFile = { "FileId" : fileId, "Extension" : extension, "Filetype" : file.type, "File":file }
      
      fileService.Broadcast.Send('FileSaved', broadcastFile);
      
      deferred.resolve(fileId);
    });
    
    return deferred.promise;
  }
  
  fileService.GetFilesModifiedSince = function(startDate) {
    var deferred = $q.defer();
    
    var select = {
      selector: { LastModifiedDateTime: { $gte: startDate.valueOf() } },
      sort: [ {LastModifiedDateTime: 'asc'} ]    
    };
    
    fileService.db.find(select)
    .then(function(posts) {
        //loop through and just return the actual files.
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
  };   
  
  return fileService;  
}]);
vitaApp.factory('FileService', ['uuid', 'pouchDB', '$q', 'broadcastService',
function(uuid, pouchDB, $q, broadcastService) {
  var fileService = {};
  
  fileService.uuid = uuid;
  fileService.Broadcast = broadcastService;
  
  //Setup the database for friends
  fileService.db = pouchDB("files");
  
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
  
  return fileService;  
}]);
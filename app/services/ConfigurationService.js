vitaApp.factory('ConfigurationService', ['pouchDB', '$q', 
function(pouchDB, $q) {
  var settingsToSave = 7;
  var configurationService = {};

  //setup the db
  configurationService.db = pouchDB("configuration");
  
  //Load the configuration settings the populate the object
  configurationService.LoadConfiguration = function() {
    var deferred = $q.defer();      

    configurationService.GetSettings()
    .then(function(settings) {
      var output = configurationService.NewConfig();

      output.UseAWS = configurationService.FindSetting('UseAWS', settings, false);
      output.AWSKey = configurationService.FindSetting('AWSKey', settings, null);
      output.AWSSecret = configurationService.FindSetting('AWSSecret', settings, null);
      output.AWSRegion = configurationService.FindSetting('AWSRegion', settings, null);
      output.AWSBucketName = configurationService.FindSetting('AWSBucketName', settings, null);
      output.ShowAWSNotifications = configurationService.FindSetting('ShowAWSNotifications', settings, false);
      output.GoogleApiKey = configurationService.FindSetting('GoogleApiKey', settings, null);
            
      deferred.resolve(output);
    });      

    return deferred.promise;
  };

  //Save the settings to the database
  configurationService.SaveConfiguration = function(configuration) {
    var deferred = $q.defer(); 
    var i = 0;
    
    configurationService.SaveSetting('UseAWS', configuration.UseAWS)
    .then(function() {
      i++;
      
      if (i>=settingsToSave) { deferred.resolve(true); }
    });
    
    configurationService.SaveSetting('AWSKey', configuration.AWSKey)
    .then(function() {
      i++;
      
      if (i>=settingsToSave) { deferred.resolve(true); }
    });
    
    configurationService.SaveSetting('AWSSecret', configuration.AWSSecret)
    .then(function() {
      i++;
      
      if (i>=settingsToSave) { deferred.resolve(true); }      
    });
    
    configurationService.SaveSetting('AWSRegion', configuration.AWSRegion)
    .then(function() {
      i++;
      
      if (i>=settingsToSave) { deferred.resolve(true); }
    });
    
    configurationService.SaveSetting('AWSBucketName', configuration.AWSBucketName)
    .then(function() {
      i++;
      
      if (i>=settingsToSave) { deferred.resolve(true); }
    });
    
    configurationService.SaveSetting('GoogleApiKey', configuration.GoogleApiKey)
    .then(function() {
      i++;
      
      if (i>=settingsToSave) { deferred.resolve(true); }
    });
    
    configurationService.SaveSetting('ShowAWSNotifications', configuration.ShowAWSNotifications)
    .then(function() {
      i++;
      
      if (i>=settingsToSave) { deferred.resolve(true); }
    });
    
    return deferred.promise;
  };

  configurationService.NewConfig = function() {
    var config = {};

    config.UseAWS = false;
    config.AWSKey = "";
    config.AWSSecret = "";
    config.AWSRegion = "";
    config.AWSBucketName = "";
    config.ShowAWSNotifications = false;
    config.GoogleApiKey = "";

    return config;
  };

  configurationService.SaveSetting = function(name, value) {
    var deferred = $q.defer();

    configurationService.GetSettingByName(name)
    .then(function(setting) {
      if (setting != null) {
        setting.value = value;

        configurationService.db.put(setting)
        .then(function(output) { 
          deferred.resolve(output) 
        });
      } else {
        setting = { _id:name, 'value':value };

        configurationService.db.post(setting)
        .then(function(output) { 
          deferred.resolve(output) 
        });
      }
    });
    
    return deferred.promise;
  };

  configurationService.FindSetting = function(settingName, settings, defaultValue)
  {
    for (i = 0, len = settings.length; i < len; i++) { 
      var setting = settings[i];
      
      if (setting._id == settingName) {
        return setting.value;    
      }
    }

    return defaultValue;
  };

  configurationService.GetSettingByName = function(name) {
    var deferred = $q.defer(); 

    configurationService.db.get(name)
    .then(function(doc) {
      deferred.resolve(doc);         
    })
    .catch(function (err) {
      deferred.resolve(null);         
    });

    return deferred.promise;
  };  

  configurationService.GetSettings = function() {
    var deferred = $q.defer();      

    configurationService.db.allDocs({ include_docs: true, attachments: true })
    .then(function(docs){
      var output = [];

      for (i = 0, len = docs.rows.length; i < len; i++) { 
          output.push(docs.rows[i].doc);
      }

      deferred.resolve(output);
    });

    return deferred.promise;
  };

  return configurationService;
}]);
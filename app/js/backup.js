    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Vita</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li><a href="#post">Post</a></li>
            <li><a href="#friends">Friends</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#configure">Configure</a></li>
          </ul>
        </div>
      </div>
    </nav>
            
            
    <!-- Set up metadata -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">            
      
        <md-card-title>
          <md-card-title-text>
            <span class="md-headline">{{ PostService.GetPostDateString(post.PostDateTime) }}</span>
            <span class="md-subhead">{{ PostService.GetLocationString(post.Location) }}</span>
          </md-card-title-text>
          <md-card-title-media>
            <div class="md-media-sm">
              <img ng-src="{{ GetFileUrl(post) }}" class="md-card-image" ng-show="HasFile(post)">
            </div>
          </md-card-title-media>
        </md-card-title>          
              
        <md-card-title>
          <md-card-title-media>
            <div class="md-media-sm card-media">
              <img ng-src="{{ GetFileUrl(post) }}" class="md-card-image" ng-show="HasFile(post)">
            </div>
          </md-card-title-media>
        </md-card-title>     
              
              
  <md-content  layout-padding class="md-padding" id="AppContentsBody" >
    <section class="md-padding" layout="row" layout-align="center start" layout-wrap layout-align="space-between start" >
      <md-card ng-repeat="post in RecentPosts" flex="100" ng-style="{'background-color':'white'}" class="PostCard" >
        <md-card-header>
          <md-card-header-text>
            <span class="md-title" >{{ PostService.GetPostDateString(post.PostDateTime) }}</span>
            <span class="md-subhead" >{{ PostService.GetLocationString(post.Location) }}</span>
          </md-card-header-text>
        </md-card-header>   
        <md-card-content layout="row" layout-xs="column" layout-sm="column" layout-padding class="md-padding">
          <div class="md-media-sm card-media" flex="20" ng-show="HasFile(post)" >
            <img ng-src="{{ GetFileUrl(post) }}" class="md-card-image" ng-show="HasFile(post)" >
          </div>
          <div flex >
            <p>{{ post.Text}}</p>  
          </div>          
        </md-card-content>
        <md-card-actions layout="row" layout-align="end center">
          <md-button ng-href="#post/{{ post._id }}" class="md-raised md-accent">Edit</md-button>            
        </md-card-actions>  
      </md-card>  
    </section>
  </md-content>                 
          
                    <input type="text" class="form-control" id="postPlace" name="postPlace" ng-model="Post.Place" required></textarea>

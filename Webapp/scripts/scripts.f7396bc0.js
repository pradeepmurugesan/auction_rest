"use strict";angular.module("auction-ui",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","swaggerUi"]).config(["$routeProvider",function(a){a.when("/auction/:auctionId",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/home",{templateUrl:"views/home.html"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",controllerAs:"login"}).when("/apis",{templateUrl:"views/apis.html",controller:"ApisCtrl",controllerAs:"apis"}).when("/admin",{templateUrl:"views/admin.html"}).otherwise({redirectTo:"/login"})}]);var app=angular.module("auction-ui");app.run(["$rootScope","$location",function(a,b){a.$on("$routeChangeStart",function(a,c,d){var e=localStorage.getItem("user");console.log("loggedin user ",e),e||"views/login.html"!=c.templateUrl&&b.path("/login")})}]),angular.module("auction-ui").controller("MainCtrl",["socket","config","$routeParams","rest",function(a,b,c,d){console.log("******"),console.log(b),console.log(c),console.log("******");var e=this;e.auctionId=c.auctionId,e.user=JSON.parse(localStorage.getItem("user")),d.getAuction(e.auctionId).then(function(a){console.log("data from controller"),console.log(a),e.auction=a,e.highestBid=e.auction.latestBid,e.highestBid||(e.highestBid={price:e.auction.item.startingPrice}),e.nextBidPrice=e.highestBid.price+20}),a.on("connect",function(){console.log("registering to the real time service channel"+e.auctionId),a.emit("register",e.auctionId)}),a.on("bidUpdated",function(a){console.log("================"),console.log(a),console.log(typeof a),console.log("================"),e.highestBid=JSON.parse(a),e.nextBidPrice=e.highestBid.price+20}),e.placeBid=function(){var a={};a.userId=e.user.id,a.auctionId=e.auctionId,a.price=e.nextBidPrice,console.log(a),d.placeBid(a).then(function(a){console.log("successfully placed the bid")})["catch"](function(a){console.log(a)})}}]),angular.module("auction-ui").controller("LoginCtrl",["rest","$location",function(a,b){var c=this;c.invalidLogin=!1,a.getUsers().then(function(a){c.users=a}),c.validate=function(){c.invalidLogin=!1;var a=void 0;console.log(c.user);for(var d=0,e=c.users.length;e>d;d++){var f=c.users[d];if(f.name.toUpperCase()===c.user.name.toUpperCase()){a=f;break}}console.log("loggined in user",a),void 0===a?c.invalidLogin=!0:(localStorage.setItem("user",JSON.stringify(a)),b.path("/home"))}}]),angular.module("auction-ui").controller("ApisCtrl",["config",function(a){var b=this;b.swaggerJsonUrl=a.restApisUrl+"/swagger.json"}]),angular.module("auction-ui").factory("socket",["$rootScope","config",function(a,b){console.log("******"),console.log(b),console.log("******");var c=io.connect(b.webSocketUrl);return console.log("Initializing the connection of socket it"),{on:function(b,d){c.on(b,function(b){var e=arguments;a.$apply(function(){d.apply(c,e)})})},emit:function(b,d,e){c.emit(b,d,function(){var b=arguments;a.$apply(function(){e&&e.apply(c,b)})})}}}]),angular.module("auction-ui").factory("rest",["$rootScope","config","$http",function(a,b,c){function d(a){function d(a,b,c){return console.log(a),a.data}return console.log("AuctionId "+a),c.get(b.restApisUrl+"/auction/"+a).then(d)["catch"](function(a){console.error("Error occured while fetching the auction details")})}function e(a){function d(a,b,c){return console.log(a),a.data}return console.log("Bidding for"),console.log(a),c.post(b.restApisUrl+"/bid/",a).then(d)["catch"](function(a){console.log("error occured while adding the bid"),console.log(a)})}function f(){function a(a,b,c){return console.log(a),a.data}return c.get(b.restApisUrl+"/user").then(a)["catch"](function(a){console.error("Error occured while fetching the users")})}return{getAuction:d,placeBid:e,getUsers:f}}]),function(){function a(){var a=angular.injector(["ng"]),b=a.get("$http");return b.get("resources/uiconfig").then(function(a){c.constant("config",a.data)},function(a){})}function b(){angular.bootstrap(document,["auction-ui"])}var c=angular.module("auction-ui");a().then(b)}(),angular.module("auction-ui").run(["$templateCache",function(a){a.put("views/admin.html",'<div class="alert alert-info"> <strong>Yet to Implement !!!</strong> </div>'),a.put("views/apis.html",'<h4>Swagger Documentation for Rest Apis</h4> <hr> <div swagger-ui url="apis.swaggerJsonUrl" trusted-sources="true"></div>'),a.put("views/home.html",'<div class="alert alert-danger"> <h4> Alert! </h4> <strong>Warning!</strong> Please add the auctionId in the url parameter to navigate and bid. <strong>Happy Bidding !!!</strong> <div> Sample URL : /auction/1 </div> </div>'),a.put("views/login.html",'<div class="alert alert-info"> <h4> Alert! </h4> Kindly sign in using any existing user listed. This is just to set the user context. Password can be anything </div> <div class="container"> <div class="row vertical-offset-100"> <div class="col-md-12"> <div class="col-md-6"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Sign in</h3> </div> <div class="panel-body"> <form accept-charset="UTF-8" name="loginForm" role="form" novalidate> <fieldset> <div class="form-group"> <input required class="form-control" ng-model="login.user.name" placeholder="User name" name="username" type="text"> </div> <div class="form-group"> <input required class="form-control" ng-model="login.user.password" placeholder="Password" name="password" type="password" value=""> </div> <input ng-disabled="loginForm.$invalid" ng-click="login.validate()" class="btn btn-lg btn-success btn-block" type="submit" value="Login"> </fieldset> </form> <hr> <div ng-if="login.invalidLogin" class="alert alert-danger"> Invalid Login!! </div> </div> </div> </div> <div ng-if="login.users.length > 0" class="col-md-4"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">List of available users</h3> </div> <div class="panel-body"> <ul> <li ng-repeat="user in login.users">{{user.name}}</li> </ul> </div> </div> </div> </div> </div> </div>'),a.put("views/main.html",'<div class="row"> <div class="col-md-12"> <img src="http://placehold.it/700x250?text=carousel"> </div> </div> <hr> <div class="row"> <div class="col-md-8"> <div class="row"> <div class="col-md-6"> <img src="http://placehold.it/200?text=item"> </div> <div class="col-md-6"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </div> </div> </div> <div class="col-md-4"> <div ng-if="main.auction.isLive" class="panel panel-info"> <div class="panel-heading"> <h3 class="panel-title"> Latest Bid by </h3> </div> <div class="panel-body"> <div id="usersection" ng-if="main.highestBid.user"> <address> <strong><span id="userName" ng-bind="main.highestBid.user.name"></span></strong>, <strong><span id="userLocation" ng-bind="main.highestBid.user.location"></span></strong> <br> </address> <div> <img src="http://placehold.it/100x64?text=flag"> </div> </div> <div ng-if="!main.highestBid.user"> No Bids placed. </div> <strong>Amount</strong> <span id="price" ng-bind="main.highestBid.price"></span> </div> <div class="panel-footer"> <button ng-click="main.placeBid()" type="button" class="btn btn-block btn-success"> Commit to Bid <span id="nextBidPrice" ng-bind="main.nextBidPrice"></span> </button> </div> </div> <div ng-if="!main.auction.isLive"> <div class="alert alert-danger"> <h4> Alert! </h4> Auction is not <strong>Live !!</strong> </div> </div> </div> </div>')}]);
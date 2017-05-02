angular.module("kaifanla", ["ng", "ngRoute", "ngAnimate"])
  .controller("startCtrl",function($scope,$location){
    //start页面跳转至main页面
    $scope.jump = function(){
      $location.path("/main");
    }
  })
  //首面main的controller
  .controller("mainCtrl",function($scope,$http){
    $scope.hasMore = true;//显示加载更多的按钮
    $scope.isLoading = true;//显示是否加载中
    //载入页面,显示5个数据,发起Ajax请求
    $http.get("data/dish_listbypage.php").success(function(data){
      $scope.dishList = data;
      $scope.isLoading = false;
    });
    //点击按钮显示更多
    $scope.more = function(){
      //加载数据
      $scope.isLoading = true;
      //每点击一次,显示多dishLish长度个数据
      //发起Ajax请求
      $http.get("data/dish_listbypage.php?start="+$scope.dishList.length).success(function(data){
        if(data.length<5){
          //服务器没有数据,按钮消失,显示警告框
          $scope.hasMore = false;
        }
        $scope.dishList = $scope.dishList.concat(data);
        $scope.isLoading = false;
      });
    };
    $scope.$watch("kw",function(){
      if(!$scope.kw){
        return $scope.mainLoad();
      }
      $scope.isLoading = true;
      $http.get("data/dish_listbykw.php?kw="+$scope.kw).success(function(data){
        $scope.dishList = data;
        $scope.isLoading = false;
      });
    });
    $scope.mainLoad = function(){
      $http.get("data/dish_listbypage.php").success(function(data){
        $scope.dishList = data;
        $scope.isLoading = false;
      });
    };
  })
  //详情页面controller
  .controller("detailCtrl",function($scope,$http,$routeParams,$location) {
    //$routeParams用于取得url里的传递的参数
    $http.get("data/dish_listbydid.php?did=" + $routeParams.did).success(function (data) {
      $scope.dishDetail = data;
    });
    //点击跳转时,带参数传进来
    $scope.jumpToOrder = function (did) {
      $location.path("/order/"+did);
    };
  })
  //订单页面controller
  .controller("orderCtrl",function($scope,$http,$routeParams){
    //判断是否提交成功
    $scope.isSuccess = false;
    //监视数据的变化
    $scope.$watchGroup(["user_name","sex","phone","addr"],function(){
      $scope.userData = {"user_name":$scope.user_name,"sex":$scope.sex,"phone":$scope             .phone,"addr":$scope.addr,"did":$routeParams.did};
    });

    //提交表单用户数据
    $scope.submit = function(){
      //判断表单数据提交是否完整
      if(!($scope.userData.user_name && $scope.userData.sex && $scope.userData.phone && $scope.userData.addr)){
        console.log("请完整填写数据");
        return;
      }
      //将对象数据转为string类型(并格式为user_name=&sex=&phone=...)
      var postData = jQuery.param($scope.userData);
      //异步交互数据请求至数据后台
      $http.post("data/order_add.php",postData).success(function(data){
        if(data.status=="success"){
          $scope.isSuccess = true;
        }
      });
    }
  })
  .controller("myorderCtrl",function($scope,$http){
      $scope.phone = "15918790080";
      $http.get("data/order_listbyphone.php?phone="+$scope.phone).success(function(data){
        console.log(data);
        $scope.orderList = data;
      });
  })
  //配置路由字典
  .config(function($routeProvider){
    $routeProvider.when("/start",{
      templateUrl: "template/start.html",
      controller: "startCtrl"
    })
      .when("/main",{
        templateUrl: "template/main.html",
        controller: "mainCtrl"
      })
      //路径带有参数传递(参数格式 /:did)
      .when("/detail/:did",{
        templateUrl: "template/detail.html",
        controller: "detailCtrl"
      })
      .when("/order/:did",{
        templateUrl: "template/order.html",
        controller: "orderCtrl"
      })
      .when("/myorder",{
        templateUrl: "template/myorder.html",
        controller: "myorderCtrl"
      })
      .otherwise({
        redirectTo: "/start"
      });
  })
  .run(function($http){
    //配置默认的HTTPPOST请求的头部
    $http.defaults.headers.post = {"Content-Type":"application/x-www-form-urlencoded"};
  });

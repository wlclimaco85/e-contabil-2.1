(function() {
  'use strict';
	var commonControllers =  angular.module('wdApp.controllers', []);
  
	commonControllers.controller('WDAppController', ['$scope', '$rootScope', function($scope, $rootScope) {
		  
		$scope.admin = {
			layout: 'wide',
			menu: 'vertical'
		};

		return $scope.color = {
			primary: '#00475B',
			success: '#94B758',
			info: '#56BDF1',
			infoAlt: '#7F6EC7',
			warning: '#F3C536',
			danger: '#FA7B58'
		 };
    }]);
  
	commonControllers.controller('NavController', ['$scope', 'TaskStorage', 'filterFilter','AuthService','$interval', function($scope, TaskStorage, filterFilter,AuthService,$interval) {
		var tasks;
		tasks = $scope.tasks = TaskStorage.get();
		$scope.taskRemainingCount = filterFilter(tasks, {
			completed: false
		}).length;
		var oUser = JSON.parse(localStorage.getItem('wdAppLS.currentUser'));
		$scope.user= oUser;
		var fNotificacoesCount = function()
		{
			var oUser = JSON.parse(localStorage.getItem('wdAppLS.currentUser'));
			if(oUser && oUser.id){
				var oNotificacaoRequest = {userId : oUser.id,empresaId : 82,role : oUser.authorities[0]};
	                AuthService.contNotificacoes(oNotificacaoRequest, function (responses) {
	                $scope.notificacoesCount = responses.result.notificacaoCount;
				});
			}
		}
		
		fNotificacoesCount();
		
		$interval(fNotificacoesCount, 50000);
		  
		
    }]);
  
	commonControllers.controller('LoginController', ['$scope','SysMgmtData', '$rootScope', '$location', 'localStorageService','WDAuthentication', 
		function($scope, SysMgmtData, $rootScope, $location, localStorageService, WDAuthentication) {
		
			$scope.login = function() {
				//$scope.username, password: $scope.password
				let body = JSON.stringify(
				        { "username": $scope.username, "password": $scope.password }
				    )
				WDAuthentication.processLogin(WebDaptiveAppConfig.authenticationURL, body, function(authenticationResult) {
					debugger
					var authToken = authenticationResult.token;
					if (authToken !== undefined){	
						$rootScope.authToken = authToken;
						localStorageService.set('authToken', authToken);
					//	localStorageService.set('expires_in', authenticationResult.expires_in);
					//	localStorageService.set('jti', authenticationResult.jti);
						
		//				  var surl = "https://quadra-test.herokuapp.com/";
						  var sUrl = "http://localhost:8080/";
					SysMgmtData.processPostPageData(sUrl + "user/findUserByEmail", ""+$scope.username , function(res){
							
						var currentUser = res;
							$rootScope.user = currentUser;
							$rootScope.main.name = $scope.username;
							localStorageService.set('currentUser', $rootScope.user);
							var tempRole = "";
							var bAdmin = false;
							var prop = {};
							for (var x = 0; x < currentUser.authorities.length; x++) {
								prop = currentUser.authorities[x]
								tempRole += prop.name + "";
								if(prop.name === 'ROLE_USER')
									bAdmin = true;
							}							
							$rootScope.displayRoles = tempRole;
							localStorageService.set('displayRoles', $rootScope.displayRoles);						
						
											
						if ($rootScope.callingPath !== undefined){	
							if ($rootScope.callingPath === '/pages/signin' || $rootScope.callingPath ===  '/cadastro'){
								if(bAdmin)
								{
									$rootScope.callingPath = "/dashboard2";
								}
								else
								{
									$rootScope.callingPath = "/meusJogos";
								}
							}
							$location.path($rootScope.callingPath);
						}
						else{
							$location.path( "/meusJogos" );
						}	
					});
					}
					else{
							$location.path( "/pages/signin" );
					}		
				});
			};
    }]);	

})();

/**
 * Main AngularJS Web Application
 */
var formeoApp = angular.module('angularjs', ['ngRoute','ui.bootstrap','ui.grid']);
 
formeoApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/home", {
    	templateUrl: "partials/home.html", 
    	controller: "HomeCtrl"
     }) 
    .when("/about", {
    	templateUrl: "partials/about.html", 
    	controller: "HomeCtrl"
     })          
    .otherwise({
    	redirectTo: '/home'
    });
}]);

formeoApp.controller('HomeCtrl', function ($scope,$http) {
	var surveyResults = [];

	localStorage["EmployeeNames"]?loadFromLocalStorage():alert("Load Employee names from JSON!");
	$scope.onClickSubmit = function(selectedEmployeeName,surveyItem){
		surveyResults.push({
			"employeeName": selectedEmployeeName,
			"surveyItem"     : surveyItem
		});
		$scope.surveyResults = surveyResults;
	}

	$scope.onClickLoadFromJSON = function(){
		$http.get('serverside/EmployeeNames.json')
		.success(function(response){
			localStorage["EmployeeNames"]?loadFromLocalStorage():loadToLocalStorage(response.records);
		});
	}

	function loadFromLocalStorage(){
		$scope.employeeNames = JSON.parse(localStorage["EmployeeNames"]);
		$scope.selectedEmployeeName = $scope.employeeNames[0];		
	}

	function loadToLocalStorage(records){
		localStorage["EmployeeNames"]= JSON.stringify(records);
		$scope.employeeNames = JSON.parse(localStorage["EmployeeNames"]);
		$scope.selectedEmployeeName = $scope.employeeNames[0];		
	}

	$scope.onClickExportAsCSV = function(){
		var str = '';
		for(var i=0; i< surveyResults.length;i++){
			str += surveyResults[i].employeeName+","+surveyResults[i].surveyItem+'\r\n';
		}
		var uri = 'data:text/csv;charset=utf-8,' + escape(str);
		var downloadLink = document.createElement("a");
		downloadLink.href = uri;
		downloadLink.download = angular.element(".panel-heading")[0].innerHTML+".csv";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

});
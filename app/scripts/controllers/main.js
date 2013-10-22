'use strict';

app.controller('MainCtrl', function ($scope, $timeout, $window) {

	$scope.commands = typeof site !== "undefined" ? site.commands : null;
	$scope.command = null;
	$scope.term = "";

	function findElem(command){
		var elem = null;
		if(_.isArray(command.targetEl)){
			_.find(command.targetEl, function(selector){
				var e = $(selector);
				if(e.length !== 0){
					elem = e;
					return true;
				}
				return false;
			})
		} else {
			elem = $(command.targetEl);
		}
		return elem;
	}

	$scope.search = function(term) {
        if (typeof site === "undefined") return;

		$scope.commands = _.filter(site.commands, function(command){
			return command.name.toLowerCase().indexOf(term.toLowerCase()) !== -1 &&
				0 !== findElem(command).length;
		})
		if(term !== "") {
			$scope.commands = $scope.commands.concat({
	      		name: "Search for \"" + term + "\"",
	      		type: "search"
    		});
		}
	};

	$scope.select = function(item) {
		if(item.type == "search") {
			$window.location = site.searchurl + encodeURIComponent($scope.term);
			return;
		}

		$scope.command = item;
		$scope.term = "";
		
		var elem = findElem(command);

		if(0 !== elem.length){
			return;
		}

		function highlight(elem){
			var originalBorder = elem.css("border");
			elem.css("border","5px solid yellow");
			$timeout(function(){
				elem.css("border",originalBorder);
			},2000);
		}

		if(elem.length) {
			elem[0].click();
			highlight(elem);
		}
		if(item.focusEl){
			highlight($(item.focusEl));
			$timeout(function(){
				$(item.focusEl).focus();
			},400);
		}
	};
});
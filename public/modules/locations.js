angular.module('locations',['services'])
  .controller('locationsCtrl', LocationsCtrl)

function LocationsCtrl($scope, serviceApi) {
  var selectedId = -1;
  var addFlag = false;
  var editFlag = false;
  var removeFlag = false;
  var rings = [];

  $scope.model = {};
  $scope.errorMessage = '';
  $scope.isBusy = isBusy;
  $scope.isLoading = isLoading;
  $scope.startAdd = startAdd;
  $scope.startEdit = startEdit;
  $scope.startRemove = startRemove;
  $scope.cancel = reset;
  $scope.isInReadMode = isInReadMode;
  $scope.isInAddMode = isInAddMode;
  $scope.isInEditMode = isInEditMode;
  $scope.isInRemoveMode = isInRemoveMode;
  $scope.add = add;
  $scope.save = save;
  $scope.remove = remove;
  $scope.hasError = hasError;

  refresh();

  function isBusy(id) {
    if (angular.isDefined(id)) {
      return rings.indexOf(id) >= 0;
    } else {
      return rings.length > 0;
    }
  }

  function isLoading() {
    return isBusy(-2);
  }

  function startAdd() {
    reset();
    selectedId = -1;
    addFlag = true;
    $scope.model.locationBox = '';
    $scope.model.lastName = '';
  }

  function startEdit(id) {
    reset();
    selectedId = id;
    editFlag = true;
    for (var i=0;i<$scope.locations.length;i++){
      var item = $scope.locations[i];
      if (item._id == id){
        $scope.model.locationBox = item.displayName;
        $scope.model.lastName = item.displayLastName;
      }
    }
  }

  function startRemove(id) {
    reset();
    selectedId = id;
    removeFlag = true;
  }

  function reset() {
    selectedId = -1;
    addFlag = false;
    editFlag = false;
    removeFlag = false;
    $scope.errorMessage = '';
  }

  function isInReadMode(id) {
    return selectedId < 0 || selectedId != id;
  }

  function isInAddMode() {
    return addFlag;
  }

  function isInEditMode() {
    return editFlag;
  }

  function isInRemoveMode(id) {
    return selectedId == id && removeFlag;
  }

  function add() {
    useBackend(-1, function () {
      return serviceApi.post("location",
        {
          id: 0,
          displayName: $scope.model.locationBox,
          lastName: $scope.model.lastName
        })
    })
  }

  function save() {
    useBackend(selectedId, function () {
      return serviceApi.put("location",
        {
          id: selectedId,
          displayName: $scope.model.locationBox,
          lastName: $scope.model.lastName
        })
    })
  }

  function remove(id) {
    useBackend(id, function () {
      return serviceApi.delete("location", id);
    })
  }

  function hasError() {
    return $scope.errorMessage != '';
  }

  function busy(id) {
    if (isBusy(id)) {
      return;
    }
    rings.push(id);
  }

  function complete(id) {
    var idx = rings.indexOf(id);
    if (idx < 0) {
      return;
    }
    rings.splice(idx, 1);
  }

  function refresh() {
    busy(-2);
    serviceApi.get("location")
      .success(function (data) {
        $scope.locations = data;
        complete(-2);
        $scope.errorMessage = '';
      })
      .error(function(errorInfo, status){
        setError(errorInfo, status, -2);
      });
    reset();
  }

  function useBackend(id, operation) {
    busy(id);
    $scope.errorMessage = '';
    operation()
      .success(
      function (data) {
        refresh();
        complete(id);
      })
      .error(
      function(errorInfo, status){
        setError(errorInfo, status, id)
      });
  }

  function setError(errorInfo, status, id) {
    reset();
    complete(id);
    if (status == 401) {
      $scope.errorMessage = "Authorization failed."
    } else if (angular.isDefined(errorInfo.reasonCode)
        && errorInfo.reasonCode == "TenantLimitExceeded")
    {
      $scope.errorMessage =
          "You cannot add more locations.";
    } else {
      $scope.errorMessage = errorInfo.message;
    }
  }
}
(function() {
  'use strict';

  angular
  .module('events')
  .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope, $timeout, toastr, event, moment, users, participations) {
    var vm = this;
    $rootScope.bodyClass = "app";
    $rootScope.context = "main";

    vm.events = {};
    vm.data = moment;
    vm.isActive = isActive;
    vm.addUserParticipation = addUserParticipation;
    vm.containsObject = containsObject;
    vm.removeUserParticipation = removeUserParticipation;
    vm.getIndexOf = getIndexOf;
    
    

    function isActive(viewLocation) { 
      return viewLocation === $location.path() ? 'active' : '';
    }

    activate();

    function activate() {
      event.getAll(function(data){
        vm.events = data;
      });
    }
    
    function addUserParticipation(event, slot){
      if(!vm.containsObject($rootScope.currentUser, slot.users)){
        var obj = {};
        obj.slotId = slot.id;
        obj.userId = $rootScope.currentUser.id;
        participations.create({id:event.id}, obj, function(res) {
          if(res.status == "success"){
            slot.users.push($rootScope.currentUser);
            toastr.success('Participation enregistrée', 'Succès');
          }
        });
      }else{
        vm.removeUserParticipation(slot);
      } 
    }
    
    function removeUserParticipation(slot){
      participations.delete({id:slot.id, userid: $rootScope.currentUser.id}, function(res) {
        if(res.status == "success"){
          var index = vm.getIndexOf($rootScope.currentUser, slot.users);
          slot.users.splice(index, 1);
          toastr.success('Participation supprimée', 'Succès');
        }
      });
    }
    
    function containsObject(obj, array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === obj.id) {
          return true;
        }
      }
      return false;
    }
    
    function getIndexOf(obj, array){
      for (var i = 0; i < array.length; i++) {
        if (array[i].id === obj.id) {
          return i;
        }
      }
      return -1;
    }

    
  }
})();

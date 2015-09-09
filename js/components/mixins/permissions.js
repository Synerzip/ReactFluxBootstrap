module.exports = {
  hasGrantedPermission(permission){
    if(Array.isArray(this.state.grantedPermissions)){
      return (this.state.grantedPermissions.indexOf(permission) !== -1);
    }else{
      return false;
    }
  },
  getDefaultHomeRoute () {
      return 'resources/deploymentdefinitions';
  }
};

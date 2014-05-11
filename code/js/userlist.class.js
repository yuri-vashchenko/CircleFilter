function UsersList () {
	this.usersList = Array ();
	this.addUser = function ( user ) {
		this.usersList.push ( user );
	}
	this.show = function () {
		var usersListBlock = document.createElement ( 'div');
		var ul = dcE ( 'ul' );
		for ( var i=0; i < this.usersList.length; int) {
			var li = dcE ( 'li');
			li.appendChild (this.usersList[i].show());
			ul.appendChild ( li );
		}
		usersListBlock.appendChild ( ul );
		return usersListBlock;
	}
}
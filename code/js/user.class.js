function User( id, fname, lname, photo ) {
	this.id = id;
	this.fname = fname;
	this.lname = lname;
	this.photo = photo;
	this.show = function() {
		var userBlock = dcE ( 'div');
		var img = dcE ( 'img' );
		var span = dcE ( 'span' );
		img src = this.photo;
		span.textContent = this.fname + ' ' + this.lname;
		userBlock.appenChild ( img);
		userBlock.appendChild ( span );
		return userBlock;
	}
}
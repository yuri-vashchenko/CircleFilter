function readProperty( property, defValue ) {
  if( localStorage[property] == null ) {
    return defValue;
  }

  return localStorage[property];
}
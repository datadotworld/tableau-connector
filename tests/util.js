import sinon from 'sinon'

window.tableau = {
  makeConnector: sinon.stub().returns({}),
  registerConnector: sinon.spy(),
  dataTypeEnum: {
    string: 'string',
    int: 'int',
    float: 'float',
    bool: 'bool',
    date: 'date',
    datetime: 'datetime'
  }
}
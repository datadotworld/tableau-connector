window.tableau = {
  makeConnector: jest.fn().mockReturnValue({test: true}),
  registerConnector: jest.fn(),
  dataTypeEnum: {
    string: 'string',
    int: 'int',
    float: 'float',
    bool: 'bool',
    date: 'date',
    datetime: 'datetime'
  }
}
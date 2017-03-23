(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
      // [TODO] API call should be to dataset schema - currently just querying table and using metadata (which is also wrong)
      var datasetCreds = JSON.parse(tableau.connectionData);

      var createTable = function (tableName) {
        return new Promise(function(resolve, reject) {
          var queryTable = tableName;
          var tableApiCall = getApiCall(datasetCreds, queryTable);
          return $.getJSON(tableApiCall, function(resp) {
            var metadata = resp.metadata,
              columnIds = resp.head.vars,
              dataset_cols = [];

            var i = 0;

            for (i = 0, len = metadata.length; i < len; i++) {
              var name = metadata[i].name;
              var idName = name.replace(/[^A-Z0-9]/ig, "");
              var dataType = "http://www.w3.org/2001/XMLSchema#string"; //setting default to string
              if(resp.results.bindings[0].hasOwnProperty(columnIds[i])) {
                dataType = resp.results.bindings[0][columnIds[i]].datatype;
              }

              dataset_cols.push({
                "id": columnIds[i],
                "alias": metadata[i].name,
                "dataType": getDatatype(dataType)
              }); //push close
            } // for close

            var datasetTable = {
              id: queryTable,
              alias: queryTable,
              columns: dataset_cols
            };

            resolve(datasetTable)
          });
        })
      } // createTable end

      getTables(datasetCreds).then(function(tables) {
        Promise.all(
          tables.map(function(tableName) {
            return createTable(tableName)
          })
        ).then(function(results) {
          schemaCallback(results);
        }).catch(function(error) {
          console.error('oh no', error)
        })
      })

    }; // myConnector.getSchema end

    function getTables (datasetCreds) {
      return new Promise(function(resolve, reject) {
        var queryTable = "Tables";
        $.getJSON(getApiCall(datasetCreds, queryTable), function(resp) {
          var datasetTablesResults = resp.results.bindings,
            datasetTables = [];
          for (var i = 0, dtLen = datasetTablesResults.length; i < dtLen; i++) {
            datasetTables[i] = datasetTablesResults[i].v_1.value;
          }
          resolve(datasetTables)
        });
      })
    }

    function getApiCall(datasetCreds, queryTable) {
      var apiCall = "http://localhost:8889/query.data.world/sql/" + datasetCreds.dataset + "?authentication=Bearer+" + datasetCreds.apiToken + "&query=SELECT%20*%20FROM%20%60" + queryTable + "%60";
      return apiCall;
    };

    // [TODO] switch case for correct dataType - metadata only uses string field, so needs to be updated
    function getDatatype(datatype) {
      var tDatatype = null;
      switch (datatype) {
        case "http://www.w3.org/2001/XMLSchema#string":
          tDatatype = tableau.dataTypeEnum.string;
          break;
        case "http://www.w3.org/2001/XMLSchema#integer":
          tDatatype = tableau.dataTypeEnum.int;
          break;
        case "http://www.w3.org/2001/XMLSchema#decimal":
          tDatatype = tableau.dataTypeEnum.float;
          break;
        case "http://www.w3.org/2001/XMLSchema#boolean":
          tDatatype = tableau.dataTypeEnum.bool;
          break;
        case "http://www.w3.org/2001/XMLSchema#date":
          tDatatype = tableau.dataTypeEnum.date;
          break;
        case "http://www.w3.org/2001/XMLSchema#dateTime":
          tDatatype = tableau.dataTypeEnum.datetime;
          break;
        default:
          tDatatype = tableau.dataTypeEnum.string;
      }
      return tDatatype;
    };

  // Download the data
  myConnector.getData = function(table, doneCallback) {
    // [TODO] API call should be to dataset schema - currently just querying table and using metadata (which is also wrong)
    var datasetCreds = JSON.parse(tableau.connectionData);

    var filesApiCall = getApiCall(datasetCreds, table.tableInfo.id);
    $.getJSON(filesApiCall, function(resp) {
      var results = resp.results.bindings,
        columnIds = resp.head.vars,
        tableData = [];

      var i = 0;

      for (i = 0, resLen = results.length; i < resLen; i++) {
        var jsonData = {};
        for(var j = 0, colLen = columnIds.length; j < colLen; j++) {
          var id = columnIds[j];
          if (results[i][id]) {
            jsonData[id] = results[i][columnIds[j]].value;
          }
        }
        tableData.push(jsonData);
      }

      table.appendRows(tableData);
      doneCallback();
    });
  };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {

        $("#submitButton").click(function() {
            var datasetCreds = {
                dataset: $('#dwDataset').val().trim(),
                apiToken: $('#apiToken').val().trim()
            };

            tableau.connectionData = JSON.stringify(datasetCreds);
            tableau.connectionName = "data.world connector";
            tableau.submit();
        });
    });
})();

(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
      // Queries TableColumns for the dataset and loops through to build out tables and columns.
      var datasetCreds = JSON.parse(tableau.connectionData);
      var queryTable = "TableColumns";

      $.getJSON(getApiCall(datasetCreds, queryTable), function(resp) {
        var datasetTablesResults = resp.results.bindings,
          datasetTables = [],
          datasetTableNames = [];
        var tableCount = 0
        for (var i = 0, dtLen = datasetTablesResults.length; i < dtLen; i++) {
          if (datasetTablesResults[i].v_2.value == 1) {
            datasetTableNames[tableCount] = datasetTablesResults[i].v_1.value;
            tableCount++;
          }
        }

        for (var i = 0, length = datasetTableNames.length; i < length; i++) {
          var activeTable = datasetTableNames[i],
            dataset_cols = [];

          for (j = 0, len = datasetTablesResults.length; j < len; j++) {
            if (datasetTablesResults[j].v_1.value == activeTable) {
              var columnId = "v_" + (datasetTablesResults[j].v_2.value - 1);

              dataset_cols.push({
                "id": columnId,
                "alias": datasetTablesResults[j].v_3.value,
                "dataType": getDatatype(datasetTablesResults[j].v_4.value)
              }); //push close
            }
          } // get columns for close

          var datasetTableId = activeTable.replace(/[^A-Z0-9]/ig, "");
          var datasetTable = {
            id: datasetTableId,
            alias: activeTable,
            columns: dataset_cols
          };

          datasetTables[i] = datasetTable;

        } // end create table for

        schemaCallback(datasetTables);

      });

    }; // myConnector.getSchema end


    function getApiCall(datasetCreds, queryTable) {
      var apiCall = "https://query.data.world/sql/" + datasetCreds.dataset + "?authentication=Bearer+" + datasetCreds.apiToken + "&query=SELECT%20*%20FROM%20%60" + queryTable + "%60";
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

    var filesApiCall = getApiCall(datasetCreds, table.tableInfo.alias);

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
            if (results[i][columnIds[j]].datatype == "http://www.w3.org/2001/XMLSchema#boolean")
              jsonData[id] = results[i][columnIds[j]].value  == "true";
            else
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
            $.cookie("dwAPIToken", encodeURIComponent(datasetCreds.apiToken));

            tableau.connectionData = JSON.stringify(datasetCreds);
            tableau.connectionName = JSON.stringify(datasetCreds.dataset);
            tableau.submit();
        });
    });

})();

function getAPIToken() {
  var apiToken = null;
  if ($.cookie("dwAPIToken")) {
    apiToken = decodeURIComponent($.cookie("dwAPIToken"));
  }
  return apiToken;
};

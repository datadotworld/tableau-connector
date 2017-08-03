/*
 * Copyright 2017 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

export const schemaData = {
  "query_text": "SELECT * FROM `TableColumns`",
  "query_lang": "SQL",
  "metadata": [
    {
      "agent": "tester",
      "name": "tableId",
      "type": "http://www.w3.org/2001/XMLSchema#string",
      "dataset": "intro-data-set",
      "table": "TableColumns"
    },
    {
      "agent": "tester",
      "name": "tableName",
      "type": "http://www.w3.org/2001/XMLSchema#string",
      "dataset": "intro-data-set",
      "table": "TableColumns"
    },
    {
      "agent": "tester",
      "name": "columnIndex",
      "type": "http://www.w3.org/2001/XMLSchema#string",
      "dataset": "intro-data-set",
      "table": "TableColumns"
    },
    {
      "agent": "tester",
      "name": "columnName",
      "type": "http://www.w3.org/2001/XMLSchema#string",
      "dataset": "intro-data-set",
      "table": "TableColumns"
    },
    {
      "agent": "tester",
      "name": "columnDatatype",
      "type": "http://www.w3.org/2001/XMLSchema#string",
      "dataset": "intro-data-set",
      "table": "TableColumns"
    },
    {
      "agent": "tester",
      "name": "columnNullable",
      "type": "http://www.w3.org/2001/XMLSchema#string",
      "dataset": "intro-data-set",
      "table": "TableColumns"
    }
  ],
  "head": {
    "vars": [
      "v_0",
      "v_1",
      "v_2",
      "v_3",
      "v_4",
      "v_5"
    ]
  },
  "results": {
    "bindings": [
      {
        "v_0": {
          "type": "literal",
          "value": "AnIntrotodata.worldDatasetChangeLog-Sheet1.csv/AnIntrotodata.worldDatasetChangeLog-Sheet1"
        },
        "v_1": {
          "type": "literal",
          "value": "AnIntrotodata.worldDatasetChangeLog-Sheet1"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "1"
        },
        "v_3": {
          "type": "literal",
          "value": "Date"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#date"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "false"
        }
      },
      {
        "v_0": {
          "type": "literal",
          "value": "AnIntrotodata.worldDatasetChangeLog-Sheet1.csv/AnIntrotodata.worldDatasetChangeLog-Sheet1"
        },
        "v_1": {
          "type": "literal",
          "value": "AnIntrotodata.worldDatasetChangeLog-Sheet1"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "2"
        },
        "v_3": {
          "type": "literal",
          "value": "Change"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "false"
        }
      },
      {
        "v_0": {
          "type": "literal",
          "value": "DataDotWorldBBallStats.csv/DataDotWorldBBallStats"
        },
        "v_1": {
          "type": "literal",
          "value": "DataDotWorldBBallStats"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "1"
        },
        "v_3": {
          "type": "literal",
          "value": "Name"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "false"
        }
      },
      {
        "v_0": {
          "type": "literal",
          "value": "DataDotWorldBBallStats.csv/DataDotWorldBBallStats"
        },
        "v_1": {
          "type": "literal",
          "value": "DataDotWorldBBallStats"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "2"
        },
        "v_3": {
          "type": "literal",
          "value": "PointsPerGame"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#decimal"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "true"
        }
      },
      {
        "v_0": {
          "type": "literal",
          "value": "DataDotWorldBBallStats.csv/DataDotWorldBBallStats"
        },
        "v_1": {
          "type": "literal",
          "value": "DataDotWorldBBallStats"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "3"
        },
        "v_3": {
          "type": "literal",
          "value": "AssistsPerGame"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#decimal"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "true"
        }
      },
      {
        "v_0": {
          "type": "literal",
          "value": "DataDotWorldBBallTeam.csv/DataDotWorldBBallTeam"
        },
        "v_1": {
          "type": "literal",
          "value": "DataDotWorldBBallTeam"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "1"
        },
        "v_3": {
          "type": "literal",
          "value": "Name"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "false"
        }
      },
      {
        "v_0": {
          "type": "literal",
          "value": "DataDotWorldBBallTeam.csv/DataDotWorldBBallTeam"
        },
        "v_1": {
          "type": "literal",
          "value": "DataDotWorldBBallTeam"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "2"
        },
        "v_3": {
          "type": "literal",
          "value": "Height"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "true"
        }
      },
      {
        "v_0": {
          "type": "literal",
          "value": "DataDotWorldBBallTeam.csv/DataDotWorldBBallTeam"
        },
        "v_1": {
          "type": "literal",
          "value": "DataDotWorldBBallTeam"
        },
        "v_2": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "3"
        },
        "v_3": {
          "type": "literal",
          "value": "Handedness"
        },
        "v_4": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "v_5": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
          "value": "false"
        }
      }
    ]
  }
}

export const tableData = {
  "query_text":"SELECT * FROM `AnIntrotodata.worldDatasetChangeLog-Sheet1`",
  "query_lang":"SQL",

  "metadata":[ {
    "formatString" : "MM/dd/yyyy",
    "agent" : "test",
    "name" : "Date",
    "type" : "http://www.w3.org/2001/XMLSchema#date",
    "dataset" : "intro-data-set",
    "table" : "AnIntrotodata.worldDatasetChangeLog-Sheet1"
  }, {
    "agent" : "test",
    "name" : "Change",
    "type" : "http://www.w3.org/2001/XMLSchema#string",
    "dataset" : "intro-data-set",
    "table" : "AnIntrotodata.worldDatasetChangeLog-Sheet1"
  } ],

  "head": {
    "vars": [ "v_0" , "v_1" ]
  } ,
  "results": {
    "bindings": [
      {
        "v_0": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "2016-12-14" } ,
        "v_1": { "type": "literal" , "value": "Test test test" }
      } ,
      {
        "v_0": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#date" , "value": "2016-12-14" } ,
        "v_1": { "type": "literal" , "value": "Test test" }
      }
    ]
  }
}

export const sparqlSchemaData = {
  "query_text":"prefix ds: <https://test.linked.data.world/d/intro-data-set/>\nprefix xsd: <http://www.w3.org/2001/XMLSchema#>\n\nSELECT ?name ?height ?heightInInches ?hand ?ppg ?apg WHERE {\n  ?s1 ds:col-datadotworldbballteam-name ?name .\n  ?s1 ds:col-datadotworldbballteam-height ?height .\n  ?s1 ds:col-datadotworldbballteam-handedness ?hand .\n  ?s2 ds:col-datadotworldbballstats-name ?name . # the join column\n  ?s2 ds:col-datadotworldbballstats-pointspergame ?ppg .\n  ?s2 ds:col-datadotworldbballstats-assistspergame ?apg .\n  \n  BIND(xsd:integer(REPLACE(?height, \"([0-9]+)\\'.*\", \"$1\")) AS ?feet) \n  BIND(xsd:decimal(REPLACE(?height, \"[0-9]+\\'([0-9.]+)\\\"\", \"$1\")) AS ?inches) \n  BIND(?feet * 12 + IF(BOUND(?inches), ?inches, 0) AS ?heightInInches)\n} ",
  "query_lang":"SPARQL",

  "head": {
    "vars": [ "name" , "height" , "heightInInches" , "hand" , "ppg" , "apg" ]
  },
  "results": {
    "bindings": [
      {
        "name": { "type": "literal" , "value": "Jon" } ,
        "height": { "type": "literal" , "value": "6'5\"" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "77" } ,
        "hand": { "type": "literal" , "value": "Right" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "20.4" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "1.3" }
      } ,
      {
        "name": { "type": "literal" , "value": "Rob" } ,
        "height": { "type": "literal" , "value": "6'7.5\"" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "79.5" } ,
        "hand": { "type": "literal" , "value": "Left" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "15.5" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "8" }
      } ,
      {
        "name": { "type": "literal" , "value": "Sharon" } ,
        "height": { "type": "literal" , "value": "6'3\"" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "75" } ,
        "hand": { "type": "literal" , "value": "Right" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "30.1" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "11.2" }
      } ,
      {
        "name": { "type": "literal" , "value": "Alex" } ,
        "height": { "type": "literal" , "value": "6'2\"" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "74" } ,
        "hand": { "type": "literal" , "value": "Right" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "8.2" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "0.5" }
      } ,
      {
        "name": { "type": "literal" , "value": "Rebecca" } ,
        "height": { "type": "literal" , "value": "7'" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "value": "84" } ,
        "hand": { "type": "literal" , "value": "Right" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "12.3" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "17" }
      } ,
      {
        "name": { "type": "literal" , "value": "Ariane" } ,
        "height": { "type": "literal" , "value": "5'8\"" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "68" } ,
        "hand": { "type": "literal" , "value": "Left" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "18.1" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "3" }
      } ,
      {
        "name": { "type": "literal" , "value": "Bryon" } ,
        "height": { "type": "literal" , "value": "7'" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#integer" , "value": "84" } ,
        "hand": { "type": "literal" , "value": "Right" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "16" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "8.5" }
      } ,
      {
        "name": { "type": "literal" , "value": "Matt" } ,
        "height": { "type": "literal" , "value": "5'5\"" } ,
        "heightInInches": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "65" } ,
        "hand": { "type": "literal" , "value": "Right" } ,
        "ppg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "13" } ,
        "apg": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "2.1" }
      }
    ]
  }
}

export const sqlSchemaData = {
  "query_text":"select * from datadotworldbballstats",
  "query_lang":"SQL",

  "metadata":[ {
    "agent" : "test",
    "name" : "name",
    "type" : "http://www.w3.org/2001/XMLSchema#string",
    "dataset" : "intro-data-set",
    "table" : "datadotworldbballstats"
  }, {
    "formatString" : "#####.0",
    "agent" : "test",
    "name" : "pointspergame",
    "type" : "http://www.w3.org/2001/XMLSchema#decimal",
    "dataset" : "intro-data-set",
    "table" : "datadotworldbballstats"
  }, {
    "formatString" : "#####.0",
    "agent" : "test",
    "name" : "assistspergame",
    "type" : "http://www.w3.org/2001/XMLSchema#decimal",
    "dataset" : "intro-data-set",
    "table" : "datadotworldbballstats"
  } ],

  "head": {
    "vars": [ "v_0" , "v_1" , "v_2" ]
  } ,
  "results": {
    "bindings": [
      {
        "v_0": { "type": "literal" , "value": "Jon" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "20.4" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "1.3" }
      } ,
      {
        "v_0": { "type": "literal" , "value": "Rob" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "15.5" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "8" }
      } ,
      {
        "v_0": { "type": "literal" , "value": "Sharon" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "30.1" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "11.2" }
      } ,
      {
        "v_0": { "type": "literal" , "value": "Alex" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "8.2" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "0.5" }
      } ,
      {
        "v_0": { "type": "literal" , "value": "Rebecca" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "12.3" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "17" }
      } ,
      {
        "v_0": { "type": "literal" , "value": "Ariane" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "18.1" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "3" }
      } ,
      {
        "v_0": { "type": "literal" , "value": "Bryon" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "16" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "8.5" }
      } ,
      {
        "v_0": { "type": "literal" , "value": "Matt" } ,
        "v_1": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "13" } ,
        "v_2": { "type": "literal" , "datatype": "http://www.w3.org/2001/XMLSchema#decimal" , "value": "2.1" }
      }
    ]
  }
}

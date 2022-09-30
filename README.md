# data.world — Tableau Web Data Connector

Tableau can help anyone see and understand their data. Connect to almost any database, drag and 
drop to create visualizations, and share your work with a click.

data.world’s Tableau web data connector is designed for business intelligence analysts, 
researchers, journalists, and students who want to quickly find data to visualize.

Create your visualizations with data from multiple sources, including:

* Government agencies
* Academia
* Canonical datasets
* Your own data hosted freely
* Data subsets via SQL
* The open data community

The connector supports Tableau and Tableau Public versions 10 and greater.

## Getting started

Using the Web Data Connector is simple!

In Tableau or Tableau Public v.10+:

1. Select the Web Data Connector option under Connect > To a Server.
2. In the window that opens, enter tableau.data.world for the web data connector URL and press 
Enter. This will open the data.world web data connector.

For additional information, check-out our video tutorial:

[![Intro to data.world Web Data Connector](https://img.youtube.com/vi/B43xnBKbATg/0.jpg)](https://www.youtube.com/watch?v=B43xnBKbATg)

## Enable scheduled refreshes for extracts created with WDC

To enable scheduled refreshes for extracts created from data.world WDC, we'll need to add the WDC and api domains to safe list on the Tableau Server.
    
    A.  To configure safe list on Tableau Server version 10.5 and below run the following commands on the machine
       
        From Tableau server directory (e.g C:\Program Files\Tableau\Tableau Server)

        1. cd <tableau server dir>\<tableau server version>\bin

        2. tabadmin whitelist_webdataconnector -a https://tableau.data.world:443

        3. tabadmin whitelist_webdataconnector -s https://tableau.data.world:443 https://api.data.world/(.*),https://query.data.world/(.*),https://data.world/oauth/(.*),https://auth.data.world/oauth/(.*)

        4. tabadmin restart

For more info see [tabadmin Commands](https://onlinehelp.tableau.com/v10.5/server/en-us/tabadmin_cmd.htm#whitelist_wdc)
    
    B.  To configure safe list for Tableau Server version 2018.1 and above run the following commands on the machine 

        1. tsm data-access web-data-connectors add --name 'DW WDC' --url https://tableau.data.world:443 --secondary https://api.data.world/*, https://query.data.world/*, https://data.world/oauth/*, https://auth.data.world/oauth/*

        2. tsm data-access web-data-connectors allow

        3. tsm restart

For more info see [Web Data Connectors in Tableau Server](https://onlinehelp.tableau.com/current/server/en-us/datasource_wdc.htm) and [tsm data-access](https://onlinehelp.tableau.com/current/server/en-us/cli_data-access.htm#web-data-connectors-add)


## Contributing

The data.world Web Data Connector is an open-source project. Community participation is encouraged.
If you'd like to contribute, please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

Apache License 2.0

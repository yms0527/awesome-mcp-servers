PPL
Piped Processing Language (PPL) is a query language that focuses on processing data in a sequential, step-by-step manner. PPL uses the pipe (|) operator to combine commands to find and retrieve data. It is particularly well suited for analyzing observability data, such as logs, metrics, and traces, due to its ability to handle semi-structured data efficiently.

PPL syntax
The following example shows the basic PPL syntax:

search source=<index-name> | <command_1> | <command_2> | ... | <command_n>
Copy
See Syntax for specific PPL syntax examples.

PPL commands
PPL filters, transforms, and aggregates data using a series of commands. See Commands for a description and an example of each command.

Using PPL within OpenSearch
The SQL plugin is required to run PPL queries in OpenSearch. If you’re running a minimal distribution of OpenSearch, you might have to install the SQL plugin before using PPL.

You can run PPL queries interactively in OpenSearch Dashboards or programmatically using the _ppl endpoint.

In OpenSearch Dashboards, the Query Workbench tool provides an interactive testing environment, documented in Query Workbench documentation.

To run a PPL query using the API, see SQL and PPL API.

Developer documentation
Developers can find information in the following resources:

Piped Processing Language specification
OpenSearch PPL Reference Manual
Observability using PPL-based visualizations
PPL Data types
Cross-cluster search in PPL

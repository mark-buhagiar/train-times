# Home

The home screen should display the following:

1. 'From' Autocomplete box - Allows the user to select which station he's leaving from. Populated using the Available stations API. Let's the user search using the CRS and the Name.
1. 'To' Autocomplete box - Allows the user to select which station he's going to. Populated using the Available stations API. Let's the user search using the CRS and the Name.
1. 'When' Text box - Allows the user to select a time between 3 hour ago and 24 hours from now. Defaults to null. The placeholder should display _now_
1. A search button, which invokes the search as per the API spec provided in api.prd.md and navigates to the services list

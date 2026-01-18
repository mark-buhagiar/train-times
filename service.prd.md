# Service

This is a representation of an individual service.
More details about a service can be retrieved using the service API.
Using the stops array, this should highlight the station that user selected in the FROM and TO selection boxes. It should display, the station name, the platform, and the expected departure time

For example, if the user enter FROM Charing Cross TO Kidbrooke:

```
Origin: London Charing Cross
Destination: Dartford
Stopping at:
- **London Charing Cross | 3 | 18:35**
- London Waterloo east | 2 | 18:28
- **Kidbrooke | 1 | 18:55**
- Eltham | 1 | 19:00
- Dartford | 2 | 19:30
```

A service should give the user the ability to add that service to "My Services" as a favourite.
If the user chooses to do this, we should store a permanent record of this service somewhere.
If the service the user was interested in was reachable at the url below:
https://transportapi.com/v3/uk/train/service_timetables/P73390:2026-01-19.json?app_id=7af98c68&app_key=2f16133ec369004284679d07d4ba6171&live=true

We should save the following URL:
https://transportapi.com/v3/uk/train/service_timetables/P73390:{DATE}.json?app_id=7af98c68&app_key=2f16133ec369004284679d07d4ba6171&live=true

This will allow us to substitute the appropriate date next time the user makes a search

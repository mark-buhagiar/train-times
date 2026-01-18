# API

## Available stations API

To get the list of available stations, make a request to this endpoint: https://crs.codes/data/stations.json
From this data, we'll want to pull the name and crs.

## Service API

https://transportapi.com/v3/uk/train/service_timetables/P73390:2026-01-19.json?app_id=7af98c68&app_key=2f16133ec369004284679d07d4ba6171&live=true

The documentation for this API can be found here: https://developer.transportapi.com/docs#get-/v3/uk/train/service_timetables/-service-.json

The service code to use as the service param will be retrieved by means of the Station Timetable API

## Station Timetable API

This is a sample API call to get the data
GET "https://transportapi.com/v3/uk/train/station_timetables/CHX.json?from_offset=PT00%3A30%3A00&to_offset=PT01%3A30%3A00&limit=20&live=true&train_status=passenger&station_detail=destination%2Corigin%2Ccalling_at&type=departure&calling_at=kdb&app_key=2f16133ec369004284679d07d4ba6171&app_id=7af98c68"

The API spec is here: https://developer.transportapi.com/docs#get-/v3/uk/train/station_timetables/-id-.json

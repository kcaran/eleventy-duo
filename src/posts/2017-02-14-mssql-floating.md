---
layout: post
title: "Calculating Distances in Microsoft SQL Server"
date: '2017-02-14'
tags: [coding, mssql]
permalink: posts/{{ title | slugify }}.html
---

One feature of almost every modern commercial website is the location finder. Enter in a search address, and site displays the closest locations to it with the distances (as the crow flies).

I ran into a couple of peculiar bugs trying to calculate distances in SQL. Floating point math is never easy, and these are the issues I faced using our Microsoft SQL Server database.

<!-- more -->

Using Google APIs, I was able to get the latitude and longitude for each of our agency locations and added them to the database table as `float`.
The formula for calculating the distance between two latitude/longitude pairs is the 
[Spherical Law of&nbsp;Cosines](http://www.movable-type.co.uk/scripts/latlong.html#cosine-law).

After geolocating the search address (again using Google APIs), getting the closest locations and the distance in miles is relatively easy.

~~~ perl
return $mssql_dbh->exec_select( <<DISTANCE_SQL );
select top 10
	rtrim(name01) as name01, rtrim(name02) as name02, rtrim(street) as street,
	rtrim(city) as city, state, zip, rtrim(phone) as phone,
	rtrim(email) as email, rtrim(web) as web,
	latitude, longitude,
	acos(sin(radians($lat)) * sin(radians(latitude)) + cos(radians($lat))
		* cos(radians(latitude)) * cos(radians(longitude) - radians($lon)))
		* 3959
		as distance
from agent_finder_info
	where (latitude > 40 and longitude < 0)
order by distance
DISTANCE_SQL
~~~

The where clause ignores any entries in the table that might not have a
latitude and longitude association with it.

This appeared to work fine in production for years. One day an agent called
and complained that the search for zip code 02185 (Braintree MA) wasn't
working. The agents furthest east of that location (which
happened to be in Maine and on Cape Cod) were displayed - and reported as
being hundreds of miles away!

<img src="/assets/img/location_02185.png" alt="Screenshot">

The problem is for that area code, the longitude returned by Google is
*exactly 71&nbsp;degrees&nbsp;North*. Perl treats this as an integer and the distance
formula looks like this:

~~~
acos(sin(radians(42.22)) * sin(radians(latitude)) + cos(radians(42.22))
	* cos(radians(latitude)) * cos(radians(longitude) - <b>radians(71)</b>))
	* 3959
~~~

In the SQL statement, `radians(71.0)` = -1.23918, but `radians(71)` = -1! Given an integer argument, radians returns an integer. Who the heck would want that??

My first fix was to explicitly cast the arguments to the radians() function as floats. Of course, I could have also done that in Perl.

~~~ perl
return $mssql_dbh->exec_select( <<DISTANCE_SQL );
select top 10
	rtrim(name01) as name01, rtrim(name02) as name02, rtrim(street) as street,
	rtrim(city) as city, state, zip, rtrim(phone) as phone,
	rtrim(email) as email, rtrim(web) as web,
	latitude, longitude,
	acos(sin(radians(<b>cast($lat as float)</b>)) * sin(radians(latitude))
		+ cos(radians(<b>cast($lat as float)</b>)) * cos(radians(latitude))
		* cos(radians(longitude) - radians(<b>cast($lon as float)</b>)))
		* 3959
		as distance
from agent_finder_info
	where (latitude > 40 and longitude < 0)
order by distance
DISTANCE_SQL
~~~

This worked great.

---
layout: post
title: "Installing ODBC on Linux for MSSQL and AS400 DB2"
date: '2013-03-01'
tags: [coding, perl, sql, as400, mssql]
permalink: posts/{{ title | slug }}.html
---

At work, we use Microsoft SQL Server and IBM AS400 databases.  Here's
how I set our Linux boxes to allow them to connect to the databases
through ODBC.  There are seperate instructions for the 
Debian and Ubuntu (9.10 Karmic Koala) and Red Hat Enterprise Linux
(RHEL4 and RHEL5) distributions.

ODBC connections require several layers of software to work.  The
bottom layer consists of the individual ODBC drivers for each
database system.  Our top layer is the DBI/DBD interface for Perl.
In between these layers is the ODBC driver manager, which keeps
track of the DSN's and their corresponding ODBC drivers.

## Packages and Software to Install

#### Ubuntu Version (tested on 9.10 Karmic Koala)  
Debian Version ("unstable" distribution)

We use **unixODBC** as our ODBC driver manager.  First, install unixODBC:

**NOTE:  Perl's DBD::ODBC module requires the developer's version
of unixODBC, so install that one.**

~~~
# apt-get install unixodbc-dev
~~~

<!-- more -->

Finding an ODBC driver for SQL Server was a challenge, since
Microsoft refuses to directly support Linux.  Fortunately, freeTDS
(version 0.61 or later) seems to work fine.

~~~
# apt-get install tdsodbc freetds-bin
~~~

**Debian NOTE:**  
Originally, I installed the **libsybdb3** package to get freetds.
But somewhere along the road,
**libsybdb3** was replaced with **libsybd5**.
When I upgraded my Debian distribution, **freetds**
was uninstalled in the process!  Hopefully, the
**tdsobdc** package won't suffer from name changes.

 The ODBC driver to the AS400 comes directly from IBM.  The best part about
the IBM website is how they constantly change their links and don't forward
the old ones.  They're worse than Microsoft in that regard:

<http://www-03.ibm.com/systems/i/software/access/linux/downloads.html>

~~~
# apt-get install rpm
# apt-get install alien
# alien -i iSeriesAccess-6.1.0-1.0.x86_64.rpm
# ln -s /opt/ibm/iSeriesAccess/lib64/libcwb* /usr/lib64
~~~

### Red Hat Enterprise Linux Version

We are using **unixODBC** as our ODBC driver manager.  A version of
unixODBC comes with the Red Hat installation,
but we need the developer's version in order for both Perl's
**DBD::ODBC** module and FreeTDS to work:

~~~
yum install unixODBC-devel
~~~

Finding an ODBC driver for SQL Server was a challenge, since
Microsoft refuses to directly support Linux.  Fortunately, freeTDS
version 0.61 or greater seems to work fine.  Under Red Hat, we needed
to compile the application.

1. Download the source code from <http://www.freetds.org/>

1. Uncompress the gzipped tar file:

	~~~
	# gzip -cd freetds-0.82.tgz | tar xf -
	~~~
  
1. Enter the freetds directory and configure, make, and install:
	~~~
	# cd freetds-0.82
	# ln -s /usr/lib/libodbcinst.so.1.0.0 /usr/lib/libodbcinst.so
	# configure --with-tdsver=7.0 --with-unixodbc=/usr/
	# make
	# make install
	~~~

The ODBC driver to the AS400 comes directly from IBM:

<http://www-03.ibm.com/systems/i/software/access/linux/index.html>

Of course, I had dependency issues.  The libstdc++ dependencies are
relevant, but the libXm and libXp libraries aren't needed for ODBC
connections.

~~~
# rpm -Uvh iSeriesAccess-5.4.0-1.6.i386.rpm
error: Failed dependencies:
        libstdc++.so.5 is needed by iSeriesAccess-5.4.0-1.6.i386
        libstdc++.so.5(CXXABI_1.2) is needed by iSeriesAccess-5.4.0-1.6.i386
        libstdc++.so.5(GLIBCPP_3.2) is needed by iSeriesAccess-5.4.0-1.6.i386
        libstdc++.so.5(GLIBCPP_3.2.2) is needed by iSeriesAccess-5.4.0-1.6.i386
        libXm.so.3 is needed by iSeriesAccess-5.4.0-1.6.i386
        libXp.so.6 is needed by iSeriesAccess-5.4.0-1.6.i386

# yum install /usr/lib/libstdc++.so.5

# rpm -Uvh --nodeps iSeriesAccess-5.4.0-1.6.i386.rpm
~~~


## Configuration

1. Add SQL Server hosts to the FreeTDS configuration file:

	`/etc/freetds/freetds.conf` (Ubuntu/Debian)

	`/usr/local/etc/freetds.conf` (Red hat)


	~~~
	[TDSproduction]
        host = 10.28.78.52
        port = 1433
        tds version = 7.0
	~~~

1. Confirm the new drivers are in the driver config file:
	`/etc/odbcinst.ini` (Ubuntu/Debian and Red Hat)

	~~~
	[FreeTDS]
	Description     = MS SQL driver
	Driver          = /usr/local/lib/libtdsodbc.so
	FileUsage       = 2

	[ODBC]
	Trace           = No       ;(=Yes if tracing using unixODBC)

	[iSeries Access ODBC Driver]
	Description     = iSeries Access for Linux ODBC Driver
	Driver          = /opt/ibm/iSeriesODBC/lib/libcwbodbc.so
	Setup           = /opt/ibm/iSeriesODBC/lib/libcwbodbc.so
	Threading       = 2
	FileUsage       = 1
	~~~

1. Add servers to the server file:
	`/etc/odbc.ini` (Ubuntu/Debian and Red Hat)
	`/usr/local/etc/odbc.ini` (Red Hat)

	~~~
	[Production]
	Driver                  = FreeTDS
	Description             = Production MS SQL Database
	Servername              = TDSproduction
	Database                = AVC
	UID                     = content1_badsg-1

	[AS400]
	Driver                  = iSeries Access ODBC Driver
	Description             = Production AS/400 Database
	Servername              = AS400.APPN.SNA.IBM.COM
	System                  = AS400.APPN.SNA.IBM.COM
	DefaultLibraries        = TESTMS
	UID                     = webodbc
	~~~

## Test the Connections

1. Verify unixODBC setup using odbcinst:

	~~~
	# odbcinst -q -d
		[FreeTDS]
		[iSeries Access ODBC Driver]

	# odbcinst -q -s
		[Production]
		[AS400]
	~~~

1. Test connection to FreeTDS servers using tsql.  
**Note:** make sure you use the server name, not the ODBC DSN, for the 
`-S` argument.  See `man tsql` for more details.

	~~~
	# tsql -STDSproduction -Usa
	~~~

1. Test connections through unixODBC:
	~~~
	# isql AS400 username PASSWORD
	~~~

1. Debugging tools for connecting to AS400:

	~~~
	# /opt/ibm/iSeriesODBC/bin/cwbping as400.appn.sna.ibm.com
	~~~

## Installing DBD::ODBC module for Perl

~~~
# cd
# perl -MCPAN -eshell
# get DBD::ODBC
<>quit
# tcsh
# cd .cpan/build/DBD-ODBC-1.09
# setenv DBI_DSN dbi:ODBC:LocalServer
# setenv DBI_USER sa
# setenv DBI_PASS sa
# setenv ODBCHOME /usr
# setenv LANG en_US
# perl Makefile.PL
# make
# make test
# make install
~~~

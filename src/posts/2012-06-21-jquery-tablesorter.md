---
layout: post
title:  "Using jQuery Tablesorter With Dynamic Tables"
date:   '2012-06-21'
tags: [coding, webdesign, jquery, javascript]
permalink: posts/{{ title | slugify }}.html
---
Here are a couple of tricks to remember when using jQuery's tablesorter plugin with dynamic tables. These are tables that the user can add or delete from.

1. If the table begins empty (with no rows in `<tbody>`), you can't
specify a default sort.

	If there are no rows in the `<tbody>` section when the page is first
	loaded, the sortList command will crash with a "parsers is undefined"
	error.

2. When the table is modified (rows are added or deleted), let tablesorter
know the table has been changed with the following command:

	~~~ javascript
	$( 'table.tablesorter' ).trigger( 'update' );
	~~~

3. Sorting checkboxes - you need to add a customized parser for sorting
checkboxes (and other form input fields):

	~~~ javascript
	$.tablesorter.addParser({
	    id: 'checkbox',
	    is: function(s) {
	        // return false so this parser is not auto-detected
	        return false;
	    },
	    format: function(s, table, cell) {
	        var checked = $( cell ).children( ':checkbox' ).attr( 'checked' );
	        return checked ? 1 : 0;
	    },
	    type: 'numeric'
	});

	$( 'table.tablesorter' ).tablesorter({
	    headers: {
	        2: { sorter: 'checkbox' }
	    }
	});
	~~~

	*The update trigger needs to be set when form fields are changed as well.*

4. When using the zebra widget, you need to specify an 'odd' class for your
table rows:

	~~~ scss
	body#employee-access tr {
		background-color:#f1f0eb;
	}

	body#employee-access tr.odd {
		background-color:#e3e2dd;
	}
	~~~

	If you update the table (for example, removing rows):

	~~~ javascript
	$( 'table.tablesorter' ).trigger( 'applyWidgets' );
	~~~

5. Additional documentation:

	<http://wowmotty.blogspot.com/2011/06/jquery-tablesorter-missing-docs.html>

	<http://mottie.github.com/tablesorter/docs/>


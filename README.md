# Bamazon

<h2>Introduction</h2>
<p>The following instructions will guide you throught the necessary steps to running Bamazon on your local computer.</p>

<h3>Requirements</h3>

<p>1st: It is necessary for you to have mySQL installed and working on your machine in order to create the necessary database and table.</p>

<p>2nd: You will need to install all the necessary npm packages in the JSON file. If for any reason there are any issues, you will need to open your command line, and install the npm packages manually.</p>

<p>3rd: You will need to run the SCHEMA.sql file in a mySQL UI, run the file in mySQL via command line, or enter the commands individuallty through your shell.</p>

<h3>Examples below:</h3>
<p>Navigate to the appropriate directory and "npm i" (install) all the packages in the JSON file. If there are any issues, install the packages manually following the steps on the next image.</p>
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/nav_inst.JPG" alt="img">

<p>Navigate to the appropriate directory, and "npm init" (initialize npm and create JSON files), then install the npm packages using command line.</p>
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/npm_init.JPG" alt="img">

<p>If all goes well, run the sql file in mySQL or enter the commands manually</p>
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/mySQL.JPG" alt="img">
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/schema.JPG" alt="img">

<p>Now that we have a database and all of out npm packages installed, we need to edit the mySQL login credentials in the bamazonCustomer.js file.</p>
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/login.JPG" alt="img">
<p>After you update your login credentials, Bamazon should be ready to go!</p>


<h2>Using the Program</h2>

<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/shop_all.JPG">
<p>Above shows how you use a username and password to login, you can shop all or by department (below).</p>
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/shop_dept.JPG">

<p>If you login as a manager, you can view all products or view low inventory (less than 5 items, below).</p>
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/man_low.JPG">
<p>The program will ask you if you'd like to restock after viewing all or low by default, or after selecting "Add Inventory". Below we have an example of a manager "Adding an Item"</p>
<img src="https://github.com/fvaldez421/Bamazon/blob/master/images/add_prod.JPG">

<p>Whether in a Manager or customer login, it will lead you towards an exit option after completing a command. If you select the "No" option, it will loop back to the shopping or managment options menu.</p>


<h2>Built With</h2>
<ul>
	<li>Node.JS</li>
	<li>mySQL Monitor</li>
	<li>Sublime Text Editor</li>
	<li>"mysql" NPM Package</li>
	<li>"inquirer" NPM Package</li>
	<li>"cli-color" NPM Package</li>
	<li>"cli-table" NPM Package</li>
</ul>


  


var path = require('path')
var db = require("../models");


var staticRoutes = function(app) {

	//match /css/burger_style.css  path with public/assets/css/burger_style.css
	app.get('/css/burger_style.css', function(req, res) {
    	res.sendFile(path.join(__dirname + '/../public/assets/css/burger_style.css'));
	});

	app.get('/img/burger.jpg', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/assets/img/burger.jpg'));

	});

}



//returns burgers classified as devored or not
function classifyBurgers(burgers) {
	var result = {
		devoured:[],
		notDevoured:[]
	}
	//for each burger classify either as devored on not.
	for(var i = 0;i < burgers.length;i++) {
		var burger = burgers[i];
		if(burger.devoured) {
			result.devoured.push(burger);
		} else {
			result.notDevoured.push(burger);
		}
	}					
	return result;
}

//find all burger and renders it a json
function findAllBurgers(res) {
	db.Burger.findAll({
			  include: [
            		{ 
            			model: db.Customer, as: 'customer'
            		}
       			],
       			 order: [
           			 ['name', 'ASC']
        		],
    	}).then(function(burgers) {
			//response object
			var response = classifyBurgers(burgers);
			res.json(response)
		})
}

var apiRoutes = function(app) {

	//returns list of burgers, classifed as devored and not devored
	app.get('/api/burgers', function(req, res) {
		findAllBurgers(res);
	})


	//updates burger  idientigied by provided id, 
	//sets customer_id and devoured flag to true
	function updateBurger(id, customer, res) {
		db.Burger.update(
			{
				devoured:true,
				customer_id:customer.id,
			},
			{
				where: {
					id: id
				}
			}).
		then(function(burger) {
			findAllBurgers(res);
		});
	}



	//put modifies devored column on burger
	app.put('/api/burgers', function(req, res) {
		var customerName = req.body.customerName;
		var customer;
		//find customer by name to determin if it exists or not
		//if the later then create a new one and assign to burger
		db.Customer.findAll(
			{
			 	where: {
                	name:customerName
            	}

				}).then(function(customers){
			if(customers.length == 0) {//customer does not exists with provided name
				db.Customer.create({name:customerName}).then(function(customer){
					updateBurger(req.body.id, customer, res);
				})
			} else {//asign existing customer to burger
				customer = customers[0];
				updateBurger(req.body.id, customer, res);
			}
		})
	});


	//post add new burger on burger
	app.post('/api/burgers', function(req, res) {
		//insert new record into database with burger
		db.Burger.create({
			name:req.body.name,
			devoured:false,
			date: new Date(),
		}).then(function(burger) {
			findAllBurgers(res);
		});
	});
}

//router delegates api and static routes
var router = function(app) {
	staticRoutes(app);
	apiRoutes(app)

	app.get('/', function (req, res) {
		db.Burger.findAll({ 
            		 include: [
	            		{ 
	            			model: db.Customer, as: 'customer'
	            		},],
				   	   order: [
           				 ['name', 'ASC']
        				],
  			}).then(function(burgers) {
			res.render('index', {
				burgers: classifyBurgers(burgers)
			});
		})
	});
}

module.exports = router;
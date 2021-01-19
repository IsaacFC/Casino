const express = require('express');
const pageUsers = require('../controllers/pageController/pageEmployees');
const pageCostumers = require('../controllers/pageController/pageCostumers');

const router = express.Router();

///////////////////////////////////////////////////
//                   EMPLEADOS                   //
///////////////////////////////////////////////////
router.get("/employees", pageUsers.getUsers);

router.get("/employees/modify/:Id", pageUsers.getUserById);

///////////////////////////////////////////////////
//                   CLIENTES                    //
///////////////////////////////////////////////////
router.get("/customers", pageCostumers.getCostumers);

router.get("/customers/modify/:id", pageCostumers.getCustomerById);


module.exports = router;
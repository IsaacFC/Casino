// auth Controller
const authLogin = require('../controllers/authController/authLogin');
const authEmployees = require('../controllers/authController/authEmployees');
const authCustomers = require('../controllers/authController/authCustomers');
const authRecharge = require('../controllers/authController/authRecharge');

var router = require('express').Router();


// utilizar router.POST para subir datos
// el primer parametro es lo mismo a "/auth/register"

//          PANTALLA PARA LOGIN             //
router.post("/login",  authLogin.login);

// PANTALLA PARA REGISTRAR EMPLEADOS //
router.post("/employees/register",  authEmployees.registerEmployee);

router.put("/employees/modify/:id",  authEmployees.modifyEmployee);

// PANTALLA PARA REGISTRAR CLIENTES //

router.post("/customers/register",  authCustomers.registerCustomer);

router.put("/customers/modify/:id",  authCustomers.modifyCustomer);

// PANTALLA RECARGA DE SALDO // 

router.post("/recharge-cash",  authRecharge.rechargeCardCash);

router.post("/recharge-credit-card",  authRecharge.rechargeCardCredit);


module.exports = router;
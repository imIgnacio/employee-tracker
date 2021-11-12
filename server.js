const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

function init() {
    console.log("Welcome to Employee Tracker V1.0.0");
    
    inquirer
    .prompt({
        type: 'list',
        message: 'Please select one of the following choices',
        name: 'choice',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'
        ]
    })
    .then((data) => {
         runFunction(data);
    })
}

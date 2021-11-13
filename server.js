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
            'Update employee role',
            'Exit'
        ]
    })
    .then((data) => {
        switch(data) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            default:
                return;
        }
    })
}

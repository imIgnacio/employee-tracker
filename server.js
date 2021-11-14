const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'root9876',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

// Function to init app  
function init() {
    console.log("Welcome to Employee Tracker V1.0.0");
    renderOptions();
}

function viewAllDepartments() {
    db.query('SELECT * FROM department', function(err,results){
        if (err) throw err;
        console.table(results);
        renderOptions();
    });
}

function viewAllRoles() {
    db.query('SELECT * FROM role', function(err,results){
        if (err) throw err;
        console.table(results);
        renderOptions();
    });
}

function viewAllEmployees() {
    db.query('SELECT * FROM employee', function(err,results){
        if (err) throw err;
        console.table(results);
        renderOptions();
    });
}

function addDepartment() {
    inquirer
    .prompt([
        {
            name:"addDepartment",
            type: "input",
            message: "What department would you like to add?",
        }
    ]).then(data => {
        let query = "INSERT INTO department (name) VALUES (?)";
        db.query(query, data.addDepartment, (err, result) => {
            if (err) throw err;
            console.log(`${data.addDepartment} added to departments`);
            viewAllDepartments();
        }); 
        renderOptions();
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What role would you like to add?",
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the salary of this role?",
        }       
    ]).then(answer => {
        const parms = [answer.role, answer.salary];

        //Get department from department table
        const roleSel = `SELECT name, id FROM department`;
        db.query(roleSel, function(err, data){
            if(err) throw err;
            const department = data.map(({name, id}) => ({name: name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: "What department would you like to add of this role ?",
                    choices: department
                }
            ]).then(departmentChoice => {
                const department = departmentChoice.department; //add the value of new department in department
                parms.push(department); //adding role , salary in department

                const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';

                db.query(sql, parms, (err, result) => {
                    if(err) throw err;
                    console.log(`Added New role to roles!`);
                    viewAllRoles();
                });
            });
        });
        renderOptions();
    });
}

function addEmployee() {
    let roleArray = [];
    let employeeArray = [];
    let queryRole = 'SELECT * FROM role';

    db.query(queryRole, (err, results) => {
        if (err) throw err;
        let queryEmployee = 'SELECT * FROM employee';
        db.query(queryEmployee, (err, resultsE) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    name:"firstName",
                    type:"input",
                    message: "Enter the first name of employee",
                },
                {
                    name:"lastName",
                    type:"input",
                    message: "Enter the last name of employee",
                },
                {
                    name:"role",
                    type:"list",
                    message: "What is the employee's Role",
                    choices: function(){
                        for(let i=0; i< results.length; i++){
                            roleArray.push(results[i].title)
                        }
                        return roleArray;
                    },
                },
                {
                    name:"managerID",
                    type:"list",
                    message: "Who is the employee's Manager ?",
                    choices: function(){
                        for(let j=0; j< resultsE.length; j++){
                            employeeArray.push(resultsE[j].first_name)
                        }
                        return employeeArray;
                    },
                },
            ])
            .then((data) => {
                let managerID = employeeArray.indexOf(data.managerID) + 1;
                let roleID = roleArray.indexOf(data.role) + 1;
                let qry = "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES( ?, ?, ?, ?)";
                db.query(qry, [data.firstName, data.lastName, roleID, managerID], (err, results) => {
                    if (err) throw err;
                    console.log("Employee added successfully");
                    viewAllEmployees();
                });
                renderOptions();
            });
        });
    });
}

function updateEmployeeRole() {
    let empNameArray =[];
    let qry = "SELECT * FROM employee";
    db.query(qry, (err, results) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name:"employeeName",
                type:"list",
                message: "Which employee would you like to update",
                choices: function(){
                    for(let i=0; i < results.length; i++){
                        empNameArray.push(results[i].id + "." + results[i].first_name + " " + results[i].last_name);
                    }
                    return empNameArray;
                }, 
            },
        ])
        .then((answer) => {
            let employeeID = empNameArray.indexOf(answer.employeeName) + 1;
            changeRole(employeeID);
        });
    });
}

function changeRole(employeeID) {
    let roleArray2 = [];
    let queryRole = "SELECT * FROM role";
    db.query(queryRole, (err, results2) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name:"role",
                type:"list",
                message: "What is the employee's new Role",
                choices: function(){
                    for(let j=0; j< results2.length; j++){
                        roleArray2.push(results2[j].title);
                    }
                    return roleArray2;
                },  
            },
        ])
        .then((data) => {
            let newRole = data.role;
            let roleID = roleArray2.indexOf(newRole) + 1;
            let qry = "UPDATE employee SET role_id = ? WHERE employee.id = ?";
            db.query(qry, [roleID, employeeID], (err, results) => {
                if(err) throw err;
                console.log("Employee Role Updated");
                console.table(results);
                viewAllEmployees();
                renderOptions();
            });
        });
    });
}

function renderOptions() {
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
        switch(data.choice) {
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
                process.exit(0);
        }
    })
}

// APP starts here
init();
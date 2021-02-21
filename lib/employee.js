const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect = require('./connection');
const role = require('./role');
const department = require('./department');
const mysql = require('mysql');
//add employee
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the first name of the employee?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: `Enter the last name of the employee?`
        },
        {
            name: 'role',
            type: 'list',
            message: `Select the role?`,
            choices: role.getRole("name")
        },
        {
            name: 'Manager',
            type: 'list',
            message: `Select the Manager?`,
            choices: getManager("name")
        }
    ]).then(answers => {
        let connection = mysql.createConnection(connect.db_config);
        const managerId = getManager(answers.Manager);
        const roleId = role.getRole(answers.role);
        const query = "insert into employee(first_name,last_name,role_id,manager_id)values('" + answers.firstName + "','" + answers.lastName + "'," + roleId + "," + managerId + ")";
        connection.query(query, function (err, res) {
            if (err) throw err;
            allEmployee("role");
        });
        connection.end();
        CreateQuestions.CreateQuestions();
    });
}
//get manager name
let managerValue = [];
function getManager(value) {
    let connection = mysql.createConnection(connect.db_config);
    if (value == "name") {
        let values = [];
        const query = `select *
    from employee`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                // console.log(res[i].id+"  "+res[i].first_name +"         "+res[i].last_name +"         "+res[i].department);
                values.push(res[i].first_name + " " + res[i].last_name);
                managerValue.push(res[i]);
            }

        });
        return (values);
    }
    else {
        let id = "";
        let split = value.split(" ");
        managerValue.forEach(element => {
            if (element.first_name == split[0] && element.last_name == split[1]) {
                id = element.id;
            }
        });
        return id;
    }
}
let employee = [];
let employeeDetails = [];
const allEmployee = (name) => {
    let connection = mysql.createConnection(connect.db_config);
    if (name == "role") {
        const query = "select id ,first_name,last_name from employee";
        employee.length=0;
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                employee.push(res[i].first_name + " " + res[i].last_name);
                employeeDetails.push({ id: res[i].id, name: res[i].first_name + " " + res[i].last_name });

            }
        });

        return employee;
    }
    else {
        const query = `select e.id as id,e.first_name,e.last_name,r.title,d.name as department,r.salary,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee e inner join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    left join employee m on e.manager_id=m.id
    order by e.id asc`;
        let values = [];
        connection.query(query, function (err, res) {
            if (err) throw err;
            if(res.length)
            {
            for (let i = 0; i < res.length; i++) {
                values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Title: res[i].title, Department: res[i].department, Salary: res[i].salary, Manager: res[i].Manager_firstname + " " + res[i].Manager_lastName });
            }
            console.table(values);
            CreateQuestions.CreateQuestions();
        }
        else
        {
            console.log("No data of employee");
            CreateQuestions.CreateQuestions();
        }
        });
    }
    connection.end();
}
//update the role of the employee
function updateEmployeeRole() {
    if(employee.length)
    {
    inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            message: `Select the Employee?`,
            choices: employee
        },
        {
            name: 'role',
            type: 'list',
            message: `Select the role for the employee?`,
            choices: role.getRole("name")
        }
    ]).then(answers => {
        let connection = mysql.createConnection(connect.db_config);
        const roleId = role.getRole(answers.role);
        let id = 0;
        employeeDetails.forEach(element => {
            if (element.name == answers.employeeName) {
                id = element.id;

            }
        });
        const query = "update employee set role_id=" + roleId + " where id=" + id;
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.log("sucessfull updated the employee");
            connection.end();
            CreateQuestions.CreateQuestions();
        });
    });
}
else
{
    console.log("No data of employee");
    CreateQuestions.CreateQuestions();
}
}
//view all the employee by department
function employeeByDepartment() {
    let connection = mysql.createConnection(connect.db_config);
    const query = `select e.id as id,e.first_name,e.last_name,d.name as department
    from employee e inner join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    order by e.id asc`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        let values = [];
        for (let i = 0; i < res.length; i++) {
            values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Department: res[i].department });
        }
        console.table(values);
        CreateQuestions.CreateQuestions();
    });
    connection.end();
}
//view all the employee by department
function employeeByManager() {
    let connection = mysql.createConnection(connect.db_config);
    const query = `select e.id as id,e.first_name,e.last_name,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee m inner join employee e on e.manager_id=m.id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        let values = [];
        for (let i = 0; i < res.length; i++) {
            values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Manager: res[i].Manager_firstname + " " + res[i].Manager_lastName });
        }
        console.table(values);
        CreateQuestions.CreateQuestions();
    });
    connection.end();
}
//reomve employee
function removeEmployee() {
    let connection = mysql.createConnection(connect.db_config);
    if (employee.length) {
        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: `Select the Employee want to remove?`,
                choices: employee
            },
        ]).then(answers => {
            let id = 0;
            employeeDetails.forEach(element => {
                if (element.name == answers.employeeName) {
                    id = element.id;
                    

                }
            });
            const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`
            const query2 = `delete from employee where id=${id}`;
            connection.query(query1, function (err, res) {
                if (err) throw err;
                connection.query(query2, function (err, res) {
                    if (err) throw err;
                    allEmployee("role");
                    console.log("Sucsessfully deleted the employee");                    
                CreateQuestions.CreateQuestions();
                });
                connection.end();
            });
        });
    }
    else {
        console.log("Sorry! no employee are there to be deleted..");
        CreateQuestions.CreateQuestions();
    }
}
//update employee manager
function updateEmployeeManager() {
    if(employee.length)
    {
    inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            message: `Select the Employee?`,
            choices: employee
        },
        {
            name: 'Manager',
            type: 'list',
            message: `Select the Manager?`,
            choices: getManager("name")
        }
    ]).then(answers => {
        let connection = mysql.createConnection(connect.db_config);
        const managerId = getManager(answers.Manager);
        let id = 0;
        employeeDetails.forEach(element => {
            if (element.name == answers.employeeName) {
                id = element.id;

            }
        });
        const query = "update employee set manager_id=" + managerId + " where id=" + id;
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.log("sucessfull updated the employee's Manager");            
            allEmployee("role");
            connection.end();
            CreateQuestions.CreateQuestions();
        });
    });
}
else
{
    console.log("No data of Employee");
    CreateQuestions.CreateQuestions();
}
}
allEmployee("role");
module.exports.allEmployee = allEmployee;
module.exports.addEmployee = addEmployee;
module.exports.updateEmployeeRole = updateEmployeeRole;
module.exports.employeeByDepartment = employeeByDepartment;
module.exports.employeeByManager = employeeByManager;
module.exports.removeEmployee = removeEmployee;
module.exports.updateEmployeeManager = updateEmployeeManager;
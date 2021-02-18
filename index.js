//added the inquirer module
const inquirer = require('inquirer');
const mysql = require('mysql');
const console = require('console');
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "090981",
    database: "office_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    CreateQuestions();
});
//function create the prompt to ask user questions
function CreateQuestions() {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: `What you would like to do?`,
            choices: ['View all Employees', 'View all Employees By Department', 'View all Employees by Manager', 'add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
        }
    ]).then(answers => {
        console.log(answers);
        if (answers.choice == 'View all Employees') {
            allEmployee(answers);
        }
        else if (answers.choice == 'View all Employees By Department') {
            employeeByDepartment();
        }
        else if (answers.choice == 'View all Employees by Manager') {
            employeeByManager();
        }
        else if (answers.choice == 'add Employee') {
            addEmployee();
        }
    });
}
//view all the employee by department
function employeeByDepartment() {
    // console.log("id  first_name  last_name   department");
    // console.log("--  ----------  ---------   ----------");
    const query = `select e.id as id,e.first_name,e.last_name,d.name as department
    from employee e right join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    order by e.id asc`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        let values = [];

        for (let i = 0; i < res.length; i++) {
            // console.log(res[i].id+"  "+res[i].first_name +"         "+res[i].last_name +"         "+res[i].department);
            values.push({ id: res[i].id, first_name: res[i].first_name, last_name: res[i].last_name, department: res[i].department });
        }
        console.table(values);
    });
    //connection.end();
}
//view all the employee by department
function employeeByManager() {
    // console.log("id  first_name  last_name   department");
    // console.log("--  ----------  ---------   ----------");
    const query = `select e.id as id,e.first_name,e.last_name,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee e inner join employee m on m.manager_id=e.id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        let values = [];

        for (let i = 0; i < res.length; i++) {
            // console.log(res[i].id+"  "+res[i].first_name +"         "+res[i].last_name +"         "+res[i].department);
            values.push({ id: res[i].id, first_name: res[i].first_name, last_name: res[i].last_name, Manager:res[i].Manager_firstname + " " + res[i].Manager_lastName });
        }
        console.table(values);
    });
    //connection.end();
}
//view all the employee
function allEmployee() {
    // console.log("id  first_name  last_name  title                department  salary     manager ");
    // console.log("--  ----------  ---------  -------------------  ----------  --------   ------------------");
    const query = `select e.id as id,e.first_name,e.last_name,r.title,d.name as department,r.salary,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee e right join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    inner join employee m on m.manager_id=e.id`;
    let values = [];
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (let i = 0; i < res.length; i++)
        //  console.log(res[i].id+"  "+res[i].first_name +"         "+res[i].last_name +"        "+res[i].title+"           "+res[i].department+"       "+res[i].salary+"    "+res[i].Manager_firstname+" "+res[i].Manager_lastName);
        {
            values.push({ id: res[i].id, first_name: res[i].first_name, last_name: res[i].last_name, title: res[i].title, department: res[i].department, salary: res[i].salary, Manager: res[i].Manager_firstname + " " + res[i].Manager_lastName });
        }
       console.table(values);
    });
}
//add employee
function addEmployee() {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'input',
            message: `Enter the first_name of the employee?`,
            choices: ['View all Employees', 'View all Employees By Department', 'View all Employees by Manager', 'add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
        }
    ]).then(answers => {
        console.log(answers);
        if (answers.choice == 'View all Employees') {
            allEmployee(answers);
        }
        else if (answers.choice == 'View all Employees By Department') {
            employeeByDepartment();
        }
        else if (answers.choice == 'View all Employees by Manager') {
            employeeByManager();
        }
        else if (answers.choice == 'add Employee') {
            addEmployee();
        }
    });
}
//modeules to be added
const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect = require('./connection');
const role = require('./role');
const department = require('./department');
const mysql = require('mysql');
//add new employee to the employee table
function addEmployee() {
    //ask the user specific question to add the new employee
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
        }
    ]).then(answers => {    
        //create an sql conneciton    
        let connection = mysql.createConnection(connect.db_config);
        //check if there is any records in the employee
        // if there is no records then the manager will be null
        //else the prompt will ask user to choose the manager
        const getEmp="select * from employee";
        connection.query(getEmp,function(err,res){
            if(res.length)
            {
                // if there is records in the employee table
                //ask user to select the manager
                inquirer.prompt([
                    {
                        name: 'Manager',
                        type: 'list',
                        message: `Select the Manager?`,
                        choices: manager
                    }]).then(ans=>{
                    //create an sql connection    
                let connection = mysql.createConnection(connect.db_config);
                //get the manager id
                const managerId = getManager(ans.Manager);
                // get the role id
                const roleId = role.getRole(answers.role);
                //query to insert into to the employee table new employee
                const query = "insert into employee(first_name,last_name,role_id,manager_id)values('" + answers.firstName + "','" + answers.lastName + "'," + roleId + "," + managerId + ")";
                //execute the query
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    //if succuessfully new employee is inserted then display a message
                    console.log("Successfully inserted the Employee");
                    //function to update the employee array
                    allEmployee("role");
                    //function to update the manager array
                    getManager("name");
                    //function to return to the main question selection
                    CreateQuestions.CreateQuestions();
                });
            });
            }
            //if there is no record in the employee table
            //then set the mmanager to null
            else
            {
                //display a message to the user that no manager is present to select
                console.log("No manager present");
                //create the sql connection
                let connection = mysql.createConnection(connect.db_config);
                //set the manager id 0
                const managerId = 0;
                //get the role id
                const roleId = role.getRole(answers.role);
                //query to set foreign key constriant to 0
                const query = `SET FOREIGN_KEY_CHECKS = 0 ;`;
                //querym to insert in the employee table with manager null
               const quer1="insert into employee(first_name,last_name,role_id,manager_id)values('" + answers.firstName + "','" + answers.lastName + "'," + roleId + "," + managerId + ")";
               //run the query
               connection.query(query, function (err, res) {
                    if (err) throw err;
                    //run the query
                    connection.query(quer1,function(err,res)
                    {
                        //display the message if successfully new employee inserted into the employee table
                        console.log("Successfully inserted the Employee");
                        //set the employee array
                        allEmployee("role");
                        //set the manager array
                        getManager("name");
                        //start the main question section again
                        CreateQuestions.CreateQuestions();
                    });
                    
                });
            }
        
        });   
    });
}
//get manager name 
let managerValue = [];
let manager=[];
//function to get the manager naime
function getManager(value) {
    //create an sql connection
    let connection = mysql.createConnection(connect.db_config);
    //get the name of all the managers
    if (value == "name") {
        let values = [];
        managerValue.length=0;
        manager.length=0;
        //query to get the name of all the managers
        const query = `select *
    from employee`;
    //run the query
        connection.query(query, function (err, res) {
            if (err) throw err;
            //if ther is a record in the employee table
            for (let i = 0; i < res.length; i++) {
                //push the employee name in the values
                values.push(res[i].first_name + " " + res[i].last_name);
                //push all the employee information to the managerValue
                managerValue.push(res[i]);
                manager.push(res[i].first_name + " " + res[i].last_name);
            }

        });
    }
    else {
        //return the id of the manager
        let id = "";
        let split = value.split(" ");
        //itirate the managerValue array and get the id for the employee
        managerValue.forEach(element => {
            if (element.first_name == split[0] && element.last_name == split[1]) {
                id = element.id;
            }
        });
        //return the manager id back to the called function
        return id;
    }
}
//function to display all the employee information
let employee = [];
let employeeDetails = [];
//get all the employee rows from the employee table
const allEmployee = (name) => {
    //create an sql connectio
    let connection = mysql.createConnection(connect.db_config);
    if (name == "role") {
        //query to get the id .first name,last name of the employee
        const query = "select id ,first_name,last_name from employee";
        employee.length=0;
        //run the query to get all the records for the employee
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                //if there are records in the employee table
                //push it to the employee and employeeDetails table
                employee.push(res[i].first_name + " " + res[i].last_name);
                employeeDetails.push({ id: res[i].id, name: res[i].first_name + " " + res[i].last_name });

            }
        });
        //return the name of all the employee to the called function
        return employee;
    }
    else {
        //query to get the all information about the employee from employee table,department table and role table
        const query = `select e.id as id,e.first_name,e.last_name,r.title,d.name as department,r.salary,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee e inner join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    left join employee m on e.manager_id=m.id
    order by e.id asc`;
        let values = [];
        //run the sql query
        connection.query(query, function (err, res) {
            if (err) throw err;
            if(res.length)
            {
                //if the employee table is not null
            for (let i = 0; i < res.length; i++) {
                values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Title: res[i].title, Department: res[i].department, Salary: res[i].salary, Manager: res[i].Manager_firstname + " " + res[i].Manager_lastName });
            }
            //display the employee data in table format
            console.table(values);
            //return to the main question segment
            CreateQuestions.CreateQuestions();
        }
        else
        {
            //tell the user there are no records in the employee table
            console.log("No data of employee");
            //return back to the main question segment
            CreateQuestions.CreateQuestions();
        }
        });
    }
    //end the connection
    connection.end();
}
//update the role of the specific employee
function updateEmployeeRole() {
    //check if there are records in the employee table
    if(employee.length)
    {
        //ask the user to select the name of the employee
    inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            message: `Select the Employee?`,
            choices: employee
        },
        //ask the user to select the role of the employee wants to update
        {
            name: 'role',
            type: 'list',
            message: `Select the role for the employee?`,
            choices: role.getRole("name")
        }
    ]).then(answers => {
        //create an sql connection
        let connection = mysql.createConnection(connect.db_config);
        //get the role id
        const roleId = role.getRole(answers.role);
        let id = 0;
        //from the employee details table get the id of the employee user selected
        employeeDetails.forEach(element => {
            if (element.name == answers.employeeName) {
                //assign the employee id to the id variable
                id = element.id;

            }
        });
        //query to update the employee role id
        const query = "update employee set role_id=" + roleId + " where id=" + id;
        //run the query
        connection.query(query, function (err, res) {
            if (err) throw err;
            //display on successfull insertion
            console.log("sucessfull updated the employee");
            //end the connection
            connection.end();
            //retun back to the main question segment
            CreateQuestions.CreateQuestions();
        });
    });
}
//if no data display no data in the employee table
else
{
    //no data in employee table
    console.log("No data of employee");
    //return back to the main question segment
    CreateQuestions.CreateQuestions();
}
}
//view all the employee by department
function employeeByDepartment() {
    //create an sql connection
    let connection = mysql.createConnection(connect.db_config);
    //create a quert to get all the employee based on the department
    const query = `select e.id as id,e.first_name,e.last_name,d.name as department
    from employee e inner join role r on e.role_id=r.id 
    inner join department d on r.department_id=d.id
    order by e.id asc`;
    //run the query
    connection.query(query, function (err, res) {
        if (err) throw err;
        let values = [];
        //assign the data to the values array
        for (let i = 0; i < res.length; i++) {
            values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Department: res[i].department });
        }
        //genrate a table format
        console.table(values);
        //retun back to main question section
        CreateQuestions.CreateQuestions();
    });
    //end the connection
    connection.end();
}
//view all the employee by department
function employeeByManager() {
    //create an sql connection
    let connection = mysql.createConnection(connect.db_config);
    //genrate a query to get the employee based on the manager
    const query = `select e.id as id,e.first_name,e.last_name,m.first_name as Manager_firstname,m.last_name as Manager_lastName
    from employee m inner join employee e on e.manager_id=m.id`;
    //run the query
    connection.query(query, function (err, res) {
        if (err) throw err;
        let values = [];
        //push the result to the values array
        for (let i = 0; i < res.length; i++) {
            values.push({ Id: res[i].id, First_name: res[i].first_name, Last_name: res[i].last_name, Manager: res[i].Manager_firstname + " " + res[i].Manager_lastName });
        }
        //display the result in table format
        console.table(values);
        //return back to the main question section
        CreateQuestions.CreateQuestions();
    });
    //end the connection
    connection.end();
}
//reomve specific employee from the employee table
function removeEmployee() {
    //create an sql connection
    let connection = mysql.createConnection(connect.db_config);
    //check if the employee table contains any rows
    if (employee.length) {
        //ask the name of the employee user wants to delete
        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: `Select the Employee want to remove?`,
                choices: employee
            },
        ]).then(answers => {
            //get the id of the employee user selected
            let id = 0;
            employeeDetails.forEach(element => {
                if (element.name == answers.employeeName) {
                    //assign the employee id to the id const
                    id = element.id;
                }
            });
            //set the foreign key constriant to 0
            const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`
            //query to delete the employee
            const query2 = `delete from employee where id=${id}`;
            //run the query
            connection.query(query1, function (err, res) {
                if (err) throw err;
                //run the query
                connection.query(query2, function (err, res) {
                    if (err) throw err;
                    //update the array 
                    allEmployee("role");
                    //update the manager array
                    getManager("name");
                    //display message of successfull deletion
                    console.log("Sucsessfully deleted the employee");
                    //return back to main question segement                    
                CreateQuestions.CreateQuestions();
                });
                //end the sql connection
                connection.end();
            });
        });
    }
    //if no records are there in the employee table
    else {
        //display no reocrds
        console.log("Sorry! no employee are there to be deleted..");
        //return back to the main question section
        CreateQuestions.CreateQuestions();
    }
}
//update specific employee manager 
function updateEmployeeManager() {
    //check if employee table is not empty
    if(employee.length)
    {
        //ask the name of the employee for which he wants to update the manager
    inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            message: `Select the Employee?`,
            choices: employee
        },
        //select the manager for the employee
        {
            name: 'Manager',
            type: 'list',
            message: `Select the Manager?`,
            choices: manager
        }
    ]).then(answers => {
        //create an sql connection
        let connection = mysql.createConnection(connect.db_config);
        //get the manager id
        const managerId = getManager(answers.Manager);
        let id = 0;
        //get the employee id
        employeeDetails.forEach(element => {
            if (element.name == answers.employeeName) {
                id = element.id;
            }
        });
        //query to update employee manager
        const query = "update employee set manager_id=" + managerId + " where id=" + id;
        //run the query
        connection.query(query, function (err, res) {
            if (err) throw err;
            //on success display a message
            console.log("sucessfull updated the employee's Manager");   
            //update employee array         
            allEmployee("role");
            //ask main questions to the user
            CreateQuestions.CreateQuestions();  
            //end the connection         
            connection.end();
        });
    });
}
else
{ //display no data in the employee table
    console.log("No data of Employee");
    //return the main question
    CreateQuestions.CreateQuestions();
}
}
//update the employee array
allEmployee("role");
//update the manager array
getManager("name");
//export all the functions of the employee
module.exports.allEmployee = allEmployee;
module.exports.addEmployee = addEmployee;
module.exports.updateEmployeeRole = updateEmployeeRole;
module.exports.employeeByDepartment = employeeByDepartment;
module.exports.employeeByManager = employeeByManager;
module.exports.removeEmployee = removeEmployee;
module.exports.updateEmployeeManager = updateEmployeeManager;
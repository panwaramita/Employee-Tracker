//modeule to be added
const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect = require('./connection');
const department = require('./department');
const mysql = require('mysql');
//add role to the role table
function addRole() {
    //ask the user question to add new role to the role table in the database
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the role title?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role?'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Select the department for the role?',
            choices: department.getDepartment("name")
        }
    ]).then(answers => {
        //create an sql connection  
        let connection = mysql.createConnection(connect.db_config);
        //get the department id  
        const departmentId = department.getDepartment(answers.department);
        //check if the role already exist or not
        const queryIsExist = "select title from role where title='" + answers.title + "' and department_id=" + departmentId;
        //run the sql query
        connection.query(queryIsExist, function (err, res) {
            if (err) throw err;
            //check if the role already present
            if (res.length) {
                //if the role already present display a message 
                console.log(answers.title + " role already exists for the department..");
                //return back to the main question selection
                CreateQuestions.CreateQuestions();
            }
            else {
                //if the role not present in the role table 
                //create a query to insert a new role in the role table
                const query = "insert into role(title,salary,department_id)values('" + answers.title + "'," + answers.salary + "," + departmentId + ")";
                //run the query
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    //on succesfull insertion display a message
                    console.log("sucessfull insertion.");
                    //updpate the role array
                    getRole("name");
                    //return to the main question section
                    CreateQuestions.CreateQuestions();
                });
            }
        })
    });
}
//get role from the role table
let roleValues = [];
let role = [];
//get the role name and id from role table from the database 
function getRole(value) {
    //create an sql connection
    let connection = mysql.createConnection(connect.db_config);
    //get all the role title      
    if (value == "name") {
        roleValues.length = 0;
        role.length = 0;
        let value = [];
        //query to get all the records from the role table
        const query = `select *
    from role`;
        //run the query
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                //update the roleValues and role and value array
                roleValues.push(res[i]);
                value.push(res[i].title);
                role.push(res[i].title);
            }
        });
        //return all the title from the role table
        return (value);
    }
    else if (value == "view") {
        let value = [];
        //query to get all the role information
        const query = `select r.id,r.title,r.salary,d.name
          from role r inner join department d
          on r.department_id=d.id
          order by id asc`;
        //run the query
        connection.query(query, function (err, res) {
            if (err) throw err;
            if (res.length) {
                //if there are records in the role table push in the value array
                for (let i = 0; i < res.length; i++) {
                    value.push({ Id: res[i].id, Title: res[i].title, Salary: res[i].salary, Department_name: res[i].name });
                }
                //display result in table form
                console.table(value);
                //return to the main question section
                CreateQuestions.CreateQuestions();
            }
            //if no data present in the table
            else {
                //display message on data of the role
                console.log("No data of the role");
                //return back to the main question section
                CreateQuestions.CreateQuestions();
            }
        });
    }
    //get the id for the sepecific role
    else {
        let id = "";
        roleValues.forEach(element => {
            //check if the title matches with title in the roleValues assign it to the id const
            if (element.title == value) {
                id = element.id;
            }
        });
        //return the id of the role to the called function
        return id;
    }
    //end the connection
    connection.end();
}
// remove the specific role from the role table
const removeRole = () => {
    //check if there are records in the role table in database
    if (role.length) {
        //ask user which role want to deleted
        inquirer.prompt([
            {
                name: 'roleName',
                type: 'list',
                message: 'Enter the name of the role want to?',
                choices: role
            }
        ]).then(answers => {
            //get the id for the role
            const query = "select id from role where title='" + answers.roleName + "'";
            //create sql connection
            let connection = mysql.createConnection(connect.db_config);
            let id = 0;
            //run the query
            connection.query(query, function (err, data) {
                if (err) throw err;
                //assign the id to the id variable
                id = data[0].id;
                if (data.length) {
                    //check if that role is assign to any employee
                    const queryRole = "select id from employee where role_id=" + id;
                    //run the query
                    connection.query(queryRole, function (err, data) {
                        if (err) throw err;
                        //if the role is assign to any employee
                        if (data.length) {
                            //display a message the role can not be deleted
                            console.log("Employee exist for the role.Hence role can not be deleted..");
                            //return back to the main question section
                            CreateQuestions.CreateQuestions();
                        }
                        //if role is not assign to any employee
                        else {       //create the query to set foreign key constraint to 0
                            const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`
                            //query to delete the role
                            const query2 = `delete from role where id=${id}`;
                            //run the query
                            connection.query(query1, function (err, res) {
                                if (err) throw err;
                                //run the query
                                connection.query(query2, function (err, res) {
                                    if (err) throw err;
                                    //display a message on successfull deletion               
                                    console.log("Successfully deleted the role\n");
                                    //update the role array
                                    getRole("name");
                                    //return back to main question section                                
                                    CreateQuestions.CreateQuestions();
                                });
                            });
                        }
                    });
                }
            });
        });
    }
    //check if not data in the role table
    else {
        //display a message no data
        console.log("No data of role");
        //return back to the main question section
        CreateQuestions.CreateQuestions();
    }
}
//initialize the array
getRole("name");
//functions to be export from the role
module.exports.addRole = addRole;
module.exports.getRole = getRole;
module.exports.removeRole = removeRole;
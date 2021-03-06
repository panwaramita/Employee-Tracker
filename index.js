//added the inquirer module
const inquirer = require('inquirer');
 const department=require('./lib/department');
const role=require('./lib/role');
const employee=require('./lib/employee');
//function create the prompt to ask user questions
function CreateQuestions(){
    //ask the user question 
    inquirer.prompt([
        {   
            name: 'choice',
            type: 'list',
            message: 'What you would like to do?',
            choices: ["Add Department","Add Role","add Employee","View Department","View Role","View all Employees","Update Employee Role","View all Employees By Department","View all Employees by Manager", "Remove Employee","Remove Department","Remove Role","Update Employee Manager","Total Salary based on Department","Exit"]
        }
    ]).then(answers => {
        if (answers.choice == 'View all Employees') {
            employee.allEmployee(answers);
        }
        else if (answers.choice == 'View all Employees By Department') {
            employee.employeeByDepartment();
        }
        else if (answers.choice == 'View all Employees by Manager') {
            employee.employeeByManager();
        }
        else if (answers.choice == 'add Employee') {
            employee.addEmployee();
        } 
        else if (answers.choice == 'Add Department') {
        department.addDepartment();
        }
        else if (answers.choice == 'Add Role') {
           role.addRole();
        }
        else if (answers.choice == 'View Department') {
             department.getDepartment("view");
        }
        else if (answers.choice == 'View Role') {
         role.getRole("view");
        }
        else if (answers.choice == 'Update Employee Role') {
            employee.updateEmployeeRole();
        }
        else if (answers.choice == 'Remove Employee') {
            employee.removeEmployee();
        }
        else if (answers.choice == 'Remove Department') {
            department.removeDepartment();
        }
        else if (answers.choice == 'Remove Role') {
            role.removeRole();
        }
        else if (answers.choice == 'Update Employee Manager') {
            employee.updateEmployeeManager();
        }
        else if (answers.choice == 'Total Salary based on Department') {
            department.salaryBasedOnDepartment();
        }
        else if(answers.choice == "Exit"){
                return process.exit(22);
        }
    });
}
// run function calls the create question function
const run = async () => {
 await CreateQuestions();
};
run();
//export the run function
module.exports.CreateQuestions=run;
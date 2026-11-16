package com.alok.mcpserver.employeemcpserver;


import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Service;

import java.util.List;

@SuppressWarnings({"OptionalGetWithoutIsPresent", "UnnecessaryLocalVariable"})
@Service
class ConversationalService {

    private final DepartmentsRepository departmentsRepository;
    private final EmployeesRepository employeesRepository;

    ConversationalService(DepartmentsRepository departmentsRepository, EmployeesRepository employeesRepository) {
        this.departmentsRepository = departmentsRepository;
        this.employeesRepository = employeesRepository;
    }

    @Tool(description = "Get the Employee details and related Department details")
    String getEmployeeDetails( @ToolParam(description = "id of the employee") int id) {
        Employees employees = employeesRepository.findById(id).get();
        Departments departments = departmentsRepository.findById(employees.department_id()).get();

        return employees + "\n" + departments;
    }

    @Tool(description = "Get the reporting manager details of the employee")
    String getReportingManagerDetails(@ToolParam(description = "id of the employee") int id) {
        Employees employees = employeesRepository.findById(id).get();
        Employees manager = employeesRepository.findById(employees.manager_id()).get();

        return employees + "\n" + manager;
    }

    @Tool(description = "Get the Reporting Hierarchy of the employee by manager id")
    List<Employees> getReportingHierarchy(@ToolParam(description = "id of the employee") int id) {
        List<Employees> byManagerId = employeesRepository.findByManagerId(id);
        return byManagerId;
    }

    @Tool(description = "Get the Salary of the reposting employee")
    String getSalary(@ToolParam(description = "id of the employee") int id) {
        Employees employees = employeesRepository.findById(id).get();
        if (employees.is_manager()) {
            return "Salary of the employee is: " + employees.salary();
        } else {
            return "Salary information is not available for the employee";
        }
    }

    @Tool(description = "Get the Employees of the department")
    List<Employees> getEmployeesByDepartment(@ToolParam(description = "id of the department") int id) {
        List<Employees> employees = employeesRepository.findByDepartmentId(id);
        return employees;
    }
}

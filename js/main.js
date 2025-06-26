class Employee {
    constructor(name, age) {
        // The class should NOT be instantiated.
        if (new.target === Employee) {
            throw new TypeError("Employee is abstract and cannot be instantiated directly");
        }
        this.name = name;
        this.age = age;
        this.annualSalary = 0;
    }
}

class PartTime extends Employee {
    constructor(name, age, payRate, hours) {
        super(name, age);
        this.payRate = payRate;
        this.hours = hours;
        this.employeeType = "Part-Time";
        this.calculatePay();
    }
    calculatePay() {
        const weekly = this.payRate * this.hours;
        this.annualSalary = weekly * 52;
    }
}

class Manager extends Employee {
    constructor(name, age, payRate, hours = 40) {
        super(name, age);
        this.payRate = payRate;
        this.hours = hours;
        this.employeeType = "Manager";
        this.calculatePay();
    }
    calculatePay() {
        const weekly = this.payRate * this.hours;
        this.annualSalary = weekly * 52 - 1000;
    }
}

class Main {
    constructor() {
        this.employees = [
            new Manager("Alex", 53, 75, 40),
            new PartTime("Elijah", 27, 16, 32),
            new Manager("Omayra", 56, 22, 40)
        ];
        this.menu();
    }

    menu() {
        let choice;
        do {
            this.displayEmployees();
            choice = parseInt(prompt(
                "Main Menu:\n" +
                "1) Add Employee\n" +
                "2) Remove Employee\n" +
                "3) Edit Employee\n" +
                "4) Display Employees\n\n" +
                "Enter selection:"
            ));
            switch (choice) {
                case 1: this.addEmployee(); break;
                case 2: this.removeEmployee(); break;
                case 3: this.editEmployee(); break;
                case 4: this.displayEmployees(); break;
                default: alert("Please enter 1-4");
            }
        } while (choice !== 9999 && choice !== null);
        console.clear();
        console.log("Program terminated.");
    }

    addEmployee() {
        const raw = prompt(
            "Enter employee information:\n" +
            "Format: name, age, pay, hours"
        );
        if (!raw) return;
        const [name, age, pay, hrs] = raw.split(",").map(s => s.trim());
        const hours = parseInt(hrs);
        const payRate = parseFloat(pay);
        const employee =
            hours < 40
                ? new PartTime(name, age, payRate, hours)
                : new Manager(name, age, payRate, hours);
        this.employees.push(employee);
    }

    removeEmployee() {
        if (!this.employees.length) return;

        const idOrName = prompt("Enter the id or name to remove:");
        if (idOrName === null) return;

        if (!isNaN(idOrName)) {
            const employeeIndex = parseInt(idOrName) - 1;
            if (this.employees[employeeIndex]) this.employees.splice(employeeIndex, 1);
        } else {
            const employeeName = idOrName.toLowerCase();
            this.employees = this.employees.filter(
                e => e.name.toLowerCase() !== employeeName
            );
        }
    }

    editEmployee() {
        if (!this.employees.length) return;

        const id = parseInt(prompt("Enter the employee id to edit:"));
        if (id === null || isNaN(id)) return;

        const employeeIndex = id - 1;

        const employee = this.employees[employeeIndex];
        if (!employee) return;

        const newRate = parseFloat(prompt(`Please enter the new rate.\nCurrent rate is: $${employee.payRate}/hr:`));
        if (newRate === null || isNaN(newRate)) return;

        employee.payRate = newRate;
        employee.calculatePay();
    }

    displayEmployees() {
        console.clear();
        console.log("Alex's Phily Cheestakes");

        // I like naming consitency. So names of columns are not as suggested.
        const headers = ["ID", "Name", "Salary", "Hours", "Pay", "FT/PT"];

        // Gerenate the rows
        const rows = this.employees.map((employee, index) => [
            employee.ID = String(index + 1),
            employee.name ?? "",
            `$${employee.annualSalary.toLocaleString()}`,
            String(employee.hours) ?? "",
            `$${employee.payRate.toFixed(2)}` ?? "",
            employee.employeeType === "Manager" ? "Full Time" : "Part Time"
        ]);

        // Get the columns width using the headers and rows.
        const colWidths = headers.map((h, i) =>
            Math.max(h.length, ...rows.map(r => r[i].length))
        );

        // This function will deal with column data missalignment
        const format = row => row
            .map((cell, i) => String(cell).padEnd(colWidths[i], " "))
            .join("\t");

        // Display the headers with the proper spacings
        // NOTE: The following causes alignment issue 
        // when a name that is too long is entered: 
        // console.log("ID\tName\tSalary\thrs\tpay\tFT/PT") 
        console.log(format(headers));

        // Display the rows with the proper spacings
        rows.forEach(r => console.log(format(r)));
    }
}

(() => {
    const main = new Main();
})();
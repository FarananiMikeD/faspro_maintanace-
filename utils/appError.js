// I have 2 class name here one call <[AppError]> an the other one call <[Error]>
//Note: The <[Error]> class name get a parameter of [message]


//* class
// class AppError extends Error {
//     constructor(message, statusCode) {
//         super(message);

//         this.statusCode = statusCode;
//         this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//         this.isOperational = true;

//         Error.captureStackTrace(this, this.constructor);
//     }
// }

// module.exports = AppError;


//* function

// function AppError(message, statusCode) {

//     if (!message || typeof message !== 'string') {
//         throw new Error('Message must be a string');
//     }

//     if (!statusCode || typeof statusCode !== 'number') {
//         throw new Error('Status code must be a number');
//     }

//     const error = new Error(message);

//     error.statusCode = statusCode;
//     error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//     error.isOperational = true;

//     Error.captureStackTrace(error, AppError);

//     return error;
// }

// module.exports = AppError;



//* more improvement

function AppError(message, statusCode) {

    if (!message || typeof message !== 'string') {
        throw new Error('Message must be a string');
    }

    if (!statusCode || typeof statusCode !== 'number') {
        throw new Error('Status code must be a number');
    }

    const error = new Error(message);

    error.statusCode = statusCode;
    if (statusCode >= 400 && statusCode < 500) {
        error.status = 'fail';
    } else if (statusCode >= 500) {
        error.status = 'error';
    } else {
        error.status = 'unknown';
    }
    error.isOperational = true;

    Error.captureStackTrace(error, AppError);

    return error;
}

module.exports = AppError;

















//! JAVASCRIPT CLASS REVISION 
//===========================
//*class one [Car]
class Car {
    constructor(brand) {
        //assigning the brand of a car to => this.car_name
        this.car_name = brand;
    }

    //This is a func that return the result 
    present() {
        return "result is" + this.car_name
    }
}

//* I could disp this class here but i extend it in class two
// my_car = new Car("Ford");
// console.log(my_car);


//*Class two [Model]
class Model extends Car {
    constructor(brand, mod) {
        super(brand); //super pass a val to class Car constructor
        this.mod = mod;
    }
    display() {
        return this.present() + ', it is a ' + this.model;
    }
}

//*am passing 2 val one that goes to class Car constructor and the second one to Class Model constructor
my_car = new Model("Ford", "Mustang");
// console.log(my_car);
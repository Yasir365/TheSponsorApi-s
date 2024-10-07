import Ajv from 'ajv'; 
import addFormats from 'ajv-formats';

const verifySchema = (Schema, requestedJSON) => {
    let result = {};
    const ajv = new Ajv({
        allErrors: true,
    });
    try {
        addFormats(ajv);  // Add formats to the Ajv instance
        ajv.addFormat("validString", /^[a-zA-Z]+$/);  // Adding custom formats
        ajv.addFormat("alphaNumeric", /^[a-zA-Z0-9]+$/);

        const validate = ajv.compile(Schema);
        const valid = validate(requestedJSON);

        if (!valid) {
            let errMessage = {};
            const newArr = validate.errors.map((er) => {
                if (er.instancePath) {
                    return (errMessage = {
                        message: er.message,
                        params: er.params,
                        path: er.instancePath
                    });
                } else {
                    return (errMessage = {
                        message: er.message,
                        params: er.params,
                    });
                }
            });
            result = {
                success: false,
                message: newArr
            };
        } else {
            result = {
                success: true,
                message: 'Requested JSON is valid',
            };
        }
    } catch (err) {
        console.log(err);
        result = {
            success: false,
            message: err,
        };
    }
    return result;
};

export default verifySchema
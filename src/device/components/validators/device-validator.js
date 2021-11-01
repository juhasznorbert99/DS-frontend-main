const requiredValidator = value => {
    return value.trim() !== '';
};

const numberValidator = value => {
    const re = /^\d+$/;
    return re.test(String(value).toLowerCase());
};

const validate = (value, rules) => {
    let isValid = true;
    for (let rule in rules) {

        switch (rule) {
            case 'isRequired': isValid = isValid && requiredValidator(value);
                break;
            case 'numberValidator': isValid = isValid && numberValidator(value);
                break;
            default: isValid = true;
        }

    }

    return isValid;
};

export default validate;

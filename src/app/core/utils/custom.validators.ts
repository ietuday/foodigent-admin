import { FormGroup, FormControl, ValidatorFn, FormArray } from '@angular/forms';

/**
 * @description email validator
 * @param control
 */
export function emailValidator(control: FormControl): any {
    const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

    /**
     *
     */
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}

/**
 * @description password validator
 * @param control
 */
export function passwordValidator(control: FormControl): any {
    const passwordReg = /^(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,30}$/;
    /**
     *
     */
    if (control.value && !passwordReg.test(control.value)) {
        return { invalidPassword: true };
    }
}

/**
 * @description password matching validator
 * @param passwordKey
 * @param passwordConfirmationKey
 */
export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (formGroup: FormGroup) => {
        const password = formGroup.controls[passwordKey];
        const passwordConfirmation = formGroup.controls[passwordConfirmationKey];
        if (passwordConfirmation.errors && !passwordConfirmation.errors.mismatchedPasswords) {
            return;
        }
        if (password.value !== passwordConfirmation.value) {
            passwordConfirmation.setErrors({ mismatchedPasswords: true });
        } else {
            passwordConfirmation.setErrors(null);
        }
    }
}

/**
 * @description minimum one checkbox selction validator
 * @param min
 */
export function minSelectedCheckboxes(min = 1) {
    const validator: any = (formArray: FormArray) => {
        const totalSelected = formArray.controls
            // get a list of checkbox values (boolean)
            .map(control => control.value)
            // total up the number of checked checkboxes
            .reduce((prev, next) => next ? prev + next : prev, 0);

        // if the total is not greater than the minimum, return the error message
        return totalSelected >= min ? null : { required: true };
    };

    return validator;
}

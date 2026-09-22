import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'completeFields', async: false })
export class CompleteFieldsConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, arguments_: ValidationArguments): boolean {
    const fields = arguments_.constraints[0] as string[];
    const object = arguments_.object as Record<string, unknown>;
    const values = fields.map((field) => object[field]);

    return values.every((value) => value === undefined) || values.every((value) => value !== undefined);
  }

  defaultMessage(arguments_: ValidationArguments): string {
    const fields = arguments_.constraints[0] as string[];
    return `${fields.join(', ')} must either all be provided or all be omitted`;
  }
}

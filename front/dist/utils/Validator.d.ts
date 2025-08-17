type Rule = {
    element: HTMLElement;
    validator: () => boolean;
    message: string;
};
export declare class Validator {
    static isEmail(value: string): boolean;
    static minLength(value: string, length: number): boolean;
    static required(value: string | null | undefined): boolean;
    static validateRules(rules: Rule[]): boolean;
}
export {};
//# sourceMappingURL=Validator.d.ts.map
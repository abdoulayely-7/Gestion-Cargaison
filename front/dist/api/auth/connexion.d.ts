import type { User } from "../../interface/User.js";
export declare function login(email: string, password: string): Promise<User | null>;
export declare function logout(): void;
export declare function getUserId(id: number): Promise<User | null>;
//# sourceMappingURL=connexion.d.ts.map
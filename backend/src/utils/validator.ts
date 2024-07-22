import { z } from "zod";

const validator = z.object({
    name: z.string({ required_error: "Username is required" })
        .trim()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(255, { message: "Username must not be more than 255 characters" }),

    email: z.string({ required_error: "Email is required" })
        .trim()
        .min(3, { message: "Email must be at least 3 characters" })
        .max(255, { message: "Email must not be more than 255 characters" }),

  
    password: z.string({ required_error: "Password is required" })
        .trim()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(20, { message: "Password must not be more than 20 characters" }),

    confirmPassword: z.string()

}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword']
});

export { validator };

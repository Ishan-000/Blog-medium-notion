import z from "zod";

export const SignupInput= z.object({
email:z.string().email(),
password:z.string().min(6)
})

export type SignupInput = z.infer<typeof SignupInput>


export const SigninInput= z.object({
    email:z.string().email(),
    password:z.string().min(6)
    })
    
    export type SigninInput = z.infer<typeof SigninInput>

    
export const CreateBlogInput= z.object({
    title:z.string(),
    content:z.string()
    })
    
export type CreateBlogInpu = z.infer<typeof CreateBlogInput>

export const UpdateBlogInput= z.object({
        title:z.string(),
        content:z.string(),
        id: z.string()
        })
        
export type UpdateBlogInpu = z.infer<typeof UpdateBlogInput>
   
    

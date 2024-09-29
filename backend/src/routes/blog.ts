import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify , decode } from "hono/jwt";
import { CreateBlogInput, UpdateBlogInpu, UpdateBlogInput } from "@ishan100x/medium-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId : string;
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("Authorization")||"";
   
//    const token = header.split("")[1];
   const user = await verify(header, c.env.JWT_SECRET);
   if(user){
    c.set("userId", user.id as string);
     await next();
   }else{
     c.status(403);
     return c.json({ message: "Invalid token" });
   }
    
})
   
   
   
   blogRouter.post('/' , async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} = CreateBlogInput.safeParse(body);
    if(!success) {
    c.status(411);
    return c.json({
      message:"Inputs are incorrecrS"
    })
    }
    
    const userId = c.get("userId");
     
    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            published: false,
            authorId: userId,
        },

    })
    return c.json({
        id:post.id 
    })

   })
   
   
   blogRouter.put('/', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const {success} = UpdateBlogInput.safeParse(body);
    if(!success) {
    c.status(411);
    return c.json({
      message:"Inputs are incorrecrS"
    })
    }
    const post = await prisma.post.update({
        where:{
            id:body.id
        },
        data: {
            title: body.title,
            content: body.content,
        },

    })
    return c.json({
        id:post.id 
    })
   })

   blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate())

    const post = await prisma.post.findMany({});
    return c.json({
        posts: post
    })

   })



   blogRouter.get('/:id', async(c) => {
    const id =  c.req.param("id");

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate())
    
    try {
        const post = await prisma.post.findFirst({
            where:{
                id:id
            },
        })
    
        return c.json({
            post
        })
    }catch(e){
        c.status(411);
        return c.json({
            error: "Could not find post"
        })
    }

  })
   
   
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Configuration, { OpenAI } from "openai"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAI();

export async function POST(req:Request) {
    try{
        const {userId} = auth();
        const body = await req.json();
        const {messages} = body;

        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }

        if(!configuration.apiKey){
            return new NextResponse("OpenAI API Key not configured",{status:500});
        }

        if(!messages){
            return new NextResponse("messages are required",{status:400})
        }

        const response = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages
        })

        return NextResponse.json(response.choices[0].message.content)

    }catch(error){
        console.log("[Conversation]",error);
        return new NextResponse("Internal error",{status:500})
    }
    
}
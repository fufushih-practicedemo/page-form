'use server';

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";

class UserNotFoundError extends Error {}

const user = {
    id: "1"
};

export async function GetFormStats() {
    const stats = await prisma?.form.aggregate({
        where: {
            userId: user.id
        },
        _sum: {
            visits: true,
            submissions: true
        }
    })

    const visits = stats?._sum?.visits ?? 0;
    const submissions = stats?._sum?.submissions ?? 0;

    let submissionRate = 0;

    if(visits > 0) {
        submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return {
        visits, submissions, submissionRate, bounceRate
    }
}

export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data);
    if(!validation.success) {
        throw new Error("Invalid form data");
    }
    if(!user) {
        throw new UserNotFoundError();
    }
    const { name, description } = data;
    const form = await prisma?.form.create({
        data: {
            userId: user.id,
            name,
            description
        }
    })

    if(!form) {
        throw new Error("Failed to create form");
    }

    return form.id;
}

export async function GetForms() {
    if(!user) {
        throw new UserNotFoundError();
    }

    return await prisma?.form.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

export async function GetFormById(id: number) {
    if(!user) {
        throw new UserNotFoundError();
    }

    return await prisma?.form.findUnique({
        where: {
            userId: user.id,
            id
        }
    })
}
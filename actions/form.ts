'use server';

import { getUser } from "@/lib/lucia";
import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";

class UserNotFoundError extends Error {}

export async function GetFormStats() {
  const user = await getUser();
  if (!user) {
    throw new UserNotFoundError();
  }

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

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;

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

    const user = await getUser();
    if (!user) {
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
  const user = await getUser();
  if (!user) {
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
  const user = await getUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma?.form.findUnique({
    where: {
      userId: user.id,
      id
    }
  })
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await getUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma?.form.update({
    where: {
      userId: user.id,
      id
    },
    data: {
      content: jsonContent
    }
  })
}

export async function PublishForm(id: number) {
  const user = await getUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  
  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}
  
export async function GetFormContentByUrl(formatUrl: string) {
  return await prisma?.form.update({
    select: {
      content: true
    },
    data: {
      visits: {
        increment: 1
      }
    },
    where: {
      shareURL: formatUrl
    }
  })
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmission: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}
    
export async function GetFormWithSubmissions(id: number) {
  const user = await getUser();
  if (!user) {
      throw new UserNotFoundError();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmission: true,
    },
  });
}

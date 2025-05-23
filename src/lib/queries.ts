"use server";

import {clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import {Agency, Plan, User } from "@prisma/client";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) return
  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await currentUser();
  const email = authUser?.emailAddresses[0].emailAddress;
  let userData;
  let foundAgencyID = agencyId;
  if (!authUser) {
    const res = await db.user.findFirst({
      where: { Agency: { SubAccount: { some: { id: subaccountId } } } },
    });
    if (res) {
      userData = res;
    } else {
      userData = await db.user.findUnique({ where: { email: email } });
    }

    if (!userData) {
      console.log("Could not find a user");
      return;
    }

    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });
    if (response) foundAgencyID = response.agencyId;
  }
  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyID,
          },
        },
        SubAccount: {
          connect: {
            id: subaccountId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyID,
          },
        },
      },
    });
  }
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") {
    return null;
  }
  const response = await db.user.create({ data: { ...user } });
  return response;
};

export const verifyAndAcceptInvitation = async () => {
  try {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");
    const invitationExists = await db.invitation.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
        status: "PENDING",
      },
    });
    if (invitationExists) {
      const userDetails = await createTeamUser(invitationExists.agencyId, {
        email: invitationExists.email,
        agencyId: invitationExists.agencyId,
        avatarUrl: user.imageUrl,
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: invitationExists.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await saveActivityLogsNotification({
        agencyId: invitationExists?.agencyId,
        description: `Joined`,
        subaccountId: undefined,
      });
      if (userDetails) {
        await users.updateUserMetadata(user.id, {
          privateMetadata: {
            role: userDetails.role || "SUBACCOUNT_USER",
          },
        });
        await db.invitation.delete({
          where: { email: userDetails.email },
        });
        return userDetails.agencyId;
      } else return null;
    } else {
      const agency = await db.user.findUnique({
        where: {
          email: user.emailAddresses[0].emailAddress,
        },
      });
      return agency ? agency.agencyId : null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateAgencyDetails = async (agencyId:string,
  agencyDetails: Partial<Agency>
) => {
  const response = await db.agency.update({
    where:{id:agencyId},
    data:{...agencyDetails}})
    return response
  }
export const deleteAgency = async (agencyId:string) =>{
  try {
    const response = await db.agency.delete({where: {
      id:agencyId
    }})
    return response
  } catch (error) {
    
  }
}

export const initUser = async (newUser:Partial<User>) => {
  const user = await currentUser()
  if(!user) return
  const userdata = await db.user.upsert({
    where:{
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create:{
      id: user.id,
      avatarUrl:user.imageUrl,
      email:user.emailAddresses[0].emailAddress,
      role: newUser.role || "SUBACCOUNT_USER"
    }
  })

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata:{
      role:newUser.role || 'SUBACCOUNT_USER'
    }
  })
  return userdata
}


export const upsertAgency = async (agency:Agency, price?:Plan) => {
  if (!agency.companyEmail) return null
  try {
    const agencyDetails = await db.agency.upsert({
      where:{
        id:agency.id,
      },
      update:agency,
      create:{
        users:{
          connect:{email: agency.companyEmail},
        },
        ...agency,
        SidebarOption:{
          create:[
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ]
        }
      }
    })
  } catch (error) {
    
  }
}
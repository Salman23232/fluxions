import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { Plan } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async({searchParams}:{searchParams:{plan:Plan, state:string}}) => {

  const agencyId = await verifyAndAcceptInvitation()
  console.log(agencyId);

  const user = await getAuthUserDetails()
  if(agencyId){
    if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER') {
      return redirect('/subaccount')
    }
    else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN")
  }
  
  return (
    <div>Agency Dashboard</div>
  )
}

export default page
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Props = {

    name: string,
    description: string,
    id: string,
    publish: boolean | null,
}

const Workflow = ({description,name,id,publish}: Props) => {
  return (
    
    <Card className="flex-2 sm:flex-row  sm:items-center sm:justify-between w-full items-start justify-between transition-shadow hover:shadow-md p-4">

      {/* <CardHeader className="flex gap-4 bg-red-300"> */}

        <Link href={`/workflows/editor/${id}`} className=' flex items-start w-full flex-1 gap-4 flex-col sm:w-2/3'>
          <div className="flex flex-row gap-2 ">
            <Image
              src="/googleDrive.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/notion.png"
              alt="Notion"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/discord.png"
              alt="Discord"
              height={30}
              width={30}
              className="object-contain"
            />
          </div>

          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      {/* </CardHeader> */}

      <div className="flex flex-col items-center gap-2 p-4 ">
        <Label
          htmlFor="airplane-mode"
          className="text-muted-foreground"
        >
          {publish! ? 'On' : 'Off'}
        </Label>
        {/*// WIP: Wire Up in DB*/}

        <Switch
          id="airplane-mode"
          // onClick={onPublishFlow}
          defaultChecked={publish!}
        />
      </div>
    </Card>
  )
}

export default Workflow;
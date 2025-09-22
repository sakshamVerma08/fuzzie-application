import WorkflowButton from "./_components/workflow-button";
import Workflows from "./_components/workflows";


type Props = {};

const Page = (props:Props)=>{

    return (
        <div className = "relative flex flex-col gap-2">

            <h1 className="sticky text-4xl z-[10] p-6 top-0 bg-background/50 backdrop-blur-lg flex items-center border-b justify-between">
                Workflows
            <WorkflowButton/>
            </h1>

            <Workflows/>
            <Workflows/>
            <Workflows/>
            <Workflows/>
        </div>
    )
}


export default Page;





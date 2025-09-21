import WorkflowButton from "./_components/workflow-button";


type Props = {};

const Workflows = (props:Props)=>{

    return (
        <div className = "relative flex flex-col gap-4">

            <h1 className="sticky text-4xl z-[10] p-6 top-0 bg-background/50 backdrop-blur-lg flex items-center border-b justify-between">
                Workflows
            <WorkflowButton/>
            </h1>
        </div>
    )
}


export default Workflows;





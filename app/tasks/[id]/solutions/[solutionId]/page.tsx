"use client";

import BackButton from "@/app/_components/ui/BackButton/BackButton";
import { useParams } from "next/navigation";

const SolutionPage = () => {
    const { solutionId } = useParams();

    return (
        <div className="container">
            <BackButton />
            solutionId {solutionId}
        </div>
    );
};

export default SolutionPage;

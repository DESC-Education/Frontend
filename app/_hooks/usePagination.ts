import { useEffect, useState } from "react";

const usePagination = <T>(
    getData: (
        args: any,
    ) => Promise<{ results?: T[]; numPages?: number; status: number }>,
    args: any,
    pageSize: number = 10,
    instantFire: boolean = true,
): [T[], number, number, (page: number) => void, boolean, () => void] => {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        const res = await getData({ ...args, page, pageSize });
        
        if (res.status !== 200) {
            setLoading(false);
            return;
        } else {
            setData(res.results!);
            setTotalPages(res.numPages!);
        }

        setLoading(false);
    };

    useEffect(() => {
        instantFire && fetchData();
    }, [page, pageSize]);

    return [data, totalPages, page, setPage, loading, fetchData];
};

export default usePagination;

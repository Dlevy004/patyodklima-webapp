import { useEffect, useContext } from "react";
import { TitleContext } from "../context/TitleContext";

const usePageTitle = (title) => {
    const { setTitle } = useContext(TitleContext);
    useEffect(() => { setTitle(title) }, [title, setTitle]);
}

export default usePageTitle
import { useEffect, useContext } from "react";
import { TitleContext } from "../components/TitleContext";

const usePageTitle = (title) => {
    const { setTitle } = useContext(TitleContext);
    useEffect(() => { setTitle(title) }, [title, setTitle]);
}

export default usePageTitle
import {FC} from "react";
import {useRouteError} from "react-router-dom";

interface Error {
    statusText?: never;
    message?: never;
}

const ErrorPage:FC = () => {
    const error = useRouteError() as Error;
    console.log(error)

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}

export {ErrorPage}
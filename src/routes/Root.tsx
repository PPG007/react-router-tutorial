import {FC, useEffect, useState} from "react";
import {Form, NavLink, Outlet, redirect, useLoaderData, useNavigation, useSubmit} from "react-router-dom";
import {createContact, getContacts} from "../contacts.ts";
import {Contact} from "./Contact.tsx";

const Root: FC = () => {
    const { contacts, query } = useLoaderData() as {contacts: Array<Contact>, query: string};
    const [q, setQuery] = useState(query)
    const navigation = useNavigation();
    const submit = useSubmit();
    const isSearching = navigation.location && new URLSearchParams(navigation.location.search).has('q');
    useEffect(() => {
        setQuery(query)
    }, [query])
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            value={q}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                submit(e.currentTarget.form, {
                                    replace: !!query,
                                });
                            }}
                            className={isSearching ? 'loading' : ''}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!isSearching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {
                        contacts.length ? (
                            <ul>
                                {
                                    contacts.map((contact) => {
                                        return (
                                            <li key={contact.id}>
                                                <NavLink
                                                    to={`contacts/${contact.id}`}
                                                    className={({isActive, isPending}) => isActive ? 'active' : isPending ? 'pending' : ''}
                                                >
                                                    {
                                                        contact.first || contact.last ? (
                                                            <>
                                                                {contact.first} {contact.last}
                                                            </>
                                                        ) : (
                                                            <i>No Name</i>
                                                        )
                                                    }
                                                    {" "}
                                                    {contact.favorite && <span>★</span>}
                                                </NavLink>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        ) : (
                            <p>
                                <i>No Contacts</i>
                            </p>
                        )
                    }
                </nav>
            </div>
            <div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
                <Outlet/>
            </div>
        </>
    )
}

const loader = async ({request}: {request: Request}): Promise<{contacts: Array<Contact>, query: string}> => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const contacts = await getContacts(query ? query : undefined);
    return {contacts, query: query ? query : ''};
}

const submitAction = async (): Promise<Response> => {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export {Root, loader, submitAction}
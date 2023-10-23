import {FC} from "react";
import {Form, Params, redirect, useFetcher, useLoaderData} from "react-router-dom";
import {deleteContact, getContact, updateContact} from "../contacts.ts";

interface Contact {
    id?: string;
    createdAt?: number;
    first?: string;
    last?: string;
    avatar?: string;
    twitter?: string;
    notes?: string;
    favorite?: boolean;
}
const Contact: FC = () => {
    const { contact } = useLoaderData() as {contact: Contact};
    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar || ''}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({ contact }: {contact: Contact}) {
    const fetcher = useFetcher();
    let favorite = contact.favorite;
    if (fetcher.formData) {
        favorite = fetcher.formData.get('favorite') === 'true'
    }
    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}

type contactLoader = ({params}: {params: Params}) => Promise<{contact: Contact} | null>;

const loader: contactLoader = async ({params}) => {
    if (!params.contactId) {
        return null;
    }
    const contact = await getContact(params.contactId);
    if (contact) {
        return {contact}
    }
    throw new Response('', {
        status: 404,
        statusText: 'contact not found'
    })
}

const destroyAction = async ({params}: {params: Params}) => {
    await deleteContact(params.contactId as string);
    return redirect(`/`);
}

const favoriteAction = async ({request, params}: {request: Request, params: Params}) => {
    const formData = await request.formData();
    return updateContact(params.contactId as string, {
        favorite: formData.get('favorite') === 'true',
    })
}

export {Contact, loader, destroyAction, favoriteAction}
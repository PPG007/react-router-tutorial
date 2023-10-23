import localforage from "localforage";
import {matchSorter} from "match-sorter";
import sortBy from "sort-by";

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

export async function getContacts(query?: string) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await localforage.getItem<Array<Contact>>("contacts");
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, {keys: ["first", "last"]});
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
    await fakeNetwork();
    const id = Math.random().toString(36).substring(2, 9);
    const contact = {id, createdAt: Date.now()};
    const contacts = await getContacts();
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

export async function getContact(id: string) {
    await fakeNetwork(`contact:${id}`);
    const contacts = await localforage.getItem<Array<Contact>>("contacts");
    if (!contacts) {
        return null;
    }
    return contacts.find(contact => contact.id === id);
}

export async function updateContact(id: string, updates: Contact) {
    await fakeNetwork();
    const contacts = await localforage.getItem<Array<Contact>>("contacts");
    if (!contacts) {
        throw new Error('No contacts available');
    }
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) {
        throw new Error(`No contact found for ${id}`);
    }
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
}

export async function deleteContact(id: string) {
    const contacts = await localforage.getItem<Array<Contact>>("contacts");
    if (!contacts) {
        return false;
    }
    const index = contacts.findIndex(contact => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

function set(contacts: Array<Contact>) {
    return localforage.setItem<Array<Contact>>("contacts", contacts);
}

interface FakeCache {
    [key: string]: boolean
}

let fakeCache: FakeCache = {};

async function fakeNetwork(key?: string) {
    if (key) {
        if (fakeCache[key]) {
            return;
        }
        fakeCache[key] = true;
    } else {
        fakeCache = {};
    }
    return new Promise(res => {
        setTimeout(res, Math.random() * 800);
    });
}
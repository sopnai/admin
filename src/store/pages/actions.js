import * as Module from "helpers/Module";

export const pageGetAction = (payload) => {
    return Module.getPages(payload);
}

export const pageUpdateAction = (payload) => {
    return Module.updatePages(payload);
}
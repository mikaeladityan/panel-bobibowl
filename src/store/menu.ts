import { atomWithStorage } from "jotai/utils";
import { MenuReqDTO } from "~/interface/admin/menu";

export const menuInit: MenuReqDTO = {
    title: "",
    price: "",
    slug: "",
    status: "PENDING",
    rating: 5,
    description: "",
};
export const menuAtom = atomWithStorage<MenuReqDTO>("menuBody", menuInit);

export type TPermission = "READ" | "WRITE" | "DELETE" | "SHARE" | "UPLOAD_FILES";

export type TGroup = {
    id: string;
    name: string;
    permissions: TPermission[];
};

export type TBaseGroup = {
    name: string;
    permissions: TPermission[];
};

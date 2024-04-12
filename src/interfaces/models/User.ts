export type User = {
    id: number,
    username: string, 
    firstName: string,
    lastName: string,
    isStaff: boolean
    permissionGroups: PermissionGroup[]
}

export type PermissionGroup = {
    id: number,
    name: string,
    school_unit_name: string
}

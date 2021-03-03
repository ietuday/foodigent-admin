/**
 * @class Menu
 * @description menu model for left hand side menu item
 */
export class Menu {

    constructor(
        public id: number,
        public title: string,
        public routerLink: string | null,
        public href: string | null,
        public icon: string,
        public target: string | null,
        public hasSubMenu: boolean,
        public parentId: number,
        public show: boolean,
        public privacy: string,
        public forum?: string
    ) { }

}
